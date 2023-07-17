<script>
	import Button from './button.svelte';
</script>

<header>
	<a class="logo" href="/"> Kitted </a>
	<nav>
		<a href="/auth/signup">Sign up</a>
		<a href="/auth/login">
			<Button type="button" rounded={2}>Login</Button>
		</a>
	</nav>
</header>

<style>
	header {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		padding: var(--size-2) var(--x-pad-std);
	}

	.logo {
		color: var(--primary);
		font-size: var(--font-size-4);
		text-decoration: none;
	}

	nav {
		display: flex;
		gap: var(--size-6);
		font-size: var(--font-size-2);
		align-items: baseline;
	}
</style>
