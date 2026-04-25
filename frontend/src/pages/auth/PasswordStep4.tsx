import { Link } from 'react-router-dom';

export default function PasswordStep4() {
  return (
    <div className="bg-background text-on-background font-body min-h-screen flex flex-col">
      {/* TopAppBar */}
      <header className="fixed top-0 w-full z-50 bg-[#fbf9f4]/70 dark:bg-[#1b1c19]/70 backdrop-blur-xl">
        <div className="flex justify-between items-center px-6 h-16 w-full max-w-7xl mx-auto">
          <div className="text-xl font-black text-[#735c00] dark:text-[#d4af37] tracking-tighter font-headline">
            Win-Way
          </div>
          <div className="text-[#4d4635] dark:text-[#d0c5af] font-label text-sm font-medium">
            4단계 중 4단계
          </div>
        </div>
      </header>

      <main className="flex-grow flex items-center justify-center px-6 pt-16 pb-12">
        <div className="w-full max-w-md">
          {/* Success Illustration & Content */}
          <div className="bg-surface-container-lowest rounded-lg p-10 flex flex-col items-center text-center shadow-[0_20px_40px_rgba(27,28,25,0.04)] relative overflow-hidden">
            {/* Asymmetric Background Accent */}
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-primary-container/10 rounded-full blur-3xl"></div>
            
            {/* Success Icon Cluster */}
            <div className="relative mb-8">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-primary-container flex items-center justify-center shadow-lg active:scale-95 duration-200 transition-all">
                <span className="material-symbols-outlined text-white text-5xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                  check_circle
                </span>
              </div>
              <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-surface-container-lowest flex items-center justify-center shadow-md">
                <span className="material-symbols-outlined text-primary text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                  celebration
                </span>
              </div>
            </div>

            <h1 className="font-headline font-bold text-2xl mb-4 text-on-surface tracking-tight">
                비밀번호 변경 완료!
            </h1>
            <p className="font-label text-on-surface-variant leading-relaxed mb-10">
                새로운 비밀번호로 로그인해 주세요. <br/>
                안전한 서비스 이용을 위해 주기적인 비밀번호 변경을 권장합니다.
            </p>

            {/* Action Button */}
            <Link className="w-full bg-gradient-to-br from-primary to-primary-container text-on-primary py-4 px-8 rounded-full font-label font-bold text-lg flex items-center justify-center gap-2 hover:opacity-90 active:scale-95 transition-all duration-200 shadow-lg" to="/auth/login">
              <span>로그인 화면으로 이동</span>
              <span className="material-symbols-outlined">arrow_forward</span>
            </Link>
          </div>

          {/* Footer Meta Info */}
          <div className="mt-8 text-center px-4">
            <p className="text-xs text-on-surface-variant/60 font-label">
                문제가 발생했나요? <a className="text-primary font-bold underline underline-offset-4 decoration-primary-container/30" href="#">고객센터 문의하기</a>
            </p>
          </div>
        </div>
      </main>

      {/* Success Toast */}
      <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[60] w-[90%] max-w-sm">
        <div className="bg-surface-container-lowest/90 backdrop-blur-xl border border-outline-variant/15 rounded-full px-6 py-4 flex items-center gap-3 shadow-[0_10px_30px_rgba(27,28,25,0.08)]">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
          </div>
          <p className="font-label text-sm font-medium text-on-surface">비밀번호가 성공적으로 변경되었습니다.</p>
        </div>
      </div>

      {/* Background Decorative Elements */}
      <div className="fixed top-0 left-0 w-full h-full -z-10 pointer-events-none opacity-40">
        <div className="absolute top-[10%] left-[5%] w-64 h-64 bg-primary-container/20 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-[10%] right-[5%] w-80 h-80 bg-surface-container-highest/50 rounded-full blur-[120px]"></div>
      </div>
    </div>
  );
}
