import type { Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';

import { logger } from '$lib/logger';
import { serve, client } from '$lib/server/jobs/inngest';
import { helloWorld } from '$lib/server/jobs/hello-world';
import { SESSION_KEY } from '$env/static/private';
import { createPingQueue } from '$lib/server/jobs/bull/queues';

const pingQueue = createPingQueue();

const handleAuth = (async ({ event, resolve }) => {
	const session = event.cookies.get(SESSION_KEY);

	// Check session is valid

	event.locals.isLoggedIn = !!session;

	return await resolve(event);
}) satisfies Handle;

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

const handleInngest = (async ({ event, resolve }) => {
	const isInngest = new URL(event.request.url).pathname.startsWith('/api/inngest');

	if (!isInngest) {
		return await resolve(event);
	}

	const handler = serve(client, [helloWorld]) as (
		req: Parameters<Handle>['0']['event']
	) => Response;
	return handler(event);
}) satisfies Handle;

const handleBullMq = (async ({ event, resolve }) => {
	event.locals.queues = {
		ping: pingQueue
	};

	return await resolve(event);
}) satisfies Handle;

export const handle = sequence(handleLogging, handleAuth, handleBullMq);
