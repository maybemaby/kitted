import { COOKIE_SECRET, NODE_ENV } from '$env/static/private';
import { setSignedCookie } from '$lib/auth/http';
import { redirect, type RequestEvent } from '@sveltejs/kit';
import { ghProvider } from '../../../../hooks.server';
import { generateState } from 'arctic';

export async function GET(req: RequestEvent) {
	const state = generateState();

	const scopes = ['user:email'];

	const url = await ghProvider.createAuthorizationURL(state, {
		scopes
	});

	await setSignedCookie(req, 'state', state, COOKIE_SECRET, {
		httpOnly: true,
		maxAge: 60 * 5,
		path: '/',
		secure: NODE_ENV === 'production'
	});

	redirect(302, url);
}
