<script lang="ts">
	import type { Delta, Payload, Snapshot } from '$lib/bybit';
	import type { Level } from '$lib/order_book';
	import { onMount } from 'svelte';
	const ENDPOINT = 'wss://stream.bybit.com/realtime_public';

  let msg = "";

  let bids: Array<Level> = []
  let asks: Array<Level> = []
    
	onMount(() => {
		const ws = new WebSocket(ENDPOINT);
		ws.onopen = () => {
			ws.send('{"op": "subscribe", "args": ["orderBookL2_25.BTCUSDT"]}');
		};
		ws.onmessage = (message) => {
      let json: Payload = JSON.parse(message.data);
      switch(json.type) {
        case "delta":
          // console.log("fdsfds");
          break;
        case "snapshot":
          asks = [...(json as Snapshot).data.order_book]
          console.log(asks)
          break;
      }
      msg = message.data;

    };
	});
</script>

<h1 class="text-3xl font-bold underline">{JSON.stringify(asks)}</h1>
