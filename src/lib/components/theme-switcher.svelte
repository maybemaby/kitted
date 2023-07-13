<script lang="ts">
	import CarbonMoon from '~icons/carbon/moon';
	import CarbonSun from '~icons/carbon/sun';
	import { onMount } from 'svelte';
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

<button on:click={setLight}>
  <CarbonSun />
</button>
<button on:click={setDark}>
	<CarbonMoon />
</button>
