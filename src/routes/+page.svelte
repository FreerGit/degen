<script lang="ts">
	import { BybitBook } from '$lib/bybit/order_book';
	import { push_front, rotate_array } from '$lib/rotate_array';
	import type { Delta, Payload, Snapshot, Trades } from '$lib/types';
	import { onMount } from 'svelte';
	import { match, P } from 'ts-pattern';
	import TradeFeed from '$lib/components/trade_feed.svelte';
	import { layoutStore } from '$lib/stores';
	import { browser } from '$app/environment';

	const ENDPOINT = 'wss://stream.bybit.com/realtime_public';

	let bybit_book = new BybitBook();

	let largest_tick = 0;

	let xx = rotate_array(100);

	let opt = $layoutStore.trade_feed;

	onMount(async () => {
		const ws = new WebSocket(ENDPOINT);
		ws.onopen = () => {
			ws.send(
				`{"op": "subscribe", "args": ["${$layoutStore.order_book.market}", "${$layoutStore.trade_feed.market}"]}`
			);
		};
		ws.onmessage = (message) => {
			let json: Payload = JSON.parse(message.data);
			match(json)
				.with({ type: 'delta' }, () => {
					bybit_book.update_delta((json as Delta).data);
					bybit_book.asks = bybit_book.asks;
					bybit_book.bids = bybit_book.bids;
					largest_tick = Math.max(...bybit_book.bids.concat(bybit_book.asks).map((l) => l.size));
				})
				.with({ type: 'snapshot' }, () => {
					bybit_book.insert((json as Snapshot).data.order_book);
					bybit_book.asks = bybit_book.asks;
					bybit_book.bids = bybit_book.bids;
				})
				.with({ data: P.array({ tick_direction: P.string }) }, () => {
					(json as Trades).data.forEach((i) => {
						if (i.size * i.price > opt.min_size) {
							xx = push_front(xx, i);
						}
					});
				})
				.run();
		};
	});
</script>

<!-- https://tailwindcss.com/docs/table-layout#basic-usage -->
<main class="flex flex-row min-h-full min-w-full justify-between">
	<!-- ONE COMPONENT L8R -->
	<div class="flex">
		<table class="table-auto ml-6">
			<thead>
				<tr>
					<th class="">{bybit_book.full_market_name}</th>
				</tr>
			</thead>

			<tbody>
				{#each bybit_book.asks as ask}
					<tr class="w-full text-xs">
						<td> {ask.price} </td>
						<td>
							<div class="bg-app-sell" style="width: {(ask.size / largest_tick) * 100}%;">
								{ask.size}
							</div>
						</td>
					</tr>
				{/each}
			</tbody>

			<!-- <thead> -->
			<tr>
				<th class="flex" />
				<th class="{bybit_book.delta > 0 ? 'text-app-buy' : 'text-app-sell'} text-xs"
					>Δ {bybit_book.delta.toFixed(3)}</th
				>
			</tr>
			<!-- </thead> -->

			<tbody>
				{#each bybit_book.bids as bids}
					<tr class="w-full text-xs">
						<td class="text-xs"> {bids.price} </td>
						<td>
							<div class="bg-app-buy" style="width: {(bids.size / largest_tick) * 100}%;">
								{bids.size}
							</div>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>

	<div />
	<!-- END OF COMP. -->

	<!-- ONE COMPONENT L8R -->
	{#if browser}
		<TradeFeed data_feed={xx} bind:options={$layoutStore.trade_feed} />
	{/if}
	<!-- END OF COMP. -->
</main>
