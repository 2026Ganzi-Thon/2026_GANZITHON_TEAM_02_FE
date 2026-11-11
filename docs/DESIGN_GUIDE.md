# 디자인 가이드

> 원본: Figma `[2026 간지톤] 2팀` → `와이어프레임` 페이지의 변수(Variables)와 컴포넌트
> 코드에서는 `src/styles/global.css`의 `@theme` 토큰 이름으로만 사용합니다. hex 값을 직접 쓰지 않습니다.

## 1. 화면 기준

| 항목 | 값 |
|---|---|
| 디자인 프레임 | 402 × 874 (iPhone 기준) |
| 앱 컨테이너 | 최대 너비 430px, PC에서는 가운데 정렬 (`.mobile-container`) |
| 좌우 여백 | 40px (페이지 타이틀·하단 액션 영역 기준) |
| 팝업 너비 | 322px (내부 콘텐츠 274px, 좌우 패딩 24px) |
| 상단 헤더 높이 | 56px |
| 하단 내비 높이 | 104px |

## 2. 색상 토큰

| Figma 변수 | 값 | Tailwind 토큰 | 용도 |
|---|---|---|---|
| Primary | `#CC3F31` | `primary` | 주요 버튼, 상단 라벨, 강조 |
| Primary/Pressed | `#B83B30` | `primary-pressed` | 눌림, 포커스 테두리, 선택 칩 텍스트·테두리, 활성 탭 |
| Primary/Soft | `#FBE9E5` | `primary-soft` | 선택된 칩 배경, 배지 배경 |
| Background | `#FFFBF5` | `background` | 페이지 배경, 취소(보조) 버튼 배경 |
| Surface | `#FFFFFF` | `surface` | 카드, 입력 필드, 하단 내비 |
| Surface/Warm | `#F3E8D8` | `surface-warm` | 팝업 배경, 목표 카드 배경 |
| Border | `#E6DCD1` | `border` | 기본 테두리, 구분선 |
| Text/Main | `#332C29` | `text-main` | 본문·제목 |
| Text/Sub | `#75665E` | `text-sub` | 설명, placeholder, 비활성 탭 |
| (Figma 변수 없음) | `#F4EFE6` | `surface-muted` | 메모 영역 배경 (3-1 비공개 메모장) |
| (Figma 변수 없음) | `#594039` | `sheep` | 양 얼굴·다리 (메모 카드) |

사용 예: `bg-primary`, `text-text-main`, `border-border`, `bg-surface-warm`

## 3. 타이포그래피

폰트: **Pretendard** (CDN으로 로드)

| Figma 스타일 | 크기 / 행간 / 굵기 | Tailwind 클래스 | 사용처 |
|---|---|---|---|
| 상단 라벨 | 14 / 21 / Bold, 자간 20% | `text-label` | `TODAY`, `100-DAY PLAN`, `MY NOTE` |
| 페이지 타이틀 제목 | 20 / 28 / SemiBold | `text-title` | 페이지 제목 |
| 영역 제목 | 16 / 28 / SemiBold | `text-section` | 영역·팝업 제목 |
| 버튼 제목 | 16 / 24 / SemiBold | `text-button` | 버튼 텍스트 |
| 설명 | 12 / 22 / Regular | `text-caption` | 설명, 입력 텍스트, 칩 |
| (탭 라벨) | 10 / 22 / Regular | `text-tab` | 하단 내비 라벨 |

## 4. 모서리 · 그림자

| 요소 | radius |
|---|---|
| 주요 버튼 (56px) | 10px (`rounded-button`) |
| 팝업, 팝업 버튼(42px), 입력 필드, 카드 | 12px (`rounded-card`) |
| 선택 칩 | 20px (`rounded-chip`) |

## 5. 공통 컴포넌트 규격

| 컴포넌트 | 규격 |
|---|---|
| 주요 버튼 | 높이 56, 가로 꽉 참, `primary` 배경, 흰 글씨, radius 10 |
| 팝업 버튼 | 높이 42, radius 12. 주요: `primary` / 보조(취소): `background` 배경 + `text-main`. 왼쪽 취소 · 오른쪽 확인, 간격 18 |
| 입력 필드 | 높이 56, 좌우 패딩 16, radius 12, `surface` 배경. 페이지 입력은 `primary-pressed` 테두리, 팝업 입력은 `border` 테두리. placeholder `text-sub`, 입력 후 `text-main` |
| 메모 입력 필드 | 높이 141, radius 12, `border` 테두리 |
| 선택 칩 | 높이 42(칩1) / 40(칩2), radius 20. 미선택: `surface` + `border` + `text-main` Regular / 선택: `primary-soft` + `primary-pressed` 테두리·글씨 Bold |
| 팝업 | 너비 322, `surface-warm` 배경, `primary-pressed` 1px 테두리, radius 12, 패딩 16·24, 요소 간격 8, 액션 영역 위 16 여백. **X 버튼 없음, 하단 `취소` 버튼으로 닫기** |
| 페이지 타이틀 | 패딩 32·40, 라벨/제목/설명 간격 8 |
| 공통 헤더 | 높이 56, 하단 `border` 0.5px, 가운데 양 로고(47×31), 이전 버전은 왼쪽 40px에 뒤로가기 아이콘(15px) |
| 하단 내비 | **4개 탭(홈 / 메모 / 지원 / 내 정보)**, 높이 104, `surface` 배경, 탭 간격 30, 아이콘 24, 라벨 10px. 비활성 `text-sub` / 활성 `primary-pressed` |
| 하단 액션 영역 | 패딩 32·40, 주요 버튼 1개 (+ 위쪽 안내 문구) |

## 6. 에셋

| 에셋 | 위치 | 비고 |
|---|---|---|
| 양 로고 / 캐릭터 | `public/sheep.png` | Figma `양` 프레임과 동일 원본 (1536×1024) |
| 하단 내비·뒤로가기 아이콘 | `src/components/icons` | Figma에서 사용한 Iconify 아이콘(arcticons, bxs, grommet-icons)과 같은 path, `currentColor`로 색 지정 |

## 7. 확정 · 미확정 사항

확정 (2026-11-10)

- 팝업 닫기 방식: **X 버튼 없이 하단 `취소` 버튼** (Figma ver1). 배경 클릭·Esc로도 닫힘
- 하단 내비: **4개 탭 — 홈 / 메모 / 지원 / 내 정보** (`목표` 탭 없음, 100일 목표는 홈에서 진입)

미확정

- 디자이너 TODO: 컴포넌트 variant 정리, 로고 제작 후 서비스명 옆 배치 → 토큰·컴포넌트가 바뀌면 이 문서도 갱신
