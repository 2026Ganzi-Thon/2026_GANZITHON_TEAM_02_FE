import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { MobileLayout } from '../../layouts/MobileLayout';
import { getSupportProgramDetail } from '../../api/support';

import type { SupportProgramDetail } from '../../types/support';
import { Header } from '../../components/Header';
import { LoadingText } from '../../components/LoadingText';

export function ProgramDetailPage() {
  const { programId } = useParams();
  const navigate = useNavigate();

  const [program, setProgram] =
    useState<SupportProgramDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    const id = Number(programId);

    const fetchDetail = async () => {
      if (!Number.isSafeInteger(id) || id <= 0) {
        setError('올바르지 않은 프로그램 번호입니다.');
        setLoading(false);
        return;
      }

      setLoading(true);
      setError('');
      setProgram(null);

      try {
        const data = await getSupportProgramDetail(
          id,
          controller.signal,
        );
        setProgram(data);
      } catch (err) {
        if (controller.signal.aborted) return;

        setError(
          err instanceof Error
            ? err.message
            : '프로그램 정보를 불러오지 못했습니다.',
        );
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    void fetchDetail();

    return () => controller.abort();
  }, [programId, retryKey]);

  const details = program
    ? [
        ['운영 기관', program.operator],
        ['지역', program.region],
        ['대상', program.target],
        ['일정', program.schedule],
        ['장소', program.place],
        ['비용', program.cost],
        ['신청 자격', program.eligibility],
        ['신청 방법', program.application_method],
      ]
    : [];

  const officialUrl = program?.official_url;
  const validOfficialUrl =
    officialUrl &&
    /^https?:\/\//i.test(officialUrl)
      ? officialUrl
      : null;

  return (
    <MobileLayout>
      <div className="flex flex-col h-full min-h-0 overflow-hidden bg-background">
        <Header showBack={true} onBack={() => navigate(-1)}/>

        <main className="scrollbar-hide min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-6">
          {loading && (
            <div className="py-10 flex justify-center">
              <LoadingText text="정보를 불러오는 중..." />
            </div>
          )}

          {!loading && error && (
            <div role="alert" className="py-10 text-center">
              <p className="mb-4 text-sm text-primary">
                {error}
              </p>
              <button
                type="button"
                onClick={() => setRetryKey((prev) => prev + 1)}
                className="rounded-full bg-primary px-5 py-2 text-button text-surface"
              >
                다시 시도
              </button>
            </div>
          )}

          {!loading && program && (
            <>
              <div className="rounded-[12px] border border-border bg-surface px-5 py-3">
                <h2 className="text-center text-section text-text-main mb-3">
                  {program.title}
                </h2>

                <div className='border-t border-border'/>

                <p className="whitespace-pre-line text-caption text-[#332C29]">
                  {program.description}
                </p>

                <dl className="mt-3 flex flex-col gap-4 ">
                  {details.map(([label, value]) => (
                    <div key={label}>
                      <dt className="mb-1 text-section text-text-sub">
                        {label}
                      </dt>
                      <dd className="whitespace-pre-line break-words text-sm text-text-main">
                        {value?.trim() || '-'}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>

              {validOfficialUrl ? (
                <a
                  href={validOfficialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 flex min-h-12 items-center justify-center rounded-[10px] bg-primary py-2 text-center text-section text-white"
                >
                  공식 홈페이지로 이동
                </a>
              ) : (
                <p className="mt-6 text-center text-sm text-text-sub">
                  공식 홈페이지 정보가 제공되지 않았어요.
                </p>
              )}
            </>
          )}
        </main>
      </div>
    </MobileLayout>
  );
}
