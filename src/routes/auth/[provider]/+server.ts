import { GithubProvider, GoogleProvider, type SocialAuthProvider } from '$lib/auth/provider';
import { error, redirect, type RequestEvent } from '@sveltejs/kit';
import oauth from 'oauth4webapi';

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

	const authParams = await selectedProvider.generateAuthUrl();

	req.cookies.set('code_verifier', authParams.codeVerifier!, {
		httpOnly: true,
		maxAge: 60 * 5,
		path: '/'
	});

	if (authParams.state) {
		req.cookies.set('state', authParams.state, {
			httpOnly: true,
			maxAge: 60 * 5,
			path: '/'
		});
	}

	throw redirect(302, authParams.url);
}
