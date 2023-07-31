<script lang="ts" context="module">
	const input = cva('input', {
		variants: {
			variant: {
				filled: ['filled'],
				unstyled: ['unstyled']
			}
		}
	});

	export type InputBaseProps = VariantProps<typeof input>;
</script>

<script lang="ts">
	import { cva, cx, type VariantProps } from 'class-variance-authority';
	import type { HTMLInputAttributes } from 'svelte/elements';
	import LucideEye from '~icons/lucide/eye';
	import Button from './button.svelte';
	import VisuallyHidden from './visually-hidden.svelte';

	interface $$Props extends InputBaseProps, HTMLInputAttributes {
		class?: string | undefined;
	}

	let cls: $$Props['class'] = undefined;
	export { cls as class };
	export let variant: $$Props['variant'] = undefined;
	export let type: $$Props['type'] = undefined;

	let hidePassword = true;
</script>

<!-- 
  @component
  **parameter** --fs: font-size css variable
  
-->

{#if type === 'password'}
	<div class={cx('password-container', input({ variant }), cls)}>
		<input
			on:focus
			on:change
			on:input
			on:keydown
			on:keypress
			on:keyup
			on:blur
			type={hidePassword ? 'password' : 'text'}
			{...$$restProps}
		/>
		<Button type="button" variant="ghost" on:click={() => (hidePassword = !hidePassword)}>
			<LucideEye aria-hidden="true" />
			<VisuallyHidden>
				{#if hidePassword}
					Show Password
				{:else}
					Hide Password
				{/if}
			</VisuallyHidden>
		</Button>
	</div>
{:else}
	<input
		on:focus
		on:change
		on:input
		on:keydown
		on:keypress
		on:keyup
		on:blur
		class={cx(input({ variant }), cls)}
		{type}
		{...$$restProps}
	/>
{/if}

<style>
	.input,
	.password-container {
		border: 1px solid var(--surface-3);
		border-radius: var(--radius-2);
		padding: var(--size-2) var(--size-2);
		transition: background 0.2s var(--ease-out-2);
		color: var(--text);
		font-size: var(--fs, inherit);
		background: transparent;
	}

	.input:focus,
	.password-container:focus-within {
		outline: 2px solid var(--secondary-2);
		outline-offset: 3px;
	}

	.input.filled,
	.password-container.filled {
		background: var(--surface-2);
	}

	.input.filled:focus,
	.password-container.filled:focus-within {
		background: var(--surface-3);
	}

	.input.unstyled {
		border: none;
		padding: 0;
		outline: none;
	}

	.password-container {
		display: flex;
		align-items: center;
		gap: var(--size-2);
	}

	.password-container.unstyled {
		border: none;
		padding: 0;
		outline: none;
	}

	.password-container > input {
		border: none;
		padding: 0;
		outline: none;
		background: transparent;
		width: 100%;
		font-size: var(--fs, inherit);
		color: var(--text);
	}
</style>
