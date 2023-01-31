<script lang="ts">
	import { BybitBook } from '$lib/bybit/order_book';
	import type { Delta, Payload, Snapshot } from '$lib/types';

	import { onMount } from 'svelte';
	const ENDPOINT = 'wss://stream.bybit.com/realtime_public';

	let bybit_book = new BybitBook();

	let handle_click: () => void;

	let largest_ask= 0;
	let largest_bid = 0;

	onMount(() => {
		const ws = new WebSocket(ENDPOINT);
		ws.onopen = () => {
			ws.send('{"op": "subscribe", "args": ["orderBookL2_25.BTCUSDT"]}');
		};
		ws.onmessage = (message) => {
			let json: Payload = JSON.parse(message.data);
			switch (json.type) {
				case 'delta':
					bybit_book.update_delta((json as Delta).data);
					bybit_book.asks = bybit_book.asks;
					bybit_book.bids = bybit_book.bids;
					largest_ask = Math.max(...bybit_book.asks.map(l => l.size));
					largest_bid = Math.max(...bybit_book.bids.map(l => l.size));
					break;
				case 'snapshot':
					bybit_book.insert((json as Snapshot).data.order_book);
					bybit_book.asks = bybit_book.asks;
					bybit_book.bids = bybit_book.bids;
					break;
			}
		};

		handle_click = () => {
			ws.close();
		};
	});
</script>

<!-- https://tailwindcss.com/docs/table-layout#basic-usage -->
<div class="flex">
	<div class="">
		<table class="table-auto ml-10">
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
							<div class="bg-red-500" style="width: {(ask.size/largest_ask) * 100}%;"> {ask.size} </div>
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
							<div class="bg-green-500" style="width: {(bids.size/largest_bid) * 100}%;"> {bids.size} </div>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>

	<div />
</div>

<!-- <ul>
  {#each bybit_book.asks as ask} 
    <li>{ask.price}</li>
  {/each}
</ul>
<button on:click={handle_click}>DISCONNECT</button>
<ul>
  {#each bybit_book.bids as bid} 
    <li>{bid.price}</li>
  {/each}
</ul> -->
