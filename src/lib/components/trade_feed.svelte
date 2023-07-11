<script lang="ts" context="module">
	export type TradeFeedOption = {
		type: Component;
		min_size: number;
		markets: Array<MarketInfo>;
	};
</script>

<script lang="ts">
	import { number_as_k } from '$lib/math';
	import Trashbin from '$lib/assets/trashbin.svelte';
	import Modal from './modal.svelte';
	import { onDestroy, onMount } from 'svelte';
	import type { MarketInfo, MarketType } from '$lib/markets/get_markets';
	import {
		get_exchange_endpoint,
		get_ping_string,
		get_trade_subscription_string
	} from '$lib/exchange';
	import type { Exchange } from '$lib/types';
	import { TradeFeedHandler } from '$lib/trade_feed';
	import { Tooltip } from 'svelte-tooltip-simple';
	import ExchangeLogo from './exchange_logo.svelte';
	import LeftArrow from '$lib/assets/left_arrow.svelte';
	import RightArrow from '$lib/assets/right_arrow.svelte';
	import { browser } from '$app/environment';
	import type { Component } from '$lib/stores/layout';
	import { onInterval } from '$lib/utils';

	export let option: TradeFeedOption;
	export let on_delete: (item: any) => void;
	export let on_left: () => void;
	export let on_right: () => void;

	let settings_modal_open = false;
	let settings_state = false;

	let data_feed: TradeFeedHandler = new TradeFeedHandler(100, option);

	let connections: Array<WebsockerPerEndpoint> = [];

	type WebsockerPerEndpoint = {
		exchange: Exchange;
		type: MarketType;
		websocket: WebSocket;
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
			option.min_size = n.target.value;
		} else {
			option.min_size = 1;
		}
	};

	onInterval(() => {
		connections.forEach((c) => {
			if (get_ping_string(c.exchange)?.length !== 0) {
				c.websocket.send(get_ping_string(c.exchange));
			}
		});
	}, 30_000);

	onMount(async () => {
		update_subscriptions(option.markets);
	});

	onDestroy(async () => {
		if (browser) {
			connections.forEach((c) => {
				c.websocket.close();
			});
		}
	});
</script>

<div>
	<Modal open={settings_modal_open} onClose={() => (settings_modal_open = false)} title="Settings">
		<div class="flex">
			<div class="flex-1 pl-4 text-base-content">Minimum size</div>
			<div class="pr-4">
				<input
					on:input={validate_number}
					value={option.min_size}
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
		<div class="flex flex-row bg-base-300 min-w-full">
			<!-- <div class="w-1/4"></div> -->
			<div class="flex flex-row justify-center w-4/5">
				<!-- svelte-ignore a11y-click-events-have-key-events -->
				<div
					on:pointerdown={(e) => e.stopPropagation()}
					on:click={() => on_left()}
					class="remove cursor-pointer"
				>
					<Tooltip text="Move Left">
						<LeftArrow />
					</Tooltip>
				</div>

				<!-- svelte-ignore a11y-click-events-have-key-events -->
				<div
					on:pointerdown={(e) => e.stopPropagation()}
					on:click={() => on_right()}
					class="remove cursor-pointer"
				>
					<Tooltip text="Move Right">
						<RightArrow />
					</Tooltip>
				</div>
			</div>
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<div
				on:pointerdown={(e) => e.stopPropagation()}
				on:click={(item) => on_delete(item)}
				class="remove cursor-pointer w-1/5"
			>
				<Tooltip text="Delete">
					<Trashbin />
				</Tooltip>
			</div>
		</div>
	{/if}

	<div class="w-full text-">
		{#each data_feed.trades.data as trade}
			<div
				class={`${
					trade.side == 'Buy' ? 'bg-primary' : 'bg-accent'
				} text-base-content flex flex-row`}
			>
				<div class="w-1/6">
					<ExchangeLogo exchange={trade.exchange} />
				</div>

				<div class="w-3/6">
					{+trade.price}
				</div>

				<div class="w-2/6">
					{#if trade.type == 'inverse'}
						{number_as_k(trade.size, 1)}
					{:else}
						{number_as_k(trade.size * trade.price, 1)}
					{/if}
				</div>
			</div>
		{/each}
	</div>
</div>
