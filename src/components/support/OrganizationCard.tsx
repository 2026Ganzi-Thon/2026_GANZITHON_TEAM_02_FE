import type { SupportOrganization } from '../../types/support';

type OrganizationCardProps = {
  organization: SupportOrganization;
};

export function OrganizationCard({
  organization,
}: OrganizationCardProps) {
  return (
    <article className="rounded-[12px] border border-border bg-surface px-6 py-2">
      <h3 className="text-section text-text-main">
        {organization.name}
      </h3>

      <div className="mb-2 h-px bg-border" />

      <dl className="flex flex-col gap-2 text-caption text-[#332C29]">
        <div className="flex items-center gap-2.5">
          <dt className="shrink-0 rounded-[12px] bg-surface-warm px-3">
            주소
          </dt>
          <dd className="break-words">
            {organization.address}
          </dd>
        </div>

        <div className="flex items-center gap-2.5">
          <dt className="shrink-0 rounded-[12px] bg-surface-warm px-3">
            운영
          </dt>
          <dd className="break-words">
            {organization.hours}
          </dd>
        </div>

        <div className="flex items-center gap-2.5">
          <dt className="shrink-0 rounded-[12px] bg-surface-warm px-3">
            연락처
          </dt>
          <dd>
            <a
              href={`tel:${organization.phone.replace(/[^0-9+]/g, '')}`}
              className="underline"
            >
              {organization.phone}
            </a>
          </dd>
        </div>
      </dl>

      {organization.official_url ? (
        <a
          href={organization.official_url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-1 block text-right text-caption text-[#332C29] hover:underline"
        >
          공식 홈페이지 이동 ↗
        </a>
      ) : (
        <span className="mt-1 block text-right text-caption text-text-sub">
          홈페이지 준비중
        </span>
      )}
    </article>
  );
}