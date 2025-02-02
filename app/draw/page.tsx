// app/draw/page.tsx
import LuckyDraw from "@/components/lucky-draw";

export default function DrawPage() {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          럭키 드로우 추첨
        </h2>
        <p className="text-gray-600">
          각 순위별로 버튼을 클릭하여 당첨 번호를 추첨해보세요.
        </p>
      </div>
      <LuckyDraw />
    </div>
  );
}