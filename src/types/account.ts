export interface AccountMetric {
  id?: string;
  account_id: string;
  balance: number;
  equity: number;
  floating: number;
  margin: number;
  freeMargin: number;
  marginLevel: number;
  openPositions: number;
  timestamp: string;
}