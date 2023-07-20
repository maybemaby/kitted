<script lang="ts">
	import type { HTMLButtonAttributes } from 'svelte/elements';
	import { cva, cx, type VariantProps } from 'class-variance-authority';
	import { type BoxProps, boxVariants } from '$lib/styles/common-variants';

	const button = cva('button', {
		variants: {
			variant: {
				primary: ['primary'],
				outline: ['outline'],
				ghost: ['ghost'],
				warn: ['warn'],
				danger: ['danger']
			}
		},
		defaultVariants: {
			variant: 'primary'
		}
	});

	type ButtonBaseProps = VariantProps<typeof button>;

	interface $$Props extends HTMLButtonAttributes, ButtonBaseProps, BoxProps {
		sz?: 'sm' | 'md' | 'lg';
		class?: string | undefined;
	}

	let cls: $$Props['class'] = undefined;
	export { cls as class };

	export let variant: $$Props['variant'] = 'primary';
	export let borderWidth: $$Props['borderWidth'] = 0;
	export let rounded: $$Props['rounded'] = 0;
	export let shadow: $$Props['shadow'] = 0;
	export let sz: $$Props['sz'] = 'md';
</script>

<!-- 
	@component
	**parameter** --btn-w: button width css variable
	
-->
<button
	class={cx(button({ variant }), boxVariants({ borderWidth, rounded, shadow }), sz, cls)}
	on:click
	on:mousedown
	on:mouseup
	{...$$restProps}
>
	<slot />
</button>

<style>
	.button {
		cursor: pointer;
		transition: background 0.2s var(--ease-out-2);
		outline-width: 2px;
		outline-offset: 3px;
		width: var(--btn-w);
	}

	/* Prevents The extra spacing at bottom of svg buttons. */
	.button > :global(svg) {
		display: block;
	}

	.button.sm {
		padding: var(--size-1) var(--size-2);
		font-size: var(--font-size-1);
	}

	.button.md {
		padding: var(--size-2) var(--size-4);
		font-size: var(--font-size-2);
	}

	.button.lg {
		padding: var(--size-3) var(--size-6);
		font-size: var(--font-size-3);
	}

	.primary {
		background: var(--primary);
		color: var(--on-primary-text);
	}

	.primary:hover {
		background: var(--primary-4);
	}

	.primary:focus {
		outline-color: var(--primary);
		outline-style: solid;
	}

	.outline {
		background: transparent;
		color: var(--text);
		border: var(--border-size-1) solid var(--primary);
	}

	.outline:hover {
		background: var(--primary-4);
		color: var(--on-primary-text);
	}

	.button.ghost {
		background: transparent;
		color: var(--text);
		padding: 0;
	}

	.button.ghost:hover {
		/* background: hsl(var(--gray-8-hsl) / 10%); */
		background: var(--stone-3);
	}

	.warn {
		background: var(--warn);
		color: var(--text);
	}

	.warn:hover {
		background: var(--warn-2);
	}

	.danger {
		background: var(--danger);
		color: var(--text);
	}

	.danger:hover {
		background: var(--danger-2);
	}
</style>
