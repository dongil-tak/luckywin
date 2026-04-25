import { useNavigate } from 'react-router-dom';

export default function PasswordStep2() {
  const navigate = useNavigate();

  return (
    <div className="bg-background text-on-background min-h-screen flex flex-col">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-xl">
        <div className="flex justify-between items-center px-6 h-16 w-full max-w-7xl mx-auto relative">
          <div className="flex items-center w-1/3">
            <button aria-label="뒤로 가기" className="flex items-center justify-center p-2 -ml-2 text-on-surface hover:bg-surface-container-high rounded-full transition-colors" onClick={() => navigate(-1)}>
              <span className="material-symbols-outlined text-2xl">chevron_left</span>
            </button>
          </div>
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <span className="text-xl font-black text-primary tracking-tighter font-headline">Win-Way</span>
          </div>
          <div className="flex items-center justify-end w-1/3">
            <span className="text-sm font-bold text-brand-orange font-body">제1150회차</span>
          </div>
        </div>
      </header>

      <main className="flex-grow flex items-center justify-center px-6 pt-16">
        <div className="w-full max-w-md">
          {/* Header Section */}
          <div className="mb-10 text-center">
            <h1 className="text-2xl font-bold font-headline text-on-surface mb-3">인증번호 입력</h1>
            <p className="text-on-surface-variant text-sm font-body leading-relaxed">이메일로 발송된 6자리 인증번호를 입력해 주세요.</p>
          </div>

          {/* Verification Card */}
          <div className="bg-surface-container-lowest p-6 rounded-lg shadow-[0_20px_40px_rgba(27,28,25,0.04)] relative overflow-hidden">
            {/* Abstract Gilded Background Detail */}
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-primary-container/10 rounded-full blur-3xl"></div>
            
            <form className="space-y-8" onSubmit={(e) => { e.preventDefault(); navigate('/auth/password/step3'); }}>
              {/* OTP Input Grid */}
              <div className="flex justify-between items-center gap-1.5 sm:gap-2">
                <input className="w-full aspect-square max-w-[48px] text-center text-xl font-bold bg-surface-container-low border-none rounded-full focus:ring-2 focus:ring-primary-container text-on-surface p-0" maxLength={1} type="text" defaultValue="4"/>
                <input className="w-full aspect-square max-w-[48px] text-center text-xl font-bold bg-surface-container-low border-none rounded-full focus:ring-2 focus:ring-primary-container text-on-surface p-0" maxLength={1} type="text" defaultValue="8"/>
                <input className="w-full aspect-square max-w-[48px] text-center text-xl font-bold bg-surface-container-low border-none rounded-full focus:ring-2 focus:ring-primary-container text-on-surface p-0" maxLength={1} placeholder="·" type="text"/>
                <input className="w-full aspect-square max-w-[48px] text-center text-xl font-bold bg-surface-container-low border-none rounded-full focus:ring-2 focus:ring-primary-container text-on-surface p-0" maxLength={1} placeholder="·" type="text"/>
                <input className="w-full aspect-square max-w-[48px] text-center text-xl font-bold bg-surface-container-low border-none rounded-full focus:ring-2 focus:ring-primary-container text-on-surface p-0" maxLength={1} placeholder="·" type="text"/>
                <input className="w-full aspect-square max-w-[48px] text-center text-xl font-bold bg-surface-container-low border-none rounded-full focus:ring-2 focus:ring-primary-container text-on-surface p-0" maxLength={1} placeholder="·" type="text"/>
              </div>

              {/* Timer Section */}
              <div className="flex flex-col items-center justify-center space-y-3">
                <div className="flex items-center gap-2 px-4 py-1.5 bg-surface-container-high rounded-full">
                  <span className="material-symbols-outlined text-sm text-primary">schedule</span>
                  <span className="text-sm font-bold font-body text-primary">3:00</span>
                </div>
                <button className="text-xs text-on-surface-variant underline decoration-outline-variant underline-offset-4 hover:text-primary transition-colors font-body" type="button">인증번호 재발송</button>
              </div>

              {/* Action Button */}
              <button className="w-full h-14 bg-gradient-to-br from-primary to-primary-container text-on-primary font-bold rounded-full shadow-lg shadow-primary/20 active:scale-[0.98] transition-all duration-200" type="submit">인증 확인</button>
            </form>
          </div>

          {/* Footer Links */}
          <div className="mt-8 text-center">
            <p className="text-xs text-on-surface-variant opacity-60 font-body">문제가 발생했나요? <a className="text-primary font-medium hover:underline" href="#">고객센터 문의</a></p>
          </div>
        </div>
      </main>

      {/* Visual Decorative Element */}
      <div className="fixed -bottom-24 -left-24 w-64 h-64 bg-primary-container/5 rounded-full blur-3xl -z-10"></div>
      <div className="fixed top-1/4 -right-16 w-48 h-48 bg-surface-container-highest/50 rounded-full blur-2xl -z-10"></div>
    </div>
  );
}
