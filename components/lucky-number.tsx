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

const LuckyNumber: React.FC<LuckyNumberProps> = ({
  numbers,
  isSpinning,
  currentNumber
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const numbersRef = useRef<NumberObject[]>([]);
  const [showFinalNumber, setShowFinalNumber] = useState(false);
  const [canvasWidth, setCanvasWidth] = useState(500);
  const [canvasHeight, setCanvasHeight] = useState(500);

  // Canvas 초기화 및 크기 설정
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // DPI 조정을 위한 크기 설정
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    
    setCanvasWidth(rect.width);
    setCanvasHeight(rect.height);
    
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // 크기에 맞게 스케일 조정
    ctx.scale(dpr, dpr);

    // 숫자 초기화
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const radius = Math.min(centerX, centerY) * 0.9;

    numbersRef.current = numbers.map(number => {
      const angle = Math.random() * Math.PI * 2;
      const r = Math.random() * radius * 0.8;
      return {
        x: centerX + Math.cos(angle) * r,
        y: centerY + Math.sin(angle) * r,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        number,
        size: 20  // 원의 반지름 크기
      };
    });

    // 초기 상태 그리기
    drawFrame(ctx, rect.width, rect.height, radius);
  }, [numbers]);

  // 프레임 그리기 함수
  const drawFrame = (ctx: CanvasRenderingContext2D, width: number, height: number, radius: number) => {
    const centerX = width / 2;
    const centerY = height / 2;

    // 캔버스 클리어
    ctx.clearRect(0, 0, width, height);

    // 배경 원 그리기
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.fillStyle = '#4F46E5';
    ctx.fill();

    // 모든 숫자 그리기
    numbersRef.current.forEach(item => {
      // 숫자 배경 원 그리기
      ctx.beginPath();
      ctx.arc(item.x, item.y, item.size, 0, Math.PI * 2);
      ctx.fillStyle = '#6366F1';
      ctx.strokeStyle = 'white';
      ctx.lineWidth = 1;
      ctx.fill();
      ctx.stroke();

      // 숫자 그리기
      ctx.fillStyle = 'white';
      ctx.font = `${item.size * 1.2}px Arial`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(item.number.toString(), item.x, item.y);
    });
  };

  // 애니메이션 효과
  useEffect(() => {
    if (!canvasRef.current || !isSpinning) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const radius = Math.min(centerX, centerY) * 0.9;

    setShowFinalNumber(false);

    const animate = () => {
      // 모든 숫자의 위치 업데이트
      numbersRef.current.forEach(item => {
        // 원 경계 체크
        const dx = item.x - centerX;
        const dy = item.y - centerY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance > radius - item.size) {
          // 벽에 부딪히면 반사
          const angle = Math.atan2(dy, dx);
          item.x = centerX + Math.cos(angle) * (radius - item.size);
          item.y = centerY + Math.sin(angle) * (radius - item.size);
          
          // 속도 반전
          const dot = item.vx * dx/distance + item.vy * dy/distance;
          item.vx = item.vx - 2 * dot * dx/distance;
          item.vy = item.vy - 2 * dot * dy/distance;
          
          // 감속
          item.vx *= 0.8;
          item.vy *= 0.8;
        }

        // 위치 업데이트
        item.x += item.vx;
        item.y += item.vy;
      });

      // 현재 프레임 그리기
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
    <Card className="p-8 relative bg-white">
      <canvas
        ref={canvasRef}
        style={{
          width: '500px',
          height: '500px',
          display: 'block',
        }}
      />
      {currentNumber && showFinalNumber && (
        <div 
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-48 w-48 flex justify-center items-center bg-white/80 rounded-full text-8xl font-bold text-slate-700 "
          style={{
            animation: 'numberAppear 1s ease-out forwards',
            opacity: 0,
            transform: 'translate(-50%, -50%) scale(0.5)',
          }}
        >
          {currentNumber}
        </div>
      )}
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