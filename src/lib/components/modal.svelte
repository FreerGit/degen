<script lang="ts">
	export let open: boolean;
	export let onClose: () => void;
	export let title: string;
	export let size: 'Small' | 'Large';
</script>

{#if open}
	{#if size == 'Small'}
		<div
			class="flex absolute top-0 bottom-0 left-0 right-0 justify-center items-center backdrop-blur-sm"
		>
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<div
				on:click={onClose}
				class="absolute top-0 bottom-0 left-0 right-0"
				style="z-index: 100;"
			/>
			<div
				class="relative rounded bg-base-300 text-neutral-content w-2/5 h-1/2 max-w-lg"
				style="z-index: 1000;"
			>
				<h1 class="text-3xl text-base-content border-b text-left pl-4 pb-2">{title}</h1>
				<slot>
					<!-- Here goes nested component -->
				</slot>
			</div>
		</div>
	{:else if size == 'Large'}
		<div
			class="flex absolute top-0 bottom-0 left-0 right-0 justify-center items-center backdrop-blur-sm"
		>
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<div
				on:click={() => onClose()}
				class="absolute top-0 bottom-0 left-0 right-0"
				style="z-index: 100;"
			/>
			<div
				class="relative rounded bg-base-300 text-neutral-content w-1/2 h-3/4  max-w-lg"
				style="z-index: 1000;"
			>
				<h1 class="text-3xl text-base-content border-b text-left pl-4 pb-2">{title}</h1>
				<slot>
					<!-- Here goes nested component -->
				</slot>
			</div>
		</div>
	{/if}
{/if}
