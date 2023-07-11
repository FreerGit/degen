<script lang="ts">
	import type { MarketInfo } from '$lib/markets/get_markets';
	import { markets_store } from '$lib/stores/markets';
	import { ExchangeValues } from '$lib/types';

	export let open: boolean;
	export let title: string;
	let display: Array<MarketInfo>;
	let chosen: MarketInfo;
	export let update: (m: MarketInfo) => void;

	let search_market = '';
	let searchable_exchanges: Array<string> = ExchangeValues.slice();
	let markets = $markets_store;

	const search_markets = () => {
		var regexPattern = /[^A-Za-z0-9]/g;
		let found: Array<MarketInfo> = [];
		for (let i = 0; i < markets.length; i++) {
			for (let j = 0; j < markets[i].markets.length; j++) {
				if (
					markets[i].markets[j].replace(regexPattern, '').startsWith(search_market.toUpperCase()) &&
					searchable_exchanges.includes(markets[i].exchange)
				) {
					found.push({
						exchange: markets[i].exchange,
						type: markets[i].market_type,
						market: markets[i].markets[j]
					});
				}
			}
		}
		display = found;
	};

	$: searchable_exchanges && search_markets();
</script>

{#if open}
	<div
		class="flex absolute top-0 bottom-0 left-0 right-0 justify-center items-center backdrop-blur-sm"
	>
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<div
			class="relative rounded bg-base-300 text-neutral-content h-2/4 w-3/5 max-w-xl"
			style="z-index: 1000;"
		>
			<h1 class="flex text-2xl w-full text-base-content justify-center border-b pb-2">{title}</h1>

			<div class="flex h-full bg-base-300">
				<div class="flex flex-col hover:bg-base-hover min-h-max pl-4 w-1/5 border-r">
					<p class="text-base-content text-l">Exchanges</p>
					{#each ExchangeValues as Ex}
						<div class="flex space-x-2">
							<input type="checkbox" bind:group={searchable_exchanges} value={Ex} />
							<p class="text-base-content">{Ex}</p>
						</div>
					{/each}
				</div>

				<div class="h-full w-4/5 bg-base-300">
					<input
						bind:value={search_market}
						on:input={() => search_markets()}
						placeholder="Search"
						type="text"
						class="input input-success w-full h-12 bg-base-200 text-base-content pl-2 text-xl"
					/>
					<div class="h-1/2 overflow-y-scroll">
						<table class="table-auto pointer-events-auto text-base-content w-full pt-0.5">
							<!-- class="text-base-content " -->
							{#if search_market.length > 0}
								{#each display as market, i}
									<tr
										class="hover:bg-base-hover hover:cursor-default"
										on:mousedown={() => (chosen = market)}
									>
										<td>
											{market.market}
										</td>
										<td>
											{market.type}
										</td>
										<td>
											{market.exchange}
										</td>
									</tr>
								{/each}
							{/if}
						</table>
					</div>
					<div class="flex-col flex text-base-content w-full h-1/5 pt-4 border-y">
						{#if chosen}
							{chosen.market + ' ' + chosen.type}
						{/if}
					</div>

					<div class="absolute text-base-content right-0 pt-6 pr-6">
						<button class="pr-4" on:click={() => (open = false)}> Cancel </button>
						<button
							class="bg-primary py-2 px-2 rounded"
							on:click={() => {
								update(chosen);
								open = false;
							}}
						>
							Update
						</button>
					</div>
				</div>
			</div>
		</div>
	</div>
{/if}
