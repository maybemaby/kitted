import type { Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import pino from 'pino';

const logger = pino({
	formatters: {
		log(object) {
			if (object instanceof Request) {
				const url = new URL(object.url);
				return {
					method: object.method,
					url: object.url,
					path: url.pathname,
					query: url.searchParams.toString()
				};
			}
			return object;
		}
	}
});

const handleLogging = (async ({ event, resolve }) => {
	event.locals.logger = logger;

	const start = Date.now();
	const url = new URL(event.request.url);

	logger.info(event.request, 'Received Request');

	const res = await resolve(event);
	const end = Date.now();

	logger.info(
		{
			path: url.pathname,
			method: event.request.method,
			status: res.status,
			duration: end - start
		},
		'Response'
	);

	return res;
}) satisfies Handle;

export const handle = sequence(handleLogging);