'use client';

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check } from 'lucide-react';
import { useLuckyDrawStore } from '@/store/lucky-draw-store';
import RouletteWheel from './roulette-wheel';
import LuckyNumber from './lucky-number';

interface LuckyResultModalProps {
  isOpen: boolean;
  onClose: () => void;
  rank: number;
  remainingCount: number;
  onDrawComplete: (number: number) => void;
  numbers: number[];
  drawType: 'roulette' | 'number';
}

const LuckyResultModal = ({
  isOpen,
  onClose,
  rank,
  remainingCount,
  onDrawComplete,
  numbers,
  drawType
}: LuckyResultModalProps) => {
  const store = useLuckyDrawStore();
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentNumber, setCurrentNumber] = useState<number | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsDrawing(false);
      setCurrentNumber(null);
      setIsCompleted(false);
    }
  }, [isOpen]);

  const handleDrawComplete = (drawnNumber: number) => {
    setIsDrawing(false);
    setIsCompleted(true);
    onDrawComplete(drawnNumber);
  };

  const generateNumber = () => {
    const randomIndex = Math.floor(Math.random() * numbers.length);
    return numbers[randomIndex];
  };

  const startDrawing = () => {
    if (isDrawing) return;
    setIsCompleted(false);
    const nextNumber = generateNumber();
    setCurrentNumber(nextNumber);
    setIsDrawing(true);

    setTimeout(() => {
      handleDrawComplete(nextNumber);
    }, 8000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader className="space-y-2">
          <DialogTitle className="flex items-center gap-2">
            {rank}등 추첨 {isCompleted ? '완료!' : '중...'} 
            {isCompleted && <Check className="w-5 h-5 text-green-500" />}
            <span className="ml-2 text-base font-normal text-gray-500">
              (남은 추첨: {remainingCount}명)
            </span>
          </DialogTitle>

        {/* Display numbers categorized by rank with styles */}
          {Object.keys(store.results).length > 0 && (
            <div className="py-2">
              <div className="text-sm font-medium text-gray-600">🏆 등수별 추첨 결과</div>
              <div className="flex items-center gap-2 mt-4">
                {Object.entries(store.results)
                  .sort(([rankA], [rankB]) => Number(rankA) - Number(rankB)) // Sort by rank order
                  .map(([rankKey, numbers]) => (
                    <div key={rankKey} className="text-gray-700 flex items-center gap-2">
                      <span className="font-semibold">{rankKey}등:</span>
                      <div className="flex flex-wrap gap-2">
                        {numbers.map((number: number, index: number) => (
                          <div
                            key={index}
                            className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full font-medium"
                          >
                            {number}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

        </DialogHeader>

        {drawType === 'roulette' ? (
          <div className="flex justify-center">
            <RouletteWheel
              numbers={numbers}
              isSpinning={isDrawing}
              currentNumber={currentNumber}
            />
          </div>
        ) : (
          <div className="flex justify-center">
            <LuckyNumber
              numbers={numbers}
              isSpinning={isDrawing}
              currentNumber={currentNumber}
            />
          </div>
        )}

        <div className="flex justify-center gap-4">
          {remainingCount !== 0 && (
            <Button 
              onClick={startDrawing} 
              disabled={isDrawing}
              size="lg"
            >
              추첨하기
            </Button>
          )}
          {!isCompleted ? (
            <Button 
              variant="outline" 
              onClick={onClose}
              size="lg"
            >
              닫기
            </Button>
          ) : (
            <Button 
              variant="outline" 
              onClick={onClose}
              size="lg"
              className="w-32"
            >
              확인
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LuckyResultModal;
