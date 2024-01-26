import { COOKIE_SECRET, NODE_ENV } from '$env/static/private';
import { setSignedCookie } from '$lib/auth/http';
import { redirect, type RequestEvent } from '@sveltejs/kit';
import { googleProvider } from '../../../../hooks.server';
import { generateCodeVerifier, generateState } from 'arctic';

export async function GET(req: RequestEvent) {
	const state = generateState();
	const codeVerifier = generateCodeVerifier();

	const scopes = ['email', 'profile', 'openid'];

	const url = await googleProvider.createAuthorizationURL(state, codeVerifier, {
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
