import ConfigForm from "@/components/config-form";


export default function Home() {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">럭키 드로우에 오신 것을 환영합니다</h2>
        <p className="text-gray-600">
          아래에서 추첨 설정을 입력하고 각 순위별 당첨 번호를 생성해보세요.
        </p>
      </div>
      <ConfigForm />
    </div>
  );
}