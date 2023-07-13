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

		--spotify-brand: #1db954;
		--font-size-fluid-1_5: calc(var(--font-size-fluid-1) * 1.5);

		--background: var(--stone-1);
		--text: var(--gray-10);
		--on-primary-text: var(--stone-10);

		--surface: var(--stone-7);
		--surface-2: var(--stone-8);
		--surface-3: var(--stone-9);

		--primary: var(--teal-4);
		--primary-2: var(--teal-5);
		--primary-3: var(--teal-6);
		--primary-4: var(--teal-7);

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
		}
	}

	:global(body.dark) {
		--background: var(--gray-10);
		--text: var(--stone-2);
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
	}
</style>
