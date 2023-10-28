import { error, json, type RequestEvent } from '@sveltejs/kit';
import type { SocialAuthProvider } from '$lib/auth/provider';
import { ghProvider, googleProvider } from '../../../../../hooks.server';

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

	const tokens = await selectedProvider.handleCallback(req, 'state', 'code_verifier');

	const userInfo = await selectedProvider.getUserInfo(tokens.access_token);

	return json({ ...tokens, ...userInfo });
}
