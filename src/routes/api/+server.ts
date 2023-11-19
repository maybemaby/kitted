import type { RequestEvent } from './$types';

export const GET = async (e: RequestEvent) => {
	return {
		status: 200
	};
};
