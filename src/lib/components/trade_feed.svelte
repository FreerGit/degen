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
	import { onMount } from 'svelte';
	import { get_markets } from '$lib/markets/get_markets';

	export let data_feed: RotateArray;
	export let options: TradeFeedOptions;
	let settings_modal_open: boolean = false;
	let settings_state = false;
	let search_modal_open: boolean = false;
	let search_market: string = "";

	onMount(async () => {
		await get_markets()
	})

</script>

<div>
  <Modal open={settings_modal_open} onClose={() => settings_modal_open = false} title="Settings"> 
		<div class="flex ">
			<div class="flex-1 pl-4 text-base-content">
				Minimum size 
			</div>
			<div class="pr-4">
				<input
				bind:value={options.min_size}
				type="number"
				class="input input-bordered input-success w-full max-w-xs bg-base-100 text-base-content border"
				/>
			</div>
		</div>
	</Modal>
</div>

<div>
  <Modal open={search_modal_open} onClose={() => search_modal_open = false} title="Chose markets"> 
		<div class="flex">
			<div class="pl-4 pt-2">
				<input
				bind:value={search_market}
				placeholder="Search"
				type="text"
				class="input input-success w-full max-w-xs bg-base-100 text-base-content "
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
			<button on:click={() => settings_modal_open = true} class="text-white">
				<Settings />
			</button>

			<button on:click={() => search_modal_open = true} class="text-white">
				<Search />
			</button>

			<button class="text-white">
				<Trashbin />
			</button>
		</div>
	{/if}
	
	<uL>
		{#each data_feed.data as trade}
		<li class={`${trade.side == 'Buy' ? 'bg-primary' : 'bg-accent'} text-base-content`}>
			{trade.price}
			{number_as_k(trade.size * trade.price, 1)}
		</li>
		{/each}
	</uL>
</div>