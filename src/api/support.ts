import { getProfile } from './profile';
import type {
  ApiResponse,
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

const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL ?? ''
).replace(/\/$/, '');

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';

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

async function request<T>(
  path: string,
  signal?: AbortSignal,
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
    credentials: 'include',
    signal,
  });

  if (!response.ok) {
    throw new SupportApiError(
      response.status,
      `요청에 실패했습니다. (${response.status})`,
    );
  }

  const result = (await response.json()) as ApiResponse<T>;

  if (!result.success) {
    throw new SupportApiError(
      response.status,
      '데이터를 불러오지 못했습니다.',
    );
  }

  return result.data;
}

function buildQuery(params: SupportListParams = {}) {
  const query = new URLSearchParams();

  if (params.region) {
    query.set('region', params.region);
  }

  if (params.page !== undefined) {
    query.set('page', String(params.page));
  }

  if (params.size !== undefined) {
    query.set('size', String(params.size));
  }

  const search = query.toString();
  return search ? `?${search}` : '';
}

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

  return request<SupportListResponse<SupportProgram>>(
    `/api/support/programs${buildQuery({ ...params, region: effectiveRegion })}`,
    signal,
  );
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

  return request<SupportProgramDetail>(
    `/api/support/programs/${programId}`,
    signal,
  );
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

  return request<SupportListResponse<SupportOrganization>>(
    `/api/support/organizations${buildQuery({ ...params, region: effectiveRegion })}`,
    signal,
  );
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

  return request<SupportOrganizationDetail>(
    `/api/support/organizations/${organizationId}`,
    signal,
  );
}