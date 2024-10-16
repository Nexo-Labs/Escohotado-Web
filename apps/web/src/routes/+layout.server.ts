import type { LayoutServerLoad } from './$types.js';

export const load: LayoutServerLoad = async (event) => {
	return {
		user: null
	};
};
