# Lucky Draw

**Lucky Draw**는 **Next.js (App Router)** 및 **Zustand**를 활용한 랜덤 추첨 서비스입니다.  
룰렛 방식 또는 행운의 숫자를 추첨할 수 있으며, 추첨 전 제외할 번호 등록, 등수 설정 등 사용자 정의 설정이 가능합니다.

## 기능 소개

- **룰렛 및 랜덤 숫자 추첨**  
  사용자는 랜덤한 숫자를 추첨하거나 룰렛을 통해 무작위로 당첨자를 선정할 수 있습니다.  

- **당첨자 수 지정**  
  1등, 2등, 3등으로 당첨자 수를 직접 설정할 수 있습니다.  

- **제외 숫자 설정**  
  특정 숫자를 제외한 상태에서 추첨을 진행할 수 있습니다.  

- **효율적인 상태 관리**  
  Zustand를 활용하여 애플리케이션 상태를 최적화하고 성능을 개선하였습니다.  

## 폴더 구조

```
lucky-draw/
│── .husky/                  # Pre-commit 훅 (Lint 및 Format 자동화)
│── app/                     # Next.js App Router 구조
│   ├── draw/                # 주요 추첨 기능 구현
│   ├── layout.tsx           # 글로벌 레이아웃
│   ├── page.tsx             # 메인 페이지
│── components/              # 재사용 가능한 UI 컴포넌트
│   ├── footer.tsx
│   ├── header.tsx
│── ui/                      # UI 관련 컴포넌트
│   ├── config-form.tsx
│   ├── lucky-number.tsx
│   ├── roulette-wheel.tsx
│── lib/                     # 유틸리티 함수
│── store/                   # Zustand 상태 관리
│── public/                  # 정적 파일 (SVG, 이미지 등)
│── utils/                   # 추가 유틸리티 함수
│── types/                   # 타입 정의 파일
│── styles/                  # Tailwind 글로벌 스타일
│── next.config.ts           # Next.js 설정 파일
│── tailwind.config.ts       # Tailwind 설정 파일
│── package.json             # 프로젝트 의존성 관리
```

## 기술 스택

- **프론트엔드 프레임워크:** Next.js (App Router)  
- **상태 관리:** Zustand  
- **스타일링:** Tailwind CSS, ShadCN UI, Radix UI  
- **코드 품질 관리:** ESLint, Prettier, Husky  
- **패키지 관리:** Yarn  

## 설치 및 실행 방법

1. **저장소 클론**
   ```sh
   git clone https://github.com/yourusername/lucky-draw.git
   cd lucky-draw
   ```

2. **패키지 설치**
   ```sh
   yarn install
   ```

3. **개발 서버 실행**
   ```sh
   yarn dev
   ```

4. **프로덕션 빌드**
   ```sh
   yarn build
   ```

## 기여 방법 (Contributing)

프로젝트에 기여하고 싶다면, GitHub 저장소에서 **issue** 또는 **pull request**를 제출해주시기 바랍니다.  
기여를 위한 가이드라인은 별도로 제공될 수 있습니다.

## 라이선스 (License)

이 프로젝트는 **MIT License**에 따라 배포됩니다.  
자세한 사항은 `LICENSE` 파일을 참고하시기 바랍니다.