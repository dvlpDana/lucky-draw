'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Minus, Plus, Trash2 } from 'lucide-react';
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
  
  const [inputValues, setInputValues] = useState({
    startNumber: formData.startNumber.toString(),
    endNumber: formData.endNumber.toString(),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.endNumber > 300) {
      alert("마지막 번호는 300 이하여야 합니다.");
      return;
    }

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
    if (formData.ranks.length >= 10) {
      alert("순위는 최대 10개까지만 설정할 수 있습니다.");
      return;
    }

    setFormData(prev => ({
      ...prev,
      ranks: [...prev.ranks, { rank: prev.ranks.length + 1, count: 1 }]
    }));
  };

  const removeRank = (index: number) => {
    setFormData(prev => {
      // 삭제할 순위보다 높은 순위들의 번호를 1씩 감소
      const updatedRanks = prev.ranks
        .filter((_, i) => i !== index)
        .map((rank, i) => ({
          ...rank,
          rank: i + 1
        }));

      return {
        ...prev,
        ranks: updatedRanks
      };
    });
  };

  const updateCount = (index: number, increment: boolean) => {
    setFormData(prev => ({
      ...prev,
      ranks: prev.ranks.map((rank, i) => {
        if (i !== index) return rank;
        
        const newCount = increment ? rank.count + 1 : Math.max(1, rank.count - 1);
        return { ...rank, count: newCount };
      })
    }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;

    // Allow empty value while typing
    setInputValues(prev => ({ ...prev, [id]: value }));
  };

  const handleInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    const numValue = value === "" ? null : parseInt(value, 10);

    if (id === "startNumber") {
      setFormData(prev => ({ ...prev, startNumber: numValue ?? prev.startNumber }));
    } else if (id === "endNumber") {
      if (numValue !== null && numValue > 300) {
        alert("마지막 번호는 300 이하여야 합니다.");
        setInputValues(prev => ({ ...prev, endNumber: "300" })); // Reset to max limit
        setFormData(prev => ({ ...prev, endNumber: 300 }));
      } else {
        setFormData(prev => ({ ...prev, endNumber: numValue ?? prev.endNumber }));
      }
    }
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
                value={inputValues.startNumber}
                onChange={handleInputChange}
                onBlur={handleInputBlur}
                min={1}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endNumber">마지막 번호</Label>
              <Input
                id="endNumber"
                type="number"
                value={inputValues.endNumber}
                onChange={handleInputChange}
                onBlur={handleInputBlur}
                min={1}
                max={300}
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
                <Label htmlFor="roulette" className="text-base font-normal">룰렛 휠</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="number" id="number" />
                <Label htmlFor="number" className="text-base font-normal">행운의 번호</Label>
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
              <Card key={index} className="overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex flex-col sm:flex-row gap-4">
                    {/* 모바일: 순위 & 삭제버튼 한 줄 */}
                    <div className="flex items-center justify-between sm:justify-start gap-2">
                      <div className="flex items-center gap-2">
                        <Label className="w-12">순위</Label>
                        <div className="h-10 w-20 flex items-center justify-center border rounded-md">
                          {rank.rank}등
                        </div>
                      </div>
                      {/* 삭제 버튼 - 모바일에서는 여기에 */}
                      {formData.ranks.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeRank(index)}
                          className="h-10 w-10 flex-shrink-0 text-red-500 hover:text-red-600 hover:bg-red-50 sm:hidden"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    
                    {/* 당첨자 수 조절 */}
                    <div className="flex items-center gap-2">
                      <Label className="w-20">당첨자 수</Label>
                      <div className="flex items-center gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => updateCount(index, false)}
                          className="h-10 w-10 flex-shrink-0"
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <div className="h-10 w-16 flex items-center justify-center border rounded-md bg-background">
                          {rank.count}명
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => updateCount(index, true)}
                          className="h-10 w-10 flex-shrink-0"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {/* 삭제 버튼 - 데스크톱에서는 여기에 */}
                    {formData.ranks.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeRank(index)}
                        className="hidden sm:flex h-10 w-10 flex-shrink-0 text-red-500 hover:text-red-600 hover:bg-red-50 ml-auto"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
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