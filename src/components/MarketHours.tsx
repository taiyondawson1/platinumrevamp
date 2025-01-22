import { useEffect, useState } from "react";

const MarketHours = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const markets = [
    {
      city: "New York",
      icon: "☀️",
      status: "closes",
      hours: calculateTimeRemaining(time, -4), // EST
    },
    {
      city: "London",
      icon: "☀️",
      status: "closes",
      hours: calculateTimeRemaining(time, 1), // BST
    },
    {
      city: "Tokyo",
      icon: "🌙",
      status: "opens",
      hours: calculateTimeRemaining(time, 9), // JST
    },
    {
      city: "Sydney",
      icon: "🌙",
      status: "opens",
      hours: calculateTimeRemaining(time, 10), // AEST
    },
  ];

  return (
    <div className="bg-black/20 rounded-lg p-4 mb-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {markets.map((market) => (
          <div key={market.city} className="flex items-center space-x-2">
            <span>{market.icon}</span>
            <span className="font-medium">{market.city}</span>
            <span className="text-lightGrey">
              {market.status} in {market.hours}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

function calculateTimeRemaining(currentTime: Date, targetTimezone: number): string {
  const localHour = currentTime.getUTCHours();
  const targetHour = (localHour + targetTimezone + 24) % 24;
  const minutes = currentTime.getMinutes();
  const seconds = currentTime.getSeconds();
  
  return `${targetHour}h ${minutes}m ${seconds}s`;
}

export default MarketHours;