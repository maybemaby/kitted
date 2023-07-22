import { error, json, type RequestEvent } from '@sveltejs/kit';
import { GithubProvider, GoogleProvider, type SocialAuthProvider } from '$lib/auth/provider';

export async function GET(req: RequestEvent) {
	const provider = req.params.provider;

	const registeredProviders: Record<string, SocialAuthProvider> = {
		github: GithubProvider,
		google: GoogleProvider
	};

	if (!provider) {
		throw error(404, 'Not found');
	}

	const selectedProvider = registeredProviders[provider];

	if (!selectedProvider) {
		throw error(404, 'Not found');
	}

	const tokens = await selectedProvider.handleCallback(req, 'state', 'code_verifier');

	return json(tokens);
}
