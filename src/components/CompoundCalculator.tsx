import { useState } from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';

const CompoundCalculator = () => {
  const [principal, setPrincipal] = useState<string>('1000');
  const [rate, setRate] = useState<string>('5');
  const [time, setTime] = useState<string>('1');
  const [compound, setCompound] = useState<string>('12');
  const [result, setResult] = useState<number | null>(null);

  const calculateCompoundInterest = () => {
    const p = parseFloat(principal);
    const r = parseFloat(rate) / 100;
    const t = parseFloat(time);
    const n = parseFloat(compound);
    
    const amount = p * Math.pow(1 + r/n, n * t);
    const interest = amount - p;
    setResult(Number(interest.toFixed(2)));
  };

  return (
    <div className="h-full bg-darkBase/40">
      <div className="p-4 space-y-4">
        <h3 className="text-sm font-medium text-softWhite">Position Size Calculator</h3>
        
        <div className="space-y-3">
          <div>
            <label className="text-xs text-mediumGray block mb-1">Principal Amount ($)</label>
            <Input
              type="number"
              value={principal}
              onChange={(e) => setPrincipal(e.target.value)}
              className="h-8 bg-darkGrey border-silver/20 text-sm"
            />
          </div>

          <div>
            <label className="text-xs text-mediumGray block mb-1">Annual Interest Rate (%)</label>
            <Input
              type="number"
              value={rate}
              onChange={(e) => setRate(e.target.value)}
              className="h-8 bg-darkGrey border-silver/20 text-sm"
            />
          </div>

          <div>
            <label className="text-xs text-mediumGray block mb-1">Time (years)</label>
            <Input
              type="number"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="h-8 bg-darkGrey border-silver/20 text-sm"
            />
          </div>

          <div>
            <label className="text-xs text-mediumGray block mb-1">Compound Frequency</label>
            <Input
              type="number"
              value={compound}
              onChange={(e) => setCompound(e.target.value)}
              className="h-8 bg-darkGrey border-silver/20 text-sm"
            />
          </div>

          <Button 
            onClick={calculateCompoundInterest}
            className="w-full h-8 bg-accent-blue hover:bg-accent-blue/90 text-sm"
          >
            Calculate
          </Button>

          {result !== null && (
            <div className="mt-2 p-2 bg-darkGrey/50">
              <p className="text-xs text-mediumGray">Interest Earned:</p>
              <p className="text-lg font-bold text-accent-green">${result}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CompoundCalculator;