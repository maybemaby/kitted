<script lang="ts">
	export let label: string | undefined = undefined;
	export let labelFor: string | undefined = undefined;
	export let hint: string | undefined = undefined;
	export let errors: string[] | undefined = undefined;
	export let horizontal = false;
	export let reverse = false;
</script>

<!-- @component
  **paramter** --w: width css variable
-->

<div class="field" class:horizontal class:reverse>
	{#if label}
		<label for={labelFor}>{label} </label>
	{/if}
	<slot />
	{#if hint}
		<span class="hint">{hint}</span>
	{/if}
	{#if errors}
		<span class="error">{errors[0]}</span>
	{/if}
</div>

<style>
	.field {
		--reverse-direction: column-reverse;
		display: flex;
		flex-direction: column;
		gap: var(--size-2);
		width: var(--w, fit-content);
	}

	.field.horizontal {
		--reverse-direction: row-reverse;
		flex-direction: row;
		align-items: center;
	}

	.field.reverse {
		flex-direction: var(--reverse-direction);
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
