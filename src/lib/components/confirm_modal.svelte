<script lang="ts">
	export let open: boolean;
	export let title: string;
	export let on_yes: () => void;
</script>

{#if open}
	<div
		class="flex absolute top-0 bottom-0 left-0 right-0 justify-center items-center backdrop-blur-sm"
	>
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<div
			class="relative rounded bg-base-300 text-neutral-content w-1/4 h-1/5 max-w-lg"
			style="z-index: 1000;"
		>
			<h1 class="text-3xl text-base-content border-b text-left pl-4 pb-2">{title}</h1>
			<slot>
				<!-- Here goes nested component -->
			</slot>
			<div class="absolute text-base-content bottom-0 right-0 pr-4 py-4">
				<button class="pr-4" on:click={() => (open = false)}> Cancel </button>
				<button
					class="bg-primary py-2 px-2 rounded"
					on:click={() => {
						on_yes();
						open = false;
					}}
				>
					Delete
				</button>
			</div>
		</div>
	</div>
{/if}
