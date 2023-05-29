import { handle_binance_trade_message } from './binance/trade_feed';
import { handle_bybit_trade_message } from './bybit/trade_feed';
import type { TFO } from './components/trade_feed.svelte';
import type { MarketType } from './markets/get_markets';
import { rotate_array, type RotateArray } from './rotate_array';
import type { Exchange } from './types';

export class TradeFeedHandler {
	trades: RotateArray;
	tfo: TFO;
	min_size: number;

	constructor(length: number, tfo: TFO) {
		this.trades = rotate_array(length);
		this.min_size = tfo.min_size;
		this.tfo = tfo;
	}

	handle_trade = (msg: string, e: Exchange, type: MarketType) => {
		switch (e) {
			case 'Bybit':
				handle_bybit_trade_message(this, msg, type);
				break;
			case 'Binance':
				handle_binance_trade_message(this, msg, type);
				break;
		}
	};
}
