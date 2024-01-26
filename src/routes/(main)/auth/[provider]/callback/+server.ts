import { error, json, type RequestEvent } from '@sveltejs/kit';
import { OAuth2RequestError, Google, GitHub } from 'arctic';
import { parseJWT } from 'oslo/jwt';
import { ghProvider, googleProvider } from '../../../../../hooks.server';
import { getSignedCookie } from '$lib/auth/http';
import { COOKIE_SECRET } from '$env/static/private';

export async function GET(req: RequestEvent) {
	const provider = req.params.provider;

	const registeredProviders: Record<string, Google | GitHub> = {
		github: ghProvider,
		google: googleProvider
	};

	if (!provider) {
		error(404, 'Not found');
	}

	const selectedProvider = registeredProviders[provider];

	if (!selectedProvider) {
		error(404, 'Not found');
	}

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
		const tokens = await selectedProvider.validateAuthorizationCode(code, storedCodeVerifier);

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

		// @ts-expect-error For providers that are openID
		if (tokens.idToken!) {
			const jwt = parseJWT(tokens.idToken as unknown as string);

			return json({ tokens, jwt });
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
