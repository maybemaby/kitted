<script lang="ts" context="module">
	import type { AnyZodObject } from 'zod';
	type T = AnyZodObject;
</script>

<script lang="ts" generics="T extends AnyZodObject">
	import type { z } from 'zod';
	import type { FormPathLeaves, ZodValidation } from 'sveltekit-superforms';
	import { formFieldProxy, type SuperForm } from 'sveltekit-superforms/client';

	import type { HTMLSelectAttributes } from 'svelte/elements';
	import Field from './field.svelte';

	interface $$Props extends HTMLSelectAttributes {
		class?: string | undefined;
		sForm: SuperForm<ZodValidation<T>, unknown>;
		field: FormPathLeaves<z.infer<T>>;
		label?: string;
		hint?: string;
		options: { value: string; label: string }[];
	}

	let cls: $$Props['class'] = undefined;
	export { cls as class };

	export let sForm: $$Props['sForm'];
	export let field: $$Props['field'];
	export let label: string | undefined = undefined;
	export let hint: string | undefined = undefined;
	export let options: { value: string; label: string }[];

	const { value, errors, constraints } = formFieldProxy(sForm, field);
</script>

<Field {label} labelFor={field} {hint} errors={$errors}>
	<select
		on:focus
		on:change
		on:input
		on:keydown
		on:keypress
		on:keyup
		on:blur
		aria-invalid={$errors ? 'true' : undefined}
		class={cls}
		bind:value={$value}
		name={field}
		{...$constraints}
		{...$$restProps}
	>
		{#each options as option (option.label)}
			<option value={option.value}>{option.label}</option>
		{/each}
	</select>
</Field>

<style>
	.field {
		display: flex;
		flex-direction: column;
		gap: var(--size-2);
	}

	select {
		background-color: var(--surface-1);
		border-radius: var(--radius-2);
		padding: var(--size-1);
		color: var(--text);
		border: var(--border-size-2) solid var(--surface-3);
		font-size: var(--font-size-2);
	}

	.hint {
		font-size: var(--font-size-1);
		color: var(--text);
	}

	.error {
		font-size: var(--font-size-1);
		color: var(--error);
	}
</style>
