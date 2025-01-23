export interface AccountMetric {
  id?: string;
  account_number: string;  // Changed from account_id to account_number
  balance: number;
  equity: number;
  floating: number;
  margin: number;
  freeMargin: number;
  marginLevel: number;
  openPositions: number;
  timestamp: string;
}