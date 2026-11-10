# CLAUDE.md

Claude Code가 이 저장소에서 작업할 때 가장 먼저 읽는 파일입니다.
세부 규칙은 `AGENTS.md`에 있고, 이 파일은 그 요약과 Claude Code 전용 주의 사항입니다. 둘이 다르면 `AGENTS.md` → `README.md` 순으로 확인하고, 그래도 다르면 작업을 멈추고 사용자에게 묻습니다.

## 1. 프로젝트 개요

- 2026 간지톤 [Ari-Thon] 2팀 **프론트엔드** 저장소 (`2026Ganzi-Thon/2026_GANZITHON_TEAM_02_FE`)
- 학교 밖 청소년이 그날의 컨디션에 맞춰 작은 목표를 100일 동안 이어가고, 지원 정보까지 연결되도록 돕는 **모바일 우선 웹앱**
- 컨셉 캐릭터: 양. 서비스명은 **"메에일"로 확정** (2026-11-09 디자인 컨펌 및 서비스명 확정 회의). 로고는 아직 제작 중
- **개발 마감: 2026-11-20(금) 23:59** — 마감 이후 공식 저장소에 커밋하면 팀 실격. 본 행사 11-21(토)

## 2. 기술 스택 (임의 변경 금지)

| 항목 | 내용 |
|---|---|
| 프레임워크 | React 19 + Vite 8 |
| 언어 | TypeScript (JS 파일 추가 금지) |
| 스타일 | Tailwind CSS v4 (`@tailwindcss/vite`), 토큰은 `src/styles/global.css`의 `@theme` |
| 런타임 | Node.js 26.8.2 / npm 11.19.1 (`package.json` `engines`) — 유민 PC는 2026-11-10 기준 Node v22.23.2 / npm 10.9.8 (lockfile이 바뀌면 커밋하지 말고 되돌린다) |
| 백엔드 | 별도 팀이 Supabase로 개발 (별도 저장소). 프론트는 현재 **목업 데이터**만 사용 |

새 패키지 설치는 사용자 승인 후에만 한다.

## 3. 작업 전에 읽을 문서 (순서대로)

1. `HANDOFF.md` — 현재 진행 상황, 브랜치 상태, 다음 할 일
2. `AGENTS.md` — 개발 규칙 전체
3. `docs/FUNCTION_SPEC.md` — 화면별 기능, 공통 컴포넌트 Props, 데이터 타입
4. `docs/USER_FLOW.md` — IA, 유저플로우, 진입 분기
5. `docs/DESIGN_GUIDE.md` — 디자인 토큰, 컴포넌트 규격
6. `docs/PRD.md` — 서비스 목적, MVP 범위, PRD↔Figma 차이표

## 4. 기준 우선순위

**Figma → 기능 명세(`docs/FUNCTION_SPEC.md`, `docs/USER_FLOW.md`) → PRD(`docs/PRD.md`)**

- Figma: `[2026 간지톤] 2팀` (fileKey `a4aWDap7YkjI72nUdnYMcn`), 페이지 `서비스 구조`(1:239), `와이어프레임`(4:197)
- 세 곳 모두 정해지지 않은 내용은 **확정하지 말고 "미정"으로 두고 질문**한다. (미정 목록은 `HANDOFF.md` 참고)

## 5. 코딩 · 파일 수정 규칙

- **기존 공통 컴포넌트와 목업 구조를 먼저 재사용한다.** 새로 만들기 전에 `src/components`, `src/layouts`, `src/api`를 확인한다.
  - 버튼 → `Button`, 입력 → `TextField`/`TextArea`, 선택지 → `Chip`, 팝업 → `Modal` + `ModalActions`, 화면 틀 → `MobileLayout` + `Header` + `BottomNav`/`BottomActionArea`, 제목 → `PageTitle`
  - 디자인 확정(2026-11-10): 하단 내비는 **홈/메모/지원/내 정보 4개 탭**, 팝업은 **X 버튼 없이 하단 `취소` 버튼**으로 닫는다.
- 색상·글자 크기는 토큰 클래스만 쓴다 (`bg-primary`, `text-text-main`, `text-caption`, `rounded-card` …). hex 값 직접 사용 금지.
- 화면은 `src/mocks`를 직접 import하지 않고 **`src/api` 함수만 호출**한다. 새 데이터가 필요하면 `src/types` → `src/mocks` → `src/api` 순으로 추가한다.
- 전역 CSS 규칙은 `global.css`의 `@layer base` 안에 둔다. (레이어 밖에 두면 Tailwind 유틸리티를 덮어써서 `text-*` 등이 무시됨)
- 기존 파일을 삭제하거나 통째로 다시 쓰지 않는다. 필요한 부분만 수정한다.
- 수정 후 `npm run build`, `npm run lint`가 통과해야 한다.

## 6. 팀원별 작업 영역

| 담당 | 범위 |
|---|---|
| 팀원A (유민) — 이 저장소의 Claude Code 사용자 | 홈, 100일 목표, 비공개 메모장, 공통 컴포넌트·디자인 토큰·모바일 레이아웃 |
| 팀원B (은빈) | 시작(컨디션·온보딩·도움 선택·로그인·초기설정), 지원 정보, 내 정보, **React Router·인증 라우트** |

- **`src/App.tsx`, 라우터, 인증 관련 파일은 수정하지 않는다** (팀원B 담당).
- 팀원B 영역 화면을 만들거나 고쳐야 하면 먼저 사용자에게 확인한다.
- 공통 컴포넌트를 바꿀 때는 Props를 깨지 않게(추가만) 하고, 바꾼 내용을 PR에 적는다.

## 7. Git 규칙 (README 기준)

- `develop`에서 `feat/기능명` 브랜치 생성 → 작업 → `develop` 대상 PR → 리뷰 후 Squash Merge
- 브랜치 이름: 영문 소문자 + 하이픈 (`feat/home-page`)
- 커밋: `type: 한글 작업 내용` (`feat`, `fix`, `design`, `refactor`, `docs`, `chore`, `test` …), 한 커밋 = 한 논리적 변경
- PR 제목: `[Type] 작업 내용`
- `main`, `develop`에 직접 push 금지
- **commit, push, PR 생성, merge는 사용자가 요청할 때만** 한다. 기존 브랜치·커밋을 지우거나 rebase/force-push 하지 않는다.

## 8. Supabase · 백엔드 주의 사항

- 백엔드 저장소 `2026Ganzi-Thon/2026_GANZITHON_TEAM_02_BE`는 **읽기만** 하고 절대 수정하지 않는다. (2026-11-10 확인 시 빈 저장소)
- 백엔드 테이블·API 명세는 아직 없다. `src/types`의 타입은 **프론트 초안**이며 백엔드 스키마가 나오면 맞춘다.
- `@supabase/supabase-js`는 아직 설치하지 않았다. 연동 방식(프론트에서 직접 호출 vs 백엔드 API 경유)은 **미정**.
- Supabase URL·키는 `.env`로만 관리하고 코드·커밋에 넣지 않는다. ⚠️ 현재 `.gitignore`에 `.env`가 없으므로(`*.local`만 있음) `.env.local`을 쓰거나, `.gitignore` 수정을 팀과 먼저 합의한다.
- AI 계획 초안 등 AI API 호출은 프론트에서 하지 않는다 (키 노출 방지).
- 메모·컨디션 기록은 민감정보: `console.log`, URL 파라미터에 내용을 남기지 않는다.
