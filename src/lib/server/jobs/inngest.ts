import type { RequestEvent } from '@sveltejs/kit';
import {
	headerKeys,
	InngestCommHandler,
	queryKeys,
	Inngest,
	type ServeHandler,
	EventSchemas
} from 'inngest';
import { logger } from '$lib/logger';
import type { Events } from '$lib/server/jobs/types';

// TODO: prevent side effect
export const client = new Inngest({
	name: 'sveltekit-ts-starter',
	logger,
	schemas: new EventSchemas().fromUnion<Events>()
});

export const serve: ServeHandler = (nameOrInngest, fns, opts) => {
	const handler = new InngestCommHandler(
		'sveltekit',
		nameOrInngest,
		fns,
		{ ...opts },
		(req: RequestEvent) => {
			const url = req.url;
			const method = req.request.method;

			/**
			 * Vercel Edge Functions do not allow dynamic access to environment
			 * variables, so we'll manage `isProd` directly here.
			 *
			 * We try/catch to avoid situations where Next.js is being used in
			 * environments where `process.env` is not accessible or polyfilled.
			 */
			let isProduction: boolean | undefined;

			try {
				isProduction = process.env.NODE_ENV === 'production';
			} catch (err) {
				// no-op
			}

			return {
				isProduction,
				url,

				register: () => {
					if (method === 'PUT') {
						return {
							deployId: url.searchParams.get(queryKeys.DeployId) as string
						};
					}
				},
				run: async () => {
					if (method === 'POST') {
						return {
							data: (await req.request.json()) as Record<string, unknown>,
							fnId: url.searchParams.get(queryKeys.FnId) as string,
							stepId: url.searchParams.get(queryKeys.StepId) as string,
							signature: req.request.headers.get(headerKeys.Signature) as string
						};
					}
				},
				view: () => {
					if (method === 'GET') {
						return {
							isIntrospection: url.searchParams.has(queryKeys.Introspect)
						};
					}
				}
			};
		},
		({ body, status, headers }, _req) => {
			return new Response(body, { status, headers });
		}
	);
	return handler.createHandler();
};
