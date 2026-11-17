import type { WeeklyPlan } from '../types';

/** 4주차는 이후 기간까지 포함하므로 화면에는 '4주차 이후'로 표시한다 (Figma 2-2, 1-1) */
function weeklyPlanLabel(week: WeeklyPlan['week']) {
  return week === 4 ? '4주차 이후' : `${week}주차`;
}

type WeeklyPlanListProps = {
  plans: WeeklyPlan[];
};

/** Figma '주간 계획 확인 영역'의 주차별 목록 (왼쪽 빨간 선 + 주차·주제 / 할 일) */
export function WeeklyPlanList({ plans }: WeeklyPlanListProps) {
  return (
    <ol className="flex flex-col gap-2">
      {plans.map((plan) => (
        <li key={plan.week} className="flex flex-col gap-1 border-l-2 border-primary-pressed px-5 text-caption text-text-main">
          <p className="font-bold">
            {weeklyPlanLabel(plan.week)} · {plan.theme}
          </p>
          <p>{plan.task}</p>
        </li>
      ))}
    </ol>
  );
}
