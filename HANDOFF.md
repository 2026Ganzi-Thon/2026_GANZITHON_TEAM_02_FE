# HANDOFF.md

> 작성: 2026-11-10 19:30 (KST) · 작성 환경: Claude (claude.ai 세션)
> 갱신: 2026-11-10 (KST) · Claude Code — GitHub·Notion·Figma 재확인 결과 반영 (서비스명 확정, 마감 일정, 브랜치 복원, 하단 내비)
> 갱신: 2026-11-10 20:20 (KST) · Claude — push·PR 현황, 디자인 확정(하단 내비 4개 탭, 팝업 X 없이 취소 버튼) 반영
> 다음 Claude Code 세션이 이어서 작업할 수 있도록 현재 상태를 정리한 문서입니다.
> 규칙은 `CLAUDE.md` / `AGENTS.md`, 상세 명세는 `docs/`를 참고하세요.

## 1. 프로젝트 개요

- 2026 간지톤 [Ari-Thon] 2팀 프론트엔드 (`2026Ganzi-Thon/2026_GANZITHON_TEAM_02_FE`)
- 학교 밖 청소년용 모바일 우선 웹앱: 컨디션 체크 → 컨디션에 맞춘 100일 작은 목표 → 지원 정보 연결 → 비공개 메모장
- 스택: React 19 · TypeScript · Vite 8 · Tailwind CSS v4 · Node 26.8.2 / npm 11.19.1
- 백엔드: 별도 팀, Supabase (BE 저장소는 2026-11-10 기준 비어 있음). 프론트는 목업 데이터로 개발
- 내 역할(팀원A·유민): 홈, 100일 목표, 비공개 메모장 + 공통 컴포넌트·디자인 토큰·모바일 레이아웃
- 서비스명: **메에일** (2026-11-09 회의에서 확정)

일정 (Notion `아리톤 관련 정보`)

| 날짜 | 내용 |
|---|---|
| ~11-18(수) | 팀 계획: 연동, 최종 회의에서 QA·제출 자료 검토 |
| **11-20(금) 23:59** | 개발 종료 + 발표자료 제출. **이후 공식 저장소 커밋 시 실격** |
| 11-21(토) | 본 행사 — 1차 심사 팀당 5분(발표 2 + 시연 2 + 질의 1). Wi-Fi 장애 대비 **오프라인 구동 환경 또는 2분 이내 시연 녹화** 필수 |

- 공식 저장소에서만 개발·배포가 인정됨 (개인 저장소 개발·배포 불인정)

참고 자료

| 자료 | 위치 |
|---|---|
| PRD, 프론트 README, 역할 분담 | Notion `2026 간지톤 [Ari-Thon] 2팀` → 기획 / 프론트 |
| 백엔드 메모 | Notion → 백엔드 ("supabase 로 진행" 한 줄뿐) |
| 디자인 | Figma `[2026 간지톤] 2팀` (fileKey `a4aWDap7YkjI72nUdnYMcn`) — `서비스 구조`(1:239), `와이어프레임`(4:197) |

## 2. 브랜치 · 커밋 현황

**원격(origin)**: `main`, `develop`, `feat/docs-setup`, `feat/common-components` — 두 작업 브랜치 모두 **push 완료, PR 리뷰 대기** (리뷰어 미지정).

| 브랜치 | 기준 | 커밋 | 상태 |
|---|---|---|---|
| `develop` | - | `62f9d60` chore: TailwindCSS 설치 및 초기 설정 (팀원B) | 최신 |
| `feat/docs-setup` | `develop` | `9c73b9f` docs: 개발 문서 및 AGENTS.md 추가<br>`22830ea` docs: CLAUDE.md 및 HANDOFF.md 추가<br>`b8fd075` docs: PRD에 확정된 서비스명 반영<br>+ docs: 디자인 확정 사항 및 작업 현황 반영 | **PR #2** (→ `develop`) |
| `feat/common-components` | `develop` | `a213769` design: 디자인 토큰 및 Pretendard 폰트 설정<br>`750cd76` feat: 공통 컴포넌트 및 모바일 레이아웃 추가<br>`a609e00` feat: 도메인 타입 및 목업 데이터 API 추가<br>`3766864` chore: 공통 컴포넌트 미리보기 페이지 추가<br>+ `7bea5d6` design: 하단 내비 4개 탭 및 팝업 취소 버튼 방식 반영 | **PR #3** (→ `develop`) |

- 그 밖에 열린 PR: #1 `develop` → `main` [Chore] Node.js, npm 버전 통일 및 Tailwind CSS 초기 설정 (팀원B)
- 2026-11-10: 새 PC(`Desktop\2026Ganzi-Thon`)에 clone 후 번들에서 두 로컬 브랜치를 복원해 push함.
- 두 브랜치는 **수정 파일이 겹치지 않음** → 어느 순서로 머지해도 충돌 없음.
- 단, `docs/`가 `feat/common-components`의 파일(`global.css` 토큰, `src/components/icons`)을 언급하므로 **두 PR을 함께 머지**하는 것이 자연스러움.
- `main`에만 있는 `.github/pull_request_template.md`는 `develop`에 아직 없음.

## 3. 완료된 문서 작업 (`feat/docs-setup`)

| 파일 | 내용 |
|---|---|
| `AGENTS.md` | AI·팀원 공통 개발 규칙 (기준 우선순위, 스택, 폴더 구조, 목업 규칙, 코드·Git 규칙, 팀 역할) |
| `docs/PRD.md` | Notion PRD 요약 + **PRD↔Figma 차이표** (개발은 Figma 기준) |
| `docs/USER_FLOW.md` | IA, 전체 유저플로우(mermaid), 로그인 시점, 100일 목표 진입 분기표, 지원 정보 분기표 |
| `docs/FUNCTION_SPEC.md` | 팀원A 화면별 기능(홈·목표·메모장·팝업), 공통 컴포넌트 목록, 데이터 타입 초안 |
| `docs/DESIGN_GUIDE.md` | Figma 변수 기반 색상·타이포·radius 토큰, 컴포넌트 규격, 에셋, 디자인 미정 사항 |
| `CLAUDE.md` | Claude Code용 요약 규칙 |
| `HANDOFF.md` | 이 문서 |

## 4. 완료된 개발 작업 (`feat/common-components`)

- **디자인 토큰**: `src/styles/global.css`에 `@import "tailwindcss"` + `@theme` 토큰 추가
  - 색상: `primary`, `primary-pressed`, `primary-soft`, `background`, `surface`, `surface-warm`, `border`, `text-main`, `text-sub`
  - 글자: `text-label`, `text-title`, `text-section`, `text-button`, `text-caption`, `text-tab`
  - 모서리: `rounded-button`(10), `rounded-card`(12), `rounded-chip`(20)
- 기존 전역 규칙(팀원B 작성)을 `@layer base`로 감쌈 — 값은 그대로, `.mobile-container` 배경만 `background` 토큰으로 변경
- **Pretendard 폰트**: `index.html`에 jsDelivr CDN `<link>` 추가
- **공통 컴포넌트 · 레이아웃 · 목업 구조** (아래 5장)
- **미리보기 페이지**: `preview.html` + `src/preview/` (개발 전용, 배포 빌드 미포함)
- **디자인 확정 반영 (2026-11-10)**: `BottomNav` 4개 탭 고정, `Modal` X 버튼 옵션 제거·`ModalActions` 취소 버튼 필수, 안 쓰게 된 `GoalIcon`·`CloseIcon` 제거
- 검증: `npm run build`, `npm run lint` 통과 (Node v22 환경), 헤드리스 크롬으로 402px·PC 화면 확인

## 5. 구현된 공통 컴포넌트

| 파일 | 컴포넌트 | 주요 Props |
|---|---|---|
| `src/components/Button.tsx` | `Button` | `variant: 'primary' \| 'secondary'`, `size: 'lg'(56px) \| 'md'(42px)`, `fullWidth`, 기본 button 속성 |
| `src/components/TextField.tsx` | `TextField` | `label?`, `tone: 'emphasis'(빨간 테두리) \| 'default'(베이지 테두리)`, 기본 input 속성 |
| `src/components/TextArea.tsx` | `TextArea` | 기본 textarea 속성 (높이 141px) |
| `src/components/Chip.tsx` | `Chip` | `selected`, `size: 'md'(42px) \| 'sm'(40px)` |
| `src/components/Modal.tsx` | `Modal` | `open`, `onClose`, `title`, `description?`, `footer?`, `children` (X 버튼 없음, portal, Esc·배경 클릭 닫기, 스크롤 잠금) |
| | `ModalActions` | `onCancel`(필수), `onConfirm`, `cancelLabel='취소'`, `confirmLabel='수정하기'`, `confirmDisabled` — 버튼이 하나인 팝업은 footer에 `Button` 직접 사용 |
| `src/components/PageTitle.tsx` | `PageTitle` | `label?`, `title`, `description?` |
| `src/components/Header.tsx` | `Header` | `showBack?`, `onBack?`, `right?` (가운데 `/sheep.png` 로고) |
| `src/components/BottomNav.tsx` | `BottomNav` | `active?: 'home'\|'memo'\|'support'\|'my'`, `onNavigate?` (홈/메모/지원/내 정보 4개 탭 고정) |
| `src/components/BottomActionArea.tsx` | `BottomActionArea` | `helperText?`, `children` |
| `src/components/icons/index.tsx` | `HomeIcon` `MemoIcon` `SearchIcon` `UserIcon` `BackIcon` | SVG props, `currentColor` |
| `src/layouts/MobileLayout.tsx` | `MobileLayout` | `header?`, `bottom?`, `children` (헤더 / 스크롤 본문 / 하단) |
| `src/utils/cn.ts` | `cn()` | className 조합 |

목업 데이터 API

| 파일 | 함수 |
|---|---|
| `src/api/mockClient.ts` | `mockResponse(data, delayMs)`, `createId(prefix)` |
| `src/api/goal.ts` | `getGoal`, `requestWeeklyPlanDraft`, `saveGoal`, `getDailyRecords`, `saveDailyRecord` |
| `src/api/memo.ts` | `getMemos`, `getMemo`, `createMemo`, `updateMemo`, `deleteMemo` |
| `src/types/index.ts` | `Condition`, `ConditionLog`, `WeeklyPlan`, `Goal`, `DayStatus`, `DailyRecord`, `Memo` |
| `src/mocks/data.ts` | `mockGoal`, `mockDailyRecords`, `mockMemos` (Figma 예시 문구) |

## 6. 디렉터리 구조 (`feat/common-components` 기준)

```text
.
├── AGENTS.md, CLAUDE.md, HANDOFF.md   # (feat/docs-setup)
├── docs/                              # (feat/docs-setup) PRD, USER_FLOW, FUNCTION_SPEC, DESIGN_GUIDE
├── index.html                         # 앱 진입점 (+ Pretendard CDN)
├── preview.html                       # 공통 컴포넌트 미리보기 (개발 전용)
├── public/sheep.png                   # 양 로고/캐릭터 (Figma 원본과 동일)
└── src
    ├── App.tsx                        # 빈 mobile-container — 팀원B(라우터) 담당, 수정 금지
    ├── main.tsx                       # global.css import
    ├── index.css, App.css             # Vite 템플릿 잔재 (import 안 됨, 그대로 둠)
    ├── styles/global.css              # Tailwind import + @theme 토큰 + @layer base
    ├── components/                    # 공통 컴포넌트 + icons/
    ├── layouts/MobileLayout.tsx
    ├── types/index.ts
    ├── mocks/data.ts
    ├── api/                           # mockClient, goal, memo
    ├── utils/cn.ts
    └── preview/                       # ComponentPreview, main
```

## 7. 실행 · 검증 방법

```bash
git checkout feat/common-components   # 컴포넌트 확인 시
npm ci
npm run dev        # http://localhost:5173/preview.html → 공통 컴포넌트 미리보기
npm run build      # tsc -b && vite build
npm run lint       # eslint
```

- Node 26.8.2 사용 (`engines` 고정). 이전 확인은 Node v22에서 진행됨 → 26.8.2에서 한 번 더 확인 필요. 새 PC도 Node v22.23.2 / npm 10.9.8이며, 이 환경에서 `npm install`을 하면 `package-lock.json`이 바뀌므로 커밋 전에 되돌린다.
- 문서만 볼 때는 `feat/docs-setup`.

## 8. 결정 사항 · 아직 결정되지 않은 사항

확정 (2026-11-10, 디자인 결정 + Figma 최신 화면 확인)

| 항목 | 결정 | 반영 |
|---|---|---|
| 하단 내비 탭 | **4개: 홈 / 메모 / 지원 / 내 정보**. 1-1·1-2·3-1·4-1·5-1 모두 4개 탭. 5개 탭은 Section 1의 이전 시안(2-2 목표 대시보드)에만 남아 있음 | `BottomNav` 4개 고정 |
| 팝업 닫기 방식 | **X 버튼 없이 하단 `취소` 버튼** (Figma ver1). 최신 팝업 6종(목표·오늘 목표·주간 계획·NEW NOTE·메모 상세) 모두 같은 형태 | `Modal` X 제거, `ModalActions` 취소 필수 |
| 라우트 경로 (11-11, 팀원B) | `/` 홈, `/goals` 목표, `/memos` 메모, `/support` 상담·기관 목록, `/mypage` 내 정보 + `/onboarding`, `/login`, `/signup` | PR #5 `AppRouter.tsx` |
| 레이아웃 그룹 (11-11 확정) | 공통 Header + BottomNav는 `/`, `/memos`, `/support`, `/mypage`에만. `/goals` 등은 단독 화면(자체 Header·하단 CTA) | `feat/layout-routing`: `TabLayout`, `paths.ts`, `AppRouter.tsx` 그룹 분리, `/goals` 연결 |
| 미사용 CSS (11-11, 팀원B) | `index.css`, `App.css` 삭제 | PR #6 |

미정 (확정 금지)

| 항목 | 현재 상태 | 결정 주체 |
|---|---|---|
| 오늘 목표 기록 방식 | 홈(1-1)은 `오늘 실천했어요` 버튼, 2-2 목표 대시보드는 체크박스 | 디자인 |
| 로고 | 서비스명은 **"메에일" 확정**(11-09). 로고는 제작 중(Figma 할 일: "로고 제작 후 서비스명 옆에 넣기") → 현재 `public/sheep.png` 사용 | 디자인 |
| 와이어프레임 미완 화면 | Figma 할 일 목록에 "0-0, 0-1, 0-4, 3-1 팝업, 4, 5", "화면 옆 기능 나열"이 남아 있음 → 해당 화면은 구현 전 재확인 | 디자인 |
| 메모 빈 목록 화면 | Figma에 없음 | 디자인 |
| 백엔드 스키마·API | BE 저장소 비어 있음, `src/types`는 프론트 초안 | 백엔드 |
| Supabase 연동 방식 | 프론트 직접 호출 vs 백엔드 API 경유 미정, `supabase-js` 미설치 | 백엔드·프론트 |
| AI 주간 계획 생성 담당 | 미정 (프론트에서 AI 키 사용 금지) | 팀 |
| 메모 잠금·암호화 (PRD Should) | 해커톤 범위 미정 | 팀 |

## 9. 주의해야 할 사항

- **`src/App.tsx`, 라우터, 인증 코드 수정 금지** (팀원B 담당).
- **백엔드 저장소는 읽기 전용.**
- 기존 브랜치·커밋 유지. commit / push / PR / merge는 사용자가 요청할 때만.
- `global.css`를 수정할 때 새 전역 규칙은 반드시 `@layer base` 안에 넣는다.
- `.gitignore`에 `.env`가 없다 (`*.local`만 있음) → 환경변수 파일은 `.env.local`로 만들거나 팀과 `.gitignore` 수정 합의.
- 탭 화면 페이지(`/`, `/memos`, `/support`, `/mypage`)는 본문만 그린다. 여기에 `MobileLayout`·`Header`를 또 쓰면 헤더가 2개가 되고, 단독 화면을 탭 그룹에 넣으면 하단 CTA가 내비에 가려진다 (11-11에 실제로 발생 → 그룹 분리로 해결).
- Figma 에셋 URL(figma.com)은 이 환경에서 다운로드가 막혀 있었음 → 아이콘은 Figma가 사용한 Iconify 아이콘과 같은 path로 구현, 로고는 `public/sheep.png` 사용.
- 미리보기 스크린샷 확인 시 폰트 CDN이 막힌 환경이면 대체 폰트로 보임 (실제 브라우저에서는 Pretendard).

- 2026-11-10 디자인 확정 반영 때 `BottomNav`의 `items`, `Modal`의 `showCloseButton` prop을 제거하고 `ModalActions`의 `onCancel`을 필수로 바꿈 (PR #3 머지 전이라 사용처 없음). 이후 공통 컴포넌트 Props 변경은 CLAUDE.md 규칙대로 **추가만** 한다.
- 이전에 있던 문서↔코드 불일치(`FUNCTION_SPEC.md` Props 표, `AGENTS.md` 폴더 구조의 `preview` 누락)는 이번에 수정함.

## 10. 다음 개발 단계 (우선순위)

(2026-11-11 기준) PR #2·#3 머지 완료. 열린 PR: #6 리뷰 반영, #5 라우터, #4 목표 설정. 로컬 준비: `feat/memo`, `feat/layout-routing`.

1. **머지 순서** — #6(팝업 버그·CSS) → #5(라우터) → #4(목표 설정) → `feat/layout-routing`(레이아웃 그룹·/goals 연결) → `feat/memo`. 모두 Squash merge. 서로 충돌 없음 확인.
2. **`feat/memo` → `/memos` 연결** — `MemosPage`가 `MemoPage`(본문만)를 그리도록 연결 (탭 화면이라 레이아웃 추가 금지).
3. **`feat/home-dashboard`** — 1-1/1-2 홈: 컨디션 카드, 오늘의 목표, 실천/쉬어가기, 오늘 목표 성공 팝업 (`saveDailyRecord`) — Must. 탭 화면이므로 본문만. 양털판(100칸)·4주 계획은 Should
4. **팀 확인 요청** — 목표 기록 방식(8장), 메모 삭제 확인 단계·빈 목록 문구, 백엔드에 `src/types` 초안 공유.
5. 백엔드 스키마 확정 후 `src/types` 조정 → `src/api` 내부를 Supabase 호출로 교체
