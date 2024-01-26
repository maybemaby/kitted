import type { RequestEvent } from '@sveltejs/kit';
import { SESSION_KEY } from '$env/static/private';
import { subtle } from 'uncrypto';

export async function login(req: RequestEvent, userId: number) {
	// const session = await userManager.createSession({ userId });

	req.cookies.set(SESSION_KEY, 'session.id', {
		path: '/',
		httpOnly: true,
		maxAge: 60 * 60 * 24 * 30,
		sameSite: 'lax'
	});
}

const HMAC_ALGORITHM = {
	name: 'HMAC',
	hash: 'SHA-256'
};

export async function logout(req: RequestEvent) {
	const sessionId = req.cookies.get(SESSION_KEY);

	if (!sessionId) {
		return;
	}

	// await userManager.deleteSession(sessionId);
	req.cookies.delete(SESSION_KEY, {
		path: '/'
	});
}

export async function createSignedCookieValue(value: string, secret: string) {
	const enc = new TextEncoder();

	const key = await subtle.importKey('raw', enc.encode(secret), HMAC_ALGORITHM, false, ['sign']);

	const signature = await subtle.sign(HMAC_ALGORITHM, key, enc.encode(value));

	return `${value}.${btoa(String.fromCharCode(...new Uint8Array(signature)))}`;
}

// Assumming the cookie is formatted: {value}.{signature}
export async function getSignedCookieValue(cookie: string, secret: string) {
	const enc = new TextEncoder();

	const [value, signature] = cookie.split('.');

	const key = await subtle.importKey('raw', enc.encode(secret), HMAC_ALGORITHM, false, ['verify']);

	const signatureBytes = Uint8Array.from(atob(decodeURIComponent(signature)), (c) =>
		c.charCodeAt(0)
	);

	const valid = await subtle.verify(HMAC_ALGORITHM, key, signatureBytes, enc.encode(value));

	if (!valid) {
		throw new Error('Invalid HMAC signature in cookie');
	}

	return value;
}

// Create non-optional version of CookieSerializeOptions
type CookieSerializeOptions = Exclude<Parameters<RequestEvent['cookies']['set']>[2], undefined>;

type CookieParseOptions = Exclude<Parameters<RequestEvent['cookies']['get']>[1], undefined>;

export async function setSignedCookie(
	req: RequestEvent,
	name: string,
	value: string,
	secret: string,
	cookieOpts: CookieSerializeOptions
) {
	const cookie = await createSignedCookieValue(value, secret);

	req.cookies.set(name, cookie, cookieOpts);
}

export async function getSignedCookie(
	req: RequestEvent,
	name: string,
	secret: string,
	cookieOpts?: CookieParseOptions
) {
	const cookie = req.cookies.get(name, cookieOpts);

	if (!cookie) {
		return undefined;
	}

	return getSignedCookieValue(cookie, secret);
}
