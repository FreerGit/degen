import { BinanceBook } from './binance/order_book';
import { BybitBook } from './bybit/order_book';
import { OKXBook } from './okx/order_book';
import type { MarketInfo, MarketType } from './markets/get_markets';
import type { AbstractOrderBook } from './order_book';
import type { Exchange } from './types';

export const new_orderbook_instance = (m: MarketInfo): AbstractOrderBook => {
	switch (m.exchange) {
		case 'Bybit':
			return new BybitBook(m);
		case 'Binance':
			return new BinanceBook(m);
		case 'OKX':
			return new OKXBook(m);
	}
};

export const get_exchange_endpoint = (exchange: Exchange, type: MarketType) => {
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
		// eslint-disable-next-line no-fallthrough
		case 'Binance':
			switch (type) {
				case 'spot':
					return 'wss://stream.binance.com/ws';
				case 'linear':
					return 'wss://fstream.binance.com/ws';
				case 'inverse':
					console.error('Binance does not have inverse?');
					return '';
			}
		// eslint-disable-next-line no-fallthrough
		case 'OKX': {
			return 'wss://wsaws.okx.com:8443/ws/v5/public';
		}
	}
};

export const add_trade_pair_suffix = (exchange: Exchange, market: string): string => {
	switch (exchange) {
		case 'Bybit':
			return `publicTrade.${market}`;
		case 'Binance':
			return `${market.toLowerCase()}@trade`;
		case 'OKX':
			return JSON.stringify({ channel: 'trades', instId: market });
	}
};

export const add_orderbook_pair_suffix = (exchange: Exchange, market: string): string => {
	switch (exchange) {
		case 'Bybit':
			return `orderbook.50.${market}`;
		case 'Binance':
			return `${market.toLocaleLowerCase()}@depth20@100ms`;
		case 'OKX':
			return `books`;
	}
};

export const get_trade_subscription_string = (
	exchange: Exchange,
	markets: Array<string>
): string => {
	const to_sub_array = markets.map((m) => add_trade_pair_suffix(exchange, m));
	switch (exchange) {
		case 'Bybit':
			return `{"op": "subscribe", "args": ${JSON.stringify(to_sub_array)}}`;
		case 'Binance':
			return `{"method": "SUBSCRIBE", "params": ${JSON.stringify(to_sub_array)}, "id": 1}`;
		case 'OKX':
			return `{"op": "subscribe", "args": [${to_sub_array}]}`;
	}
};
