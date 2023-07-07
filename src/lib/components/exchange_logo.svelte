<script lang="ts">
	import Binance from '$lib/assets/binance.svelte';
	import Okx from '$lib/assets/okx.svelte';
	import type { Exchange } from '$lib/types';
	import Bybit from '../assets/bybit.svelte';

	export let exchange: Exchange;
</script>

{#if exchange == 'Binance'}
	<Binance />
{:else if exchange == 'Bybit'}
	<Bybit />
{:else if exchange == 'OKX'}
	<Okx />
{/if}
