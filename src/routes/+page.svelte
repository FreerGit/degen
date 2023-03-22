
<script lang="ts">
	import { BybitBook } from '$lib/bybit/order_book';
	import type { Delta, Payload, Snapshot } from '$lib/types';
	import { onMount } from 'svelte';
	import { match, P } from 'ts-pattern';
	import TradeFeed from '$lib/components/trade_feed.svelte';
	import { browser } from '$app/environment';
	import { layoutStore } from '$lib/stores/layout';
	import MenuButton from '$lib/components/menu_button.svelte';

	
	const ENDPOINT = 'wss://stream.bybit.com/realtime_public';

	let bybit_book = new BybitBook();

	let largest_tick = 0;




	onMount(async () => {
		const ws = new WebSocket(ENDPOINT);
		ws.onopen = () => {
			ws.send(`{"op": "subscribe", "args": ["${$layoutStore.order_book.market}"]}`);
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
				.with({ success: P.boolean }, (e) => {
					console.log(e);
				})
				.run();
		};
	});
</script>

<!-- https://tailwindcss.com/docs/table-layout#basic-usage -->
<main class="flex flex-row min-h-full h-full min-w-full justify-between bg-base-100">
	<!-- ONE COMPONENT L8R -->
	<div class="flex bg-base-100">
		<table class="table-auto ml-6">
			<thead>
				<tr>
					<th class="text-base-content">{bybit_book.full_market_name}</th>
				</tr>
			</thead>

			<tbody>
				{#each bybit_book.asks as ask}
					<tr class="w-full text-xs text-base-content">
						<td> {ask.price} </td>
						<td>
							<div
								class="bg-accent text-base-content"
								style="width: {(ask.size / largest_tick) * 100}%;"
							>
								{ask.size}
							</div>
						</td>
					</tr>
				{/each}
			</tbody>

			<!-- <thead> -->
			<tr>
				<th class="flex" />
				<th class="{bybit_book.delta > 0 ? 'text-primary' : 'text-accent'} text-xs">
					Δ {bybit_book.delta.toFixed(3)}
				</th>
			</tr>
			<!-- </thead> -->

			<tbody>
				{#each bybit_book.bids as bids}
					<tr class="w-full text-xs text-base-content">
						<td class="text-xs"> {bids.price} </td>
						<td>
							<div
								class="bg-primary text-base-content"
								style="width: {(bids.size / largest_tick) * 100}%;"
							>
								{bids.size}
							</div>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>

	<div />

	{#if browser}
		<TradeFeed bind:options={$layoutStore.trade_feed} />
	{/if}

	<MenuButton />
</main>
