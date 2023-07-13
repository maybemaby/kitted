import { GithubProvider } from '$lib/auth/provider';
import { error, redirect, type RequestEvent } from '@sveltejs/kit';
import oauth from 'oauth4webapi';

export async function GET(req: RequestEvent) {
	const provider = req.params.provider;

	if (!provider) {
		throw error(404, 'Not found');
	}

	const githubParams = await GithubProvider.generateAuthUrl();

	req.cookies.set('code_verifier', githubParams.codeVerifier!, {
		httpOnly: true,
		maxAge: 60 * 5,
		path: '/'
	});

	throw redirect(302, githubParams.url);
}
