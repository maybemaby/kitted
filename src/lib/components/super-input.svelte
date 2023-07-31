<script lang="ts">
	import type { FormPathLeaves, ZodValidation } from 'sveltekit-superforms';

	import { formFieldProxy, type SuperForm } from 'sveltekit-superforms/client';

	import type { HTMLInputAttributes } from 'svelte/elements';
	import Input, { type InputBaseProps } from './input.svelte';
	import type { z, AnyZodObject } from 'zod';

	type T = $$Generic<AnyZodObject>;

	interface $$Props extends InputBaseProps, HTMLInputAttributes {
		class?: string | undefined;
		sForm: SuperForm<ZodValidation<T>, unknown>;
		field: FormPathLeaves<z.infer<T>>;
	}

	let cls: $$Props['class'] = undefined;
	export { cls as class };
	export let variant: $$Props['variant'] = undefined;
	export let type: $$Props['type'] = undefined;
	export let sForm: $$Props['sForm'];
	export let field: $$Props['field'];

	const { value, errors, constraints } = formFieldProxy(sForm, field);
</script>

<Input
	on:focus
	on:change
	on:input
	on:keydown
	on:keypress
	on:keyup
	on:blur
	aria-invalid={$errors ? 'true' : undefined}
	class={cls}
	{variant}
	{type}
	bind:value={$value}
	name={field}
	{...$constraints}
	{...$$restProps}
/>
