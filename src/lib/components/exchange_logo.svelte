<script lang="ts">
	import Binance from '$lib/assets/binance.svelte';
	import type { Exchange } from '$lib/types';

	export let exchange: Exchange;
</script>

{#if exchange == 'Binance'}
	<Binance />
{:else if exchange == 'Bybit'}
	<img width="20px" height="20px" src="src/lib/assets/bybit.png" alt={exchange}/>
{/if}
