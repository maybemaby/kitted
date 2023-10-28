<script>
	import Button from '$lib/components/button.svelte';
	import Card from '$lib/components/card.svelte';
	import Input from '$lib/components/input.svelte';
	import CarbonLogoGithub from '~icons/carbon/logo-github';
	import LogosGoogleIcon from '~icons/logos/google-icon';
</script>

<Card class="auth__content" rounded={2}>
	<h1>Login</h1>
	<div class="providers stack gap-3">
		<a href="/auth/github">
			<Button
				class="row justify-center gap-4 items-center"
				--btn-w="100%"
				variant="primary"
				rounded={2}
			>
				<CarbonLogoGithub />
				Login with Github
			</Button>
		</a>
		<a href="/auth/google">
			<Button
				class="row justify-center gap-4 items-center"
				--btn-w="100%"
				variant="primary"
				rounded={2}
			>
				<LogosGoogleIcon />
				Login with Google
			</Button>
		</a>
	</div>

	<div class="row items-center gap-4">
		<div class="separator" />
		<p>Or</p>
		<div class="separator" />
	</div>

	<form method="post">
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

	.providers {
		margin: var(--size-6) 0;
	}

	.providers > a {
		width: 100%;
	}

	.separator {
		flex: 1;
		height: 2px;
		background: var(--text);
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
