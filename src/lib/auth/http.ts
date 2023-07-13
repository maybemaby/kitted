import type { RequestEvent } from '@sveltejs/kit';
import { SESSION_KEY } from '$env/static/private';

export async function login(req: RequestEvent, userId: number) {
	// const session = await userManager.createSession({ userId });

	req.cookies.set(SESSION_KEY, 'session.id', {
		path: '/',
		httpOnly: true,
		maxAge: 60 * 60 * 24 * 30,
		sameSite: 'lax'
	});
}

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
