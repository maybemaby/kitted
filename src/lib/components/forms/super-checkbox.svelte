<script lang="ts" context="module">
	import type { AnyZodObject } from 'zod';
	type T = AnyZodObject;
</script>

<script lang="ts" generics="T extends AnyZodObject">
	import type { HTMLInputAttributes } from 'svelte/elements';

	import type { z } from 'zod';
	import type { FormPathLeaves, ZodValidation } from 'sveltekit-superforms';
	import { formFieldProxy, type SuperForm } from 'sveltekit-superforms/client';

	import Field from './field.svelte';
	import type { Writable } from 'svelte/store';

	interface $$Props extends Omit<HTMLInputAttributes, 'type'> {
		class?: string | undefined;
		sForm: SuperForm<ZodValidation<T>, unknown>;
		field: FormPathLeaves<z.infer<T>>;
		label?: string;
		hint?: string;
		horizontal?: boolean;
		reverse?: boolean;
	}

	let cls: $$Props['class'] = undefined;
	export { cls as class };

	export let sForm: $$Props['sForm'];
	export let field: $$Props['field'];
	export let label: string | undefined = undefined;
	export let hint: string | undefined = undefined;
	export let horizontal: boolean = false;
	export let reverse: boolean = false;

	const { errors, value, constraints } = formFieldProxy(sForm, field);

	$: boolValue = value as Writable<boolean>;
</script>

<Field {label} labelFor={field} {hint} errors={$errors} {horizontal} {reverse}>
	<input
		on:focus
		on:change
		on:input
		on:keydown
		on:keypress
		on:keyup
		on:blur
		class={cls}
		bind:checked={$boolValue}
		name={field}
		aria-invalid={$errors ? 'true' : undefined}
		type="checkbox"
		{...$constraints}
		{...$$restProps}
	/>
</Field>

<style>
	input {
		width: var(--size-3);
		aspect-ratio: 1/1;
	}
</style>
