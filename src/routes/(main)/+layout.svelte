<script lang="ts">
	import Header from '$lib/components/header.svelte';
	import type { PageData } from './$types';
	import '../../global.css';

	export let data: PageData;
</script>

<Header loggedIn={data.isLoggedIn} />
<main>
	<slot />
</main>
