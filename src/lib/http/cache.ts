import type { RequestEvent } from '@sveltejs/kit';

interface CacheOptions {
	maxAge?: number;
	sMaxAge?: number;
	noCache?: boolean;
	noStore?: boolean;
	mustRevalidate?: boolean;
	proxyRevalidate?: boolean;
	immutable?: boolean;
	staleWhileRevalidate?: number;
	staleIfError?: number;
	private?: boolean;
	public?: boolean;
}

export function cache(req: RequestEvent, options: CacheOptions) {
	const cacheControl = [];

	if (options.maxAge) {
		cacheControl.push(`max-age=${options.maxAge}`);
	}

	if (options.sMaxAge) {
		cacheControl.push(`s-maxage=${options.sMaxAge}`);
	}

	if (options.noCache) {
		cacheControl.push('no-cache');
	}

	if (options.noStore) {
		cacheControl.push('no-store');
	}

	if (options.mustRevalidate) {
		cacheControl.push('must-revalidate');
	}

	if (options.proxyRevalidate) {
		cacheControl.push('proxy-revalidate');
	}

	if (options.immutable) {
		cacheControl.push('immutable');
	}

	if (options.staleWhileRevalidate) {
		cacheControl.push(`stale-while-revalidate=${options.staleWhileRevalidate}`);
	}

	if (options.staleIfError) {
		cacheControl.push(`stale-if-error=${options.staleIfError}`);
	}

	if (options.private) {
		cacheControl.push('private');
	} else if (options.public) {
		cacheControl.push('public');
	}

	req.setHeaders({
		'cache-control': cacheControl.join(', ')
	});
}
