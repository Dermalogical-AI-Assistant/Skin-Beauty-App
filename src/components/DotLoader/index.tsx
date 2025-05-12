import { useEffect, useState } from 'react';

export default function DotLoader() {
  const [activeIndices, setActiveIndices] = useState([0, 1, 2, 3, 4, 5, 6, 7, 8]);

  useEffect(() => {
    let isRunning = true;

    const delay = (ms: number) =>
      new Promise(resolve => setTimeout(resolve, ms));

    const loop = async () => {
      while (isRunning) {
        setActiveIndices(prev => {
          if (prev.length === 0) return prev;

          const [first, ...rest] = prev;

          setTimeout(() => {
            setActiveIndices(current => {
              if (!current.includes(first)) {
                return [...current, first];
              }
              return current;
            });
          }, 200);

          return rest;
        });

        await delay(100);
      }
    };

    loop();

    return () => {
      isRunning = false;
    };
  }, []);

  return (
    <div className="flex items-center justify-center">
      <div className="grid grid-cols-3 gap-1">
        {[...Array(9)].map((_, index) => {
          const isActive = activeIndices.includes(index);

          return (
            <div
              key={index}
              className="w-[25px] h-[25px] flex items-center justify-center"
            >
              <div
                className={`
                  w-[15px] h-[15px] rounded-full bg-white/40 backdrop-blur-xs  drop-shadow-lg transition-all duration-300 ease-in-out
                  ${isActive ? 'scale-100' : 'scale-0'}
                `}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}