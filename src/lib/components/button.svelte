<script lang="ts">
	import type { HTMLButtonAttributes } from 'svelte/elements';

	interface $$Props extends HTMLButtonAttributes {
		kind?: 'primary' | 'secondary' | 'tertiary' | 'danger';
	}

	export let kind: $$Props['kind'] = 'primary';
</script>

<button class={kind}>
	<slot />
</button>
