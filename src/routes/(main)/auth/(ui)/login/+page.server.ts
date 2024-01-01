import { login } from '$lib/auth/http';
import { redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { superValidate } from 'sveltekit-superforms/server';
import { LoginSchema } from '$lib/auth/schema';

export const actions = {
	default: async (e) => {
		const form = await superValidate(e.request, LoginSchema);

		await login(e, 1);

		redirect(302, '/');
	}
} satisfies Actions;
