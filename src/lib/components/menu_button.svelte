
<script lang="ts">

  let is_fullscreen = false;

  const handle_fullscreen = () => {
    if(is_fullscreen) {
      document.exitFullscreen();
    } else {
      document.documentElement.requestFullscreen();
    }
  }

  const check_fullscreen = () => {
    document.fullscreenElement ? is_fullscreen = true : is_fullscreen = false;
  }
</script>

<!-- <ul class="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-36">
  <li><button>Add Pane</button></li>
  {#if is_fullscreen}
  <li><button on:click={handle_fullscreen}>Exit Fullscreen</button></li>
  {:else}
  <li><button on:click={handle_fullscreen}>Fullscreen</button></li>
  {/if}
</ul> -->

<button on:mouseenter={check_fullscreen} class="absolute bottom-6 right-6 w-12 h-12 bg-red-600 rounded-full hover:bg-red-700 active:shadow-lg shadow transition ease-in duration-200 focus:outline-none">
  <svg viewBox="0 0 20 20" enable-background="new 0 0 20 20" class="w-6 h-6 inline-block">
  <path fill="#FFFFFF" d="M16,10c0,0.553-0.048,1-0.601,1H11v4.399C11,15.951,10.553,16,10,16c-0.553,0-1-0.049-1-0.601V11H4.601
                        C4.049,11,4,10.553,4,10c0-0.553,0.049-1,0.601-1H9V4.601C9,4.048,9.447,4,10,4c0.553,0,1,0.048,1,0.601V9h4.399
                        C15.952,9,16,9.447,16,10z" />
  </svg>
</button>
