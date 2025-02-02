'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLuckyDrawStore } from '@/store/lucky-draw-store';
import LuckyResultModal from './lucky-result-modal';

const LuckyDraw = () => {
  const router = useRouter();
  const store = useLuckyDrawStore();
  const [modalState, setModalState] = useState({
    isOpen: false,
    currentRank: null as number | null
  });

  const handleDrawComplete = (drawnNumber: number) => {
    if (modalState.currentRank !== null) {
      const currentResults = store.results[modalState.currentRank] || [];
      store.setResults(modalState.currentRank, [...currentResults, drawnNumber]);
    }
  };

  // 사용 가능한 번호 목록 생성
  const getAvailableNumbers = () => {
    const usedNumbers = new Set([
      ...store.excludedNumbers,
      ...Object.values(store.results).flat()
    ]);
    
    const numbers = [];
    for (let i = store.range.start; i <= store.range.end; i++) {
      if (!usedNumbers.has(i)) {
        numbers.push(i);
      }
    }
    return numbers;
  };

  const getRemainingCount = (rank: number) => {
    const results = store.results[rank] || [];
    const rankInfo = store.ranks.find(r => r.rank === rank);
    return rankInfo ? rankInfo.count - results.length : 0;
  };

  const getRankDrawCount = (rank: number) => {
    const results = store.results[rank] || [];
    const rankInfo = store.ranks.find(r => r.rank === rank);
    return rankInfo ? `(${results.length}/${rankInfo.count}명)` : '';
  };

  const isRankCompleted = (rank: number) => {
    const results = store.results[rank] || [];
    const rankInfo = store.ranks.find(r => r.rank === rank);
    return rankInfo ? results.length >= rankInfo.count : false;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>
            럭키 드로우 추첨
            <span className="ml-2 text-sm text-gray-500 font-normal">
              ({store.drawType === 'roulette' ? '룰렛 휠' : '행운의 번호'} 모드)
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {store.ranks.map((rank) => (
              <Button
                key={rank.rank}
                onClick={() => setModalState({
                  isOpen: true,
                  currentRank: rank.rank
                })}
                disabled={isRankCompleted(rank.rank)}
                className="w-full"
                variant={isRankCompleted(rank.rank) ? "outline" : "default"}
              >
                {rank.rank}등 추첨하기 {getRankDrawCount(rank.rank)}
              </Button>
            ))}
          </div>

          {Object.entries(store.results).length > 0 && (
            <div className="mt-8 space-y-4">
              <h3 className="text-lg font-medium">추첨 결과</h3>
              {store.ranks.map((rank) => {
                const numbers = store.results[rank.rank] || [];
                if (numbers.length === 0) return null;
                
                return (
                  <Card key={rank.rank}>
                    <CardContent className="pt-6">
                      <div className="font-medium">{rank.rank}등</div>
                      <div className="mt-2 text-slate-600">
                        {numbers.join(', ')}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}

          <div className="mt-6">
            <Button
              variant="outline"
              onClick={() => {
                store.reset();
                router.push('/');
              }}
              className="w-full"
            >
              처음으로 돌아가기
            </Button>
          </div>
        </CardContent>
      </Card>

      {modalState.currentRank !== null && (
        <LuckyResultModal
          isOpen={modalState.isOpen}
          onClose={() => setModalState({ isOpen: false, currentRank: null })}
          rank={modalState.currentRank}
          remainingCount={getRemainingCount(modalState.currentRank)}
          onDrawComplete={handleDrawComplete}
          numbers={getAvailableNumbers()}
          drawType={store.drawType}
        />
      )}
    </div>
  );
};

export default LuckyDraw;