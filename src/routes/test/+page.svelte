<script lang="ts">
	import { BybitBook } from '$lib/bybit/order_book';
	import { layoutStore } from '$lib/stores/layout';
	import type { Delta, Payload, Snapshot } from '$lib/types';
	import { onMount } from 'svelte';

	import Grid from 'svelte-grid';
	import gridHelp from 'svelte-grid/build/helper/index.mjs';
	import { match, P } from 'ts-pattern';

	const id = () => '_' + Math.random().toString(36).substr(2, 9);

	const COLS = 45;

	let items = [
		{
			[COLS]: gridHelp.item({
				x: 0,
				y: 0,
				w: 9,
				h: 9.4
			}),
			id: id()
		},

		{
			[COLS]: gridHelp.item({
				x: 10,
				y: 0,
				w: 10,
				h: 9
			}),
			id: id()
		},
		{
			[COLS]: gridHelp.item({
				x: 20,
				y: 0,
				w: 10,
				h: 10
			}),
			id: id()
		}
	];

	const cols = [[1000, COLS]];

	const ENDPOINT = 'wss://stream.bybit.com/realtime_public';

	let bybit_book = new BybitBook();

	let largest_tick = 0;

	onMount(async () => {
		const ws = new WebSocket(ENDPOINT);
		ws.onopen = () => {
			ws.send(`{"op": "subscribe", "args": ["${$layoutStore.order_book.market}"]}`);
		};
		ws.onmessage = (message) => {
			let json: Payload = JSON.parse(message.data);
			match(json)
				.with({ type: 'delta' }, () => {
					bybit_book.update_delta((json as Delta).data);
					bybit_book.asks = bybit_book.asks;
					bybit_book.bids = bybit_book.bids;
					largest_tick = Math.max(...bybit_book.bids.concat(bybit_book.asks).map((l) => l.size));
				})
				.with({ type: 'snapshot' }, () => {
					bybit_book.insert((json as Snapshot).data.order_book);
					bybit_book.asks = bybit_book.asks;
					bybit_book.bids = bybit_book.bids;
				})
				.with({ success: P.boolean }, (e) => {
					console.log(e);
				})
				.run();
		};
	});
</script>

<!-- https://tailwindcss.com/docs/table-layout#basic-usage -->
<main class="flex flex-row min-h-full h-full min-w-full justify-between bg-base-100">
	<Grid
		bind:items
		rowHeight={100}
		let:item
		{cols}
		let:index
		fastStart={true}
		fillSpace={true}
		gap={[5, 0]}

	>
		<div class="flex bg-base-300 h-full w-full overflow-y-auto no-scrollbar">
			<table class="table-auto">
				<thead>
					<tr>
						<th class="text-base-content text-xs">{bybit_book.exchange + '/' + bybit_book.market}</th>
					</tr>
				</thead>
        
				<tbody>
					{#each bybit_book.asks as ask}
						<tr class="w-full text-2xs text-base-content ">
							<td> {ask.price} </td>
							<td>
								<div
									class="bg-accent text-base-content"
									style="width: {(ask.size / largest_tick) * 100}%;"
								>
									{ask.size}
								</div>
							</td>
						</tr>
					{/each}
				</tbody>

				<!-- <thead> -->
				<tr>
					<th class="flex" />
					<th class="{bybit_book.delta > 0 ? 'text-primary' : 'text-accent'} text-2xs">
						Δ {bybit_book.delta.toFixed(3)}
					</th>
				</tr>
				<!-- </thead> -->

				<tbody>
					{#each bybit_book.bids as bids}
						<tr class="w-full text-2xs text-base-content">
							<td> {bids.price} </td>
							<td>
								<div
									class="bg-primary text-base-content"
									style="width: {(bids.size / largest_tick) * 100}%;"
								>
									{bids.size}
								</div>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>

		<div />
	</Grid>

	<!-- ONE COMPONENT L8R -->
</main>
