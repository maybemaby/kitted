<span class="sr-only">
	<!-- @component
	Visually hidden text for accessibility
	-->
	<slot />
</span>

<style>
	.sr-only {
		position: absolute;
		left: -10000px;
		top: auto;
		width: 1px;
		height: 1px;
		overflow: hidden;
	}
</style>
