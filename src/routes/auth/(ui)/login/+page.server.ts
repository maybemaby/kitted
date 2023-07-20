import { login } from '$lib/auth/http';
import { redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions = {
	default: async (e) => {
		const data = await e.request.formData();

		await login(e, 1);

		throw redirect(302, '/');
	}
} satisfies Actions;
