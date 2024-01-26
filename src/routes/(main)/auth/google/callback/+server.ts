import { error, json, type RequestEvent } from '@sveltejs/kit';
import { OAuth2RequestError } from 'arctic';
import { parseJWT } from 'oslo/jwt';
import { getSignedCookie } from '$lib/auth/http';
import { COOKIE_SECRET } from '$env/static/private';
import { googleProvider } from '../../../../../hooks.server';

export async function GET(req: RequestEvent) {
	const code = req.url.searchParams.get('code');
	const state = req.url.searchParams.get('state');

	const storedState = await getSignedCookie(req, 'state', COOKIE_SECRET);
	const storedCodeVerifier = await getSignedCookie(req, 'code_verifier', COOKIE_SECRET);

	if (!code || !state || !storedState || !storedCodeVerifier) {
		error(400, 'Invalid request');
	}

	if (state !== storedState) {
		error(400, 'Invalid request');
	}

	try {
		const tokens = await googleProvider.validateAuthorizationCode(code, storedCodeVerifier);

		req.cookies.delete('state', {
			path: '/',
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			sameSite: 'lax'
		});

		req.cookies.delete('code_verifier', {
			path: '/',
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			sameSite: 'lax'
		});

		if (tokens.idToken) {
			const jwt = parseJWT(tokens.idToken as unknown as string);

			return json({
				tokens,
				user: jwt?.payload as {
					iss: string;
					email: string;
					email_verified: boolean;
					name: string;
					picture: string;
				}
			});
		}

		return json({ tokens });
	} catch (e) {
		if (e instanceof OAuth2RequestError) {
			req.locals.logger.error(e, 'OAuth2 Request Error');
			error(400, 'Invalid request');
		}
		req.locals.logger.error(e, 'Unexpected error');
		error(500, 'Internal Server Error');
	}
}
