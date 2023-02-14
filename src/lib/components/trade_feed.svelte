<script lang="ts" context="module">
    export type TradeFeedOptions = {
      max_size: number;
      min_size: number;
    }
</script>

<script lang="ts">
	import type { RotateArray } from "$lib/rotate_array";


  export let data_feed: RotateArray;
  export let options: TradeFeedOptions;
</script>

<div class="flex flex-col w-40 max-h-screen overflow-y-auto no-scrollbar">
		{#each data_feed.data as trade}
			  <li class="{trade.side == 'Buy' ? 'text-app-buy' : 'text-app-sell'}">
          {trade.price} {trade.size}
        </li>
		{/each}
</div>