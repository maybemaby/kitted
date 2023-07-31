<script lang="ts">
	export let error: string[] | undefined = undefined;
</script>

{#if error}
	<span>
		{#each error as message}
			{message}
		{/each}
	</span>
{/if}

<style>
	span {
		color: var(--danger);
	}
</style>
