<script lang="ts">
	export let open: boolean;
	export let onClose: () => void;
	export let title: string;
</script>

{#if open}
	<div
		class="flex absolute top-0 bottom-0 left-0 right-0 justify-center items-center backdrop-blur-sm"
	>
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<div
			class="relative rounded bg-base-300 text-neutral-content w-2/5 h-3/4"
			style="z-index: 1000;"
		>
			<h1 class="flex text-2xl text-base-content pl-4 border-b text-left pb-2">{title}</h1>

			<slot>
				<!-- Here goes nested component -->
			</slot>
		</div>
	</div>
{/if}
