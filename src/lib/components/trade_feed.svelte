<script lang="ts" context="module">
    export type TradeFeedOptions = {
      market: string;
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
  console.log(options)
  let settings_state = false; 

</script>

<input type="checkbox" id="my-modal-4" class="modal-toggle" />
<label for="my-modal-4" class="modal cursor-pointer">
  <label class="modal-box relative bottom-1/4" for="">
    <h3 class="text-lg font-bold">Options</h3>
    <p class="py-4">Minimum size</p>
    <input bind:value={options.min_size} type="number" class="input input-bordered input-success w-full max-w-xs" />
  </label>
</label>

<div 
  on:mouseenter={() => settings_state = true} 
  on:mouseleave={() => settings_state = false}
  on:focus={() => {}}
  on:blur={() => {}}
  class="flex flex-col w-40 max-h-screen overflow-y-auto no-scrollbar">
  {#if settings_state}
    
    <div class="fixed flex min-w-full bg-black bg-opacity-50">
      <label for="my-modal-4" class="text-white">
        <!-- The button to open modal -->

        <!-- Put this part before </body> tag -->

        <Settings/>
      </label>

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