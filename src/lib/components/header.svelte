<header>
	<a class="logo" href="/"> Kitted </a>
	<nav>
		<a href="/auth/register">Register</a>
		<a href="/auth/login">Login</a>
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
	}
</style>
