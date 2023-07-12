<script lang="ts" context="module">
	export type OrderBookOption = {
		type: Component;
		markets: MarketInfo;
	};
</script>

<script lang="ts">
	import Center from '$lib/assets/center.svelte';
	import Trashbin from '$lib/assets/trashbin.svelte';
	import type { MarketInfo } from '$lib/markets/get_markets';
	import { number_as_k } from '$lib/math';
	import { onDestroy, onMount } from 'svelte';

	import { Tooltip } from 'svelte-tooltip-simple';
	import ExchangeLogo from './exchange_logo.svelte';
	import { browser } from '$app/environment';
	import LeftArrow from '$lib/assets/left_arrow.svelte';
	import RightArrow from '$lib/assets/right_arrow.svelte';
	import type { Component } from '$lib/stores/layout';
	import { new_orderbook_instance } from '$lib/exchange';
	import type { AbstractOrderBook } from '$lib/order_book';
	import { onInterval } from '$lib/utils';

	export let option: OrderBookOption;
	export let on_delete: (item: any) => void;
	export let id: number;
	export let on_left: () => void;
	export let on_right: () => void;

	let ws: WebSocket;
	let order_book: AbstractOrderBook = new_orderbook_instance(option.markets);

	const scroll_to_center = () => {
		const delta_element = document.getElementById(`mid-point-ob-${id}`);
		delta_element?.scrollIntoView({
			behavior: 'auto',
			block: 'center',
			inline: 'center'
		});
	};

	onInterval(() => {
		if (order_book.get_ping_string().length !== 0) {
			ws.send(order_book.get_ping_string());
		}
	}, 30_000);

	onMount(async () => {
		const endpoint = order_book.get_endpoint();
		ws = new WebSocket(endpoint);

		ws.onopen = () => ws.send(order_book.get_subscribe_string());

		ws.onmessage = (message) => {
			order_book.handle_message(message.data);
			order_book = order_book;
		};
	});

	onDestroy(async () => {
		if (browser) {
			ws.close();
		}
	});
</script>

<div class="flex flex-col bg-base-300 h-full w-full overflow-y-auto no-scrollbar">
	<!-- Header -->
	<div class="px-1 flex flex-row w-full">
		<div class="flex w-3/12 justify-center">
			<div class="remove cursor-pointer">
				<Tooltip text={order_book.market_info.type + ' ' + order_book.market_info.market}>
					<ExchangeLogo exchange={order_book.market_info.exchange} />
				</Tooltip>
			</div>
		</div>

		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<div
			on:pointerdown={(e) => e.stopPropagation()}
			on:click={() => on_left()}
			class="remove cursor-pointer w-2/12 flex justify-center"
		>
			<Tooltip text="Move Left">
				<LeftArrow />
			</Tooltip>
		</div>
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<div
			on:pointerdown={(e) => e.stopPropagation()}
			on:click={() => scroll_to_center()}
			class="remove cursor-pointer w-2/12 flex justify-center"
		>
			<Tooltip text="Scroll to middle">
				<Center />
			</Tooltip>
		</div>

		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<div
			on:pointerdown={(e) => e.stopPropagation()}
			on:click={() => on_right()}
			class="remove cursor-pointer w-2/12 flex justify-center"
		>
			<Tooltip text="Move Right">
				<RightArrow />
			</Tooltip>
		</div>

		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<div
			on:pointerdown={(e) => e.stopPropagation()}
			on:click={(item) => {
				on_delete(item);
				ws.close();
			}}
			class="remove cursor-pointer w-3/12 flex justify-center"
		>
			<Tooltip text="Delete">
				<Trashbin />
			</Tooltip>
		</div>
	</div>

	<!-- OB -->
	<div class="w-full">
		{#each order_book.asks.toArray() as [price, size]}
			<div class="flex flex-row w-full px-1 text-2xs text-base-content">
				<div class="w-2/5">{price}</div>
				<div
					class="w-3/5 bg-accent text-base-content"
					style="width: {(size / order_book.highest_vol_level) * 60}%;"
				>
					{size}
				</div>
			</div>
		{/each}
	</div>

	<div class="scroll flex flex-row w-full" id={`mid-point-ob-${id}`}>
		<div class="w-2/5" />
		<div class="w-3/5 {order_book.delta > 0 ? 'text-primary' : 'text-accent'} text-sm">
			Δ {number_as_k(order_book.delta, 1)}
		</div>
	</div>

	<div>
		{#each order_book.bids.toArray() as [price, size]}
			<div class="flex flex-row w-full px-1 text-2xs text-base-content">
				<div class="w-2/5">{price}</div>
				<div
					class="w-3/5 bg-primary text-base-content"
					style="width: {(size / order_book.highest_vol_level) * 60}%;"
				>
					{size}
				</div>
			</div>
		{/each}
	</div>
</div>
