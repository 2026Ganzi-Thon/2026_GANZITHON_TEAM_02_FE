import { useCallback, useEffect, useRef, useState } from 'react';
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

type FilterRegion = '부천시' | '화성시';

function getFilterRegion(region: string | null | undefined): FilterRegion | null {
  if (!region) return null;
  if (region.includes('부천')) return '부천시';
  if (region.includes('화성')) return '화성시';
  return null;
}

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
  return { items: [], page: -1, hasNext: true, loaded: false };
}

function createInitialCache(): SupportCache {
  return {
    programs: emptyList<SupportProgram>(),
    organizations: emptyList<SupportOrganization>(),
  };
}

// 상세 페이지에서 복귀했을 때 목록 및 스크롤 위치 유지
let cachedData: SupportCache = createInitialCache();
let cachedScrollTop = 0;
let cachedRegion: FilterRegion | null = null;

export default function SupportPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab: SupportTab =
    searchParams.get('tab') === 'organizations' ? 'organizations' : 'programs';

  const [lists, setLists] = useState<SupportCache>(() => cachedData);
  const [userRegion, setUserRegion] = useState<string>('');
  const filterRegion = getFilterRegion(userRegion);
  const [regionLoaded, setRegionLoaded] = useState(false);
  const [profileError, setProfileError] = useState('');
  const [profileRetryKey, setProfileRetryKey] = useState(0);
  const [loadingTab, setLoadingTab] = useState<SupportTab | null>(null);
  const [listError, setListError] = useState('');

  const sentinelRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const requestRef = useRef<{
    tab: SupportTab;
    region: FilterRegion;
    controller: AbortController;
  } | null>(null);
  const regionRef = useRef<FilterRegion | null>(null);
  const mountedRef = useRef(false);

  const currentList = lists[activeTab];

  // 언마운트 시 진행 중인 목록 요청 취소
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      requestRef.current?.controller.abort();
      requestRef.current = null;
    };
  }, []);

  // 프로필 지역 조회. 상세 페이지 복귀 시에도 최신 지역을 확인한다.
  useEffect(() => {
    let active = true;

    const loadRegion = async () => {
      setRegionLoaded(false);
      setProfileError('');
      try {
        const profile = await getProfile();
        if (!active) return;

        const nextRegion = profile.region ?? '';
        const nextFilterRegion = getFilterRegion(nextRegion);

        // 기존 지역의 응답이 새 지역 캐시에 반영되지 않도록 즉시 취소
        if (regionRef.current !== nextFilterRegion || cachedRegion !== nextFilterRegion) {
          requestRef.current?.controller.abort();
          requestRef.current = null;
          setLoadingTab(null);
          setListError('');
        }

        regionRef.current = nextFilterRegion;
        setUserRegion(nextRegion);

        if (cachedRegion !== nextFilterRegion) {
          cachedData = createInitialCache();
          cachedScrollTop = 0;
          cachedRegion = nextFilterRegion;
          setLists(cachedData);
          if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollTop = 0;
          }
        }
      } catch {
        if (!active) return;
        requestRef.current?.controller.abort();
        requestRef.current = null;
        regionRef.current = null;
        setUserRegion('');
        setLoadingTab(null);

        cachedData = createInitialCache();
        cachedRegion = null;
        cachedScrollTop = 0;
        setLists(cachedData);

        setProfileError('지역 정보를 불러오지 못했습니다.');
      } finally {
        if (active) setRegionLoaded(true);
      }
    };

    void loadRegion();
    return () => {
      active = false;
    };
  }, [profileRetryKey]);

  const loadPage = useCallback(
    async (tab: SupportTab, page: number) => {
      const region = filterRegion;
      if (!region || !regionLoaded || profileError || requestRef.current) return;

      const controller = new AbortController();
      requestRef.current = { tab, region, controller };
      setLoadingTab(tab);
      setListError('');

      try {
        const params = { region, page, size: PAGE_SIZE };

        if (tab === 'programs') {
          const result = await getSupportPrograms(params, controller.signal);
          if (controller.signal.aborted || regionRef.current !== region || !mountedRef.current) return;

          setLists((prev) => {
            if (page <= prev.programs.page || cachedRegion !== region) return prev;
            const next: SupportCache = {
              ...prev,
              programs: {
                items: page === 0 ? result.items : [...prev.programs.items, ...result.items],
                page: result.page,
                hasNext: result.has_next,
                loaded: true,
              },
            };
            cachedData = next;
            return next;
          });
        } else {
          const result = await getSupportOrganizations(params, controller.signal);
          if (controller.signal.aborted || regionRef.current !== region || !mountedRef.current) return;

          setLists((prev) => {
            if (page <= prev.organizations.page || cachedRegion !== region) return prev;
            const next: SupportCache = {
              ...prev,
              organizations: {
                items: page === 0 ? result.items : [...prev.organizations.items, ...result.items],
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
        if (controller.signal.aborted || regionRef.current !== region || !mountedRef.current) return;
        setListError(err instanceof Error ? err.message : '목록을 불러오지 못했습니다.');
      } finally {
        if (requestRef.current?.controller === controller) {
          requestRef.current = null;
           if (mountedRef.current) setLoadingTab(null);
        }
      }
    },
    [filterRegion, regionLoaded, profileError],
  );

  // 지역이 준비된 뒤 최초 목록 요청 (탭별 최초 1회)
  useEffect(() => {
    if (!regionLoaded || !filterRegion || profileError || listError) return;
    if (currentList.loaded || requestRef.current) return;

    const timer = window.setTimeout(() => {
      void loadPage(activeTab, 0);
    }, 0);
    return () => window.clearTimeout(timer);
  }, [activeTab, currentList.loaded, regionLoaded, filterRegion, profileError, listError, loadPage]);

  // 무한 스크롤: 지역에 해당하는 다음 페이지 요청
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (
      !regionLoaded || !filterRegion || profileError || !sentinel ||
      !currentList.loaded || !currentList.hasNext ||
      loadingTab !== null || listError
    ) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting || requestRef.current) return;
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
    regionLoaded,
    filterRegion,
    profileError,
    loadingTab,
    listError,
    loadPage,
  ]);

  // 목록 및 스크롤 위치 복원
  useEffect(() => {
    if (!regionLoaded || !filterRegion) return;
    const scrollEl = scrollContainerRef.current;
    if (!scrollEl) return;

    const frame = requestAnimationFrame(() => {
      scrollEl.scrollTop = cachedScrollTop;
    });
    const saveScroll = () => {
      cachedScrollTop = scrollEl.scrollTop;
    };
    scrollEl.addEventListener('scroll', saveScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      scrollEl.removeEventListener('scroll', saveScroll);
    };
  }, [regionLoaded, filterRegion]);

  const handleTabChange = (tab: SupportTab) => {
    if (tab === activeTab) return;
    requestRef.current?.controller.abort();
    requestRef.current = null;
    setLoadingTab(null);
    setListError('');
    cachedScrollTop = 0;
    if (scrollContainerRef.current) scrollContainerRef.current.scrollTop = 0;
    setSearchParams(tab === 'programs' ? {} : { tab }, { replace: true });
  };

  const handleRetry = () => {
    if (profileError || !filterRegion) {
      setProfileRetryKey((prev) => prev + 1);
      return;
    }
    void loadPage(activeTab, currentList.loaded ? currentList.page + 1 : 0);
  };

  const displayedError = profileError || listError;
  const regionMissing = regionLoaded && !profileError && !filterRegion;

  return (
    <div
      ref={scrollContainerRef}
      className="scrollbar-hide h-full overflow-y-auto overscroll-contain bg-background px-10 pb-8"
    >
      {/* 함께 위로 스크롤되어 사라지는 상단 안내 헤더 */}
      <header className="flex flex-col gap-2 border-b border-border pt-8 pb-8">
        <p className="text-label text-primary">FIND YOUR SUPPORT</p>
        <h1 className="text-title text-text-main">
          필요한 도움을 가까이에서 찾아요
        </h1>
        <p className="text-caption text-text-sub">
          나에게 맞는 프로그램과 기관을 살펴보세요.
        </p>
        <p className="text-button text-text-main">
          나의 지역: {!regionLoaded ? '' : userRegion || '지역 미설정'}
        </p>
        <p className="text-caption text-primary-pressed">
          나의 지역은 '내 정보'에서 수정할 수 있어요.
        </p>
      </header>

      {/* 스크롤 시 상단에 고정되는 탭 */}
      <section className="sticky top-0 z-10 -mx-10 bg-background px-10 py-6">
        <SupportTabs activeTab={activeTab} onChange={handleTabChange} />
      </section>

      {/* 무한 스크롤 목록 */}
      <section className="flex flex-col gap-3">
        {regionLoaded && !profileError && filterRegion && activeTab === 'programs'
          ? lists.programs.items.map((program) => (
              <ProgramCard key={program.program_id} program={program} />
            ))
          : regionLoaded && !profileError && filterRegion && activeTab === 'organizations'
            ? lists.organizations.items.map((organization) => (
                <OrganizationCard
                  key={organization.organization_id}
                  organization={organization}
                />
              ))
            : null}

        {(!regionLoaded || (loadingTab === activeTab && !currentList.loaded)) &&
          !regionMissing &&
          !displayedError && (
            <div className="flex justify-center py-5">
              <LoadingText text="목록을 불러오는 중..." />
            </div>
          )}

        {regionMissing && (
          <p className="py-5 text-center text-caption text-text-sub">
            지원 지역을 설정해 주세요. 부천시와 화성시를 지원해요.
          </p>
        )}

        {displayedError && (
          <div role="alert" className="p-5 text-center">
            <p className="mb-3 text-sm text-text-sub">{displayedError}</p>
            <button
              type="button"
              onClick={handleRetry}
              className="rounded-sm bg-primary px-5 py-2 text-caption text-surface"
            >
              다시 시도
            </button>
          </div>
        )}

        {filterRegion && regionLoaded && currentList.loaded && currentList.items.length === 0 &&
          !displayedError && loadingTab === null && (
            <p className="py-5 text-center text-caption text-text-sub">
              등록된 정보가 없어요.
            </p>
          )}

        <div ref={sentinelRef} aria-hidden="true" className="h-1" />

        {filterRegion && regionLoaded && currentList.loaded && !currentList.hasNext &&
          currentList.items.length > 0 && (
            <p className="py-1 text-center text-caption text-text-sub">
              모든 정보를 확인했어요.
            </p>
          )}
      </section>
    </div>
  );
}