<script lang="ts">
	import Button from '$lib/components/button.svelte';
	import ThemeSwitcher from '$lib/components/theme-switcher.svelte';
</script>

<div class="main">
	<h1>Welcome to Kitted</h1>
	<p>An opinionated starter kit for Sveltekit</p>
	<ThemeSwitcher />
</div>

<style>
	.main {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		height: 100%;
	}
</style>
