<script lang="ts" context="module">
	export type TradeFeedOption = {
		exchange: Exchange;
		market: string;
		min_size: number;
	};
</script>

<script lang="ts">
	import { number_as_k } from '$lib/math';
	import Settings from '$lib/assets/settings.svelte';
	import Search from '$lib/assets/search.svelte';
	import Trashbin from '$lib/assets/trashbin.svelte';
	import { push_front, rotate_array, type RotateArray } from '$lib/rotate_array';
	import Modal from './modal.svelte';
	import { onMount } from 'svelte';
	import { ExchangeValues, type Exchange, type Payload, type Trades } from '$lib/types';
	import { markets_store } from '$lib/stores/markets';
	import { match, P } from 'ts-pattern';
	import { add_market_suffix, type MarketType } from '$lib/markets/get_markets';
	import { get_exchange_trade_endpoint } from '$lib/exchange';

	export let options: Array<TradeFeedOption>;

	let settings_modal_open = false;
	let settings_state = false;
	let search_modal_open = true;

	let search_market = '';
	let searchable_exchanges: Array<string> = ExchangeValues.slice();
	let markets_to_display: Array<MarketInfo> = [];
	let chosen_markets: Array<MarketInfo> = [];

	let data_feed: RotateArray = rotate_array(100);
	let connections: Array<WebsockerPerEndpoint> = [];

	let markets = $markets_store;

	type MarketInfo = {
		exchange: Exchange;
		type: MarketType;
		market: string;
	};

	type WebsockerPerEndpoint = {
		exchange: Exchange;
		type: MarketType;
		websocket: WebSocket;
	};

	const search_markets = () => {
		let found: Array<MarketInfo> = [];
		for (let i = 0; i < markets.length; i++) {
			for (let j = 0; j < markets[i].markets.length; j++) {
				if (
					markets[i].markets[j].startsWith(search_market.toUpperCase()) &&
					searchable_exchanges.includes(markets[i].exchange)
				) {
					if (chosen_markets.every((e) => e.market != markets[i].markets[j])) {
						found.push({
							exchange: markets[i].exchange,
							type: markets[i].market_type,
							market: markets[i].markets[j]
						});
					}
				}
			}
		}
		markets_to_display = found;
	};

	const handle_market = (info: MarketInfo) => {
		markets_to_display = markets_to_display.filter((m) => m.market != info.market);
		chosen_markets.push(info);
	};

	// const update_websocket_connections = (exchanges: Array<Exchange>) => {
	// 	connections = exchanges.map(e => {
	// 		return {
	// 			exchange: e,
	// 			websocket: new WebSocket(get_exchange_endpoint(e))
	// 		} as WebsocketPerExchange;
	// 	});
	// }

	// const update_subscriptions = (markets: Array<MarketWithExchange>) => {
	// 	update_websocket_connections(markets.map(m => m.exchange));

	// 	connections.forEach(c => {
	// 		const markets_to_sub = markets.filter(m => m.)
	// 		const endopint = get_exchange_trade_endpoint(c.exchange, )
	// 	})
	// }

	onMount(async () => {
		// update_subscriptions(options.map(o => {return {exchange: o.exchange, market_name: o.market}}));
		// 	ws.onopen = () => {
		// 		ws.send(
		// 			`{"op": "subscribe", "args": ["${options.market}"]}`
		// 		);
		// 	};
		// 	ws.onmessage = (message) => {
		// 		let json: Payload = JSON.parse(message.data);
		// 		match(json)
		// 			.with({ data: P.array({ tick_direction: P.string }) }, () => {
		// 				(json as Trades).data.forEach((i) => {
		// 					if (i.size * i.price > options.min_size) {
		// 						data_feed = push_front(data_feed, i);
		// 					}
		// 				});
		// 			})
		// 			.run();
		// 	};
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
		title="Choose markets"
		size="Large"
	>
		<div class="flex h-full bg-base-300">
			<div class="flex flex-col hover:bg-base-hover min-h-max  pl-4  pr-4">
				<p class="text-base-content text-xl">Exchanges</p>
				{#each ExchangeValues as Ex}
					<div class="flex space-x-2">
						<input type="checkbox" bind:group={searchable_exchanges} value={Ex} />
						<p class="text-base-content">{Ex}</p>
					</div>
				{/each}
			</div>

			<div class="w-full bg-neutral">
				<div class="pl-4 pt-2">
					<input
						bind:value={search_market}
						on:input={() => search_markets()}
						placeholder="Search"
						type="text"
						class="input input-success w-full max-w-xs bg-base-100 text-base-content "
					/>
				</div>

				<ul class="pl-4 pointer-events-auto">
					{#if search_market.length > 0}
						{#each markets_to_display as market, i}
							<li
								class="text-base-content pointer-events-auto hover:bg-base-hover hover:cursor-default"
								on:mousedown={() => handle_market(market)}
							>
								{market.market}
								{market.type}
								{market.exchange}
							</li>
						{/each}
					{/if}
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
