
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

export interface OpenTradesResponse {
  error: boolean;
  message: string;
  openTrades: OpenTrade[];
}

export interface HistoryResponse {
  error: boolean;
  message: string;
  history: TradeHistory[];
}

export interface TradingMetrics {
  avgWin: number;
  avgLoss: number;
  winRate: number;
  totalResults: number;
  totalBalance: number;
  profitFactor: number;
  maxClosedDrawdown: number;
  totalOrders: number;
  lastTradeTake: number;
}

export interface RecentMetrics {
  percentageGain: number;
  totalProfit: number;
  maxDrawdown: number;
  floatingPL: number;
  openOrdersCount: number;
}
