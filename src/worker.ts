// ts-node doesn't work without .js extension
import { createPingWorker } from '$lib/server/jobs/bull/queues';

console.info('Starting worker');

const worker = createPingWorker();

process.on('SIGINT', async () => {
	await worker.close();
	// logger.flush();
	process.exit(0);
});

process.on('SIGTERM', async () => {
	await worker.close();
	// logger.flush();
	process.exit(0);
});
