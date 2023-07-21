import type { Handle } from '@sveltejs/kit';

interface CorsOptions {
	origin?: string | boolean | RegExp | string[];
	methods?: string[];
	allowedHeaders?: string[];
}

export const cors: (opts: CorsOptions) => Handle = (opts) => {
	return async ({ event, resolve }) => {
		const reqOrigin = event.request.headers.get('Origin') ?? '';

		const originDomain = new URL(reqOrigin).hostname;

		const res = await resolve(event);

		return res;
	};
};
