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
	import { ExchangeValues } from '$lib/types';
	import { markets_store } from '$lib/stores/markets';

	export let data_feed: RotateArray;
	export let options: TradeFeedOptions;
	let settings_modal_open = false;
	let settings_state = false;
	let search_modal_open = false;
	let search_market = '';
	let searchable_exchanges: Array<string> = ExchangeValues.slice();
	let searchable_markets: Array<string> = [];

	let markets = $markets_store;

	const filter_market = () => {
		let new_markets: Array<string> = [];
		markets.forEach((e) => {
			if (searchable_exchanges.includes(e.exchange.toString())) {
				new_markets = new_markets.concat(e.markets);
			}
		});
		searchable_markets = new_markets;
		console.log(searchable_markets);
	};

	onMount(async () => {
		filter_market();
	});
</script>

<div>
	<Modal
		open={settings_modal_open}
		onClose={() => (settings_modal_open = false)}
		title="Settings"
		size="Small"
	>
		<div class="flex ">
			<div class="flex-1 pl-4 text-base-content">Minimum size</div>
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
	<Modal
		open={search_modal_open}
		onClose={() => (search_modal_open = false)}
		title="Chose markets"
		size="Large"
	>
		<div class="flex h-full bg-base-300">
			<div class="flex flex-col hover:bg-base-hover min-h-max  pl-4  pr-4">
				<p class="text-base-content text-xl">Exchanges</p>
				{#each ExchangeValues as Ex}
					<div class="flex space-x-2">
						<input
							type="checkbox"
							bind:group={searchable_exchanges}
							on:change={() => filter_market()}
							value={Ex}
						/>
						<p class="text-base-content">{Ex}</p>
					</div>
				{/each}
			</div>

			<div>
				<div class="pl-4 pt-2">
					<input
						bind:value={search_market}
						placeholder="Search"
						type="text"
						class="input input-success w-full max-w-xs bg-base-100 text-base-content "
					/>
				</div>

				<ul>
					{#each searchable_markets as market}
						<li>
							{market}
						</li>
					{/each}
				</ul>
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
			<button on:click={() => (settings_modal_open = true)} class="text-white">
				<Settings />
			</button>

			<button on:click={() => (search_modal_open = true)} class="text-white">
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
