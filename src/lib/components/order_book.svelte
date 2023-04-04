<script lang="ts">
	import type { AbstractOrderBook } from "$lib/order_book";
	import { layoutStore } from "$lib/stores/layout";
	import type { Delta, Payload, Snapshot } from "$lib/types";
	import { onMount } from "svelte";
	import { match, P } from "ts-pattern";

	export let order_book: AbstractOrderBook;
	const ENDPOINT = 'wss://stream.bybit.com/realtime_public';


	onMount(async () => {
		const ws = new WebSocket(ENDPOINT);
		ws.onopen = () => {
			ws.send(`{"op": "subscribe", "args": ["${$layoutStore.order_book.market}"]}`);
		};
		ws.onmessage = (message) => {
			let json: Payload = JSON.parse(message.data);
			match(json)
				.with({ type: 'delta' }, () => {
					order_book.update_delta((json as Delta).data);
					order_book.asks = order_book.asks;
					order_book.bids = order_book.bids;
				})
				.with({ type: 'snapshot' }, () => {
					order_book.snapshot((json as Snapshot).data.order_book);
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
				<th class="text-base-content text-xs">{order_book.exchange + '/' + order_book.market}</th>
			</tr>
		</thead>
		
		<tbody>
			{#each order_book.asks as ask}
				<tr class="w-full text-2xs text-base-content ">
					<td> {ask.price} </td>
					<td>
						<div
							class="bg-accent text-base-content"
							style="width: {(ask.size / order_book.highest_vol_level) * 100}%;"
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
			<th class="{order_book.delta > 0 ? 'text-primary' : 'text-accent'} text-2xs">
				Δ {order_book.delta.toFixed(3)}
			</th>
		</tr>
		<!-- </thead> -->

		<tbody>
			{#each order_book.bids as bids}
				<tr class="w-full text-2xs text-base-content">
					<td> {bids.price} </td>
					<td>
						<div
							class="bg-primary text-base-content"
							style="width: {(bids.size / order_book.highest_vol_level) * 100}%;"
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