<script lang="ts">
	import { onMount } from 'svelte';
	const ENDPOINT = 'wss://stream.bybit.com/realtime_public';

	onMount(() => {
		const ws = new WebSocket(ENDPOINT);
		ws.onopen = () => {
			ws.send('{"op": "subscribe", "args": ["orderBookL2_25.BTCUSDT"]}');
		};
		ws.onmessage = (message) => {};
	});
</script>

<h1 class="text-3xl font-bold underline">Hello world!</h1>
