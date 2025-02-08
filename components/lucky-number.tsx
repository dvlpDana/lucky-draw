'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Card } from '@/components/ui/card';

interface LuckyNumberProps {
  numbers: number[];
  isSpinning: boolean;
  currentNumber: number | null;
}

interface NumberObject {
  x: number;
  y: number;
  vx: number;
  vy: number;
  number: number;
  size: number;
}

const LuckyNumber = ({
  numbers,
  isSpinning,
  currentNumber
}: LuckyNumberProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const numbersRef = useRef<NumberObject[]>([]);
  const [showFinalNumber, setShowFinalNumber] = useState(false);
  const [canvasWidth, setCanvasWidth] = useState(500);
  const [canvasHeight, setCanvasHeight] = useState(500);
  const [countdown, setCountdown] = useState<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const updateCanvasSize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      
      setCanvasWidth(rect.width);
      setCanvasHeight(rect.height);
      
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      
      ctx.scale(dpr, dpr);

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const radius = Math.min(centerX, centerY) * 0.9;

      const baseSize = Math.min(rect.width, rect.height) * 0.04;

      numbersRef.current = numbers.map(number => {
        const angle = Math.random() * Math.PI * 2;
        const r = Math.random() * radius * 0.8;
        return {
          x: centerX + Math.cos(angle) * r,
          y: centerY + Math.sin(angle) * r,
          vx: (Math.random() - 0.5) * 2,
          vy: (Math.random() - 0.5) * 2,
          number,
          size: baseSize
        };
      });

      drawFrame(ctx, rect.width, rect.height, radius);
    };

    updateCanvasSize();

    const resizeObserver = new ResizeObserver(updateCanvasSize);
    resizeObserver.observe(canvas);

    return () => {
      resizeObserver.disconnect();
    };
  }, [numbers]);

  const drawFrame = (ctx: CanvasRenderingContext2D, width: number, height: number, radius: number) => {
    const centerX = width / 2;
    const centerY = height / 2;

    ctx.clearRect(0, 0, width, height);

    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.fillStyle = '#4F46E5';
    ctx.fill();

    numbersRef.current.forEach(item => {
      ctx.beginPath();
      ctx.arc(item.x, item.y, item.size, 0, Math.PI * 2);
      ctx.fillStyle = '#6366F1';
      ctx.strokeStyle = 'white';
      ctx.lineWidth = 1;
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = 'white';
      ctx.font = `${item.size * 1.2}px Arial`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(item.number.toString(), item.x, item.y);
    });
  };

  useEffect(() => {
    if (!canvasRef.current || !isSpinning) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const radius = Math.min(centerX, centerY) * 0.9;

    setCountdown(8); 
    setShowFinalNumber(false);

    let countdownValue = 8;

    const countdownInterval = setInterval(() => {
      countdownValue -= 1;
      setCountdown(countdownValue);
      if (countdownValue === 1) {
        clearInterval(countdownInterval);
        setTimeout(() => {
          setCountdown(null);
          setShowFinalNumber(true);
        }, 1000);
      }
    }, 1000);

    const animate = () => {
      numbersRef.current.forEach(item => {
        const dx = item.x - centerX;
        const dy = item.y - centerY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance > radius - item.size) {
          const angle = Math.atan2(dy, dx);
          item.x = centerX + Math.cos(angle) * (radius - item.size);
          item.y = centerY + Math.sin(angle) * (radius - item.size);
          
          const dot = item.vx * dx/distance + item.vy * dy/distance;
          item.vx = item.vx - 2 * dot * dx/distance;
          item.vy = item.vy - 2 * dot * dy/distance;
          
          item.vx *= 0.8;
          item.vy *= 0.8;
        }

        item.x += item.vx;
        item.y += item.vy;
      });

      drawFrame(ctx, canvasWidth, canvasHeight, radius);

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isSpinning, canvasWidth, canvasHeight]);

  useEffect(() => {
    if (!isSpinning && currentNumber) {
      setTimeout(() => setShowFinalNumber(true), 500);
    }
  }, [isSpinning, currentNumber]);

  return (
    <Card className="p-4 sm:p-6 relative bg-white">
      <div className="w-full max-w-[500px] mx-auto aspect-square">
        <canvas
          ref={canvasRef}
          className="w-full h-full block"
        />

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
        {currentNumber && showFinalNumber && (
          <div 
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1/3 aspect-square flex justify-center items-center bg-white/80 rounded-full text-4xl sm:text-6xl md:text-8xl font-bold text-slate-700"
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

export default LuckyNumber;