import { useEffect, useState } from "react";
import { Sun } from "lucide-react";

interface SplashScreenProps {
  onComplete: () => void;
}

export const SplashScreen = ({ onComplete }: SplashScreenProps) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Start animation sequence
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onComplete, 300); // Wait for fade out
    }, 2000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-[#FFF8E7] flex flex-col items-center justify-center transition-opacity duration-300">
      <div className="relative animate-pulse">
        {/* Logo Container */}
        <div className="w-24 h-24 bg-gradient-to-br from-orange-400 to-orange-500 rounded-3xl shadow-lg flex items-center justify-center animate-bounce">
          <Sun className="w-12 h-12 text-white" />
        </div>

        {/* Animated circles */}
        <div className="absolute inset-0 bg-orange-400 rounded-3xl filter blur-xl opacity-30 animate-ping" />
      </div>

      <h1 className="mt-8 text-3xl font-bold text-orange-800 animate-fade-in">
        親子日記
      </h1>

      <p className="mt-2 text-orange-600 text-sm animate-fade-in-delay">
        家族の思い出を残そう
      </p>

      <div className="mt-8 flex space-x-1">
        <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
        <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
        <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
      </div>
    </div>
  );
};
