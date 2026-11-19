import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useSearchParams } from 'react-router-dom';

import { SupportTabs } from '../components/support/SupportTabs';
import { ProgramCard } from '../components/support/ProgramCard';
import { OrganizationCard } from '../components/support/OrganizationCard';

import {
  getSupportPrograms,
  getSupportOrganizations,
} from '../api/support';
import { getProfile } from '../api/profile';

import type {
  SupportTab,
  SupportProgram,
  SupportOrganization,
} from '../types/support';
import { LoadingText } from '../components/LoadingText';

const PAGE_SIZE = 4;

type ListState<T> = {
  items: T[];
  page: number;
  hasNext: boolean;
  loaded: boolean;
};

type SupportCache = {
  programs: ListState<SupportProgram>;
  organizations: ListState<SupportOrganization>;
};

function emptyList<T>(): ListState<T> {
  return {
    items: [],
    page: -1,
    hasNext: true,
    loaded: false,
  };
}

function createInitialCache(): SupportCache {
  return {
    programs: emptyList<SupportProgram>(),
    organizations: emptyList<SupportOrganization>(),
  };
}

// 상세 페이지에서 돌아왔을 때 목록 및 스크롤 위치 유지
let cachedData: SupportCache = createInitialCache();
let cachedScrollTop = 0;
let cachedRegion: string | null = null;

export default function SupportPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const activeTab: SupportTab =
    searchParams.get('tab') === 'organizations'
      ? 'organizations'
      : 'programs';

  const [lists, setLists] = useState<SupportCache>(
    () => cachedData,
  );
  const [userRegion, setUserRegion] = useState<string>('');

  const [loadingTab, setLoadingTab] =
    useState<SupportTab | null>(null);

  const [error, setError] = useState('');

  // 사용자 지역 프로필 불러오기 및 지역 변경 시 캐시 초기화
  useEffect(() => {
    let active = true;
    getProfile()
      .then((profile) => {
        if (!active) return;
        const nextRegion = profile.region ?? '';
        setUserRegion(nextRegion);

        if (cachedRegion !== null && cachedRegion !== nextRegion) {
          cachedData = createInitialCache();
          cachedScrollTop = 0;
          setLists(cachedData);
        }
        cachedRegion = nextRegion;
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  const sentinelRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // 요청 중복 방지용
  const requestRef = useRef<{
    tab: SupportTab;
    controller: AbortController;
  } | null>(null);

  const currentList = lists[activeTab];

  const loadPage = useCallback(
    async (tab: SupportTab, page: number) => {
      if (requestRef.current) return;

      const controller = new AbortController();

      requestRef.current = {
        tab,
        controller,
      };

      setLoadingTab(tab);
      setError('');

      try {
        const params = {
          page,
          size: PAGE_SIZE,
        };

        if (tab === 'programs') {
          const result = await getSupportPrograms(
            params,
            controller.signal,
          );

          if (controller.signal.aborted) return;

          setLists((prev) => {
            if (page <= prev.programs.page) {
              return prev;
            }

            const next: SupportCache = {
              ...prev,
              programs: {
                items:
                  page === 0
                    ? result.items
                    : [
                        ...prev.programs.items,
                        ...result.items,
                      ],
                page: result.page,
                hasNext: result.has_next,
                loaded: true,
              },
            };

            cachedData = next;
            return next;
          });
        } else {
          const result = await getSupportOrganizations(
            params,
            controller.signal,
          );

          if (controller.signal.aborted) return;

          setLists((prev) => {
            if (page <= prev.organizations.page) {
              return prev;
            }

            const next: SupportCache = {
              ...prev,
              organizations: {
                items:
                  page === 0
                    ? result.items
                    : [
                        ...prev.organizations.items,
                        ...result.items,
                      ],
                page: result.page,
                hasNext: result.has_next,
                loaded: true,
              },
            };

            cachedData = next;
            return next;
          });
        }
      } catch (err) {
        if (controller.signal.aborted) return;

        setError(
          err instanceof Error
            ? err.message
            : '목록을 불러오지 못했습니다.',
        );
      } finally {
        if (requestRef.current?.controller === controller) {
          requestRef.current = null;
          setLoadingTab(null);
        }
      }
    },
    [],
  );

  // 최초 목록 및 탭 변경 시 데이터 조회
  useEffect(() => {
    const list = cachedData[activeTab];

    if (!list.loaded) {
      const timer = window.setTimeout(() => {
        void loadPage(activeTab, 0);
      }, 0);

      return () => window.clearTimeout(timer);
    }
  }, [activeTab, loadPage]);

  // 무한 스크롤
  useEffect(() => {
    const sentinel = sentinelRef.current;

    if (
      !sentinel ||
      !currentList.loaded ||
      !currentList.hasNext ||
      loadingTab !== null ||
      error
    ) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting) return;
        if (requestRef.current) return;

        void loadPage(activeTab, currentList.page + 1);
      },
      {
        root: scrollContainerRef.current,
        rootMargin: '200px',
        threshold: 0,
      },
    );

    observer.observe(sentinel);

    return () => observer.disconnect();
  }, [
    activeTab,
    currentList.loaded,
    currentList.hasNext,
    currentList.page,
    loadingTab,
    error,
    loadPage,
  ]);

  // 상세 페이지 복귀 시 스크롤 위치 복원 및 이탈 시 저장
  useEffect(() => {
    const scrollEl = scrollContainerRef.current;
    if (!scrollEl) return;

    const frame = requestAnimationFrame(() => {
      scrollEl.scrollTop = cachedScrollTop;
    });

    // 스크롤할 때마다 현재 위치 저장
    const saveScroll = () => {
      cachedScrollTop = scrollEl.scrollTop;
    };

    scrollEl.addEventListener('scroll', saveScroll, {
      passive: true,
    });

    return () => {
      cancelAnimationFrame(frame);
      scrollEl.removeEventListener('scroll', saveScroll);
    };
  }, []);

  const handleTabChange = (tab: SupportTab) => {
    if (tab === activeTab) return;

    requestRef.current?.controller.abort();
    requestRef.current = null;

    setLoadingTab(null);
    setError('');

    cachedScrollTop = 0;

    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0;
    }

    setSearchParams(
      tab === 'programs' ? {} : { tab },
      { replace: true },
    );
  };

  const handleRetry = () => {
    void loadPage(
      activeTab,
      currentList.loaded
        ? currentList.page + 1
        : 0,
    );
  };

  return (
    <div
      ref={scrollContainerRef}
      className="scrollbar-hide h-full overflow-y-auto overscroll-contain bg-background px-10 pb-8"
    >
      {/* 함께 위로 스크롤되어 사라지는 상단 안내 헤더 */}
      <header className="flex flex-col gap-2 border-b border-border pt-8 pb-8">
        <p className="text-label text-primary">
          FIND YOUR SUPPORT
        </p>

        <h1 className="text-title text-text-main">
          필요한 도움을 가까이에서 찾아요
        </h1>

        <p className="text-caption text-text-sub">
          나에게 맞는 프로그램과 기관을 살펴보세요.
        </p>

        <p className="text-button text-text-main">
          나의 지역: {userRegion || ''}
        </p>

        <p className="text-caption text-primary-pressed">
          나의 지역은 '내 정보'에서 수정할 수 있어요.
        </p>
      </header>

      {/* 스크롤 시 레이아웃 Header 바로 밑(top-0)에 고정되어 절대 안 올라가는 탭 */}
      <section className="sticky top-0 z-10 -mx-10 bg-background px-10 py-6">
        <SupportTabs
          activeTab={activeTab}
          onChange={handleTabChange}
        />
      </section>

      {/* 무한 스크롤 목록 */}
      <section className="flex flex-col gap-3">
        {activeTab === 'programs'
          ? lists.programs.items.map((program) => (
              <ProgramCard
                key={program.program_id}
                program={program}
              />
            ))
          : lists.organizations.items.map((organization) => (
              <OrganizationCard
                key={organization.organization_id}
                organization={organization}
              />
            ))}

        {loadingTab === activeTab && !currentList.loaded && (
          <div className="flex justify-center py-5">
            <LoadingText text="목록을 불러오는 중..." />
          </div>
        )}

        {error && (
          <div
            role="alert"
            className="p-5 text-center"
          >
            <p className="mb-3 text-sm text-text-sub">
              {error}
            </p>

            <button
              type="button"
              onClick={handleRetry}
              className="rounded-sm bg-primary px-5 py-2 text-caption text-surface"
            >
              다시 시도
            </button>
          </div>
        )}

        {currentList.loaded &&
          currentList.items.length === 0 &&
          !error &&
          loadingTab === null && (
            <p className="py-5 text-center text-caption text-text-sub">
              등록된 정보가 없어요.
            </p>
          )}

        <div
          ref={sentinelRef}
          aria-hidden="true"
          className="h-1"
        />

        {currentList.loaded &&
          !currentList.hasNext &&
          currentList.items.length > 0 && (
            <p className="py-1 text-center text-caption text-text-sub">
              모든 정보를 확인했어요.
            </p>
          )}
      </section>
    </div>
  );
}