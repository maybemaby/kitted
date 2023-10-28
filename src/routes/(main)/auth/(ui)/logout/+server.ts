import { logout } from '$lib/auth/http';
import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST = (async (e) => {
	await logout(e);

	throw redirect(302, '/');
}) satisfies RequestHandler;
