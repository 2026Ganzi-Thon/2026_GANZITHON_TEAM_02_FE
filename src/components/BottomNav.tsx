import type { ComponentType, SVGProps } from 'react';
import { cn } from '../utils/cn';
import { GoalIcon, HomeIcon, MemoIcon, SearchIcon, UserIcon } from './icons';

export type BottomNavKey = 'home' | 'goal' | 'memo' | 'support' | 'my';

type NavItem = {
  key: BottomNavKey;
  label: string;
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
};

const NAV_ITEMS: NavItem[] = [
  { key: 'home', label: '홈', Icon: HomeIcon },
  { key: 'goal', label: '목표', Icon: GoalIcon },
  { key: 'memo', label: '메모', Icon: MemoIcon },
  { key: 'support', label: '지원', Icon: SearchIcon },
  { key: 'my', label: '내 정보', Icon: UserIcon },
];

type BottomNavProps = {
  /** 현재 탭. 없으면 아무 탭도 활성화하지 않음 */
  active?: BottomNavKey;
  /** 탭 클릭 시 호출. 라우터 경로 연결은 라우터 설정 후 여기서 처리 */
  onNavigate?: (key: BottomNavKey) => void;
  /**
   * 표시할 탭. Figma 변형마다 '목표' 탭 유무가 달라 확정 전까지 선택 가능하게 둔다.
   * 기본값: 5개 탭 모두
   */
  items?: BottomNavKey[];
};

export function BottomNav({ active, onNavigate, items }: BottomNavProps) {
  const visible = items ? NAV_ITEMS.filter((item) => items.includes(item.key)) : NAV_ITEMS;

  return (
    <nav aria-label="주요 메뉴" className="h-[104px] shrink-0 bg-surface">
      <ul className="flex h-full items-center justify-center gap-[30px] px-[30px] py-2">
        {visible.map(({ key, label, Icon }) => {
          const isActive = key === active;
          return (
            <li key={key}>
              <button
                type="button"
                onClick={() => onNavigate?.(key)}
                aria-current={isActive ? 'page' : undefined}
                className={cn(
                  'flex w-10 flex-col items-center gap-px py-1 text-tab',
                  isActive ? 'text-primary-pressed' : 'text-text-sub',
                )}
              >
                <span className="flex h-6 items-center justify-center">
                  <Icon />
                </span>
                <span className="whitespace-nowrap">{label}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
