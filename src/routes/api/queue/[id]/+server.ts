import { error, json } from '@sveltejs/kit';
import type { RequestEvent } from './$types';

export const GET = async (e: RequestEvent) => {
	const id = e.params.id;

	const queue = e.locals.queues.ping;

	const job = await queue.getJob(id);

	if (!job) {
		error(404, 'Job not found');
	}

	return json(job.asJSON());
};
