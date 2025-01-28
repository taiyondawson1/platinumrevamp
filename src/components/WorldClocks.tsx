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
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {cities.map((city) => (
        <div key={city.name} className="relative w-[200px] h-[200px] mx-auto">
          <div className="absolute inset-0 bg-black/40 border border-silver/20">
            {/* Clock Face */}
            <div className="relative w-full h-full">
              {/* Hour markers */}
              {[...Array(12)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-0.5 h-3 bg-softWhite/50"
                  style={{
                    left: '50%',
                    top: '0',
                    transformOrigin: '50% 100px',
                    transform: `rotate(${i * 30}deg) translateX(-50%)`
                  }}
                />
              ))}

              {/* Digital Time */}
              <div className="absolute top-1/4 left-0 right-0 text-center">
                <div className="text-2xl font-bold text-softWhite">
                  {formatInTimeZone(time, city.timezone, 'HH:mm')}
                </div>
                <div className="text-xs text-mediumGray mt-1">
                  {formatInTimeZone(time, city.timezone, 'EEEE • MMM dd')}
                </div>
              </div>

              {/* City Name */}
              <div className="absolute bottom-8 left-0 right-0 text-center">
                <span className="text-sm font-medium text-mediumGray">
                  {city.name}
                </span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default WorldClocks;