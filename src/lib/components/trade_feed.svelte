<script lang="ts" context="module">
	export type TradeFeedOption = {
		min_size: number;
		markets: Array<MarketInfo>;
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
	import type { MarketInfo, MarketType } from '$lib/markets/get_markets';
	import ModalWithButton from './modal_with_button.svelte';
	import { get_exchange_trade_endpoint, get_trade_subscription_string } from '$lib/exchange';
	import { match, P } from 'ts-pattern';

	export let options: TradeFeedOption;

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
		chosen_markets = [...chosen_markets, info];
	};

	const update_subscriptions = (markets: Array<MarketInfo>) => {
		connections = markets.map((e) => {
			return {
				exchange: e.exchange,
				type: e.type,
				websocket: new WebSocket(get_exchange_trade_endpoint(e.exchange, e.type))
			} as WebsockerPerEndpoint;
		});

		connections.forEach((c) => {
			console.log(c);
			console.log(chosen_markets);
			const to_sub = chosen_markets
				.filter((cm) => cm.exchange == c.exchange && cm.type == c.type)
				.map((cm) => cm.market);
			console.log(to_sub);
			console.log(get_trade_subscription_string(c.exchange, to_sub));
			c.websocket.onopen = () => {
				c.websocket.send(get_trade_subscription_string(c.exchange, to_sub));
			};

			c.websocket.onmessage = (message) => {
				let json: Payload = JSON.parse(message.data);
				match(json)
					.with({ data: P.array({ L: P.string }) }, () => {
						(json as Trades).data.forEach((i) => {
							i.type = c.type; // inverse has usd dom.
							if (i.type == 'inverse') {
								if (i.v > options.min_size) {
									data_feed = push_front(data_feed, i);
								}
							} else {
								if (i.v * i.p > options.min_size) {
									data_feed = push_front(data_feed, i);
								}
							}
						});
					})
					.run();
			};

			// c.websocket.send()
		});
	};

	onMount(async () => {
		console.log(options);
		chosen_markets = options.markets;
		update_subscriptions(options.markets);

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
	<Modal open={settings_modal_open} onClose={() => (settings_modal_open = false)} title="Settings">
		<div class="flex ">
			<div class="flex-1 pl-4 text-base-content">Minimum size</div>
			<div class="pr-4">
				<input
					bind:value={options}
					type="number"
					class="input input-bordered input-success w-full max-w-xs bg-base-100 text-base-content border"
				/>
			</div>
		</div>
	</Modal>
</div>

<div>
	<ModalWithButton
		open={search_modal_open}
		onClose={() => (search_modal_open = false)}
		title="Choose markets"
	>
		<div class="flex h-full bg-base-300">
			<div class="flex flex-col hover:bg-base-hover min-h-max justify-middle items-center  w-1/4">
				<p class="text-base-content text-l">Exchanges</p>
				{#each ExchangeValues as Ex}
					<div class="flex space-x-2">
						<input type="checkbox" bind:group={searchable_exchanges} value={Ex} />
						<p class="text-base-content">{Ex}</p>
					</div>
				{/each}
			</div>

			<div class="h-full w-full bg-base-300">
				<input
					bind:value={search_market}
					on:input={() => search_markets()}
					placeholder="Search"
					type="text"
					class="input input-success w-full h-12 bg-base-200 text-base-content pl-2 text-xl"
				/>
				<div class="h-1/2 overflow-hidden">
					<table
						class="table-auto pointer-events-auto overflow-hidden text-base-content w-full pt-0.5"
					>
						<!-- class="text-base-content " -->
						{#if search_market.length > 0}
							{#each markets_to_display as market, i}
								<tr
									class="hover:bg-base-hover hover:cursor-default"
									on:mousedown={() => handle_market(market)}
								>
									<td>
										{market.market}
									</td>
									<td>
										{market.type}
									</td>
									<td>
										{market.exchange}
									</td>
								</tr>
							{/each}
						{/if}
					</table>
				</div>

				<div class="text-base-content">
					{#each chosen_markets as cm}
						{cm.market}
					{/each}
				</div>

				<div class="absolute text-base-content bottom-0 right-0 pr-4">
					<button class="pr-4" on:click={() => (search_modal_open = false)}> Cancel </button>
					<button class="bg-primary py-2 px-2 rounded"> Update </button>
				</div>
			</div>
		</div>
	</ModalWithButton>
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
			<li class={`${trade.S == 'Buy' ? 'bg-primary' : 'bg-accent'} text-base-content`}>
				{trade.p}
				{#if trade.type == 'inverse'}
					{number_as_k(trade.v, 1)}
				{:else}
					{number_as_k(trade.v * trade.p, 1)}
				{/if}
				{trade.type}
			</li>
		{/each}
	</uL>
</div>
