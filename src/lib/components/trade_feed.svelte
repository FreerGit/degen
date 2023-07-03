<script lang="ts" context="module">
	export type TradeFeedOption = Array<TFO>;
	export type TFO = {
		min_size: number;
		markets: Array<MarketInfo>;
	};
</script>

<script lang="ts">
	import { number_as_k } from '$lib/math';
	import Trashbin from '$lib/assets/trashbin.svelte';
	import Modal from './modal.svelte';
	import { onMount } from 'svelte';
	import type { MarketInfo, MarketType } from '$lib/markets/get_markets';
	import { get_exchange_endpoint, get_trade_subscription_string } from '$lib/exchange';
	import type { Exchange } from '$lib/types';
	import { TradeFeedHandler } from '$lib/trade_feed';
	import { Tooltip } from 'svelte-tooltip-simple';
	import ExchangeLogo from './exchange_logo.svelte';

	export let options: TFO;
	export let on_delete: (item: any) => void;

	let settings_modal_open = false;
	let settings_state = false;

	let data_feed: TradeFeedHandler = new TradeFeedHandler(100, options);

	let connections: Array<WebsockerPerEndpoint> = [];

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

	const update_subscriptions = async (chosen: Array<MarketInfo>) => {
		connections.forEach((c) => c.websocket.close());
		connections = [];

		chosen.forEach(async (m) => {
			if (!connections.find((c) => c.exchange == m.exchange && c.type == m.type)) {
				connections.push({
					exchange: m.exchange,
					type: m.type,
					websocket: new WebSocket(get_exchange_endpoint(m.exchange, m.type))
				} as WebsockerPerEndpoint);
			}
		});

		connections.forEach((c) => {
			const to_sub = chosen
				.filter((cm) => cm.exchange == c.exchange && cm.type == c.type)
				.map((cm) => cm.market);

			c.websocket.onopen = async () => {
				c.websocket.send(get_trade_subscription_string(c.exchange, to_sub));
			};

			c.websocket.onmessage = (message) => {
				data_feed.handle_trade(message.data, c.exchange, c.type);
				data_feed = data_feed;
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
		update_subscriptions(options.markets);
	});
</script>

<div>
	<Modal open={settings_modal_open} onClose={() => (settings_modal_open = false)} title="Settings">
		<div class="flex">
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

<div
	on:mouseenter={() => (settings_state = true)}
	on:mouseleave={() => (settings_state = false)}
	class="flex flex-col bg-red h-full max-h-screen overflow-y-auto no-scrollbar w-full"
>
	{#if settings_state}
		<div class="flex bg-base-300 min-w-full">
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<span
				on:pointerdown={(e) => e.stopPropagation()}
				on:click={(item) => {
					on_delete(item);
					connections.forEach((c) => {
						c.websocket.close();
					});
				}}
				class="remove cursor-pointer"
			>
				<Tooltip text="Delete">
					<Trashbin />
				</Tooltip>
			</span>
		</div>
	{/if}

	<div>
		{#each data_feed.trades.data as trade}
			<div class={`${trade.side == 'Buy' ? 'bg-primary' : 'bg-accent'} text-base-content flex flex-row`}>
				<ExchangeLogo exchange={trade.exchange}/>
				{trade.price}
				{#if trade.type == 'inverse'}
					{number_as_k(trade.size, 1)}
				{:else}
					{number_as_k(trade.size * trade.price, 1)}
				{/if}
			</div>
		{/each}
		</div>
</div>
