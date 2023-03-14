<script lang="ts">
  export let open: boolean
  export let onClose: Function
  export let title: string;
</script>

{#if open}
  <div 
    class="flex absolute top-0 bottom-0 left-0 right-0 justify-center items-center">
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <div on:click={() => onClose()} class="absolute top-0 bottom-0 left-0 right-0" style="z-index: 100;" />
    <div class="relative rounded bg-base-300 text-neutral-content w-1/2 h-1/3 bottom-1/4 max-w-lg " style="z-index: 1000;">
      <h1 class="text-3xl text-base-content border-b text-left pl-4 pb-2">{title}</h1>
      <slot>
        <!-- Here goes nested component -->
      </slot>
      
    </div>
  </div>
{/if}

