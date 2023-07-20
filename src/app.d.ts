// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
/// <reference types="unplugin-icons/types/svelte" />
import type { pino } from 'pino';

declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			logger: pino.Logger;
			isLoggedIn: boolean;
		}
		// interface PageData {}
		// interface Platform {}
	}
}

export {};
