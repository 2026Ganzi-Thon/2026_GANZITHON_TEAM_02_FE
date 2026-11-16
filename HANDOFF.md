# HANDOFF.md

> 작성: 2026-11-10 19:30 (KST) · 작성 환경: Claude (claude.ai 세션)
> 갱신: 2026-11-10 (KST) · Claude Code — GitHub·Notion·Figma 재확인 결과 반영 (서비스명 확정, 마감 일정, 브랜치 복원, 하단 내비)
> 갱신: 2026-11-10 20:20 (KST) · Claude — push·PR 현황, 디자인 확정(하단 내비 4개 탭, 팝업 X 없이 취소 버튼) 반영
> 갱신: 2026-11-11 (KST) · Claude Code — PR #2~#8 머지 완료 현황, 실제 `develop` 기준 컴포넌트·디렉터리, 미정 사항·다음 단계 반영
> 갱신: 2026-11-16 (KST) · Claude Code — PR #10~#13 머지(홈 대시보드·양털판·Figma 차이 수정), 열린 PR #14(온보딩) 영향, 미정 사항·다음 단계 반영
> 다음 Claude Code 세션이 이어서 작업할 수 있도록 현재 상태를 정리한 문서입니다.
> 규칙은 `CLAUDE.md` / `AGENTS.md`, 상세 명세는 `docs/`를 참고하세요.

## 1. 프로젝트 개요

- 2026 간지톤 [Ari-Thon] 2팀 프론트엔드 (`2026Ganzi-Thon/2026_GANZITHON_TEAM_02_FE`)
- 학교 밖 청소년용 모바일 우선 웹앱: 컨디션 체크 → 컨디션에 맞춘 100일 작은 목표 → 지원 정보 연결 → 비공개 메모장
- 스택: React 19 · TypeScript · Vite 8 · Tailwind CSS v4 · Node 26.8.2 / npm 11.19.1
- 백엔드: 별도 팀, Supabase. BE 저장소에 2026-11-16 `supabase/schema.sql`·README 추가됨 (8장 참고). 프론트는 아직 목업 데이터로 개발
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

**`develop` = `f3bcb35`** (2026-11-16 기준). 아래 PR이 모두 `develop`에 머지됨 (#2·#3·#10~#13은 merge commit, #4~#9는 Squash merge). #10~#13은 은빈님이 머지.

| PR | 제목 | `develop` 커밋 |
|---|---|---|
| #2 | [Docs] 개발 문서 및 AI 작업 규칙 추가 | `044c9bd` |
| #3 | [Feat] 디자인 토큰, 공통 컴포넌트 및 목업 데이터 API 추가 | `6a30732` |
| #6 | [Fix] 팝업 입력 포커스 버그 수정 및 미사용 CSS 삭제 | `805ba76` |
| #5 | [Feat] React Router 기반 페이지 라우팅 설정 (팀원B) | `dc2c7b3` |
| #4 | [Feat] 100일 목표 설정 화면 및 목표·주간 계획 수정 팝업 추가 | `0dc5391` |
| #7 | [Refactor] 탭 화면·단독 화면 레이아웃 분리 및 /goals 연결 | `953284b` |
| #8 | [Feat] 비공개 메모장 화면 및 메모 작성·상세·삭제 팝업 추가 | `75785f4` |
| #9 | [Docs] 머지 완료 현황 및 문서 최신화 | `ed40724` |
| #10 | [Feat] 홈 대시보드 및 오늘 목표 성공·수정 팝업 추가 | `00bdfaa` |
| #11 | [Docs] 머지 규칙을 README 기준으로 바로잡음 | `dfcf8be` |
| #12 | [Feat] 홈 '한 칸씩 내 속도로' 100칸 양털판 추가 | `6c82cc4` |
| #13 | [Design] Figma와 다른 간격·아이콘 크기·필수 표시 맞춤 | `f3bcb35` |

열린 PR

| PR | 내용 | 상태 |
|---|---|---|
| #1 | `develop` → `main` [Chore] Node.js, npm 버전 통일 및 Tailwind CSS 초기 설정 (팀원B) | 배포 직전까지 그대로 둔다 |
| #14 | [Feat] 온보딩 화면 구현 (팀원B, `feat/onboarding`, 11-16 생성) — 온보딩(인트로·컨디션·도움 선택) + 로그인·프로필 설정(카카오) 화면 | 리뷰 대기. 아래 '#14 영향' 참고 |

#14가 팀원A 영역에 주는 영향 (머지되면 확인)
- `package.json`: `@supabase/supabase-js`, `lucide-react` 추가 → 머지 후 `npm ci` 필요. `src/utils/supabase.ts`는 아직 빈 파일, `src/api/auth.ts`·`src/utils/authStorage.ts` 추가
- 공통 `MobileLayout`: `<main>`이 `flex min-h-0 flex-1 flex-col`로 바뀜 → `/goals`(단독 화면) 간격이 달라지지 않는지 확인
- `global.css`: 로고 폰트 토큰 `--font-logo`(BMKkubulim) 추가, `src/styles/fonts.css`에 Pretendard·BMKkubulim 로컬 폰트 등록 (`index.html`의 Pretendard CDN과 중복되는지 확인)
- 컨디션 선택(`onboarding/ConditionStep.tsx`)이 생김 → 홈 컨디션 카드(`getTodayCondition`) 연결 대상
- 새 작업은 항상 최신 `develop`에서 `feat/기능명` 브랜치를 새로 만든다.
- 머지 방식: README대로 **팀원 리뷰 승인 + 테스트 후에만 Squash merge**. 승인 없는 머지는 하지 않는다 (예외 없음).
- 참고: #5·#4·#7·#8·#9는 머지 범위를 잘못 이해해 리뷰 승인 전에 머지됨 → 은빈님께 사후 리뷰 요청. 지적 사항은 후속 PR로 반영한다.
- `main`에만 있는 `.github/pull_request_template.md`는 `develop`에 아직 없음 (PR 본문은 같은 형식으로 직접 작성).

## 3. 완료된 문서 작업 (PR #2)

| 파일 | 내용 |
|---|---|
| `AGENTS.md` | AI·팀원 공통 개발 규칙 (기준 우선순위, 스택, 폴더 구조, 목업 규칙, 코드·Git 규칙, 팀 역할) |
| `docs/PRD.md` | Notion PRD 요약 + **PRD↔Figma 차이표** (개발은 Figma 기준) |
| `docs/USER_FLOW.md` | IA, 전체 유저플로우(mermaid), 로그인 시점, 100일 목표 진입 분기표, 지원 정보 분기표 |
| `docs/FUNCTION_SPEC.md` | 팀원A 화면별 기능(홈·목표·메모장·팝업), 공통 컴포넌트 목록, 데이터 타입 초안 |
| `docs/DESIGN_GUIDE.md` | Figma 변수 기반 색상·타이포·radius 토큰, 컴포넌트 규격, 에셋, 디자인 미정 사항 |
| `CLAUDE.md` | Claude Code용 요약 규칙 |
| `HANDOFF.md` | 이 문서 |

## 4. 완료된 개발 작업 (`develop` 기준)

**공통 기반 (PR #3)**
- **디자인 토큰**: `src/styles/global.css`에 `@import "tailwindcss"` + `@theme` 토큰
  - 색상: `primary`, `primary-pressed`, `primary-soft`, `background`, `surface`, `surface-warm`, `border`, `text-main`, `text-sub` + 메모장용 `surface-muted`, `sheep` (PR #8)
  - 글자: `text-label`, `text-title`, `text-section`, `text-button`, `text-caption`, `text-tab`
  - 모서리: `rounded-button`(10), `rounded-card`(12), `rounded-chip`(20)
- 기존 전역 규칙(팀원B 작성)을 `@layer base`로 감쌈 — 값은 그대로, `.mobile-container` 배경만 `background` 토큰으로 변경
- **Pretendard 폰트**: `index.html`에 jsDelivr CDN `<link>`
- **공통 컴포넌트 · 레이아웃 · 목업 구조** (아래 5장)
- **디자인 확정 반영 (2026-11-10)**: `BottomNav` 4개 탭 고정, `Modal` X 버튼 옵션 제거·`ModalActions` 취소 버튼 필수, 안 쓰게 된 `GoalIcon`·`CloseIcon` 제거

**라우팅 · 레이아웃 (PR #5 팀원B, PR #7)**
- `src/routes/AppRouter.tsx`: React Router. 탭 화면(`TabLayout`)과 단독 화면 두 그룹으로 나눔 (규칙: `AGENTS.md` 4장)
- `src/routes/paths.ts`: 경로 상수 `PATHS`
- `src/layouts/TabLayout.tsx`: 공통 Header + `BottomNav`, 현재 경로로 활성 탭 표시·탭 클릭 이동
- `src/App.tsx`는 `AppRouter`만 그림

**화면**
- **100일 목표 설정 (PR #4, #7)**: `/goals` — 2-1 목표 입력 → 2-2 주간 계획 확인, 목표 수정·주간 계획 수정 팝업, 저장 후 홈 이동 (`src/pages/goal/`)
- **비공개 메모장 (PR #8)**: `/memos` — 양 모양 메모 카드 목록, 신규 메모 팝업(NEW NOTE), 상세 팝업에서 수정·삭제 (`src/pages/memo/`)
- **홈 대시보드 (PR #10)**: `/` — Figma 1-1·1-2 (`src/pages/home/`, 본문만 그림)
  - 타이틀 `TODAY` + `{닉네임} 님, …` (오늘 기록 상태에 따라 문구 변경), `ConditionCard`(괜찮아요/힘들어요)
  - `TodayGoalSection`: 오늘의 목표 + `수정하기`(오늘 목표 수정 팝업 — `GoalEditModal` 재사용), `오늘 실천했어요` → `GoalSuccessModal`, `오늘은 쉬어갈게요`
  - `GoalSuccessModal`: `해보니 어땠나요?` 칩, `대시보드로 돌아가기`, `완료 취소`
  - 이번 4주 계획: `WeeklyPlanList` + `계획 수정하기`(`WeeklyPlanEditModal`)
  - 목표가 없으면 `/goals` 안내 (문구 임시)
- **한 칸씩 내 속도로 — 100칸 양털판 (PR #12)**: 홈 '오늘의 목표' 아래 (Figma 95:428, GL-11)
  - `SheepBoard`(SVG 양, 칸 순서 위 줄부터 왼→오), `SheepProgressSection`(`N일 째` 배지 + 범례 실천/쉬어감/오늘/기록 없음), `sheepDays.ts`(시작일 기준 날짜 계산)
  - 성공 팝업의 양도 같은 `SheepBoard`로 그려 방금 채운 칸이 보임 (`assets/home/success-sheep.svg`는 미사용, 삭제 안 함)
  - 버그 수정: 새 목표 시작 시 이전 목표의 시작일을 이어받던 문제 → `createGoal` 추가(시작일 = 오늘, 1일 째부터), 시작일을 UTC로 계산해 한국 시간 새벽에 하루 밀리던 문제 → `todayKey()` 사용
- **Figma 차이 수정 (PR #13)**: 2-1 라벨 뒤 빨간 필수 `*`, 라벨-입력칸 8px, 입력 팝업 4종·메모 상세의 입력칸-버튼 간격 32px, 하단 내비 아이콘 Figma 크기

**기타**
- **팝업 입력 포커스 버그 수정 (PR #6)**: `Modal`이 부모 리렌더링마다 포커스를 다시 가져가던 문제 수정 (Props 변경 없음)
- **미사용 CSS 삭제 (PR #6)**: Vite 템플릿 `src/index.css`, `src/App.css` 삭제
- **미리보기 페이지**: `preview.html` + `src/preview/` (개발 전용, 배포 빌드 미포함) — `/preview.html` 공통 컴포넌트, `?page=goal-setting`, `?page=memo`
- 검증: 각 머지 후 `npm ci` → `npm run build` → `npm run lint` 통과 (Node v22.23.2 환경), 브라우저 402px에서 화면 확인

## 5. 구현된 공통 컴포넌트

| 파일 | 컴포넌트 | 주요 Props |
|---|---|---|
| `src/components/Button.tsx` | `Button` | `variant: 'primary' \| 'secondary'`, `size: 'lg'(56px) \| 'md'(42px)`, `fullWidth`, 기본 button 속성 |
| `src/components/TextField.tsx` | `TextField` | `label?: ReactNode`(#13에서 string → ReactNode), `tone: 'emphasis'(빨간 테두리) \| 'default'(베이지 테두리)`, 기본 input 속성 |
| `src/components/TextArea.tsx` | `TextArea` | 기본 textarea 속성 (높이 141px) |
| `src/components/Chip.tsx` | `Chip` | `selected`, `size: 'md'(42px) \| 'sm'(40px)` |
| `src/components/Modal.tsx` | `Modal` | `open`, `onClose`, `title`, `description?`, `footer?`, `children`, `paddingClassName?`(기본 `px-6 py-4`, #12) (X 버튼 없음, portal, Esc·배경 클릭 닫기, 스크롤 잠금) |
| | `ModalActions` | `onCancel`(필수), `onConfirm`, `cancelLabel='취소'`, `confirmLabel='수정하기'`, `confirmDisabled` — 버튼이 하나인 팝업은 footer에 `Button` 직접 사용 |
| `src/components/PageTitle.tsx` | `PageTitle` | `label?`, `title`, `description?`, `children?`(#10 — 타이틀 영역 안 추가 내용) |
| `src/components/Header.tsx` | `Header` | `showBack?`, `onBack?`, `right?` (가운데 `/sheep.png` 로고) |
| `src/components/BottomNav.tsx` | `BottomNav` | `active?: 'home'\|'memo'\|'support'\|'my'`, `onNavigate?` (홈/메모/지원/내 정보 4개 탭 고정) |
| `src/components/BottomActionArea.tsx` | `BottomActionArea` | `helperText?`, `children` |
| `src/components/TextButton.tsx` | `TextButton` | 기본 button 속성 — 밑줄 링크형 버튼 (목표 수정하기, 계획 수정하기 등) |
| `src/components/WeeklyPlanList.tsx` | `WeeklyPlanList` | `plans: WeeklyPlan[]` — 왼쪽 빨간 선 주간 계획 목록, 4주차는 `4주차 이후`로 표시 |
| `src/components/icons/index.tsx` | `HomeIcon` `MemoIcon` `SearchIcon` `UserIcon` `BackIcon` | SVG props, `currentColor` |
| `src/layouts/MobileLayout.tsx` | `MobileLayout` | `header?`, `bottom?`, `children` (헤더 / 스크롤 본문 / 하단) — 단독 화면용 |
| `src/layouts/TabLayout.tsx` | `TabLayout` | Props 없음 (라우트 레이아웃). 공통 Header + `BottomNav`, 활성 탭·탭 이동 처리 — 탭 화면용 |
| `src/utils/cn.ts` | `cn()` | className 조합 |
| `src/utils/date.ts` | `todayKey()`, `formatMonthDayTime()`, `formatFullDateTime()` | 오늘 날짜 키(기기 시간 `YYYY-MM-DD`), 메모 날짜·시간 표시 |
| `src/routes/paths.ts` | `PATHS` | 경로 상수 (`home`, `goals`, `memos`, `support`, `mypage`, `onboarding`, `login`, `signup`) |

목업 데이터 API

| 파일 | 함수 |
|---|---|
| `src/api/mockClient.ts` | `mockResponse(data, delayMs)`, `createId(prefix)` |
| `src/api/goal.ts` | `getGoal`, `requestWeeklyPlanDraft`, `createGoal`(새 목표, 시작일 = 오늘), `saveGoal`(기존 목표 수정, 시작일 유지), `getDailyRecords`, `saveDailyRecord` |
| `src/api/memo.ts` | `getMemos`, `getMemo`, `createMemo`, `updateMemo`, `deleteMemo` |
| `src/api/condition.ts` | `getTodayCondition` — 목업, **팀원B 컨디션 저장과 연결 필요** |
| `src/api/profile.ts` | `getProfile` — 목업(닉네임 `구름`), **초기 설정 프로필과 연결 필요** |
| `src/types/index.ts` | `Condition`, `ConditionLog`, `WeeklyPlan`, `Goal`, `DayStatus`, `DailyRecord`, `Profile`, `Memo` |
| `src/mocks/data.ts` | `mockGoal`(시작일 2026-10-01), `mockDailyRecords`, `mockMemos` 등 (Figma 예시 문구) |

## 6. 디렉터리 구조 (`develop` `f3bcb35` 기준)

```text
.
├── AGENTS.md, CLAUDE.md, HANDOFF.md   # 작업 규칙·인수인계
├── docs/                              # PRD, USER_FLOW, FUNCTION_SPEC, DESIGN_GUIDE
├── index.html                         # 앱 진입점 (+ Pretendard CDN)
├── preview.html                       # 미리보기 진입점 (개발 전용)
├── public/sheep.png                   # 양 로고/캐릭터 (Figma 원본과 동일)
└── src
    ├── App.tsx                        # AppRouter만 그림 (팀원B)
    ├── main.tsx                       # global.css import
    ├── styles/global.css              # Tailwind import + @theme 토큰 + @layer base
    ├── routes/                        # AppRouter(라우트·레이아웃 그룹), paths(PATHS)
    ├── layouts/                       # MobileLayout(단독 화면), TabLayout(탭 화면)
    ├── components/                    # 공통 컴포넌트 + icons/ (TextButton, WeeklyPlanList 포함)
    ├── pages/
    │   ├── HomePage, GoalsPage, MemosPage, SupportPage, MyPage   # 라우트 진입 페이지
    │   ├── OnboardingPage, LoginPage, SignupPage, NotFoundPage   # 팀원B placeholder
    │   ├── goal/                      # 100일 목표 설정 (GoalSettingPage, 단계·팝업)
    │   ├── home/                      # 홈 대시보드 (HomeDashboard, ConditionCard, TodayGoalSection, GoalSuccessModal, SheepBoard, SheepProgressSection, sheepDays)
    │   └── memo/                      # 비공개 메모장 (MemoPage, 카드·팝업)
    ├── types/index.ts
    ├── mocks/data.ts
    ├── api/                           # mockClient, goal, memo, condition, profile
    ├── utils/                         # cn, date
    ├── assets/home/                   # 컨디션 아이콘 SVG, success-sheep.svg(미사용)
    ├── assets/vite.svg                # Vite 템플릿 잔재
    └── preview/                       # ComponentPreview, PagePreview, main
```

`src/index.css`, `src/App.css`(Vite 템플릿)는 PR #6에서 삭제됨.

## 7. 실행 · 검증 방법

```bash
git switch develop && git pull
npm ci             # ⚠️ node_modules를 통째로 지움 (node_modules/.cache 안 파일 포함)
npm run dev        # http://localhost:5173 앱, /preview.html 공통 컴포넌트, /preview.html?page=goal-setting|memo 페이지
npm run build      # tsc -b && vite build
npm run lint       # eslint
```

- Node 26.8.2 사용 (`engines` 고정). 지금까지 확인은 Node v22에서 진행됨 → 26.8.2에서 한 번 더 확인 필요. 유민 PC는 Node v22.23.2 / npm 10.9.8이며, 이 환경에서 `npm install`을 하면 `package-lock.json`이 바뀌므로 커밋 전에 되돌린다.
- 개발 서버가 켜져 있으면 `npm ci`가 파일 잠금(EPERM)으로 실패하므로 먼저 끈다.

## 8. 결정 사항 · 아직 결정되지 않은 사항

확정 (2026-11-10, 디자인 결정 + Figma 최신 화면 확인)

| 항목 | 결정 | 반영 |
|---|---|---|
| 하단 내비 탭 | **4개: 홈 / 메모 / 지원 / 내 정보**. 1-1·1-2·3-1·4-1·5-1 모두 4개 탭. 5개 탭은 Section 1의 이전 시안(2-2 목표 대시보드)에만 남아 있음 | `BottomNav` 4개 고정 |
| 팝업 닫기 방식 | **X 버튼 없이 하단 `취소` 버튼** (Figma ver1). 최신 팝업 6종(목표·오늘 목표·주간 계획·NEW NOTE·메모 상세) 모두 같은 형태 | `Modal` X 제거, `ModalActions` 취소 필수 |
| 라우트 경로 (11-11, 팀원B) | `/` 홈, `/goals` 목표, `/memos` 메모, `/support` 상담·기관 목록, `/mypage` 내 정보 + `/onboarding`, `/login`, `/signup` | PR #5 `AppRouter.tsx` |
| 레이아웃 그룹 (11-11 확정) | 공통 Header + BottomNav는 `/`, `/memos`, `/support`, `/mypage`에만. `/goals` 등은 단독 화면(자체 Header·하단 CTA) | PR #7: `TabLayout`, `paths.ts`, `AppRouter.tsx` 그룹 분리, `/goals` 연결 |
| 미사용 CSS (11-11, 팀원B) | `index.css`, `App.css` 삭제 | PR #6 |
| 홈 기록 상태 vs 컨디션 (11-15) | Figma 1-2 두 화면: 타이틀·목표 영역은 **기록 상태**(실천/쉬어감), 카드는 **컨디션**을 따름 | PR #10 |
| 오늘의 목표 수정 범위 (11-15) | 100일 목표가 아니라 **오늘 목표(`todayGoal`)만** 수정 | PR #10 |
| 양털판 칸 순서 (11-16) | 1칸 = 목표 시작일, 위 줄부터 왼쪽 → 오른쪽. 새 목표는 1일 째부터 | PR #12 |

미정 (확정 금지)

| 항목 | 현재 상태 | 결정 주체 |
|---|---|---|
| 오늘 목표 기록 방식 | 홈(1-1)은 `오늘 실천했어요` 버튼, 2-2 목표 대시보드는 체크박스 | 디자인 |
| 로고 | 서비스명은 **"메에일" 확정**(11-09). 로고는 제작 중(Figma 할 일: "로고 제작 후 서비스명 옆에 넣기") → 현재 `public/sheep.png` 사용 | 디자인 |
| 와이어프레임 미완 화면 | Figma 할 일 목록에 "0-0, 0-1, 0-4, 3-1 팝업, 4, 5", "화면 옆 기능 나열"이 남아 있음 → 해당 화면은 구현 전 재확인 | 디자인 |
| 메모 빈 목록 문구 | Figma에 빈 상태 화면 없음 → `MemoPage`에 임시 문구 | 디자인 |
| 메모 삭제 확인 단계 | Figma에 확인 화면 없음 → 지금은 `삭제하기`를 누르면 바로 삭제 | 디자인 |
| 신규 메모 placeholder 문구 | Figma 그대로 `예) 나에게 맞는 생활 리듬 만들기` (목표 문구와 같음) → 메모용 문구로 바꿀지 확인 | 디자인 |
| 팝업 높이 (작은 화면) | 메모 상세 팝업 약 490px, 주간 계획 수정 팝업 약 534px, 성공 팝업 542px. 320×568에서는 화면 안에 들어옴(#13 확인). 그보다 짧은 화면은 미확인 | 디자인·프론트 |
| 힘들어요일 때 더 작은 목표 | 데이터 없음 → 지금은 컨디션과 상관없이 같은 오늘 목표 | 디자인·팀 |
| 쉬어감 되돌리기 / 성공 팝업 닫은 뒤 완료 취소 | Figma 1-2에 없음 → 지금은 불가 | 디자인 |
| 목표 없음 홈 문구·버튼 | Figma에 화면 없음 → 임시 | 디자인 |
| 양털판 실천·기록 없음 칸 색 | 실천(`surface` 흰색)과 기록 없음(`background` 크림)이 화면에서 거의 같아 보임 → Figma 색 재확인 | 디자인 |
| `해보니 어땠나요?` 피드백 사용처 | 칩 선택값을 저장만 함 ("다음 목표 분량 참고") — 실제 반영 방식 미정 | 팀 |
| 백엔드 스키마 ↔ `src/types` | BE 저장소에 `supabase/schema.sql`·README 추가됨(11-16 03:38 KST). 테이블 `profiles`, `conditions`(`OK`/`HARD`), `goals`(`DRAFT`→`ACTIVE`→`ENDED`), `goal_weeks`, `daily_records`(오늘 것만 수정), `memos`, `support_programs`, `support_organizations`, RPC `get_home_summary()`. 프론트 타입과 값이 다름(예: 컨디션 `good`/`hard` ↔ `OK`/`HARD`) → 맞추는 작업 필요 | 백엔드·프론트 |
| Supabase 연동 방식 | BE README 기준 **프론트가 `supabase-js`로 직접 호출(anon key) + RLS, 카카오 로그인** — 팀 확정 여부는 확인 필요 (CLAUDE.md 8장은 아직 '미정'). `supabase-js`는 #14에서 추가 예정(`src/utils/supabase.ts`는 아직 빈 파일) | 백엔드·프론트 |
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

(2026-11-16 기준) PR #2~#13 머지 완료 — 팀원A 화면(홈·100일 목표·메모장)은 목업 기준으로 모두 구현됨. 열린 PR은 #1, #14. 마감 **11-20(금) 23:59** (11-18 최종 회의에서 QA·제출 자료 검토).

1. **#14 머지 후 확인** — `npm ci`(새 패키지) → build·lint, `/goals`·메모 팝업 등 `MobileLayout`/폰트 변경 영향 확인, 문제 있으면 후속 PR
2. **컨디션·닉네임 연동** — 온보딩 컨디션 선택(#14)과 초기 설정 닉네임의 저장 위치가 정해지면 `getTodayCondition()`·`getProfile()` 내부만 바꾼다 (화면 코드는 그대로)
3. **Supabase 전환** — BE `schema.sql`(11-16)에 맞춰 `src/types` 조정 → `src/api` 함수 내부만 Supabase 호출로 교체 (홈은 RPC `get_home_summary()` 사용 검토). #14 머지 후 `src/utils/supabase.ts` 클라이언트를 같이 쓴다
4. **시연 준비** — 전체 흐름 QA(온보딩 → 홈 → 목표 → 메모), Node 26.8.2에서 build 확인, 오프라인 구동 환경 또는 2분 이내 시연 녹화

팀 확인 요청: 8장 미정 사항(기록 방식, 힘들어요 목표, 양털판 칸 색, 메모 관련), 백엔드에 `src/types` 초안 공유.
