<script lang="ts">
	import ThemeSwitcher from '$lib/components/theme-switcher.svelte';
</script>

<div class="main">
	<h1>Welcome to SvelteKit</h1>
	<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>
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
