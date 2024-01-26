import { error, json, type RequestEvent } from '@sveltejs/kit';
import { OAuth2RequestError } from 'arctic';
import { getSignedCookie } from '$lib/auth/http';
import { COOKIE_SECRET } from '$env/static/private';
import { ghProvider } from '../../../../../hooks.server';

export async function GET(req: RequestEvent) {
	const code = req.url.searchParams.get('code');
	const state = req.url.searchParams.get('state');

	const storedState = await getSignedCookie(req, 'state', COOKIE_SECRET);

	if (!code || !state || !storedState) {
		error(400, 'Invalid request');
	}

	if (state !== storedState) {
		error(400, 'Invalid request');
	}

	try {
		const tokens = await ghProvider.validateAuthorizationCode(code);

		req.cookies.delete('state', {
			path: '/',
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			sameSite: 'lax'
		});

		const userRes = await fetch('https://api.github.com/user', {
			headers: {
				Authorization: `Bearer ${tokens.accessToken}`
			}
		});

		const user = (await userRes.json()) as {
			id: number;
			login: string;
			email: string | null;
			avatar_url: string;
			gravatar_url: string;
			name: string;
			bio: string | null;
			created_at: string;
			updated_at: string;
		};

		return json({ tokens, user });
	} catch (e) {
		if (e instanceof OAuth2RequestError) {
			req.locals.logger.error(e, 'OAuth2 Request Error');
			error(400, 'Invalid request');
		}
		req.locals.logger.error(e, 'Unexpected error');
		error(500, 'Internal Server Error');
	}
}
