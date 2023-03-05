
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

<button on:mouseenter={check_fullscreen} class="btn btn-circle fixed bottom-6 right-6 z-10 dropdown dropdown-top dropdown-end dropdown-hover">
  <ul class="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-36">
    <li><button>Item 1</button></li>
    {#if is_fullscreen}
      <li><button on:click={handle_fullscreen}>Exit Fullscreen</button></li>
    {:else}
      <li><button on:click={handle_fullscreen}>Fullscreen</button></li>

    {/if}
  </ul>

  <svg viewBox="0 0 256 256">
    <circle cx="128" cy="128" r="14"/>
    <circle cx="80" cy="128" r="14"/>
    <circle cx="176" cy="128" r="14"/>
  </svg> 
</button>
