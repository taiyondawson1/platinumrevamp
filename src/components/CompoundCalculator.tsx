import { useState } from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';

const PositionSizeCalculator = () => {
  const [accountSize, setAccountSize] = useState<string>('10000');
  const [riskPercentage, setRiskPercentage] = useState<string>('1');
  const [entryPrice, setEntryPrice] = useState<string>('');
  const [stopLoss, setStopLoss] = useState<string>('');
  const [result, setResult] = useState<{
    positionSize: number;
    riskAmount: number;
  } | null>(null);

  const calculatePositionSize = () => {
    const account = parseFloat(accountSize);
    const risk = parseFloat(riskPercentage) / 100;
    const entry = parseFloat(entryPrice);
    const stop = parseFloat(stopLoss);
    
    if (!account || !risk || !entry || !stop) return;
    
    const riskAmount = account * risk;
    const priceDifference = Math.abs(entry - stop);
    const positionSize = riskAmount / priceDifference;
    
    setResult({
      positionSize: Number(positionSize.toFixed(2)),
      riskAmount: Number(riskAmount.toFixed(2))
    });
  };

  return (
    <div className="h-full bg-darkBase/40">
      <div className="p-4 space-y-4">
        <h3 className="text-sm font-medium text-softWhite">Position Size Calculator</h3>
        
        <div className="space-y-3">
          <div>
            <label className="text-xs text-mediumGray block mb-1">Account Size</label>
            <Input
              type="number"
              value={accountSize}
              onChange={(e) => setAccountSize(e.target.value)}
              className="h-8 bg-darkGrey border-silver/20 text-sm"
            />
          </div>

          <div>
            <label className="text-xs text-mediumGray block mb-1">Risk Per Trade (%)</label>
            <Input
              type="number"
              value={riskPercentage}
              onChange={(e) => setRiskPercentage(e.target.value)}
              className="h-8 bg-darkGrey border-silver/20 text-sm"
            />
          </div>

          <div>
            <label className="text-xs text-mediumGray block mb-1">Entry Price</label>
            <Input
              type="number"
              value={entryPrice}
              onChange={(e) => setEntryPrice(e.target.value)}
              className="h-8 bg-darkGrey border-silver/20 text-sm"
            />
          </div>

          <div>
            <label className="text-xs text-mediumGray block mb-1">Stop Loss</label>
            <Input
              type="number"
              value={stopLoss}
              onChange={(e) => setStopLoss(e.target.value)}
              className="h-8 bg-darkGrey border-silver/20 text-sm"
            />
          </div>

          <Button 
            onClick={calculatePositionSize}
            className="w-full h-8 bg-accent-blue hover:bg-accent-blue/90 text-sm"
          >
            Calculate
          </Button>

          {result !== null && (
            <div className="mt-4 space-y-2">
              <div className="p-2 bg-darkGrey/50">
                <p className="text-xs text-mediumGray">Position Size:</p>
                <p className="text-lg font-bold text-accent-green">{result.positionSize}</p>
              </div>
              <div className="p-2 bg-darkGrey/50">
                <p className="text-xs text-mediumGray">Risk Amount:</p>
                <p className="text-lg font-bold text-accent-red">${result.riskAmount}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PositionSizeCalculator;