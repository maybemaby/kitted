import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async (e) => {
	return {
		isLoggedIn: e.locals.isLoggedIn
	};
};
