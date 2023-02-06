<script lang="ts">
	import { BybitBook } from '$lib/bybit/order_book';
	import type { Delta, Payload, Snapshot, Trades } from '$lib/types';

	import { onMount } from 'svelte';
	import { match, P} from 'ts-pattern';

	const ENDPOINT = 'wss://stream.bybit.com/realtime_public';

	let bybit_book = new BybitBook();

	let handle_click: () => void;

	let largest_tick = 0;

	onMount(() => {
		const ws = new WebSocket(ENDPOINT);
		ws.onopen = () => {
			ws.send('{"op": "subscribe", "args": ["orderBookL2_25.BTCUSDT","trade.BTCUSDT"]}');
		};
		ws.onmessage = (message) => {
			let json: Payload = JSON.parse(message.data);
			match(json).with({type: "delta"}, () => {
					bybit_book.update_delta((json as Delta).data);
					bybit_book.asks = bybit_book.asks;
					bybit_book.bids = bybit_book.bids;
					largest_tick = Math.max(...bybit_book.bids.concat(bybit_book.asks).map(l => l.size));
			})
			.with({type: "snapshot"}, () => {
					bybit_book.insert((json as Snapshot).data.order_book);
					bybit_book.asks = bybit_book.asks;
					bybit_book.bids = bybit_book.bids;
			}).with({data: P.array({tick_direction: P.string})}, () => {
				console.log('fdsffds');

			}).run()
		};

		handle_click = () => {
			ws.close();
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
		
			<tbody >
				{#each bybit_book.asks as ask}
				<tr class="w-full text-xs">
					<td> {ask.price} </td>
					<td>
						<div class="bg-red-500" style="width: {(ask.size/largest_tick) * 100}%;"> {ask.size} </div>
					</td>
				</tr>
				{/each}
			</tbody>
		
		<!-- <thead> -->
			<tr>
				<th class="flex"></th>
				<th class="{bybit_book.delta > 0 ? "text-green-500" : "text-red-500"} text-xs">Δ {bybit_book.delta.toFixed(3)}</th>
			</tr>
			<!-- </thead> -->
			
			<tbody >
				{#each bybit_book.bids as bids}
				<tr class="w-full text-xs">
					<td class="text-xs"> {bids.price} </td>
					<td>
						<div class="bg-green-500" style="width: {(bids.size/largest_tick) * 100}%;"> {bids.size} </div>
					</td>
				</tr>
				{/each}
			</tbody>
		</table>
	</div>
	
	<div />
	<!-- END OF COMP. -->
	
	<!-- ONE COMPONENT L8R -->
	<div class="flex w-40 bg-red-500">
		fdafasdf
	</div>

<!-- END OF COMP. -->

</main>


