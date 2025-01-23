-- Create mt4_accounts table
CREATE TABLE IF NOT EXISTS public.mt4_accounts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  account_number TEXT UNIQUE NOT NULL,
  server TEXT NOT NULL,
  password TEXT NOT NULL
);

-- Create account_metrics table
CREATE TABLE IF NOT EXISTS public.account_metrics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  account_number TEXT NOT NULL REFERENCES mt4_accounts(account_number),
  balance DECIMAL DEFAULT 0,
  equity DECIMAL DEFAULT 0,
  floating DECIMAL DEFAULT 0,
  margin DECIMAL DEFAULT 0,
  "freeMargin" DECIMAL DEFAULT 0,
  "marginLevel" DECIMAL DEFAULT 0,
  "openPositions" INTEGER DEFAULT 0,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Add RLS policies
ALTER TABLE public.mt4_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.account_metrics ENABLE ROW LEVEL SECURITY;

-- Allow public access for now (in production, you should restrict this to authenticated users)
CREATE POLICY "Allow public access to mt4_accounts"
  ON public.mt4_accounts
  FOR ALL
  TO public
  USING (true);

CREATE POLICY "Allow public access to account_metrics"
  ON public.account_metrics
  FOR ALL
  TO public
  USING (true);