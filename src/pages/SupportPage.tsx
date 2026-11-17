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

// 상세 페이지에서 돌아왔을 때 목록 유지
let cachedData: SupportCache = createInitialCache();
let cachedScrollTop = 0;

// function findScrollContainer(element: HTMLElement) {
//   let parent = element.parentElement;

//   while (parent) {
//     const style = getComputedStyle(parent);
//     const overflow = style.overflowY;

//     if (
//       overflow === 'auto' ||
//       overflow === 'scroll'
//     ) {
//       return parent;
//     }

//     parent = parent.parentElement;
//   }

//   return null;
// }

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

  // 사용자 지역 프로필 불러오기
  useEffect(() => {
    let active = true;
    getProfile()
      .then((profile) => {
        if (active && profile.region) {
          setUserRegion(profile.region);
        }
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  const sentinelRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const listScrollRef = useRef<HTMLElement>(null);

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
      // 비동기 작업으로 예약하여 effect 내부의
      // 동기적 setState 호출을 방지
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
        root: listScrollRef.current,
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

  // 목록 복귀 시 스크롤 복원

  // useEffect(() => {
  //   const element = containerRef.current;
  //   if (!element) return;

  //   const scrollContainer = findScrollContainer(element);

  //   const frame = requestAnimationFrame(() => {
  //     if (scrollContainer) {
  //       scrollContainer.scrollTop = cachedScrollTop;
  //     } else {
  //       window.scrollTo(0, cachedScrollTop);
  //     }
  //   });

  //   return () => {
  //     cancelAnimationFrame(frame);

  //     cachedScrollTop = scrollContainer
  //       ? scrollContainer.scrollTop
  //       : window.scrollY;
  //   };
  // }, []);

  // SupportPage가 표시되는 동안 MobileLayout의 바깥 스크롤 차단
  useEffect(() => {
    const scrollElement = listScrollRef.current;
    if (!scrollElement) return;

    const frame = requestAnimationFrame(() => {
      scrollElement.scrollTop = cachedScrollTop;
    });

    return () => {
      cancelAnimationFrame(frame);
      cachedScrollTop = scrollElement.scrollTop;
    };
  }, []);

  // const handleTabChange = (tab: SupportTab) => {
  //   // 기존 요청 취소
  //   requestRef.current?.controller.abort();
  //   requestRef.current = null;

  //   setLoadingTab(null);
  //   setError('');

  //   cachedScrollTop = 0;

  //   const element = containerRef.current;

  //   if (element) {
  //     const scrollContainer = findScrollContainer(element);

  //     if (scrollContainer) {
  //       scrollContainer.scrollTop = 0;
  //     } else {
  //       window.scrollTo(0, 0);
  //     }
  //   }

  //   setSearchParams(
  //     tab === 'programs' ? {} : { tab },
  //     { replace: true },
  //   );
  // };

  const handleTabChange = (tab: SupportTab) => {
    if (tab === activeTab) return;

    requestRef.current?.controller.abort();
    requestRef.current = null;

    setLoadingTab(null);
    setError('');

    cachedScrollTop = 0;

    if (listScrollRef.current) {
      listScrollRef.current.scrollTop = 0;
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
      ref={containerRef}
      className="flex flex-col h-full overflow-hidden bg-background px-10 pt-8"
    >
        <header className="shrink-0 flex flex-col border-b border-border gap-2 pb-8">
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
            나의 지역: {userRegion || '지역 미설정'}
          </p>

          <p className="text-caption text-primary-pressed">
            나의 지역은 '내 정보'에서 수정할 수 있어요.
          </p>
        </header>

        <section className="shrink-0 my-6">
          <SupportTabs
            activeTab={activeTab}
            onChange={handleTabChange}
          />
        </section>

        <section 
          ref={listScrollRef}
          className="scrollbar-hide min-h-0 flex-1 overflow-y-auto overscroll-contain pb-8">
          <div className='flex flex-col gap-3'>
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

          {loadingTab === activeTab && (
            <p
              role="status"
              className="py-5 text-center text-caption text-text-sub"
            >
              목록을 불러오는 중...
            </p>
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
          </div>
        </section>
    </div>
  );
}
