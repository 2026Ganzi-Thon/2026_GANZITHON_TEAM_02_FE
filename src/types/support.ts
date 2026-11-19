export type SupportTab = 'programs' | 'organizations';

export interface ApiResponse<T> {
  success: boolean;
  data: T;
}

export interface SupportListParams {
  region?: string;
  page?: number;
  size?: number;
}

export interface SupportListResponse<T> {
  items: T[];
  page: number;
  has_next: boolean;
}

export interface SupportProgram {
  program_id: number;
  title: string;
  region: string;
  target: string;
  schedule: string;
  place: string;
  cost: string;
  registered_at: string;
}

export interface SupportProgramDetail {
  program_id: number;
  title: string;
  description: string;
  operator: string;
  region: string;
  target: string;
  schedule: string;
  place: string;
  cost: string;
  eligibility: string;
  application_method: string;
  official_url: string | null;
}

export interface SupportOrganization {
  organization_id: number;
  name: string;
  services: string[];
  address: string;
  hours: string;
  phone: string;
  registered_at: string;
  official_url: string | null;
}

export interface SupportOrganizationDetail {
  organization_id: number;
  name: string;
  description: string;
  target: string;
  services: string[];
  address: string;
  hours: string;
  phone: string;
  usage_method: string;
  reservation_required: boolean | null;
  official_url: string | null;
}