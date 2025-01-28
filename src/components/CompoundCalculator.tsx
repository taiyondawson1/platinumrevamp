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
    <div className="p-6 bg-darkGrey/30 rounded-lg space-y-4">
      <h3 className="text-xl font-semibold text-softWhite mb-4">Compound Interest Calculator</h3>
      
      <div className="space-y-4">
        <div>
          <label className="text-sm text-mediumGray block mb-2">Principal Amount ($)</label>
          <Input
            type="number"
            value={principal}
            onChange={(e) => setPrincipal(e.target.value)}
            className="bg-darkBase border-silver/20"
          />
        </div>

        <div>
          <label className="text-sm text-mediumGray block mb-2">Annual Interest Rate (%)</label>
          <Input
            type="number"
            value={rate}
            onChange={(e) => setRate(e.target.value)}
            className="bg-darkBase border-silver/20"
          />
        </div>

        <div>
          <label className="text-sm text-mediumGray block mb-2">Time (years)</label>
          <Input
            type="number"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="bg-darkBase border-silver/20"
          />
        </div>

        <div>
          <label className="text-sm text-mediumGray block mb-2">Compound Frequency (per year)</label>
          <Input
            type="number"
            value={compound}
            onChange={(e) => setCompound(e.target.value)}
            className="bg-darkBase border-silver/20"
          />
        </div>

        <Button 
          onClick={calculateCompoundInterest}
          className="w-full bg-accent-blue hover:bg-accent-blue/90"
        >
          Calculate
        </Button>

        {result !== null && (
          <div className="mt-4 p-4 bg-darkBase rounded-lg">
            <p className="text-sm text-mediumGray">Interest Earned:</p>
            <p className="text-2xl font-bold text-accent-green">${result}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompoundCalculator;