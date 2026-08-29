import { Link } from 'react-router-dom';

interface Section {
  title: string;
  body: string[];
}

interface LegalDocProps {
  title: string;
  updatedAt: string;
  sections: Section[];
}

/** 개인정보처리방침·이용약관 공용 레이아웃 */
export default function LegalDoc({ title, updatedAt, sections }: LegalDocProps) {
  return (
    <div className="min-h-screen bg-surface">
      <header className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-50 bg-surface/95 backdrop-blur border-b border-outline-variant/20">
        <div className="flex items-center gap-3 px-5 h-14">
          <Link to="/dashboard" className="text-on-surface-variant hover:text-on-surface transition-colors">
            <span className="material-symbols-outlined text-xl">arrow_back</span>
          </Link>
          <h1 className="text-base font-bold font-headline text-on-surface">{title}</h1>
        </div>
      </header>

      <main className="pt-20 pb-16 px-6 max-w-2xl mx-auto">
        <p className="text-xs text-on-surface-variant mb-6">시행일 {updatedAt}</p>

        <div className="space-y-7">
          {sections.map((s) => (
            <section key={s.title}>
              <h2 className="text-sm font-bold text-on-surface mb-2">{s.title}</h2>
              {s.body.map((p, i) => (
                <p key={i} className="text-[13px] leading-relaxed text-on-surface-variant mb-2 whitespace-pre-line">
                  {p}
                </p>
              ))}
            </section>
          ))}
        </div>
      </main>
    </div>
  );
}
