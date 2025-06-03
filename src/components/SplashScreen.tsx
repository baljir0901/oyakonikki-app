
import { useEffect, useState } from "react";
import { Heart, Sun, Sparkles } from "lucide-react";

interface SplashScreenProps {
  onComplete: () => void;
}

export const SplashScreen = ({ onComplete }: SplashScreenProps) => {
  const [isVisible, setIsVisible] = useState(true);
  const [animationPhase, setAnimationPhase] = useState(0);

  useEffect(() => {
    const timer1 = setTimeout(() => setAnimationPhase(1), 500);
    const timer2 = setTimeout(() => setAnimationPhase(2), 1500);
    const timer3 = setTimeout(() => setAnimationPhase(3), 2500);
    const timer4 = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onComplete, 500);
    }, 3500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, [onComplete]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-100 flex items-center justify-center overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-32 h-32 bg-yellow-200/30 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-32 w-24 h-24 bg-amber-300/30 rounded-full blur-lg animate-pulse delay-500"></div>
        <div className="absolute bottom-32 left-40 w-28 h-28 bg-orange-200/30 rounded-full blur-xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 right-20 w-20 h-20 bg-yellow-300/30 rounded-full blur-lg animate-pulse delay-700"></div>
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 2}s`
            }}
          >
            <Sparkles className="w-4 h-4 text-amber-400/60" />
          </div>
        ))}
      </div>

      {/* Main content */}
      <div className="relative z-10 text-center space-y-8 px-8">
        {/* Logo */}
        <div className={`transition-all duration-1000 ${animationPhase >= 0 ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}`}>
          <div className="relative">
            <div className="w-32 h-32 bg-gradient-to-br from-amber-400 via-yellow-500 to-orange-500 rounded-3xl mx-auto shadow-2xl transform rotate-6 animate-pulse">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-300 to-yellow-400 rounded-3xl transform -rotate-12 opacity-70"></div>
              <div className="relative z-10 w-full h-full flex items-center justify-center">
                <Sun className="w-16 h-16 text-white drop-shadow-lg" />
              </div>
            </div>
            {/* Decorative rings */}
            <div className="absolute -inset-4 border-2 border-amber-300/30 rounded-full animate-spin-slow"></div>
            <div className="absolute -inset-8 border border-yellow-400/20 rounded-full animate-ping"></div>
          </div>
        </div>

        {/* App title */}
        <div className={`transition-all duration-1000 delay-500 ${animationPhase >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-amber-800 via-yellow-700 to-orange-800 bg-clip-text text-transparent mb-4 tracking-tight">
            親子日記
          </h1>
          <div className="flex items-center justify-center gap-2 text-amber-700/80 text-lg font-medium">
            <Heart className="w-5 h-5 text-red-400 animate-pulse" />
            <span>家族の思い出を残そう</span>
            <Heart className="w-5 h-5 text-red-400 animate-pulse" />
          </div>
        </div>

        {/* Loading indicator */}
        <div className={`transition-all duration-1000 delay-1000 ${animationPhase >= 2 ? 'opacity-100' : 'opacity-0'}`}>
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-2 h-2 bg-amber-500 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-yellow-500 rounded-full animate-bounce delay-100"></div>
            <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce delay-200"></div>
          </div>
          <p className="text-amber-600/70 font-medium">アプリを準備中...</p>
        </div>

        {/* Welcome message */}
        <div className={`transition-all duration-1000 delay-2000 ${animationPhase >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <div className="bg-white/40 backdrop-blur-sm rounded-2xl p-6 border border-amber-200/50 shadow-lg">
            <p className="text-amber-800 font-medium text-lg leading-relaxed">
              ようこそ！<br />
              <span className="text-amber-700/80 text-base">
                親子の絆を深める素敵な旅が始まります
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Custom animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          25% { transform: translateY(-10px) rotate(5deg); }
          50% { transform: translateY(-5px) rotate(-5deg); }
          75% { transform: translateY(-15px) rotate(3deg); }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
      `}</style>
    </div>
  );
};
