<script lang="ts">
	import { boxVariants } from '$lib/styles/common-variants';
	import { cva, cx, type VariantProps } from 'class-variance-authority';
	import type { HTMLAttributes } from 'svelte/elements';

	type $$Props = HTMLAttributes<HTMLDivElement> &
		VariantProps<typeof boxVariants> & {
			class?: string | undefined;
		};

	export let shadow: $$Props['shadow'] = 3;
	export let rounded: $$Props['rounded'] = 0;
	export let borderWidth: $$Props['borderWidth'] = 0;
	let cls: $$Props['class'] = undefined;
	export { cls as class };
</script>

<div class={cx(boxVariants({ shadow, rounded, borderWidth }), 'card', cls)} {...$$restProps}>
	<slot />
</div>

<style>
	.card {
		background: var(--surface);
	}
</style>
