import { redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { login } from '$lib/auth/http';

export const actions: Actions = {
	default: async (e) => {
		const data = await e.request.formData();

		// Validate and create user, then login

		await login(e, 1);

		throw redirect(302, '/');
	}
};
