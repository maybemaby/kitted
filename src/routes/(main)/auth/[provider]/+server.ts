import { COOKIE_SECRET, NODE_ENV } from '$env/static/private';
import { setSignedCookie } from '$lib/auth/http';
import { error, redirect, type RequestEvent } from '@sveltejs/kit';
import { ghProvider, googleProvider } from '../../../../hooks.server';
import { authScopes } from '$lib/auth/provider';
import type { GitHub, Google, OAuth2Provider, OAuth2ProviderWithPKCE } from 'arctic';
import { generateCodeVerifier, generateState } from 'arctic';

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

	const state = generateState();
	const codeVerifier = generateCodeVerifier();

	const scopes = authScopes[provider];

	const url = await selectedProvider.createAuthorizationURL(state, codeVerifier, {
		scopes
	});

	await setSignedCookie(req, 'code_verifier', codeVerifier, COOKIE_SECRET, {
		httpOnly: true,
		maxAge: 60 * 5,
		path: '/',
		secure: NODE_ENV === 'production'
	});

	await setSignedCookie(req, 'state', state, COOKIE_SECRET, {
		httpOnly: true,
		maxAge: 60 * 5,
		path: '/',
		secure: NODE_ENV === 'production'
	});

	redirect(302, url);
}
