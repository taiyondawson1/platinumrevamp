
import { TradeHistory, OpenTrade, RecentMetrics, TradingMetrics } from "@/types/trading";

export const calculateRecentMetrics = (
  history: TradeHistory[], 
  opens: OpenTrade[],
  balance?: number
): RecentMetrics => {
  const fiveDaysAgo = new Date();
  fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 5);

  const recentTrades = history.filter(trade => 
    new Date(trade.closeTime) >= fiveDaysAgo
  );

  const recentProfit = recentTrades.reduce((sum, trade) => 
    sum + trade.profit + trade.interest + trade.commission, 0
  );

  const totalProfit = recentProfit;
  const percentageGain = ((recentProfit / (balance || 1)) * 100);

  const floatingPL = opens.reduce((sum, trade) => sum + trade.profit + trade.swap, 0);
  const openOrdersCount = opens.length;

  let maxBalance = balance || 0;
  let maxDrawdown = 0;
  
  recentTrades.forEach(trade => {
    const tradeResult = trade.profit + trade.interest + trade.commission;
    maxBalance = Math.max(maxBalance, maxBalance + tradeResult);
    const drawdown = ((maxBalance - (maxBalance + tradeResult)) / maxBalance) * 100;
    maxDrawdown = Math.max(maxDrawdown, drawdown);
  });

  return {
    percentageGain,
    totalProfit,
    maxDrawdown,
    floatingPL,
    openOrdersCount
  };
};

export const calculateTradingMetrics = (
  history: TradeHistory[],
  balance?: number,
  maxDrawdown = 0
): TradingMetrics => {
  if (!history.length) return {
    avgWin: 0,
    avgLoss: 0,
    winRate: 0,
    totalResults: 0,
    totalBalance: 0,
    profitFactor: 0,
    maxClosedDrawdown: 0,
    totalOrders: 0,
    lastTradeTake: 0
  };

  const winningTrades = history.filter(trade => 
    (trade.profit + trade.interest + trade.commission) > 0
  );
  const losingTrades = history.filter(trade => 
    (trade.profit + trade.interest + trade.commission) <= 0
  );

  const totalWinnings = winningTrades.reduce((sum, trade) => 
    sum + trade.profit + trade.interest + trade.commission, 0
  );

  const totalLosses = Math.abs(losingTrades.reduce((sum, trade) => 
    sum + trade.profit + trade.interest + trade.commission, 0
  ));

  const profitFactor = totalLosses === 0 ? totalWinnings : totalWinnings / totalLosses;

  const avgWin = winningTrades.length > 0
    ? totalWinnings / winningTrades.length
    : 0;

  const avgLoss = losingTrades.length > 0
    ? totalLosses / losingTrades.length
    : 0;

  const winRate = (winningTrades.length / history.length) * 100;

  const totalResults = history.reduce((sum, trade) => 
    sum + trade.profit + trade.interest + trade.commission, 0
  );

  const lastTradeTake = history.length > 0 
    ? history[0].profit + history[0].interest + history[0].commission
    : 0;

  return {
    avgWin,
    avgLoss,
    winRate,
    totalResults,
    totalBalance: balance || 0,
    profitFactor,
    maxClosedDrawdown: maxDrawdown,
    totalOrders: history.length,
    lastTradeTake
  };
};
