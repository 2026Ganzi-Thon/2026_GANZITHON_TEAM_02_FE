import { Link } from 'react-router-dom';
import type { SupportProgram } from '../../types/support';

type ProgramCardProps = {
  program: SupportProgram;
};

const fields = [
  ['대상', 'target'],
  ['일정', 'schedule'],
  ['장소', 'place'],
  ['비용', 'cost'],
] as const;

export function ProgramCard({
  program,
}: ProgramCardProps) {
  return (
    <Link
      to={`/support/programs/${program.program_id}`}
      className="block rounded-[12px] border border-border bg-surface px-6 py-2"
    >
      <div className="flex items-center justify-between">
        <h3 className="min-w-0 text-section text-text-main">
          {program.title}
        </h3>
        <span
          aria-hidden="true"
          className="shrink-0 text-lg text-text-main"
        >
          ›
        </span>
      </div>

      <div className="my-2 h-px bg-border" />

      <dl className="flex flex-col gap-2">
        {fields.map(([label, key]) => (
          <div
            key={key}
            className="flex items-start gap-2.5 text-caption px-1 py-0.5"
          >
            <dt className="inline-flex h-5 w-12 shrink-0 items-center justify-center rounded-[12px] bg-surface-warm text-[#332C29]">
              {label}
            </dt>
            <dd className="min-w-0 flex-1 break-words text-[#332C29] leading-5">
              {program[key]?.trim() || '-'}
            </dd>
          </div>
        ))}
      </dl>
    </Link>
  );
}