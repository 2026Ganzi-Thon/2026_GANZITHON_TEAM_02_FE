import { getProfile } from './profile';
import { USE_SUPABASE, supabase } from '../utils/supabase';
import type {
  SupportListParams,
  SupportListResponse,
  SupportProgram,
  SupportProgramDetail,
  SupportOrganization,
  SupportOrganizationDetail,
} from '../types/support';

import {
  mockPrograms,
  mockProgramDetails,
  mockOrganizations,
  mockOrganizationDetails,
  paginateMockData,
} from '../mocks/support';

/** Supabase 미설정 또는 VITE_USE_MOCK=true 이면 목업 */
const USE_MOCK = !USE_SUPABASE;

const mockDelay = () =>
  new Promise<void>((resolve) => setTimeout(resolve, 300));

export class SupportApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = 'SupportApiError';
    this.status = status;
  }
}

/* ---------------------------------------------------------
 * Supabase: support_programs / support_organizations (비로그인 포함 누구나 조회)
 * --------------------------------------------------------- */

type ProgramRow = {
  id: number;
  title: string;
  description: string | null;
  operator: string | null;
  region: string | null;
  target: string | null;
  schedule: string | null;
  place: string | null;
  cost: string | null;
  eligibility: string | null;
  application_method: string | null;
  official_url: string | null;
  registered_at: string;
};

type OrganizationRow = {
  id: number;
  name: string;
  description: string | null;
  region: string | null;
  target: string | null;
  services: string[] | null;
  address: string | null;
  hours: string | null;
  phone: string | null;
  usage_method: string | null;
  reservation_required: boolean | null;
  official_url: string | null;
  registered_at: string;
};

function throwIfError(error: { message: string; code?: string } | null, message: string) {
  if (!error) return;
  console.error('[Supabase]', error.code, error.message);
  throw new SupportApiError(500, message);
}

/** '경기도 부천시 소사구' → 단어별 부분 일치 OR 조건 (목업의 지역 매칭과 같은 기준) */
function regionFilter(region: string | undefined, columns: string[]) {
  const parts = (region ?? '')
    .split(' ')
    .map((part) => part.replace(/[,()%*]/g, '').trim())
    .filter(Boolean);
  if (parts.length === 0) return null;
  return parts.flatMap((part) => columns.map((column) => `${column}.ilike.*${part}*`)).join(',');
}

function pageRange(params: SupportListParams) {
  const page = Math.max(0, params.page ?? 0);
  const size = Math.max(1, params.size ?? 10);
  // 다음 페이지 존재 여부를 알기 위해 1개 더 조회
  return { page, size, from: page * size, to: page * size + size };
}

async function fetchList<Row>(
  table: 'support_programs' | 'support_organizations',
  columns: string,
  regionColumns: string[],
  params: SupportListParams,
  region: string | undefined,
  signal?: AbortSignal,
): Promise<{ rows: Row[]; page: number; has_next: boolean }> {
  const { page, size, from, to } = pageRange(params);

  const run = async (withRegion: boolean) => {
    let query = supabase
      .from(table)
      .select(columns)
      .order('registered_at', { ascending: false })
      .order('id', { ascending: false })
      .range(from, to);
    const filter = withRegion ? regionFilter(region, regionColumns) : null;
    if (filter) query = query.or(filter);
    if (signal) query = query.abortSignal(signal);
    const { data, error } = await query.returns<Row[]>();
    throwIfError(error, '데이터를 불러오지 못했습니다.');
    return data ?? [];
  };

  let rows = await run(true);
  // 목업과 같이: 내 지역 결과가 하나도 없으면 전체 목록을 보여준다
  if (rows.length === 0 && page === 0 && region) rows = await run(false);

  return { rows: rows.slice(0, size), page, has_next: rows.length > size };
}

const PROGRAM_LIST_COLUMNS = 'id, title, region, target, schedule, place, cost, registered_at';
const ORGANIZATION_LIST_COLUMNS = 'id, name, services, address, hours, phone, registered_at, official_url';

export async function getSupportPrograms(
  params: SupportListParams = {},
  signal?: AbortSignal,
) {
  let effectiveRegion = params.region;
  if (!effectiveRegion) {
    try {
      const userProfile = await getProfile();
      if (userProfile.region) {
        effectiveRegion = userProfile.region;
      }
    } catch {
      // ignore
    }
  }

  if (USE_MOCK) {
    await mockDelay();

    if (signal?.aborted) {
      throw new DOMException('Aborted', 'AbortError');
    }

    const filtered = effectiveRegion
      ? mockPrograms.filter((program) => {
          // 시/도 또는 시/군/구 단위 매칭 지원
          const parts = effectiveRegion!.split(' ').filter(Boolean);
          return parts.some((p) => program.region.includes(p)) || program.region.includes(effectiveRegion!);
        })
      : mockPrograms;

    return paginateMockData(filtered.length > 0 ? filtered : mockPrograms, params);
  }

  const { rows, page, has_next } = await fetchList<ProgramRow>(
    'support_programs',
    PROGRAM_LIST_COLUMNS,
    ['region'],
    params,
    effectiveRegion,
    signal,
  );
  const result: SupportListResponse<SupportProgram> = {
    items: rows.map((row) => ({
      program_id: row.id,
      title: row.title,
      region: row.region ?? '',
      target: row.target ?? '',
      schedule: row.schedule ?? '',
      place: row.place ?? '',
      cost: row.cost ?? '',
      registered_at: row.registered_at,
    })),
    page,
    has_next,
  };
  return result;
}

export async function getSupportProgramDetail(
  programId: number,
  signal?: AbortSignal,
) {
  if (USE_MOCK) {
    await mockDelay();

    if (signal?.aborted) {
      throw new DOMException('Aborted', 'AbortError');
    }

    const program = mockProgramDetails.find(
      (item) => item.program_id === programId,
    );

    if (!program) {
      throw new SupportApiError(
        404,
        '프로그램을 찾을 수 없습니다.',
      );
    }

    return program;
  }

  let query = supabase.from('support_programs').select('*').eq('id', programId);
  if (signal) query = query.abortSignal(signal);
  const { data, error } = await query.maybeSingle<ProgramRow>();
  throwIfError(error, '프로그램 정보를 불러오지 못했습니다.');
  if (!data) throw new SupportApiError(404, '프로그램을 찾을 수 없습니다.');

  const detail: SupportProgramDetail = {
    program_id: data.id,
    title: data.title,
    description: data.description ?? '',
    operator: data.operator ?? '',
    region: data.region ?? '',
    target: data.target ?? '',
    schedule: data.schedule ?? '',
    place: data.place ?? '',
    cost: data.cost ?? '',
    eligibility: data.eligibility ?? '',
    application_method: data.application_method ?? '',
    official_url: data.official_url,
  };
  return detail;
}

export async function getSupportOrganizations(
  params: SupportListParams = {},
  signal?: AbortSignal,
) {
  let effectiveRegion = params.region;
  if (!effectiveRegion) {
    try {
      const userProfile = await getProfile();
      if (userProfile.region) {
        effectiveRegion = userProfile.region;
      }
    } catch {
      // ignore
    }
  }

  if (USE_MOCK) {
    await mockDelay();

    if (signal?.aborted) {
      throw new DOMException('Aborted', 'AbortError');
    }

    // 기관 목록 응답에는 region 필드가 없으므로
    // Mock에서는 주소를 기준으로 지역 필터링
    const filtered = effectiveRegion
      ? mockOrganizations.filter((organization) => {
          const parts = effectiveRegion!.split(' ').filter(Boolean);
          return parts.some((p) => organization.address.includes(p)) || organization.address.includes(effectiveRegion!);
        })
      : mockOrganizations;

    return paginateMockData(filtered.length > 0 ? filtered : mockOrganizations, params);
  }

  const { rows, page, has_next } = await fetchList<OrganizationRow>(
    'support_organizations',
    ORGANIZATION_LIST_COLUMNS + ', region',
    ['region', 'address'],
    params,
    effectiveRegion,
    signal,
  );
  const result: SupportListResponse<SupportOrganization> = {
    items: rows.map((row) => ({
      organization_id: row.id,
      name: row.name,
      services: row.services ?? [],
      address: row.address ?? '',
      hours: row.hours ?? '',
      phone: row.phone ?? '',
      registered_at: row.registered_at,
      official_url: row.official_url,
    })),
    page,
    has_next,
  };
  return result;
}

export async function getSupportOrganizationDetail(
  organizationId: number,
  signal?: AbortSignal,
) {
  if (USE_MOCK) {
    await mockDelay();

    if (signal?.aborted) {
      throw new DOMException('Aborted', 'AbortError');
    }

    const organization = mockOrganizationDetails.find(
      (item) => item.organization_id === organizationId,
    );

    if (!organization) {
      throw new SupportApiError(
        404,
        '기관을 찾을 수 없습니다.',
      );
    }

    return organization;
  }

  let query = supabase.from('support_organizations').select('*').eq('id', organizationId);
  if (signal) query = query.abortSignal(signal);
  const { data, error } = await query.maybeSingle<OrganizationRow>();
  throwIfError(error, '기관 정보를 불러오지 못했습니다.');
  if (!data) throw new SupportApiError(404, '기관을 찾을 수 없습니다.');

  const detail: SupportOrganizationDetail = {
    organization_id: data.id,
    name: data.name,
    description: data.description ?? '',
    target: data.target ?? '',
    services: data.services ?? [],
    address: data.address ?? '',
    hours: data.hours ?? '',
    phone: data.phone ?? '',
    usage_method: data.usage_method ?? '',
    reservation_required: data.reservation_required,
    official_url: data.official_url,
  };
  return detail;
}