import oauth from 'oauth4webapi';
import { json, type RequestEvent } from '@sveltejs/kit';
import { GithubProvider } from '$lib/auth/provider';

export async function GET(req: RequestEvent) {
	const provider = req.params.provider;

	const tokens = await GithubProvider.handleCallback(req, 'state', 'code_verifier');

	return json(tokens);
}
