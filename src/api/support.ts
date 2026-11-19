
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

/** Supabase 미설정이면 Mock 사용 */
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
 * 지역 필터
 * 지원 지역: 경기도 부천시 / 경기도 화성시
 * --------------------------------------------------------- */

type SupportRegion = '경기도 부천시' | '경기도 화성시';

function normalizeRegion(
  region?: string | null,
): SupportRegion | null {
  if (!region) return null;

  if (region.includes('부천시')) {
    return '경기도 부천시';
  }

  if (region.includes('화성시')) {
    return '경기도 화성시';
  }

  return null;
}

/**
 * Supabase 지역 검색 조건 생성
 *
 * 프로그램: region
 * 기관: region 또는 address
 */
function regionFilter(
  region: SupportRegion,
  columns: string[],
): string {
  const city =
    region === '경기도 부천시' ? '부천시' : '화성시';

  return columns
    .map((column) => `${column}.ilike.*${city}*`)
    .join(',');
}

/**
 * 요청에 region이 있으면 해당 값을 사용하고,
 * 없으면 사용자 프로필에서 지역을 가져온다.
 */
async function resolveRegion(
  region?: string,
): Promise<SupportRegion> {
  let effectiveRegion = normalizeRegion(region);

  if (!effectiveRegion && !region) {
    try {
      const profile = await getProfile();
      effectiveRegion = normalizeRegion(profile.region);
    } catch {
      throw new SupportApiError(
        500,
        '지역 정보를 불러오지 못했습니다.',
      );
    }
  }

  if (!effectiveRegion) {
    throw new SupportApiError(
      400,
      '지원 지역을 설정해 주세요.',
    );
  }

  return effectiveRegion;
}

/* ---------------------------------------------------------
 * Supabase: support_programs / support_organizations
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

function throwIfError(
  error: { message: string; code?: string } | null,
  message: string,
) {
  if (!error) return;

  console.error('[Supabase]', error.code, error.message);
  throw new SupportApiError(500, message);
}

/* ---------------------------------------------------------
 * 페이지네이션
 * --------------------------------------------------------- */

function pageRange(params: SupportListParams) {
  const page = Math.max(0, params.page ?? 0);
  const size = Math.max(1, params.size ?? 10);

  // 다음 페이지 존재 여부를 확인하기 위해 1개 더 조회
  return {
    page,
    size,
    from: page * size,
    to: page * size + size,
  };
}

/* ---------------------------------------------------------
 * 공통 목록 조회
 * --------------------------------------------------------- */

async function fetchList<Row>(
  table: 'support_programs' | 'support_organizations',
  columns: string,
  regionColumns: string[],
  params: SupportListParams,
  region: SupportRegion,
  signal?: AbortSignal,
): Promise<{
  rows: Row[];
  page: number;
  has_next: boolean;
}> {
  const { page, size, from, to } = pageRange(params);

  let query = supabase
    .from(table)
    .select(columns)
    .or(regionFilter(region, regionColumns))
    .order('registered_at', { ascending: false })
    .order('id', { ascending: false })
    .range(from, to);

  if (signal) {
    query = query.abortSignal(signal);
  }

  const { data, error } = await query.returns<Row[]>();

  throwIfError(error, '데이터를 불러오지 못했습니다.');

  const rows = data ?? [];

  // 해당 지역 데이터가 없어도 전체 목록으로 대체하지 않음
  return {
    rows: rows.slice(0, size),
    page,
    has_next: rows.length > size,
  };
}

const PROGRAM_LIST_COLUMNS =
  'id, title, region, target, schedule, place, cost, registered_at';

const ORGANIZATION_LIST_COLUMNS =
  'id, name, services, address, hours, phone, registered_at, official_url';

/* ---------------------------------------------------------
 * 프로그램 목록 조회
 * --------------------------------------------------------- */

export async function getSupportPrograms(
  params: SupportListParams = {},
  signal?: AbortSignal,
): Promise<SupportListResponse<SupportProgram>> {
  const region = await resolveRegion(params.region);

  if (signal?.aborted) {
    throw new DOMException('Aborted', 'AbortError');
  }

  if (USE_MOCK) {
    await mockDelay();

    if (signal?.aborted) {
      throw new DOMException('Aborted', 'AbortError');
    }

    const city =
      region === '경기도 부천시' ? '부천시' : '화성시';

    const filtered = mockPrograms.filter((program) =>
      program.region.includes(city),
    );

    return paginateMockData(filtered, params);
  }

  const { rows, page, has_next } =
    await fetchList<ProgramRow>(
      'support_programs',
      PROGRAM_LIST_COLUMNS,
      ['region'],
      params,
      region,
      signal,
    );

  return {
    items: rows.map((row) => ({
      program_id: row.id,
      title: row.title,
      region: row.region ?? '',
      target: row.target ?? '',
      schedule: row.schedule ?? '',
      place: row.place ?? '',
      cost: row.cost ?? '',
      registered_at: row.registered_at ?? row.registered_at,
    })),
    page,
    has_next,
  };
}

/* ---------------------------------------------------------
 * 프로그램 상세 조회
 * --------------------------------------------------------- */

export async function getSupportProgramDetail(
  programId: number,
  signal?: AbortSignal,
): Promise<SupportProgramDetail> {
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

  let query = supabase
    .from('support_programs')
    .select('*')
    .eq('id', programId);

  if (signal) {
    query = query.abortSignal(signal);
  }

  const { data, error } =
    await query.maybeSingle<ProgramRow>();

  throwIfError(
    error,
    '프로그램 정보를 불러오지 못했습니다.',
  );

  if (!data) {
    throw new SupportApiError(
      404,
      '프로그램을 찾을 수 없습니다.',
    );
  }

  return {
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
}

/* ---------------------------------------------------------
 * 기관 목록 조회
 * --------------------------------------------------------- */

export async function getSupportOrganizations(
  params: SupportListParams = {},
  signal?: AbortSignal,
): Promise<SupportListResponse<SupportOrganization>> {
  const region = await resolveRegion(params.region);

  if (signal?.aborted) {
    throw new DOMException('Aborted', 'AbortError');
  }

  if (USE_MOCK) {
    await mockDelay();

    if (signal?.aborted) {
      throw new DOMException('Aborted', 'AbortError');
    }

    const city =
      region === '경기도 부천시' ? '부천시' : '화성시';

    const filtered = mockOrganizations.filter(
      (organization) =>
        organization.address.includes(city),
    );

    return paginateMockData(filtered, params);
  }

  const { rows, page, has_next } =
    await fetchList<OrganizationRow>(
      'support_organizations',
      ORGANIZATION_LIST_COLUMNS + ', region',
      ['region', 'address'],
      params,
      region,
      signal,
    );

  return {
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
}

/* ---------------------------------------------------------
 * 기관 상세 조회
 * --------------------------------------------------------- */

export async function getSupportOrganizationDetail(
  organizationId: number,
  signal?: AbortSignal,
): Promise<SupportOrganizationDetail> {
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

  let query = supabase
    .from('support_organizations')
    .select('*')
    .eq('id', organizationId);

  if (signal) {
    query = query.abortSignal(signal);
  }

  const { data, error } =
    await query.maybeSingle<OrganizationRow>();

  throwIfError(
    error,
    '기관 정보를 불러오지 못했습니다.',
  );

  if (!data) {
    throw new SupportApiError(
      404,
      '기관을 찾을 수 없습니다.',
    );
  }

  return {
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
}
