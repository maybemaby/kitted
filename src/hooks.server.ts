import type { Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import { GitHub, Google } from 'arctic';

import { logger } from '$lib/logger';
import { serve, client } from '$lib/server/jobs/inngest';
import { helloWorld } from '$lib/server/jobs/hello-world';
import {
	GITHUB_CLIENT_ID,
	GITHUB_CLIENT_SECRET,
	GOOGLE_CLIENT_ID,
	GOOGLE_CLIENT_SECRET,
	SESSION_KEY,
	ORIGIN
} from '$env/static/private';
import { createPingQueue } from '$lib/server/jobs/bull/queues';

export const googleProvider = new Google(
	GOOGLE_CLIENT_ID,
	GOOGLE_CLIENT_SECRET,
	`${ORIGIN}/auth/google/callback`
);

export const ghProvider = new GitHub(GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET, {
	redirectURI: `${ORIGIN}/auth/github/callback`
});

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

	// const handler = serve(client, [helloWorld])
	const handler = serve({
		client,
		functions: [helloWorld]
	});

	return handler(event);
}) satisfies Handle;

const handleBullMq = (async ({ event, resolve }) => {
	event.locals.queues = {
		ping: pingQueue
	};

	return await resolve(event);
}) satisfies Handle;

export const handle = sequence(handleLogging, handleAuth, handleBullMq);
