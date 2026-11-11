import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTodayCondition } from '../../api/condition';
import { getDailyRecords, getGoal, saveDailyRecord, saveGoal } from '../../api/goal';
import { getProfile } from '../../api/profile';
import { Button } from '../../components/Button';
import { PageTitle } from '../../components/PageTitle';
import { TextButton } from '../../components/TextButton';
import { WeeklyPlanList } from '../../components/WeeklyPlanList';
import { PATHS } from '../../routes/paths';
import type { ConditionLog, DailyRecord, Goal, Profile } from '../../types';
import { todayKey } from '../../utils/date';
import { GoalEditModal } from '../goal/GoalEditModal';
import { WeeklyPlanEditModal } from '../goal/WeeklyPlanEditModal';
import { ConditionCard } from './ConditionCard';
import { GoalSuccessModal } from './GoalSuccessModal';
import { TodayGoalSection } from './TodayGoalSection';

type HomeData = {
  profile: Profile;
  condition: ConditionLog | null;
  goal: Goal | null;
  todayRecord: DailyRecord | null;
};

type ModalKey = 'todayGoal' | 'success' | 'weeklyPlan';

const TITLE_BY_STATUS = {
  none: '오늘도 반가워요',
  done: '오늘은 목표를 완료했어요!',
  rest: '오늘은 푹 쉬세요',
} as const;

function SectionDivider() {
  return <div aria-hidden className="mx-[17px] border-t border-border" />;
}

/**
 * Figma 1-1 홈 대시보드(85:2057) / 1-2 목표 기록 후 홈(180:12282 실천, 180:12508 쉬어감).
 * 탭 화면이라 TabLayout이 Header·하단 내비를 그리므로 본문만 그린다.
 */
export function HomeDashboard() {
  const navigate = useNavigate();
  const [data, setData] = useState<HomeData | null>(null);
  const [modal, setModal] = useState<ModalKey | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      const [profile, condition, goal] = await Promise.all([getProfile(), getTodayCondition(), getGoal()]);
      const records = goal ? await getDailyRecords(goal.id) : [];
      const todayRecord = records.find((record) => record.date === todayKey()) ?? null;
      if (active) setData({ profile, condition, goal, todayRecord });
    })();
    return () => {
      active = false;
    };
  }, []);

  if (!data) {
    return <p className="px-10 py-8 text-caption text-text-sub">불러오는 중...</p>;
  }

  const { profile, condition, goal, todayRecord } = data;
  const status = todayRecord?.status ?? 'none';
  const todayGoal = todayRecord?.todayGoal || goal?.title || '';
  const showCondition = condition && condition.condition !== 'skipped' ? condition.condition : null;

  const saveRecord = async (patch: Partial<Pick<DailyRecord, 'status' | 'todayGoal' | 'feedback'>>) => {
    if (!goal) return null;
    setSaving(true);
    try {
      const saved = await saveDailyRecord({
        goalId: goal.id,
        date: todayKey(),
        todayGoal,
        status,
        feedback: todayRecord?.feedback,
        ...patch,
      });
      setData((prev) => (prev ? { ...prev, todayRecord: saved } : prev));
      return saved;
    } finally {
      setSaving(false);
    }
  };

  const handleDone = async () => {
    if (await saveRecord({ status: 'done' })) setModal('success');
  };

  const handleUndo = async () => {
    await saveRecord({ status: 'none', feedback: undefined });
    setModal(null);
  };

  return (
    <>
      <PageTitle
        label="TODAY"
        title={`${profile.nickname} 님, ${TITLE_BY_STATUS[status]}`}
        description={status === 'none' ? undefined : '오늘은 편히 쉬고, 내일 만나요!'}
      >
        {showCondition && <ConditionCard condition={showCondition} />}
      </PageTitle>
      <SectionDivider />

      {goal ? (
        <>
          <TodayGoalSection
            title={todayGoal}
            description={goal.description}
            status={status}
            saving={saving}
            onEdit={() => setModal('todayGoal')}
            onDone={handleDone}
            onRest={() => saveRecord({ status: 'rest' })}
          />
          <SectionDivider />

          {/* Should: 한 칸씩 내 속도로(100칸 양털판 + N일 째)는 아직 미구현 */}

          <section className="flex flex-col gap-2 px-10 py-8">
            <h2 className="text-section text-text-main">이번 4주 계획</h2>
            <WeeklyPlanList plans={goal.weeklyPlans} />
            <TextButton onClick={() => setModal('weeklyPlan')}>계획 수정하기</TextButton>
          </section>
        </>
      ) : (
        // Figma에 '목표 없음' 홈 화면이 없어 임시 문구 (디자인 확인 필요)
        <section className="flex flex-col gap-2 px-10 py-8">
          <h2 className="text-section text-text-main">오늘의 목표</h2>
          <p className="text-caption text-text-sub">아직 100일 목표가 없어요. 작은 목표부터 함께 정해봐요.</p>
          <Button fullWidth onClick={() => navigate(PATHS.goals)}>
            100일 목표 세우기
          </Button>
        </section>
      )}

      <GoalEditModal
        open={modal === 'todayGoal'}
        heading="오늘의 목표 수정하기"
        inputLabel="오늘의 목표"
        title={todayGoal}
        onClose={() => setModal(null)}
        onSave={async (title) => {
          await saveRecord({ todayGoal: title });
          setModal(null);
        }}
      />
      <GoalSuccessModal
        open={modal === 'success'}
        feedback={todayRecord?.feedback}
        onFeedbackChange={(feedback) => saveRecord({ feedback })}
        onClose={() => setModal(null)}
        onUndo={handleUndo}
      />
      {goal && (
        <WeeklyPlanEditModal
          open={modal === 'weeklyPlan'}
          plans={goal.weeklyPlans}
          onClose={() => setModal(null)}
          onSave={async (weeklyPlans) => {
            const saved = await saveGoal({ title: goal.title, description: goal.description, weeklyPlans });
            setData((prev) => (prev ? { ...prev, goal: saved } : prev));
            setModal(null);
          }}
        />
      )}
    </>
  );
}
