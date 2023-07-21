// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
/// <reference types="unplugin-icons/types/svelte" />
import type { pino } from 'pino';
import type { Queue } from 'bullmq';
import type { createPingQueue } from '$lib/server/jobs/bull/queues';

declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			logger: pino.Logger;
			isLoggedIn: boolean;
			queues: {
				// Add your queues here and add them to your hook
				ping: ReturnType<typeof createPingQueue>;
			};
		}
		// interface PageData {}
		// interface Platform {}
	}
}

export {};
