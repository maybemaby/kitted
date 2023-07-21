import { json } from '@sveltejs/kit';
import type { RequestEvent } from '../$types';

export const GET = async (e: RequestEvent) => {
	const queue = e.locals.queues.ping;

	const job = await queue.add('test', {
		message: 'Hello World'
	});

	return json({
		id: job.id,
		status: 200
	});
};
