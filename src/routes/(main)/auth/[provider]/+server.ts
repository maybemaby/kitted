import { COOKIE_SECRET, NODE_ENV } from '$env/static/private';
import { setSignedCookie } from '$lib/auth/http';
import type { SocialAuthProvider } from '$lib/auth/provider';
import { error, redirect, type RequestEvent } from '@sveltejs/kit';
import { ghProvider, googleProvider } from '../../../../hooks.server';

export async function GET(req: RequestEvent) {
	const provider = req.params.provider;

	const registeredProviders: Record<string, SocialAuthProvider> = {
		github: ghProvider,
		google: googleProvider
	};

	if (!provider) {
		throw error(404, 'Not found');
	}

	const selectedProvider = registeredProviders[provider];

	if (!selectedProvider) {
		throw error(404, 'Not found');
	}

	const authParams = await selectedProvider.generateAuthUrl();

	await setSignedCookie(req, 'code_verifier', authParams.codeVerifier!, COOKIE_SECRET, {
		httpOnly: true,
		maxAge: 60 * 5,
		path: '/',
		secure: NODE_ENV === 'production'
	});

	if (authParams.state) {
		await setSignedCookie(req, 'state', authParams.state, COOKIE_SECRET, {
			httpOnly: true,
			maxAge: 60 * 5,
			path: '/',
			secure: NODE_ENV === 'production'
		});
	}

	throw redirect(302, authParams.url);
}
