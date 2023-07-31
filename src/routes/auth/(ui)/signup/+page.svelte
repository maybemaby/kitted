<script lang="ts">
	import { superForm } from 'sveltekit-superforms/client';
	import Button from '$lib/components/button.svelte';
	import Card from '$lib/components/card.svelte';
	import type { PageData } from './$types';
	import Error from '$lib/components/error.svelte';
	import SuperInput from '$lib/components/super-input.svelte';

	export let data: PageData;
	const form = superForm(data.form);

	$: errors = form.errors;
</script>

<Card class="auth__content" rounded={2}>
	<h1>Sign up</h1>
	<form use:form.enhance method="post">
		<div class="row gap-5 names">
			<div class="stack gap-2">
				<label for="firstName">First Name</label>
				<SuperInput
					type="text"
					id="firstName"
					name="firstName"
					sForm={form}
					field={'firstName'}
					required
				/>
				<Error error={$errors.firstName} />
			</div>
			<div class="stack gap-2">
				<label for="lastName">Last Name</label>
				<SuperInput
					type="text"
					id="lastName"
					name="lastName"
					sForm={form}
					field={'lastName'}
					required
				/>
				<Error error={$errors.lastName} />
			</div>
		</div>
		<label for="email">Email</label>
		<SuperInput type="email" id="email" name="email" sForm={form} field={'email'} required />
		<Error error={$errors.email} />
		<label for="password">Password</label>
		<SuperInput
			type="password"
			id="password"
			name="password"
			required
			sForm={form}
			field={'password'}
			minlength={8}
		/>
		<Error error={$errors.password} />
		<label for="passwordConfirm">Confirm Password</label>
		<SuperInput
			type="password"
			id="passwordConfirm"
			name="passwordConfirm"
			required
			minlength={8}
			sForm={form}
			field={'passwordConfirm'}
		/>
		<Error error={$errors.passwordConfirm} />
		<Button class="auth_submit" rounded={2} type="submit">Login</Button>
	</form>
	<div>
		Already have an account? <a href="/auth/login">Login</a>
	</div>
</Card>

<style>
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
