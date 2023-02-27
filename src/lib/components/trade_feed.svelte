<script lang="ts" context="module">
    export type TradeFeedOptions = {
      min_size: number;
    }
</script>

<script lang="ts">
	import { number_as_k } from "$lib/math";
  import Settings from "$lib/assets/settings.svelte";
  import Search from "$lib/assets/search.svelte";
  import Trashbin from "$lib/assets/trashbin.svelte";
	import type { RotateArray } from "$lib/rotate_array";


  export let data_feed: RotateArray;
  export let options: TradeFeedOptions;
  let settings_state = false; 

</script>

<div 
  on:mouseenter={() => settings_state = true} 
  on:mouseleave={() => settings_state = false}
  on:focus={() => {}}
  on:blur={() => {}}
  class="flex flex-col w-40 max-h-screen overflow-y-auto no-scrollbar">
  {#if settings_state}
    <div class="fixed flex min-w-full bg-black bg-opacity-50">
      <button class="text-white">
        <Settings/>
      <button class="text-white">
        <Search/>
      </button>
      <button class="text-white">
        <Trashbin/>
      </button>
    </div>
  {/if}
		{#each data_feed.data as trade}
			  <li class="{trade.side == 'Buy' ? 'text-app-buy' : 'text-app-sell'}">
          {trade.price} {number_as_k(trade.size * trade.price, 1)}
        </li>
		{/each}

</div>