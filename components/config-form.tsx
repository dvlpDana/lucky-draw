'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useLuckyDrawStore } from '@/store/lucky-draw-store';
import { DrawType } from '@/type/lucky-draw';

const ConfigForm = () => {
  const router = useRouter();
  const setDrawConfig = useLuckyDrawStore((state) => state.setDrawConfig);
  
  const [formData, setFormData] = useState({
    startNumber: 1,
    endNumber: 100,
    excludedNumbers: '',
    ranks: [{ rank: 1, count: 1 }],
    drawType: 'roulette'
  });
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const excludedNumbers = formData.excludedNumbers
      ? formData.excludedNumbers.split(',').map(n => parseInt(n.trim()))
      : [];

    setDrawConfig(
      { start: formData.startNumber, end: formData.endNumber },
      excludedNumbers,
      formData.ranks,
      formData.drawType as 'roulette' | 'number'
    );

    router.push('/draw');
  };
  
  const addRank = () => {
    setFormData(prev => ({
      ...prev,
      ranks: [...prev.ranks, { rank: prev.ranks.length + 1, count: 1 }]
    }));
  };
  
  const updateRank = (index: number, field: 'rank' | 'count', value: number) => {
    setFormData(prev => ({
      ...prev,
      ranks: prev.ranks.map((rank, i) => 
        i === index ? { ...rank, [field]: parseInt(String(value)) } : rank
      )
    }));
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>럭키 드로우 설정</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="startNumber">시작 번호</Label>
              <Input
                id="startNumber"
                type="number"
                value={formData.startNumber}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  startNumber: parseInt(e.target.value)
                }))}
                min="1"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endNumber">마지막 번호</Label>
              <Input
                id="endNumber"
                type="number"
                value={formData.endNumber}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  endNumber: parseInt(e.target.value)
                }))}
                min="1"
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="excludedNumbers">제외할 번호 (쉼표로 구분)</Label>
            <Input
              id="excludedNumbers"
              type="text"
              value={formData.excludedNumbers}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                excludedNumbers: e.target.value
              }))}
              placeholder="1, 2, 3"
            />
          </div>

          <div className="space-y-2">
            <Label>추첨 방식</Label>
            <RadioGroup
              defaultValue="roulette"
              onValueChange={(value: DrawType) => setFormData(prev => ({
                ...prev,
                drawType: value
              }))}
              className="flex gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="roulette" id="roulette" />
                <Label htmlFor="roulette">룰렛 휠</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="number" id="number" />
                <Label htmlFor="number">행운의 번호</Label>
              </div>
            </RadioGroup>
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label className="text-lg">순위 설정</Label>
              <Button
                type="button"
                variant="outline"
                onClick={addRank}
              >
                순위 추가
              </Button>
            </div>
            
            {formData.ranks.map((rank, index) => (
              <Card key={index}>
                <CardContent className="grid grid-cols-2 gap-4 pt-6">
                  <div className="space-y-2">
                    <Label htmlFor={`rank-${index}`}>순위</Label>
                    <Input
                      id={`rank-${index}`}
                      type="number"
                      value={rank.rank}
                      onChange={(e) => updateRank(index, 'rank', parseInt(e.target.value))}
                      min="1"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`count-${index}`}>당첨자 수</Label>
                    <Input
                      id={`count-${index}`}
                      type="number"
                      value={rank.count}
                      onChange={(e) => updateRank(index, 'count', parseInt(e.target.value))}
                      min="1"
                      required
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <Button type="submit" className="w-full">
            설정 완료
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ConfigForm;