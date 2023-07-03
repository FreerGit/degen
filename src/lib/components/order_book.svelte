<script lang="ts" context="module">
	export type OrderBookOptions = {
		markets: Array<MarketInfo>;
	};
</script>

<script lang="ts">
	import Center from '$lib/assets/center.svelte';
	import Trashbin from '$lib/assets/trashbin.svelte';
	import type { MarketInfo } from '$lib/markets/get_markets';
	import { number_as_k } from '$lib/math';
	import type { AbstractOrderBook } from '$lib/order_book';
	import { onMount } from 'svelte';

	import { Tooltip } from 'svelte-tooltip-simple';
	import ExchangeLogo from './exchange_logo.svelte';

	export let order_book: AbstractOrderBook;
	export let on_delete: (item: any) => void;
	export let id: number;

	let ws: WebSocket;

	const scroll_to_center = () => {
		const delta_element = document.getElementById(`mid-point-ob-${id}`);
		delta_element?.scrollIntoView({
			behavior: 'auto',
			block: 'center',
			inline: 'center'
		});
	};

	onMount(async () => {
		const endpoint = order_book.get_endpoint();
		ws = new WebSocket(endpoint);

		ws.onopen = () => ws.send(order_book.get_subscribe_string());

		ws.onmessage = (message) => {
			order_book.handle_message(message.data);
			order_book = order_book;
		};
	});
</script>

<div class="flex flex-col bg-base-300 h-full w-full overflow-y-auto no-scrollbar">
	<!-- Header -->
	<div class="px-1 flex flex-row w-full">
			<div class="flex w-2/5">
				<span class="remove cursor-pointer">
					<Tooltip text={order_book.market_info.type + ' ' + order_book.market_info.market}>
						<ExchangeLogo exchange={order_book.market_info.exchange} />
					</Tooltip>
				</span>
		</div>
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<div class="flex w-2/5">
			<span
				on:pointerdown={(e) => e.stopPropagation()}
				on:click={() => {
					scroll_to_center();
				}}
				class="remove cursor-pointer"
			>
				<Tooltip text="Scroll to middle">
					<Center />
				</Tooltip>
			</span>
		</div>
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<div class="relative w-1/5 ">
			<span
				on:pointerdown={(e) => e.stopPropagation()}
				on:click={(item) => {
					on_delete(item);
					ws.close();
				}}
				class="remove cursor-pointer "
			>
				<Tooltip text="Delete">
					<Trashbin />
				</Tooltip>
			</span>
			<!-- svelte-ignore a11y-click-events-have-key-events -->
		</div>
	</div>

	<!-- OB -->
	<div class="w-full">
		{#each order_book.asks.toArray() as [price, size]}
			<div class="flex flex-row w-full px-1 text-2xs text-base-content">
				<div class="w-2/5">{price}</div>
				<div
					class="w-3/5 bg-accent text-base-content "
					style="width: {(size / order_book.highest_vol_level) * 60}%;"
				>
					{size}
				</div>
			</div>
		{/each}
	</div>

	<div class="scroll flex flex-row w-full" id={`mid-point-ob-${id}`}>
		<div class="w-2/5"/>
		<div class="w-3/5 {order_book.delta > 0 ? 'text-primary' : 'text-accent'} text-sm">
			Δ {number_as_k(order_book.delta, 1)}
		</div>
	</div>

	<div>
		{#each order_book.bids.toArray() as [price, size]}
			<div class="flex flex-row w-full px-1 text-2xs text-base-content">
				<div class="w-2/5">{price}</div>
				<div>
					<div
						class="w-3/5 bg-primary text-base-content"
						style="width: {(size / order_book.highest_vol_level) * 100}%;"
					>
						{size}
					</div>
				</div>
			</div>
		{/each}
	</div>
</div>
