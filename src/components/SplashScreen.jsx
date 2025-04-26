import React, { useEffect, useState } from 'react';
import { Cloud, Wind, Droplets, Thermometer } from 'lucide-react';

const SplashScreen = () => {
  const [showContent, setShowContent] = useState(false);
  
  const colors = {
    primary: "#4d547d", // primary[400]
    secondary: "#ffe3a3", // secondary[300]
    background: "#191F45", // primary[600] (dark mode background)
    alt: "#21295c", // primary[500] (dark mode background alt)
    text: "#ffffff", // grey[0]
    textSecondary: "#a6a9be", // primary[200]
    accent1: "#ffd166", // secondary[500]
    accent2: "#7a7f9d", // primary[300]
  };
  
  useEffect(() => {
    const contentTimer = setTimeout(() => {
      setShowContent(true);
    }, 300);

    return () => {
      clearTimeout(contentTimer);
    };
  }, []);

  const particles = Array.from({ length: 20 }).map((_, i) => {
    const size = Math.random() * 12 + 4;
    const left = Math.random() * 100;
    const top = Math.random() * 100;
    const delay = Math.random() * 5;
    const duration = Math.random() * 6 + 6;
    const opacity = Math.random() * 0.5 + 0.2;
    
    const particleColor = i % 2 === 0 ? colors.primary : colors.secondary;

    return (
      <div 
        key={i}
        className="absolute rounded-full"
        style={{
          left: `${left}%`,
          top: `${top}%`,
          width: `${size}px`,
          height: `${size}px`,
          backgroundColor: particleColor,
          opacity: opacity,
          animation: `float ${duration}s ease-in-out infinite`,
          animationDelay: `${delay}s`
        }}
      />
    );
  });

  return (
    <div className="fixed inset-0 flex items-center justify-center overflow-hidden"
         style={{ background: `linear-gradient(135deg, ${colors.background} 0%, ${colors.alt} 100%)` }}>
      <style jsx global>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0) scale(1);
          }
          50% {
            transform: translateY(-20px) scale(1.1);
          }
        }
        
        @keyframes scaleIn {
          0% {
            transform: scale(0.8);
            opacity: 0;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
        
        @keyframes fadeUp {
          0% {
            transform: translateY(20px);
            opacity: 0;
          }
          100% {
            transform: translateY(0);
            opacity: 1;
          }
        }
        
        .scale-in {
          animation: scaleIn 0.8s forwards;
        }
        
        .fade-up {
          animation: fadeUp 0.8s forwards;
        }
        
        .rotating {
          animation: rotate 20s linear infinite;
        }
        
        @keyframes rotate {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to { transform: translate(-50%, -50%) rotate(360deg); }
        }
        
        .rotating-reverse {
          animation: rotate-reverse 15s linear infinite;
        }
        
        @keyframes rotate-reverse {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to { transform: translate(-50%, -50%) rotate(-360deg); }
        }
      `}</style>
      
      {/* Background particles */}
      {particles}
      
      {/* Decorative rings */}
      <div 
        className="absolute -z-10 w-64 h-64 border-2 rounded-full left-1/2 top-1/2 rotating"
        style={{ borderColor: `${colors.primary}40` }}
      ></div>
      <div 
        className="absolute -z-10 w-80 h-80 border-2 rounded-full left-1/2 top-1/2 rotating-reverse"
        style={{ borderColor: `${colors.secondary}30` }}
      ></div>
      
      {/* Content container */}
      <div className="relative z-10 text-center px-4 max-w-md">
        {/* Icon group with staggered animation */}
        <div className={`mb-8 ${showContent ? "opacity-100" : "opacity-0"} transition-all duration-1000`}>
          <div className="relative flex justify-center items-center h-20">
            <div className="absolute">
              <Cloud 
                style={{
                  width: '64px',
                  height: '64px',
                  color: colors.text,
                  filter: `drop-shadow(0 0 8px ${colors.primary}80)`,
                  animation: showContent ? 'scaleIn 0.8s forwards' : 'none'
                }}
              />
            </div>
            <div className="absolute -top-2 -right-6">
              <Wind 
                style={{
                  width: '32px',
                  height: '32px',
                  color: colors.accent1,
                  filter: `drop-shadow(0 0 5px ${colors.accent1}60)`,
                  animation: showContent ? 'scaleIn 0.8s forwards, float 4s ease-in-out infinite' : 'none',
                  animationDelay: '0.2s'
                }}
              />
            </div>
            <div className="absolute bottom-0 -left-6">
              <Droplets 
                style={{
                  width: '32px',
                  height: '32px',
                  color: colors.secondary,
                  filter: `drop-shadow(0 0 5px ${colors.secondary}60)`,
                  animation: showContent ? 'scaleIn 0.8s forwards, float 3.5s ease-in-out infinite' : 'none',
                  animationDelay: '0.4s'
                }}
              />
            </div>
            <div className="absolute -bottom-2 -right-2">
              <Thermometer 
                style={{
                  width: '28px',
                  height: '28px',
                  color: colors.accent2,
                  filter: `drop-shadow(0 0 5px ${colors.accent2}60)`,
                  animation: showContent ? 'scaleIn 0.8s forwards, float 5s ease-in-out infinite' : 'none',
                  animationDelay: '0.6s'
                }}
              />
            </div>
          </div>
        </div>

        {/* Title with animation */}
        <h1 
          className={`text-4xl md:text-5xl font-bold mb-3 ${showContent ? "scale-in" : "opacity-0"}`}
          style={{ color: colors.text, textShadow: `0 2px 10px ${colors.primary}80` }}
        >
          AirMonitor
        </h1>

        {/* Subtitle with animation */}
        <p 
          className={`text-lg md:text-xl mb-8 ${showContent ? "fade-up" : "opacity-0"}`}
          style={{ 
            color: colors.textSecondary, 
            textShadow: `0 1px 5px ${colors.background}`,
            animationDelay: '0.3s'
          }}
        >
          Real-time air quality monitoring
        </p>

        {/* Loading dots */}
        <div 
          className={`flex justify-center items-center gap-3 ${showContent ? "fade-up" : "opacity-0"}`}
          style={{ animationDelay: '0.6s' }}
        >
          <span 
            className="w-3 h-3 rounded-full animate-pulse"
            style={{ backgroundColor: colors.primary, boxShadow: `0 0 10px ${colors.primary}` }}
          ></span>
          <span 
            className="w-3 h-3 rounded-full animate-pulse" 
            style={{ 
              backgroundColor: colors.secondary, 
              boxShadow: `0 0 10px ${colors.secondary}`,
              animationDelay: '0.3s' 
            }}
          ></span>
          <span 
            className="w-3 h-3 rounded-full animate-pulse" 
            style={{ 
              backgroundColor: colors.accent1, 
              boxShadow: `0 0 10px ${colors.accent1}`,
              animationDelay: '0.6s' 
            }}
          ></span>
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;