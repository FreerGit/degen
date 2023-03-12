<script lang="ts" context="module">
	export type TradeFeedOptions = {
		market: string;
		min_size: number;
	};
</script>

<script lang="ts">
	import { number_as_k } from '$lib/math';
	import Settings from '$lib/assets/settings.svelte';
	import Search from '$lib/assets/search.svelte';
	import Trashbin from '$lib/assets/trashbin.svelte';
	import type { RotateArray } from '$lib/rotate_array';
	import Modal from './modal.svelte';

	export let data_feed: RotateArray;
	export let options: TradeFeedOptions;
	let isModalOpen: boolean = false;
	let settings_state = false;
</script>


<div>
  <Modal open={isModalOpen} onClose={() => isModalOpen = false}> 
		<div class="flex ">
			<div class="flex-1 pl-4">

				Minimum size 
			</div>
			<div class="pr-4">

				<input
				bind:value={options.min_size}
				type="number"
				class="input input-bordered input-success w-full max-w-xs bg-neutral"
				/>
			</div>
		</div>
</Modal>
</div>


<div
	on:mouseenter={() => (settings_state = true)}
	on:mouseleave={() => (settings_state = false)}
	class="flex flex-col w-40 max-h-screen overflow-y-auto no-scrollbar"
>
	{#if settings_state}
		<div class="fixed flex min-w-full bg-black bg-opacity-50">
			<button on:click={() => isModalOpen = true} class="text-white">
				<Settings />
			</button>

			

			<button class="text-white">
				<Search />
			</button>

			<button class="text-white">
				<Trashbin />
			</button>
		</div>
	{/if}
	{#each data_feed.data as trade}
		<li class={`${trade.side == 'Buy' ? 'bg-primary' : 'bg-accent'} text-base-content`}>
			{trade.price}
			{number_as_k(trade.size * trade.price, 1)}
		</li>
	{/each}
</div>
