// ts-node doesn't work without .js extension
import { WorkerQPair } from './workers.js';

export const [createPingQueue, createPingWorker] = WorkerQPair<
	{ message: string },
	{ success: boolean }
>(
	'ping',
	async (job) => {
		job.updateProgress(10);

		console.log(`Received job ${job.id} with message: ` + job.data.message);

		return {
			success: true
		};
	},
	{
		queueArgs: [
			{
				defaultJobOptions: {
					removeOnComplete: 1000,
					removeOnFail: 5000
				}
			},
			undefined
		]
	}
);
