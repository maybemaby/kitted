<script>
	import Button from '$lib/components/button.svelte';
	import Card from '$lib/components/card.svelte';
	import Input from '$lib/components/input.svelte';
</script>

<Card class="auth__content" rounded={2}>
	<h1>Login</h1>
	<form>
		<label for="email">Email</label>
		<Input type="email" id="email" name="email" required />
		<label for="password">Password</label>
		<Input type="password" id="password" name="password" required />
		<Button class="auth_submit" rounded={2} type="submit">Login</Button>
	</form>
	<div>
		Don't have an account? <a href="/auth/signup">Sign up</a>
	</div>
</Card>

<style>
	h1 {
		font-size: var(--font-size-4);
		font-weight: var(--font-weight-5);
	}

	form {
		display: flex;
		flex-direction: column;
		gap: var(--size-3);
		margin: var(--size-6) 0;
		font-size: var(--font-size-2);
	}

	:global(.auth__content) {
		padding: var(--size-6);
		border: 1px solid var(--surface-2);
		width: 95%;
	}

	:global(.auth_submit) {
		margin-top: var(--size-3);
	}

	@media (--sm-n-above) {
		:global(.auth__content) {
			width: clamp(400px, 60vw, 800px);
		}
	}
</style>
