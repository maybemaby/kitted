<script>
	import Button from '$lib/components/button.svelte';
	import Card from '$lib/components/card.svelte';
	import Input from '$lib/components/input.svelte';
</script>

<Card class="auth__content" rounded={2}>
	<h1>Sign up</h1>
	<form>
		<div class="row gap-5 names">
			<div class="stack gap-2">
				<label for="first_name">First Name</label>
				<Input type="text" id="first_name" name="first_name" required />
			</div>
			<div class="stack gap-2">
				<label for="last_name">Last Name</label>
				<Input type="text" id="last_name" name="last_name" required />
			</div>
		</div>
		<label for="email">Email</label>
		<Input type="email" id="email" name="email" required />
		<label for="password">Password</label>
		<Input type="password" id="password" name="password" required />
		<label for="password_confirm">Confirm Password</label>
		<Input type="password" id="password_confirm" name="password_confirm" required />
		<Button class="auth_submit" rounded={2} type="submit">Login</Button>
	</form>
	<div>
		Already have an account? <a href="/auth/login">Login</a>
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

	.names > .stack {
		flex: 1 1 auto;
	}

	.names {
		margin-bottom: var(--size-4);
	}
</style>
