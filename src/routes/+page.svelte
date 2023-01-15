<script lang="ts">
	import { BybitBook } from '$lib/bybit/order_book';
	import type { Delta, Payload, Snapshot } from '$lib/types';

	import { onMount } from 'svelte';
	const ENDPOINT = 'wss://stream.bybit.com/realtime_public';

	let bybit_book = new BybitBook();

	let handle_click: () => void;

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

<p class="">{JSON.stringify(bybit_book.asks)}</p>
<button on:click={handle_click}>DISCONNECT</button>
<p class="">{JSON.stringify(bybit_book.bids)}</p>
