import { useNavigate } from 'react-router-dom';

export default function PasswordStep3() {
  const navigate = useNavigate();

  return (
    <div className="bg-background text-on-background min-h-screen flex flex-col">
      {/* TopAppBar */}
      <header className="fixed top-0 w-full z-50 bg-[#fbf9f4]/70 backdrop-blur-xl shadow-[0_20px_40px_rgba(27,28,25,0.04)]">
        <div className="flex justify-between items-center px-6 h-16 w-full max-w-7xl mx-auto">
          <div className="flex-1 flex justify-start">
            <button className="active:scale-95 duration-200 hover:opacity-80 transition-opacity" onClick={() => navigate(-1)}>
              <span className="material-symbols-outlined text-on-surface text-[24px]">arrow_back</span>
            </button>
          </div>
          <div className="flex-1 flex justify-center">
            <div className="text-xl font-black text-[#735c00] tracking-tighter font-headline">Win-Way</div>
          </div>
          <div className="flex-1 flex justify-end">
            <span className="text-[13px] font-bold text-on-surface-variant font-label whitespace-nowrap">제1150회차</span>
          </div>
        </div>
      </header>

      <main className="flex-grow flex items-center justify-center px-6 pt-24 pb-12">
        <div className="w-full max-w-md">
          {/* Header Section */}
          <div className="mb-10 text-center">
            <h1 className="text-3xl font-bold font-headline text-on-surface tracking-tight mb-2">새 비밀번호 설정</h1>
            <p className="text-on-surface-variant font-label text-sm">보안을 위해 강력한 비밀번호를 설정해주세요.</p>
          </div>

          {/* Form Card */}
          <div className="bg-surface-container-lowest rounded-lg p-8 shadow-[0_20px_40px_rgba(27,28,25,0.04)] border border-outline-variant/10">
            <form className="space-y-8" onSubmit={(e) => { e.preventDefault(); navigate('/auth/password/step4'); }}>
              {/* Password Input Group */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-on-surface-variant font-label px-1">새 비밀번호</label>
                  <div className="relative group">
                    <input className="w-full bg-surface-container-low border-none rounded-DEFAULT py-4 px-5 text-on-surface placeholder:text-outline/50 focus:ring-2 focus:ring-primary-container transition-all" placeholder="새 비밀번호를 입력하세요" type="password"/>
                    <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-outline/60 cursor-pointer">visibility_off</span>
                  </div>
                  {/* Security Strength Indicator */}
                  <div className="pt-2 px-1">
                    <div className="flex gap-1 h-1.5 mb-2">
                      <div className="flex-1 bg-primary rounded-full"></div>
                      <div className="flex-1 bg-primary rounded-full"></div>
                      <div className="flex-1 bg-primary-container rounded-full opacity-30"></div>
                      <div className="flex-1 bg-primary-container rounded-full opacity-30"></div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-bold text-primary font-label">보안 등급: 보통</span>
                      <span className="text-[10px] text-on-surface-variant font-label">8자 이상, 숫자, 특수문자 포함</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2 pt-2">
                  <label className="block text-xs font-bold text-on-surface-variant font-label px-1">새 비밀번호 확인</label>
                  <div className="relative group">
                    <input className="w-full bg-surface-container-low border-none rounded-DEFAULT py-4 px-5 text-on-surface placeholder:text-outline/50 focus:ring-2 focus:ring-primary-container transition-all" placeholder="비밀번호를 한번 더 입력하세요" type="password"/>
                    <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-outline/60 cursor-pointer">visibility_off</span>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button className="w-full py-4 rounded-full bg-gradient-to-br from-primary to-primary-container text-on-primary font-bold text-base shadow-lg shadow-primary/20 active:scale-[0.98] transition-all hover:opacity-90" type="submit">
                  비밀번호 변경하기
              </button>
            </form>
          </div>

          {/* Footer Meta */}
          <div className="mt-8 text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-surface-container-high rounded-full">
              <span className="material-symbols-outlined text-sm text-primary">verified_user</span>
              <span className="text-[11px] font-medium text-on-surface-variant font-label">종단간 암호화로 데이터가 보호됩니다</span>
            </div>
          </div>
        </div>
      </main>

      {/* Decorative Elements */}
      <div className="fixed -bottom-24 -left-24 w-64 h-64 bg-primary-container/10 rounded-full blur-[80px] -z-10"></div>
      <div className="fixed top-24 -right-12 w-48 h-48 bg-primary/5 rounded-full blur-[60px] -z-10"></div>
    </div>
  );
}
