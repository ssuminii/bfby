# 컨벤션 가이드

## 브랜치 전략

```
main        → 배포 브랜치
dev     → 개발 통합 브랜치
feat/#이슈번호-작업내용  → 기능 개발
fix/#이슈번호-작업내용   → 버그 수정
```

**예시**

```
feat/12-link-input-page
fix/34-ogimage-parse-error
```

---

## 커밋 컨벤션

```
타입: 내용 (#이슈번호)
```

**예시**

```
feat: 상품 링크 입력 화면 구현 (#12)
fix: OG 이미지 파싱 오류 수정 (#34)
```

| 타입       | 설명                                              |
| ---------- | ------------------------------------------------- |
| `feat`     | 새로운 기능 추가                                  |
| `fix`      | 버그 수정                                         |
| `docs`     | 문서 수정                                         |
| `style`    | 코드 포맷팅, 세미콜론 누락 등 코드 변경 없는 경우 |
| `refactor` | 코드 리팩토링                                     |
| `test`     | 테스트 코드 추가                                  |
| `chore`    | 패키지 매니저, 기타 설정 수정                     |
| `design`   | UI 디자인 변경                                    |
| `rename`   | 파일/폴더명 변경                                  |
| `remove`   | 파일 삭제                                         |

---

## 폴더 구조

```
src/
├── pages/
│   ├── Onboarding.jsx   # 온보딩 (/)
│   ├── Consult.jsx      # 구매 상담 멀티스텝 (/consult)
│   └── Report.jsx       # 상담 결과 리포트 (/report)
├── components/          # 재사용 공통 컴포넌트
├── constants/           # 화면 설정 상수 (리포트 타입별 테마 등)
├── mocks/               # API 응답 목데이터 ⚠️ 실제 데이터 연결되면 삭제할 것
├── utils/               # API 호출, 유틸 함수
├── App.jsx
├── index.css            # Tailwind + 디자인 토큰
└── main.jsx
```

---

## 코드 컨벤션

### 네이밍

| 대상        | 규칙             | 예시            |
| ----------- | ---------------- | --------------- |
| 컴포넌트    | PascalCase       | `LinkInput.jsx` |
| 함수 / 변수 | camelCase        | `parseProduct`  |
| 상수        | UPPER_SNAKE_CASE | `API_BASE_URL`  |
| CSS 클래스  | kebab-case       | `card-wrapper`  |

## 디자인 시스템

> Tailwind v4 기반. `index.css`의 `@theme`에 정의된 토큰을 사용할 것.
> 임의의 색상 값(`text-[#2F80FF]`) 사용 금지.

### 컬러

```jsx
// Primary
bg - blue - 500 // #2F80FF  주요 버튼, 강조
bg - blue - 600 // #1F8AE0
bg - blue - 50 // #EAF2FF  배경 강조

// Neutral
bg - gray - 50 // #F7F8FA  페이지 배경
bg - gray - 100 // #EDEFF2  카드 배경
bg - gray - 300 // #C6CBD2  border, divider
bg - gray - 500 // #B8B9BA  placeholder
bg - gray - 600 // #8B909A  보조 텍스트
bg - gray - 800 // #23262B  본문 텍스트

// Semantic
bg - success // #2FAE66  구매 추천
bg - error // #D9483D  재검토
bg - caution // #C98A2E  주의

// Report (리포트 화면 전용)
report - recommend // #D6E5FF  추천 배경 그라데이션 중간색
report - hold // #FFF4D6  보류 배경 그라데이션 중간색
report - avoid // #E2E2E2  비추천 배경 그라데이션 중간색
report - gauge - error // #DD4821  게이지 빨강 구간
report - gauge - caution // #DEB040  게이지 노랑 구간
report - gauge - info // #558EEA  게이지 파랑 구간
```

> 게이지 색은 semantic 토큰(`error` / `caution` / `info`)보다 밝습니다.
> 일러스트라 태그·버튼과 톤이 다릅니다. 섞어 쓰지 마세요.

### 타이포그래피

폰트: `SUIT` (자동 적용됨)

| 용도        | 클래스                     | 크기 |
| ----------- | -------------------------- | ---- |
| 화면 타이틀 | `text-display font-bold`   | 32px |
| 가격        | `text-price font-bold`     | 22px |
| 섹션 제목   | `text-title font-semibold` | 20px |
| 강조 텍스트 | `text-head font-bold`      | 18px |
| 본문        | `text-body1`               | 16px |
| 보조 텍스트 | `text-body2`               | 13px |
| 캡션        | `text-caption`             | 13px |

### 레이아웃

- 화면 기준: **393 × 852px** (iPhone 15)
- 좌우 여백: `px-6` (24px) 고정
- 컬럼 간격: `gap-4` (16px)

---

## PR 규칙

- PR은 하나의 이슈 단위로 작성
- 머지 전 최소 1명 리뷰 확인
- 제목 형식: `[feat] 상품 링크 입력 화면 구현 (#12)`
