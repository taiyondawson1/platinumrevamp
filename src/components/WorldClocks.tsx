import { useState, useEffect } from 'react';
import { formatInTimeZone } from 'date-fns-tz';

const WorldClocks = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const cities = [
    { name: 'TOKYO', timezone: 'Asia/Tokyo' },
    { name: 'LONDON', timezone: 'Europe/London' },
    { name: 'NEWYORK', timezone: 'America/New_York' }
  ];

  return (
    <div className="w-full bg-black/40 p-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        {cities.map((city) => (
          <div key={city.name} className="relative w-[200px] h-[200px] mx-auto">
            <div className="relative w-full h-full">
              {/* Clock markers */}
              {[...Array(12)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-[1px] h-2 bg-softWhite/30"
                  style={{
                    left: '50%',
                    top: '0',
                    transformOrigin: '50% 100px',
                    transform: `rotate(${i * 30}deg) translateX(-50%)`
                  }}
                />
              ))}

              {/* City Name */}
              <div className="absolute top-8 left-0 right-0 text-center">
                <span className="text-sm font-medium text-softWhite/70">
                  {city.name}
                </span>
              </div>

              {/* Digital Time */}
              <div className="absolute top-1/2 left-0 right-0 text-center -translate-y-1/2">
                <div className="text-2xl font-light text-softWhite tracking-wider">
                  {formatInTimeZone(time, city.timezone, 'HH:mm')}
                </div>
                <div className="text-[10px] text-softWhite/50 mt-1 tracking-wider uppercase">
                  {formatInTimeZone(time, city.timezone, 'EEEE • MMM dd')}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WorldClocks;