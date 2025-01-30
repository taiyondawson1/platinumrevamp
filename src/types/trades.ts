
export interface OpenTrade {
  openTime: string;
  symbol: string;
  action: string;
  sizing: {
    type: string;
    value: string;
  };
  openPrice: number;
  tp: number;
  sl: number;
  comment: string;
  profit: number;
  pips: number;
  swap: number;
  magic: number;
}

export interface TradeHistory {
  openTime: string;
  closeTime: string;
  symbol: string;
  action: string;
  sizing: {
    type: string;
    value: string;
  };
  openPrice: number;
  closePrice: number;
  tp: number;
  sl: number;
  comment: string;
  pips: number;
  profit: number;
  interest: number;
  commission: number;
}
