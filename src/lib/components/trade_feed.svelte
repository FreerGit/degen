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
	import type { MarketInfo, MarketType } from '$lib/markets/get_markets';
	import { get_exchange_trade_endpoint, get_trade_subscription_string } from '$lib/exchange';
	import { match, P } from 'ts-pattern';
	import SearchModal from './search_modal.svelte';
	import type { Exchange, Payload, Trades } from '$lib/types';
	import ConfirmModal from './confirm_modal.svelte';

	export let options: TradeFeedOption;

	let settings_modal_open = false;
	let settings_state = false;
	let search_modal_open = false;
	let confirm_modal_open = false;

	let data_feed: RotateArray = rotate_array(100);
	let connections: Array<WebsockerPerEndpoint> = [];
	let markets_to_display: Array<MarketInfo> = [];
	let chosen_markets: Array<MarketInfo> = [];

	type WebsockerPerEndpoint = {
		exchange: Exchange;
		type: MarketType;
		websocket: WebSocket;
	};

	const handle_update = (markets: Array<MarketInfo>) => {
		settings_modal_open = false;
		update_subscriptions(markets);
		options.markets = markets;
	};

	const update_subscriptions = (chosen: Array<MarketInfo>) => {
		connections.forEach((c) => c.websocket.close());
		connections = [];

		chosen.forEach((m) => {
			if (!connections.find((c) => c.exchange == m.exchange && c.type == m.type)) {
				connections.push({
					exchange: m.exchange,
					type: m.type,
					websocket: new WebSocket(get_exchange_trade_endpoint(m.exchange, m.type))
				} as WebsockerPerEndpoint);
			}
		});

		console.log(connections);

		connections.forEach((c) => {
			const to_sub = chosen_markets
				.filter((cm) => cm.exchange == c.exchange && cm.type == c.type)
				.map((cm) => cm.market);
			c.websocket.onopen = () => {
				c.websocket.send(get_trade_subscription_string(c.exchange, to_sub));
			};

			c.websocket.onmessage = (message) => {
				let json: Payload = JSON.parse(message.data);
				match(json)
					.with({ data: P.array({ S: P.string }) }, () => {
						(json as Trades).data.forEach((i) => {
							i.type = c.type; // inverse has usd dom.
							if (i.type == 'inverse') {
								if (+i.v > options.min_size) {
									//
									data_feed = push_front(data_feed, i);
								}
							} else {
								if (i.v * i.p > options.min_size) {
									data_feed = push_front(data_feed, i);
								}
							}
						});
					})
					.with({ success: P.boolean }, () => {})
					.run();
			};
		});
	};

	const isNumber = (n: any) => {
		return !isNaN(parseFloat(n)) && isFinite(n);
	};

	const validate_number = (n: any) => {
		if (isNumber(n.target.value)) {
			options.min_size = n.target.value;
		} else {
			options.min_size = 1;
		}
	};

	onMount(async () => {
		chosen_markets = options.markets;
		update_subscriptions(options.markets);
	});
</script>

<div>
	<Modal open={settings_modal_open} onClose={() => (settings_modal_open = false)} title="Settings">
		<div class="flex ">
			<div class="flex-1 pl-4 text-base-content">Minimum size</div>
			<div class="pr-4">
				<input
					on:input={validate_number}
					value={options.min_size}
					type="number"
					class="input input-bordered input-success w-full max-w-xs bg-base-100 text-base-content border"
				/>
			</div>
		</div>
	</Modal>
</div>

<SearchModal
	bind:open={search_modal_open}
	title="Choose Markets"
	display={markets_to_display}
	chosen={chosen_markets}
	{options}
	update={handle_update}
/>

<div
	on:mouseenter={() => (settings_state = true)}
	on:mouseleave={() => (settings_state = false)}
	class="flex flex-col w-40 max-h-screen overflow-y-auto no-scrollbar"
>
	{#if settings_state}
		<div class="fixed flex min-w-full bg-base-300">
			<button on:click={() => (settings_modal_open = true)} class="text-white">
				<Settings />
			</button>

			<button on:click={() => (search_modal_open = true)} class="text-white">
				<Search />
			</button>

			<button on:click={() => (confirm_modal_open = true)} class="text-white">
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
				<!-- {trade.type} -->
			</li>
		{/each}
	</uL>
</div>
