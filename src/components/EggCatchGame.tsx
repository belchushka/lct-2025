import { useEffect, useRef, useState } from "react";

interface EggCatchGameProps {
  onGameEnd: (score: number) => void;
}

interface Egg {
  id: number;
  x: number;
  y: number;
  speed: number;
}

export const EggCatchGame = ({ onGameEnd }: EggCatchGameProps) => {
  const [basketX, setBasketX] = useState(50); // percentage from left
  const [eggs, setEggs] = useState<Egg[]>([]);
  const [score, setScore] = useState(0);
  const [gameTime, setGameTime] = useState(10); // 30 seconds game
  const containerRef = useRef<HTMLDivElement>(null);
  const eggIdCounter = useRef(0);

  // Handle touch move for basket
  const handleTouchMove = (e: TouchEvent) => {
    if (!containerRef.current) return;

    const touch = e.touches[0];
    const containerRect = containerRef.current.getBoundingClientRect();
    const x = touch.clientX - containerRect.left;
    const percentage = (x / containerRect.width) * 100;

    // Keep basket within bounds (0-100%)
    setBasketX(Math.max(0, Math.min(100, percentage)));
  };

  // Handle mouse move for desktop testing
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - containerRect.left;
    const percentage = (x / containerRect.width) * 100;

    setBasketX(Math.max(0, Math.min(100, percentage)));
  };

  // Spawn eggs periodically
  useEffect(() => {
    const spawnInterval = setInterval(() => {
      const newEgg: Egg = {
        id: eggIdCounter.current++,
        x: Math.random() * 90 + 5, // 5-95% from left
        y: -10, // start above screen
        speed: Math.random() * 2 + 3, // 3-5 speed
      };
      setEggs((prev) => [...prev, newEgg]);
    }, 800);

    return () => clearInterval(spawnInterval);
  }, []);

  // Update egg positions and check collisions
  useEffect(() => {
    const updateInterval = setInterval(() => {
      setEggs((prevEggs) => {
        const updatedEggs: Egg[] = [];

        prevEggs.forEach((egg) => {
          const newY = egg.y + egg.speed;

          // Check if egg is caught by basket
          const basketLeft = basketX - 8; // basket width is ~16%
          const basketRight = basketX + 8;
          const basketTop = 85; // basket is at ~85% from top

          if (
            newY >= basketTop &&
            newY <= basketTop + 10 &&
            egg.x >= basketLeft &&
            egg.x <= basketRight
          ) {
            // Egg caught!
            setScore((prev) => prev + 1);
            return; // Don't add this egg to updated array
          }

          // Keep egg if it's still on screen
          if (newY < 100) {
            updatedEggs.push({ ...egg, y: newY });
          }
        });

        return updatedEggs;
      });
    }, 50);

    return () => clearInterval(updateInterval);
  }, [basketX]);

  // Game timer
  useEffect(() => {
    if (gameTime <= 0) {
      onGameEnd(score);
      return;
    }

    const timer = setInterval(() => {
      setGameTime((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [gameTime, score, onGameEnd]);

  // Touch event listeners
  useEffect(() => {
    document.addEventListener("touchmove", handleTouchMove);
    return () => {
      document.removeEventListener("touchmove", handleTouchMove);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 z-10"
      onMouseMove={handleMouseMove}
      style={{ touchAction: "none" }}
    >
      {/* Score and Timer */}
      <div className="absolute top-4 left-0 right-0 flex justify-between px-6 text-white text-xl font-bold">
        <div className="bg-black/50 px-4 py-2 rounded">Счёт: {score}</div>
        <div className="bg-black/50 px-4 py-2 rounded">Время: {gameTime}с</div>
      </div>

      {/* Eggs */}
      {eggs.map((egg) => (
        <img
          key={egg.id}
          src="/egg.png"
          alt="egg"
          className="absolute w-12 h-12 pointer-events-none"
          style={{
            left: `${egg.x}%`,
            top: `${egg.y}%`,
            transform: "translate(-50%, -50%)",
          }}
        />
      ))}

      {/* Basket */}
      <img
        src="/korzina.png"
        alt="basket"
        className="absolute w-24 h-24 pointer-events-none"
        style={{
          left: `${basketX}%`,
          bottom: "8%",
          transform: "translateX(-50%)",
        }}
      />
    </div>
  );
};
