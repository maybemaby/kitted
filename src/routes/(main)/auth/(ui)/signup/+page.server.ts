import { fail, redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';
import type { Actions } from './$types';
import { login } from '$lib/auth/http';
import { RegisterSchema } from '$lib/auth/schema';

export const actions: Actions = {
	default: async (e) => {
		const form = await superValidate(e.request, RegisterSchema);

		if (!form.valid) {
			return fail(400, { form });
		}

		// Validate and create user, then login

		await login(e, 1);

		redirect(302, '/');
	}
};

export const load = async () => {
	const form = await superValidate(RegisterSchema);

	return {
		form
	};
};
