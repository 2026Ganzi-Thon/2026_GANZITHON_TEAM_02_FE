# AGENTS.md

AI 코딩 도구(Claude Code, Cursor, Codex 등)가 이 저장소에서 작업할 때 따르는 규칙입니다.
사람 팀원도 같은 기준을 사용합니다. 협업 규칙의 원본은 `README.md`이며, 충돌하면 README가 우선합니다.

## 1. 프로젝트 한 줄 요약

학교 밖 청소년이 그날의 컨디션에 맞춰 작은 목표를 100일 동안 이어가고, 필요한 지원 정보까지 연결되도록 돕는 **모바일 우선 웹앱**의 프론트엔드 저장소입니다. (2026 간지톤 [Ari-Thon] 2팀)

작업 전에 반드시 읽을 문서:

| 문서 | 내용 |
|---|---|
| `docs/PRD.md` | 서비스 목적, 타깃, MVP 범위, 우선순위 |
| `docs/USER_FLOW.md` | IA(메뉴·화면 구조), 유저플로우, 진입 분기표 |
| `docs/FUNCTION_SPEC.md` | 화면별 기능, 상태, 데이터 타입, 담당자 |
| `docs/DESIGN_GUIDE.md` | 디자인 토큰(색상·폰트·radius), 공통 컴포넌트 규격 |

## 2. 기준의 우선순위

1. **Figma `[2026 간지톤] 2팀` 와이어프레임** — 화면 구성, 문구, 플로우의 최종 기준
2. `docs/FUNCTION_SPEC.md` / `docs/USER_FLOW.md`
3. `docs/PRD.md` — Figma와 다르면 Figma를 따른다 (예: 컨디션 선택지는 Figma 기준 `괜찮아요 / 힘들어요 + 건너뛰기`)

Figma와 문서 모두 정해지지 않은 부분은 **임의로 결정하지 말고 질문**한다.

## 3. 기술 스택 (임의 변경 금지)

| 항목 | 버전 / 내용 |
|---|---|
| 플랫폼 | 웹앱 (모바일 우선, 최대 너비 430px 컨테이너) |
| 프레임워크 | React 19 + Vite 8 |
| 언어 | **TypeScript** (JavaScript 파일 추가 금지) |
| 스타일 | Tailwind CSS v4 (`@tailwindcss/vite`), 토큰은 `src/styles/global.css`의 `@theme` |
| 런타임 | Node.js **26.8.2**, npm **11.19.1** (`package.json` `engines`) |
| 백엔드 | 별도 팀이 **Supabase**로 개발 (별도 저장소). 프론트는 현재 **목업 데이터**로 개발 |

- 새 라이브러리 설치는 팀 합의 후에만 한다. 설치했다면 PR 본문에 이유를 적는다.
- 백엔드 저장소(`2026_GANZITHON_TEAM_02_BE`)의 코드는 이 저장소에서 수정하지 않는다.

## 4. 폴더 구조

README의 구조를 따르며, 목업 데이터를 위해 `mocks`, `api`를 추가로 사용한다.

```text
src
 ┣ assets      # 이미지, 아이콘
 ┣ components  # 재사용 공통 UI (Button, Input, Modal ...)
 ┣ hooks       # 커스텀 훅
 ┣ layouts     # MobileLayout(모바일 틀), TabLayout(공통 Header + 하단 내비)
 ┣ routes      # AppRouter(라우트·레이아웃 그룹), paths(경로 상수)
 ┣ pages       # 페이지 단위 컴포넌트
 ┣ styles      # 전역 CSS, 디자인 토큰
 ┣ types       # 도메인 타입 (Goal, Memo, Condition ...)
 ┣ mocks       # 목업 데이터 (Supabase 연동 전 임시)
 ┣ api         # 데이터 접근 함수 — 화면은 반드시 여기만 호출
 ┣ preview     # 공통 컴포넌트 미리보기 (개발 전용, /preview.html)
 ┗ utils       # 날짜 변환 등 공통 함수
```

루트의 `preview.html`은 미리보기 진입점이며 배포 빌드(`index.html`)에는 포함되지 않는다.

사용하지 않는 폴더는 미리 만들지 않는다.

### 라우팅 · 레이아웃 규칙 (2026-11-11 확정)

모든 페이지는 아래 두 그룹 중 **하나에만** 속한다. 새 페이지를 만들 때 `src/routes/AppRouter.tsx`에서 그룹을 먼저 정한다.

| 그룹 | 레이아웃 | 경로 | 페이지가 할 일 |
|---|---|---|---|
| 탭 화면 | `TabLayout` (공통 Header + BottomNav) | `/`, `/memos`, `/support`, `/mypage` | **본문만** 그린다. `MobileLayout`·`Header`·`BottomNav`를 직접 쓰지 않는다 |
| 단독 화면 | 없음 | `/goals`, `/onboarding`, `/login`, `/signup`, 404 | `MobileLayout`으로 자체 Header와 하단 CTA(`BottomActionArea`)를 직접 그린다 |

- 기준: **Figma에서 하단 내비가 보이는 화면만 탭 화면**이다. 그 밖의 화면은 모두 단독 화면.
- 경로는 문자열 대신 `src/routes/paths.ts`의 `PATHS`를 쓴다 (`navigate(PATHS.home)`).
- 하단 내비 탭 ↔ 경로 연결은 `TabLayout`에서만 관리한다.

## 5. 데이터 접근 규칙 (목업 → Supabase 전환 대비)

- 화면/컴포넌트는 `src/mocks`를 **직접 import하지 않는다.** 항상 `src/api`의 함수를 호출한다.
- `src/api` 함수는 실제 API처럼 `Promise`를 반환한다. Supabase가 준비되면 이 함수 내부만 교체한다.
- 도메인 타입은 `src/types`에 정의하고, 목업과 API가 같은 타입을 사용한다.
- Supabase URL·키 등은 `.env`로만 관리하고 코드에 직접 쓰지 않는다. `.env`는 커밋하지 않는다(`.env.example`만 공유).

## 6. 코드 규칙

- 컴포넌트: 함수형 + 이름 있는 export, 파일명은 PascalCase (`Button.tsx`).
- Props 타입은 컴포넌트 파일 안에 `type XxxProps`로 정의한다. `any` 금지.
- 스타일은 Tailwind 유틸리티 + 디자인 토큰 클래스(`bg-primary`, `text-text-main` 등)만 사용한다. 색상 hex 값을 직접 쓰지 않는다.
- 접근성: 클릭 요소는 `button`/`a`를 사용하고, 아이콘만 있는 버튼에는 `aria-label`을 단다.
- 공통 컴포넌트를 수정할 때는 다른 팀원 화면에 영향이 없는지 확인하고 PR에 적는다.

## 7. 작업 방식

1. 작업 전: 관련 문서와 Figma 화면, 기존 파일 구조를 먼저 확인한다.
2. 기능은 작은 단위로 나눠 구현한다. 한 PR = 한 기능.
3. 기존 코드를 필요 이상으로 수정하지 않는다. (포맷 변경만 있는 diff 금지)
4. 완료 전: `npm run build`와 `npm run lint`가 통과해야 한다.
5. 브랜치·커밋·PR 규칙은 README를 따른다.
   - `develop`에서 `feat/기능명` 브랜치 생성 → `develop`으로 PR → 리뷰 후 Squash Merge
   - 커밋: `type: 한글 작업 내용` (예: `feat: 공통 버튼 컴포넌트 추가`)
   - `main`, `develop`에 직접 push 금지

## 8. 팀 역할 (충돌 방지)

| 담당 | 범위 |
|---|---|
| 팀원A (유민) | 홈, 100일 목표, 비공개 메모장, **공통 컴포넌트·디자인 토큰·모바일 레이아웃** |
| 팀원B (은빈) | 시작(컨디션·온보딩·도움 선택·로그인·초기설정), 지원 정보, 내 정보, **React Router·인증 라우트** |

다른 담당 영역의 파일을 수정해야 하면 먼저 담당자와 이야기한다.
