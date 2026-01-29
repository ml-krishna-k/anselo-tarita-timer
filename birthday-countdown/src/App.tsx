import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Heart, Music, Sparkles } from 'lucide-react';
import { useCountdown } from './hooks/useCountdown';
import leftImg from './assets/hero.png';
import rightImg from './assets/heroine.png';

function App() {
  // Configuration
  const [dates] = useState(() => {
    const start = new Date('2026-01-29T00:00:00').getTime();
    const target = new Date('2026-02-18T23:58:00').getTime();
    return { start, target };
  });

  const { days, hours, minutes, seconds, total, isComplete } = useCountdown(dates.target);
  const [isPlaying, setIsPlaying] = useState(false);

  const TOTAL_DURATION = dates.target - dates.start;

  // Calculate progress (0 to 1)
  // 0 = Start Date
  // 1 = Target Date (Images meet)
  const progress = useMemo(() => {
    if (isComplete) return 1;
    const timeElapsed = TOTAL_DURATION - total;
    return Math.max(0, Math.min(1, timeElapsed / TOTAL_DURATION));
  }, [total, isComplete, TOTAL_DURATION]);

  // Trigger confetti on completion
  useEffect(() => {
    if (isComplete) {
      const duration = 15 * 1000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

      const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

      const interval: any = setInterval(function () {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
          colors: ['#f43f5e', '#f9a8d4', '#e6d3a3']
        });
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
          colors: ['#f43f5e', '#f9a8d4', '#e6d3a3']
        });
      }, 250);

      return () => clearInterval(interval);
    }
  }, [isComplete]);

  // Image Motion Logic
  // At progress 0: TranslateX is roughly 50vw (or enough to separate them)
  // At progress 1: TranslateX is 0 (they touch/overlap in center)
  // We offset them from the CENTER.
  // Left Image: Right aligned to center. Initial translateX: -50vw. Final: 0.
  // Right Image: Left aligned to center. Initial translateX: 50vw. Final: 0.

  // Refined for responsiveness: 
  // On mobile/portrait, maybe specific gap handling? 
  // Design says "Images meet precisely".
  const initialOffset = 55; // vw
  const currentOffset = initialOffset * (1 - progress);

  return (
    <div className="relative h-dvh w-full overflow-hidden bg-champagne-100/50 text-stone-800 font-sans selection:bg-dusty-200">

      {/* Background Texture/Grain */}
      <div className="absolute inset-0 opacity-40 pointer-events-none mix-blend-multiply"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}>
      </div>

      {/* Floating Elements (Subtle) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 text-dusty-300 animate-float opacity-50"><Heart size={24} /></div>
        <div className="absolute bottom-20 right-10 text-dusty-300 animate-float opacity-50" style={{ animationDelay: '2s' }}><Heart size={32} /></div>
        <div className="absolute top-1/3 right-1/4 text-champagne-400 animate-pulse opacity-60"><Sparkles size={20} /></div>
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center p-6 text-center">

        {/* Hero Text */}
        <AnimatePresence mode="wait">
          {!isComplete ? (
            <motion.div
              key="countdown"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="flex flex-col items-center gap-6 sm:gap-8 mb-8 sm:mb-0 relative z-20 p-6 sm:p-10 rounded-3xl bg-white/10 backdrop-blur-[2px] border border-white/20 shadow-xl"
            >
              <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-dusty-600 italic tracking-wide drop-shadow-sm text-center">
                Something beautiful is coming...
              </h1>

              {/* Countdown Grid */}
              <div className="grid grid-cols-4 gap-3 sm:gap-8 md:gap-12 text-center mt-6 sm:mt-8 w-full max-w-lg">
                <TimeBlock value={days} label="Days" />
                <TimeBlock value={hours} label="Hours" />
                <TimeBlock value={minutes} label="Mins" />
                <TimeBlock value={seconds} label="Secs" />
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="birthday"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="flex flex-col items-center z-50"
            >
              <h1 className="font-serif text-4xl sm:text-5xl md:text-7xl text-dusty-600 drop-shadow-sm mb-4">
                Happy Birthday <br />
                <span className="italic text-blush-500">babygirl Tarita</span> 💕
              </h1>
              <p className="text-lg text-stone-600 max-w-md mt-4 font-light leading-relaxed">
                The wait is finally over. Here's to you, my love.
              </p>
            </motion.div>
          )}
        </AnimatePresence>

      </div>

      {/* Moving Images */}
      {/* Container for images to center them relative to screen */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-0">

        {/* Left Image */}
        {/* Left Image (Hero) */}
        {/* Left Image (Hero) */}
        {/* Left Image (Hero) */}
        <div
          className="absolute z-10 pointer-events-auto hover:z-50"
          style={{
            right: '50%',
            transform: `translateX(-${currentOffset}vw)`,
            transition: 'transform 1s linear',
            willChange: 'transform'
          }}
        >
          <div className="h-[48vh] sm:h-[70vh] md:h-[80vh] w-auto aspect-[3/4] shadow-2xl rounded-[30px] sm:rounded-[40px] rounded-tr-[80px] sm:rounded-tr-[100px] rounded-bl-[80px] sm:rounded-bl-[100px] overflow-hidden border-[4px] sm:border-[6px] border-white/60 transform -rotate-6 hover:rotate-[-3deg] hover:scale-105 transition-all duration-500 ease-out origin-bottom-right">
            <img src={leftImg} alt="Hero" className="w-full h-full object-cover object-right opacity-95 hover:opacity-100 transition-opacity duration-500" />
            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-blush-500/20 to-transparent"></div>
          </div>
        </div>

        {/* Right Image */}
        {/* Right Image (Heroine) */}
        {/* Right Image (Heroine) */}
        <div
          className="absolute z-10 pointer-events-auto hover:z-50"
          style={{
            left: '50%',
            transform: `translateX(${currentOffset}vw)`,
            transition: 'transform 1s linear',
            willChange: 'transform'
          }}
        >
          <div className="h-[48vh] sm:h-[70vh] md:h-[80vh] w-auto aspect-[3/4] shadow-2xl rounded-[30px] sm:rounded-[40px] rounded-tl-[80px] sm:rounded-tl-[100px] rounded-br-[80px] sm:rounded-br-[100px] overflow-hidden border-[4px] sm:border-[6px] border-white/60 transform rotate-6 hover:rotate-[3deg] hover:scale-105 transition-all duration-500 ease-out origin-bottom-left">
            <img src={rightImg} alt="Heroine" className="w-full h-full object-cover object-left opacity-95 hover:opacity-100 transition-opacity duration-500" />
            <div className="absolute inset-0 bg-gradient-to-t from-dusty-500/20 to-transparent"></div>
          </div>
        </div>

      </div>

      {/* Audio Button */}
      <button
        onClick={() => setIsPlaying(!isPlaying)}
        className="fixed bottom-6 right-6 z-50 p-3 rounded-full bg-white/30 backdrop-blur-md border border-white/50 text-dusty-500 hover:bg-white/50 transition-all shadow-lg"
      >
        <Music size={20} className={isPlaying ? "animate-spin-slow" : ""} />
      </button>

    </div>
  );
}

function TimeBlock({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <span className="font-serif text-3xl sm:text-5xl md:text-6xl text-stone-800 tabular-nums leading-none">
        {String(value).padStart(2, '0')}
      </span>
      <span className="text-[10px] sm:text-xs uppercase tracking-[0.2em] text-stone-500 mt-2">
        {label}
      </span>
    </div>
  );
}

export default App;
