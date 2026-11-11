# 기능명세 (프론트엔드)

> 기준: Figma `[2026 간지톤] 2팀` 와이어프레임 + Notion PRD 9장(MoSCoW)
> 기능 ID(HM-01 등)는 PRD의 기능 ID와 같습니다. 백엔드(Supabase) 연동 전까지 모든 데이터는 `src/api` → `src/mocks` 목업으로 동작합니다.

## 0. 담당

| 영역 | 담당 | 상태 |
|---|---|---|
| 공통 컴포넌트 · 디자인 토큰 · 모바일 레이아웃 | 팀원A (유민) | 완료 (PR #3, #7) |
| 2 100일 목표 — 목표 설정(2-1·2-2) | 팀원A (유민) | 완료 (PR #4, #7) |
| 3 비공개 메모장 | 팀원A (유민) | 완료 (PR #8) |
| 1 홈 | 팀원A (유민) | 대기 (다음 작업: `feat/home-dashboard`) |
| 0 시작 / 4 지원 정보 / 5 내 정보 | 팀원B (은빈) | 대기 (placeholder 페이지만 있음) |
| React Router | 팀원B (은빈) | 완료 (PR #5, 레이아웃 그룹은 PR #7) |
| 인증 라우트 | 팀원B (은빈) | 대기 |

---

## 1. 홈 — 1-1 / 1-2 홈 대시보드 (팀원A)

| 영역 | 내용 | 기능 ID | 우선순위 |
|---|---|---|---|
| 페이지 타이틀 | `TODAY` 라벨 + `{닉네임} 님, 오늘도 반가워요` | - | Must |
| 오늘의 컨디션 카드 | 오늘 선택한 컨디션(괜찮아요/힘들어요) 표시 | HM-01 | Must |
| 오늘의 목표 | 목표 제목·설명 카드, `수정하기` 링크(오늘 목표 수정 팝업) | HM-02 | Must |
| 실천 기록 | `오늘 실천했어요` 버튼 → 오늘 목표 성공 팝업 / `오늘은 쉬어갈게요` 링크 | GL-08, GL-09 | Must |
| 한 칸씩 내 속도로 | 100칸 양털판 + `N일 째` 배지. 상태: 실천 / 쉬어감 / 오늘 / 기록 없음 | GL-11 | Should |
| 이번 4주 계획 | 1~4주차 계획 목록, `계획 수정하기` 링크(주간 계획 수정 팝업) | GL-06, GL-07 | Should |
| 하단 내비 | `홈` 탭 활성 | - | Must |

화면 상태

- 목표 없음 → 오늘의 목표 영역 대신 목표 설정(2-1)으로 이동 유도
- 목표 기록 후(1-2) → 오늘의 목표 영역이 완료 상태로 바뀜 (괜찮아요/힘들어요 버전)
- 힘들어요 → 오늘의 목표가 더 작은 목표로 표시

### 팝업

| 팝업 | 내용 |
|---|---|
| 오늘 목표 수정 | 제목 `오늘의 목표 수정하기`, 입력 필드 1개, `취소` / `수정하기` |
| 오늘 목표 성공 | `오늘의 털 한 칸을 채웠어요!`, 양털판, `해보니 어땠나요?`(선택: 이 정도면 괜찮아요 / 아직 부담돼요), `대시보드로 돌아가기`, `완료 취소` 링크 |
| 주간 계획 수정 | 제목 `주간 계획 수정하기`, 1~4주차 입력, `취소` / `수정하기` |

> 팝업 닫기 방식 (2026-11-10 확정): **X 버튼 없이 하단 `취소` 버튼**으로 닫는다. 버튼이 하나인 팝업(오늘 목표 성공 팝업)은 `대시보드로 돌아가기` 버튼과 배경 클릭으로 닫는다.

---

## 2. 100일 목표 (팀원A)

### 2-1 목표 설정 (1/2)

| 영역 | 내용 | 기능 ID |
|---|---|---|
| 페이지 타이틀 | `100-DAY PLAN | 1/2`, `앞으로 어떤 일상을 만들고 싶나요?` | - |
| 목표 입력 | `100일 동안 이어가고 싶은 목표` 입력 필드 | GL-03 |
| 하단 | 안내 문구 `내용은 언제든 다시 바꿀 수 있어요` + `주간 계획 제안받기` 버튼 | GL-04 |

- 입력이 비어 있으면 버튼 비활성
- 버튼을 누르면 AI 계획 초안 생성 → 2-2로 이동 (지금은 목업 지연 응답으로 대체)

### 2-2 목표 설정 확인 (2/2)

| 영역 | 내용 | 기능 ID |
|---|---|---|
| 페이지 타이틀 | `100-DAY PLAN | 2/2`, `이렇게 시작해볼까요?` | - |
| 100일 동안 만들어갈 변화 | 목표 카드(제목·설명) + `목표 수정하기` 링크 → 목표 수정 팝업 | GL-07 |
| 주간 계획 | 1주차~4주차 이후 (주제 + 할 일) + `계획 수정하기` 링크 → 주간 계획 수정 팝업 | GL-04 |
| 하단 | `이 계획으로 시작하기` 버튼 → 저장(비회원이면 로그인으로) → 홈 | - |

### 목표 대시보드 / 목표 기록 후 상태

- 오늘의 목표 체크 목록 + `수정하기`, 오늘 목표 완료 처리 (GL-08)
- 미달성 목표는 실패로 표시하지 않고 다음 날 이후로 조정 (GL-10)

---

## 3. 비공개 메모장 — 3-1 (팀원A)

| 영역 | 내용 | 기능 ID | 우선순위 |
|---|---|---|---|
| 페이지 타이틀 | `MY NOTE`, `나만의 메모장` | - | Must |
| 메모 목록 | 양 모양 말풍선 카드. 날짜·시간(`11.09 | 18:30`) + 본문 미리보기. 카드 색상 3종 순환 | MM-01 | Must |
| 새 메모 | `새로운 메모 적기` 버튼 → 신규 메모 입력 팝업 (`NEW NOTE`) | MM-02 | Must |
| 메모 상세 | 카드 탭 → 상세 팝업 (`그날의 내 마음`, 작성 일시, 본문) | MM-03 | Must |
| 메모 수정 | 상세 팝업에서 본문 수정 → `저장하기` | MM-04 | Should |
| 메모 삭제 | 상세 팝업 `삭제하기` → 확인 후 삭제 | - | Must |

- 메모 내용은 민감정보: `console.log`, URL, 로컬 분석 도구에 남기지 않는다.
- 빈 목록일 때 안내 문구 필요 (Figma 미정 → 확인 필요)

---

## 4. 공통 컴포넌트 (팀원A, 먼저 진행)

| 컴포넌트 | Figma 이름 | 주요 Props |
|---|---|---|
| `Button` | 주요 버튼 / 취소 버튼 / 수정하기 버튼 | `variant: primary \| secondary`, `size: lg(56px) \| md(42px)`, `fullWidth`, `disabled` |
| `TextField` | 입력 필드 / 팝업 수정 입력 필드 | `label?`, `tone: emphasis(빨간 테두리) \| default(베이지 테두리)`, 기본 input 속성 |
| `TextArea` | 메모 입력 팝업 필드 | `value`, `onChange`, `placeholder`, `rows` |
| `Chip` | 선택 칩1 / 선택 칩2 | `selected`, `size: md(42px) \| sm(40px)`, `onClick` |
| `Modal` | 각종 수정 팝업 | `open`, `onClose`, `title`, `description?`, `footer?`, `children` (X 버튼 없음) |
| `ModalActions` | 팝업 액션 영역 | `onCancel`(필수), `onConfirm`, `cancelLabel='취소'`, `confirmLabel='수정하기'`, `confirmDisabled` |
| `PageTitle` | 페이지 타이틀 | `label`, `title`, `description` |
| `Header` | 공통 헤더 / 공통 헤더(ver.이전) | `showBack`, `onBack`, `right` |
| `BottomNav` | 하단 내비게이션 (4개 탭) | `active?: home \| memo \| support \| my`, `onNavigate?` |
| `BottomActionArea` | 하단 액션 영역 | `children`, `helperText` |
| `TextButton` | 밑줄 링크 (목표 수정하기 / 계획 수정하기 등) | 기본 button 속성 |
| `WeeklyPlanList` | 주간 계획 확인 영역 (2-2, 1-1 이번 4주 계획) | `plans: WeeklyPlan[]` (4주차는 `4주차 이후`로 표시) |
| `MobileLayout` | (레이아웃) | `header?`, `bottom?`, `children` |

`BottomNav`의 탭 ↔ 경로 연결은 `TabLayout`(`src/layouts/TabLayout.tsx`)에서 `PATHS`로 처리한다 (PR #7).

---

## 5. 데이터 타입 (목업 기준 초안)

백엔드 스키마가 정해지면 맞춰서 수정한다. 백엔드 팀과 공유용.

```ts
type Condition = 'good' | 'hard';            // 괜찮아요 / 힘들어요
type ConditionLog = { date: string; condition: Condition | 'skipped' };

type WeeklyPlan = { week: 1 | 2 | 3 | 4; theme: string; task: string };

type Goal = {
  id: string;
  title: string;          // 나에게 맞는 생활 리듬 만들기
  description: string;    // 일정한 시간에 일어나고, ...
  startDate: string;      // YYYY-MM-DD
  weeklyPlans: WeeklyPlan[];
};

type DayStatus = 'done' | 'rest' | 'none';   // 실천 / 쉬어감 / 기록 없음
type DailyRecord = {
  goalId: string;
  date: string;
  todayGoal: string;
  status: DayStatus;
  feedback?: 'okay' | 'burden';               // 이 정도면 괜찮아요 / 아직 부담돼요
};

type Memo = { id: string; content: string; createdAt: string; updatedAt: string };
```
