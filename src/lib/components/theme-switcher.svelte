<script lang="ts">
	import CarbonMoon from '~icons/carbon/moon';
	import CarbonSun from '~icons/carbon/sun';
	import { onMount } from 'svelte';
	import Button from './button.svelte';
	import VisuallyHidden from './visually-hidden.svelte';
	let theme: string;

	onMount(() => {
		let storedTheme = localStorage.getItem('theme');
		if (storedTheme === null || storedTheme === 'system') {
			theme = 'system';
		} else if (storedTheme === 'dark') {
			theme = 'dark';
		} else {
			theme = 'light';
		}
	});

	const setLight = () => {
		document.body.classList.replace('dark', 'light');
		localStorage.setItem('theme', 'light');
		theme = 'light';
	};

	const setDark = () => {
		document.body.classList.replace('light', 'dark');
		localStorage.setItem('theme', 'dark');
		theme = 'dark';
	};

	const setSystem = () => {
		if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
			document.body.classList.replace('light', 'dark');
		} else {
			document.body.classList.replace('dark', 'light');
		}
		localStorage.setItem('theme', 'system');
		theme = 'system';
	};
</script>

<div class="theme-toggle">
	<Button class="switcher" rounded={2} sz="md" on:click={setLight}>
		<CarbonSun />
		<VisuallyHidden>Light Mode</VisuallyHidden>
	</Button>
	<Button class="switcher" variant="primary" rounded={2} sz="md" on:click={setDark}>
		<CarbonMoon />
		<VisuallyHidden>Dark Mode</VisuallyHidden>
	</Button>
</div>

<style>
	.theme-toggle {
		display: flex;
		gap: var(--size-4);
	}

	.theme-toggle :global(.switcher) {
		cursor: pointer;
		border: none;
		background: var(--primary);
		color: var(--on-primary-text);
		font-size: var(--font-size-3);
		height: var(--size-8);
		width: var(--size-8);
		padding: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: background 0.2s var(--ease-out-2);
	}

	.theme-toggle :global(.switcher:hover) {
		background: var(--primary-4);
	}
</style>
