<script>
	import Header from '$lib/components/header.svelte';
</script>

<Header />
<main>
	<slot />
</main>

<style>
	@import 'open-props/postcss/style';

	:global(:root, body.light) {
		--royal-blue-50: #f3f3ff;
		--royal-blue-100: #eae9fe;
		--royal-blue-200: #d7d6fe;
		--royal-blue-300: #b9b4fe;
		--royal-blue-400: #958afb;
		--royal-blue-500: #725af8;
		--royal-blue-600: #6c47f0;
		--royal-blue-700: #5226db;
		--royal-blue-800: #4420b7;
		--royal-blue-900: #3a1c96;
		--royal-blue-950: #210f66;

		--background: var(--stone-1);
		--text: var(--gray-10);
		--link: var(--blue-4);
		--link-hover: var(--blue-5);
		--on-primary-text: var(--stone-1);

		--surface: var(--stone-7);
		--surface-2: var(--stone-8);
		--surface-3: var(--stone-9);

		--primary: var(--gray-11);
		--primary-2: var(--gray-10);
		--primary-3: var(--gray-9);
		--primary-4: var(--gray-8);

		--secondary: var(--royal-blue-300);
		--secondary-2: var(--royal-blue-400);
		--secondary-3: var(--royal-blue-500);
		--secondary-4: var(--royal-blue-600);

		--danger: var(--red-5);
		--danger-2: var(--red-6);

		--warn: var(--yellow-5);
		--warn-2: var(--yellow-6);
	}

	@media (--OSdark) {
		:global(:root) {
			--background: var(--gray-10);
			--text: var(--stone-2);

			--primary: var(--gray-0);
			--primary-2: var(--gray-1);
			--primary-3: var(--gray-2);
			--primary-4: var(--gray-3);
			--on-primary-text: var(--stone-11);
		}
	}

	:global(:root) {
		/* Spacing */

		/* Standard x padding to align multiple main layout elements. */
		--x-pad-std: var(--size-fluid-3);

		--font-size-fluid-1_5: calc(var(--font-size-fluid-1) * 1.5);
	}

	@media (--md-n-above) {
		:global(:root) {
			--x-pad-std: var(--size-fluid-6);
		}
	}

	@media (--xl-n-above) {
		:global(:root) {
			--x-pad-std: var(--size-fluid-9);
		}
	}

	:global(body.dark) {
		--background: var(--gray-10);
		--text: var(--stone-2);

		--primary: var(--gray-0);
		--primary-2: var(--gray-1);
		--primary-3: var(--gray-2);
		--primary-4: var(--gray-3);
		--on-primary-text: var(--stone-11);
	}

	:global(html) {
		height: 100vh;
	}

	:global(body) {
		font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu,
			Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
		max-width: 100vw;
		overflow-x: hidden;
		background: var(--background);
		color: var(--text);
		height: 100%;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		font-size: 16px;
	}

	main {
		height: 100%;
		padding: 0 var(--x-pad-std);
	}

	:global(a) {
		color: var(--link);
		text-decoration: none;
	}

	:global(a:hover) {
		text-decoration: underline;
		color: var(--link-hover);
	}

	/* Utils */
	:global(.rounded-none) {
		border-radius: 0;
	}

	:global(.rounded-sm) {
		border-radius: var(--radius-1);
	}

	:global(.rounded-md) {
		border-radius: var(--radius-2);
	}

	:global(.rounded-lg) {
		border-radius: var(--radius-3);
	}

	:global(.rounded-xl) {
		border-radius: var(--radius-4);
	}

	:global(.rounded-full) {
		border-radius: var(--radius-round);
	}

	:global(.border-0) {
		border-width: 0;
	}

	:global(.border-1) {
		border-width: var(--border-size-1);
	}

	:global(.border-2) {
		border-width: var(--border-size-2);
	}

	:global(.border-3) {
		border-width: var(--border-size-3);
	}

	:global(.border-4) {
		border-width: var(--border-size-4);
	}

	:global(.border-5) {
		border-width: var(--border-size-5);
	}

	:global(.shadow-0) {
		box-shadow: none;
	}

	:global(.shadow-1) {
		box-shadow: var(--shadow-1);
	}

	:global(.shadow-2) {
		box-shadow: var(--shadow-2);
	}

	:global(.shadow-3) {
		box-shadow: var(--shadow-3);
	}

	:global(.shadow-4) {
		box-shadow: var(--shadow-4);
	}

	:global(.shadow-5) {
		box-shadow: var(--shadow-5);
	}

	:global(.shadow-6) {
		box-shadow: var(--shadow-6);
	}

	:global(.row) {
		display: flex;
		flex-direction: row;
	}

	:global(.stack) {
		display: flex;
		flex-direction: column;
	}

	:global(.justify-between) {
		justify-content: space-between;
	}

	:global(.justify-center) {
		justify-content: center;
	}

	:global(.items-center) {
		align-items: center;
	}

	:global(.gap-1) {
		gap: var(--size-1);
	}

	:global(.gap-2) {
		gap: var(--size-2);
	}

	:global(.gap-3) {
		gap: var(--size-3);
	}

	:global(.gap-4) {
		gap: var(--size-4);
	}

	:global(.gap-5) {
		gap: var(--size-5);
	}

	:global(.gap-6) {
		gap: var(--size-6);
	}
</style>
