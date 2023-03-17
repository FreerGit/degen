import type { MarketType } from './markets/get_markets';
import type { Exchange } from './types';

export const get_exchange_trade_endpoint = (exchange: Exchange, type: MarketType) => {
	switch (exchange) {
		case 'Bybit':
			switch (type) {
				case 'spot':
					return 'wss://stream.bybit.com/v5/public/spot';
				case 'inverse':
					return 'wss://stream.bybit.com/v5/public/inverse';
				case 'linear':
					return 'wss://stream.bybit.com/v5/public/linear';
			}
		case 'Binance':
			return 'wss://data-stream.binance.com';
	}
};
