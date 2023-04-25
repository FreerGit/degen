<script lang="ts" context="module">
	export type OrderBookOptions = {
		markets: Array<MarketInfo>;
	};
</script>

<script lang="ts">
	import Center from '$lib/assets/center.svelte';
	import Trashbin from '$lib/assets/trashbin.svelte';
	import type { Level } from '$lib/bybit/order_book';
	import type { MarketInfo } from '$lib/markets/get_markets';
	import { number_as_k } from '$lib/math';
	import type { AbstractOrderBook } from '$lib/order_book';
	import type { Delta, Payload, Snapshot } from '$lib/types';
	import { onMount } from 'svelte';
	import { match, P } from 'ts-pattern';
	import { Tooltip } from 'svelte-tooltip-simple';
	export let order_book: AbstractOrderBook;
	export let on_delete: (item: any) => void;

	let ws: WebSocket;

	const scroll_to_center = () => {
		const delta_element = document.getElementById('mid-point');
		delta_element?.scrollIntoView({
			behavior: 'auto',
			block: 'center',
			inline: 'center'
		});
	};

	onMount(async () => {
		const endpoint = order_book.get_endpoint();
		const sub = order_book.get_subscribe_args();
		ws = new WebSocket(endpoint);
		ws.onopen = () => {
			ws.send(`{"op": "subscribe", "args": ["${sub}"]}`);
		};
		ws.onmessage = (message) => {
			// convert asks and bids to numbers
			let json: Payload = JSON.parse(message.data, function (key, value) {
				if (key === 'a') {
					return value.map((lvl: Level) => {
						return [+lvl[0], +lvl[1]];
					});
				}
				if (key === 'b') {
					return value.map((lvl: Level) => {
						return [+lvl[0], +lvl[1]];
					});
				}
				return value;
			});
			match(json)
				.with({ type: 'delta' }, () => {
					order_book.update_delta((json as Delta).data);
					order_book.asks = order_book.asks;
					order_book.bids = order_book.bids;
				})
				.with({ type: 'snapshot' }, () => {
					order_book.snapshot((json as Snapshot).data);
					order_book.asks = order_book.asks;
					order_book.bids = order_book.bids;
				})
				.with({ success: P.boolean }, (e) => {
					console.log(e);
				})
				.run();
		};
	});
</script>

<div class="flex bg-base-300 h-full w-full overflow-y-auto no-scrollbar">
	<table class="table-auto">
		<thead>
			<tr>
				<th class="text-base-content text-xs"
					>{order_book.market_info.exchange + '/' + order_book.market_info.market}</th
				>
				<!-- svelte-ignore a11y-click-events-have-key-events -->
				<th class="flex w-full">
					<span
						on:pointerdown={(e) => e.stopPropagation()}
						on:click={(item) => {
							on_delete(item);
							ws.close();
						}}
						class="remove cursor-pointer"
					>
						<Tooltip text="Delete">
							<Trashbin />
						</Tooltip>
					</span>
					<!-- svelte-ignore a11y-click-events-have-key-events -->
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
				</th>
			</tr>
		</thead>

		<tbody>
			{#each order_book.asks.toArray() as [price, size]}
				<tr class="w-full text-2xs text-base-content">
					<td> {price} </td>
					<td>
						<div
							class="bg-accent text-base-content"
							style="width: {(size / order_book.highest_vol_level) * 100}%;"
						>
							{size}
						</div>
					</td>
				</tr>
			{/each}
		</tbody>

		<tr class="scroll" id="mid-point">
			<th class="flex" />
			<th class="{order_book.delta > 0 ? 'text-primary' : 'text-accent'} text-2xs">
				Δ {number_as_k(order_book.delta, 1)}
			</th>
		</tr>

		<tbody>
			{#each order_book.bids.toArray() as [price, size]}
				<tr class="w-full text-2xs text-base-content">
					<td> {price} </td>
					<td>
						<div
							class="bg-primary text-base-content"
							style="width: {(size / order_book.highest_vol_level) * 100}%;"
						>
							{size}
						</div>
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>

<div />
