'use client';

import React, { useCallback, useRef, useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';

interface RouletteProps {
  numbers: number[];
  isSpinning: boolean;
  currentNumber: number | null;
}

const RouletteWheel = ({ 
  numbers, 
  isSpinning, 
  currentNumber,
}: RouletteProps) => {
  const wheelRef = useRef<SVGGElement>(null);
  const animationRef = useRef<number | null>(null);
  const speedRef = useRef(60);
  const [rotation, setRotation] = useState(0);
  const [wheelState, setWheelState] = useState<'idle' | 'spinning' | 'stopped'>('idle');
  const [initialNumbers, setInitialNumbers] = useState<number[]>([]);
  const [displayNumbers, setDisplayNumbers] = useState<number[]>([]);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [size, setSize] = useState(500); // Default size

  // Update SVG size based on screen width
  useEffect(() => {
    const updateSize = () => {
      if (window.innerWidth < 640) {
        setSize(300);
      } else if (window.innerWidth < 1024) {
        setSize(400);
      } else {
        setSize(500);
      }
    };

    updateSize(); // Run on mount
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  useEffect(() => {
    if (initialNumbers.length === 0) {
      setInitialNumbers(numbers);
      setDisplayNumbers(numbers);
    }
  }, [numbers, initialNumbers]);

  useEffect(() => {
    if (isSpinning) {
      setDisplayNumbers(numbers);
    }
  }, [isSpinning, numbers]);

    const stopAnimation = useCallback(() => {
    if (animationRef.current) {
      window.cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
  }, []);

  const calculateTargetAngle = useCallback((targetNumber: number | null) => {
    if (!targetNumber || displayNumbers.length === 0) return 0;
    
    const segmentCount = displayNumbers.length;
    const anglePerSegment = 360 / segmentCount;
    
    const targetIndex = displayNumbers.indexOf(targetNumber);
    
    if (targetIndex === -1) return 0;
    
    const targetAngle = (targetIndex * anglePerSegment) + (anglePerSegment / 2);
    
    return 360 - targetAngle + 5;
  }, [displayNumbers]);

  const createSegments = useCallback(() => {
    const segments = [];
    const segmentCount = displayNumbers.length;
    const anglePerSegment = 360 / segmentCount;
    const shouldShowNumbers = segmentCount <= 36;

    for (let i = 0; i < segmentCount; i++) {
      const angle = i * anglePerSegment;
      const startX = Math.cos((angle - anglePerSegment / 2) * Math.PI / 180) * 330;
      const startY = Math.sin((angle - anglePerSegment / 2) * Math.PI / 180) * 330;
      const endX = Math.cos((angle + anglePerSegment / 2) * Math.PI / 180) * 330;
      const endY = Math.sin((angle + anglePerSegment / 2) * Math.PI / 180) * 330;

      const largeArcFlag = anglePerSegment > 180 ? 1 : 0;

      segments.push(
        <g key={`segment-${i}`}>
          <path
            d={`M 0 0 L ${startX} ${startY} A 330 330 0 ${largeArcFlag} 1 ${endX} ${endY} Z`}
            fill={i % 2 === 0 ? '#4F46E5' : '#6366F1'}
            stroke="#312E81"
            strokeWidth="1"
          />
          {shouldShowNumbers && (
            <text
              x={Math.cos(angle * Math.PI / 180) * 300}
              y={Math.sin(angle * Math.PI / 180) * 300}
              fill="white"
              fontSize="16"
              fontWeight="bold"
              textAnchor="middle"
              dominantBaseline="middle"
              transform={`rotate(${90 + angle}, ${Math.cos(angle * Math.PI / 180) * 300}, ${Math.sin(angle * Math.PI / 180) * 300})`}
            >
              {displayNumbers[i]}
            </text>
          )}
        </g>
      );
    }
    return segments;
  }, [displayNumbers]);

  useEffect(() => {
    if (isSpinning) {
      setWheelState('spinning');
      setCountdown(8); // Start countdown

      let countdownValue = 8;

      const countdownInterval = setInterval(() => {
        countdownValue -= 1;
        setCountdown(countdownValue);
        if (countdownValue === 1) {
          clearInterval(countdownInterval);
          setTimeout(() => {
            setCountdown(null);
          }, 1000);
        }
      }, 1000);
      
      let start: number | null = null;
      speedRef.current = 60;

      const spin = (timestamp: number) => {
        if (!start) {
          start = timestamp;
        }
        
        const elapsed = timestamp - start;
        const duration = 8000;
        
        if (elapsed < duration) {
          const progress = elapsed / duration;
          const easeOut = 1 - Math.pow(1 - progress, 3);
          
          speedRef.current = 60 * (1 - easeOut) + 0.1;
          
          setRotation(prev => prev + speedRef.current);
          animationRef.current = window.requestAnimationFrame(spin);
        }
      };

      animationRef.current = window.requestAnimationFrame(spin);
      return () => stopAnimation();
    } else {
      if (currentNumber !== null) {
        const finalAngle = calculateTargetAngle(currentNumber);
        setRotation(finalAngle);

        stopAnimation();
        
        setTimeout(() => {
          setWheelState('stopped');
        }, 500);
      }

      setWheelState('idle');
    }
  }, [isSpinning, currentNumber, calculateTargetAngle, stopAnimation]);

  return (
    <Card className="p-6 flex justify-center items-center relative">
      <div className="w-full max-w-[500px] aspect-square">
        <svg 
          width={size} 
          height={size} 
          viewBox="-350 -350 700 700" // Keeps the proportions
        >
          <circle
            cx="0"
            cy="0"
            r="340"
            fill="#312E81"
            stroke="#312E81"
            strokeWidth="1"
          />
          
          <g ref={wheelRef} transform={`rotate(${-90 + rotation})`}>
            {createSegments()}
          </g>
          
          <g transform="translate(0, -338)">
            <path
              d="M -20 0 L 0 -30 L 20 0 L -20 0"
              fill="#DC2626"
              stroke="#DC2626"
              strokeWidth="1"
            />
            <rect
              x="-20"
              y="0"
              width="40"
              height="10"
              fill="#DC2626"
            />
          </g>
        </svg>

        {/* Countdown Animation */}
        {countdown !== null && (
          <div
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-red-500 font-bold"
            style={{
              fontSize: '10rem',
              animation: 'numberAppear 1s ease-out forwards',
              transform: 'translate(-50%, -50%) scale(2)',
            }}
          >
            {countdown}
          </div>
        )}

        {/* Display Final Lucky Number */}
        {currentNumber !== null && (wheelState === 'stopped' || !isSpinning) && (
          <div 
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-48 w-48 flex justify-center items-center bg-white/80 rounded-full text-8xl font-bold text-slate-700 shadow-lg"
            style={{
              animation: 'numberAppear 1s ease-out forwards',
              opacity: 0,
              transform: 'translate(-50%, -50%) scale(0.5)',
            }}
          >
            {currentNumber}
          </div>
        )}
      </div>
      <style jsx>{`
        @keyframes numberAppear {
          0% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(2);
          }
          50% {
            opacity: 0.5;
            transform: translate(-50%, -50%) scale(1.2);
          }
          100% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
          }
        }
      `}</style>
    </Card>
  );
};

export default RouletteWheel;