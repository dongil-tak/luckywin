import { Link, useNavigate } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();

  return (
    <div className="bg-background text-on-surface min-h-screen flex flex-col">
      {/* TopAppBar */}
      <header className="fixed top-0 w-full z-50 bg-[#fbf9f4]/70 backdrop-blur-xl shadow-[0_20px_40px_rgba(27,28,25,0.04)]">
        <div className="flex justify-between items-center px-6 h-16 w-full max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <span className="material-symbols-outlined text-on-surface hover:opacity-80 transition-opacity cursor-pointer">menu</span>
            <h1 className="text-xl font-black text-[#735c00] tracking-tighter font-headline">Win-Way</h1>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[#d4af37] text-xs font-bold tracking-tight bg-surface-container-high px-3 py-1 rounded-full">1150회차</span>
          </div>
        </div>
      </header>
      
      <main className="flex-grow flex items-center justify-center px-6 pt-24 pb-12">
        <div className="w-full max-w-md">
          {/* Hero Illustration/Abstract Section */}
          <div className="mb-10 text-center">
            <div className="inline-block p-4 rounded-xl bg-surface-container-low mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary-container rounded-full flex items-center justify-center shadow-lg">
                <span className="material-symbols-outlined text-white text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>lock</span>
              </div>
            </div>
            <h2 className="text-3xl font-headline font-extrabold text-on-surface tracking-tight mb-2">로그인 및 인증</h2>
            <p className="text-on-surface-variant font-label text-sm">데이터 기반의 당첨 분석 시스템에 접속하세요</p>
          </div>
          
          {/* Login Form Card */}
          <div className="bg-surface-container-lowest p-8 rounded-lg shadow-[0_20px_40px_rgba(27,28,25,0.04)]">
            <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); navigate('/dashboard'); }}>
              {/* Email Input */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-on-surface-variant font-headline tracking-widest uppercase ml-1" htmlFor="email">이메일 주소</label>
                <div className="relative">
                  <input className="w-full bg-surface-container-low border-none rounded-sm px-4 py-4 text-on-surface focus:ring-2 focus:ring-primary-container transition-all placeholder:text-outline/50" id="email" placeholder="이메일 주소를 입력하세요" type="email"/>
                </div>
              </div>
              
              {/* Password Input */}
              <div className="space-y-2">
                <div className="flex justify-between items-center px-1">
                  <label className="block text-xs font-bold text-on-surface-variant font-headline tracking-widest uppercase" htmlFor="password">비밀번호</label>
                  <Link to="/auth/password/step1" className="text-xs font-label text-primary font-medium hover:underline">비밀번호 찾기</Link>
                </div>
                <div className="relative">
                  <input className="w-full bg-surface-container-low border-none rounded-sm px-4 py-4 text-on-surface focus:ring-2 focus:ring-primary-container transition-all placeholder:text-outline/50" id="password" placeholder="••••••••" type="password"/>
                  <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant cursor-pointer">visibility</span>
                </div>
              </div>
              
              {/* Toggles and Remember */}
              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-2">
                  <div className="relative inline-flex items-center cursor-pointer">
                    <input className="sr-only peer" id="remember" type="checkbox"/>
                    <div className="w-10 h-5 bg-surface-container-highest rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary-container"></div>
                    <span className="ml-2 text-sm font-label text-on-surface-variant">이메일 기억하기</span>
                  </div>
                </div>
              </div>
              
              {/* CTA Button */}
              <button className="w-full bg-gradient-to-br from-primary to-primary-container text-white py-4 rounded-full font-headline font-bold text-lg shadow-lg hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2" type="submit">
                  로그인 및 시작
                  <span className="material-symbols-outlined">arrow_forward</span>
              </button>
            </form>
          </div>
          
          {/* Notice & Footer Links */}
          <div className="mt-8 text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-surface-container-high rounded-full">
              <span className="material-symbols-outlined text-primary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>info</span>
              <p className="text-[11px] font-label text-on-surface-variant leading-none">90일 동안 로그인 상태가 유지됩니다 (공용 기기 주의)</p>
            </div>
            <div className="pt-4 flex justify-center gap-6">
              <Link to="/auth/verify" className="text-xs font-label text-outline hover:text-on-surface transition-colors">회원가입</Link>
              <div className="w-[1px] h-3 bg-outline-variant self-center"></div>
              <a className="text-xs font-label text-outline hover:text-on-surface transition-colors" href="#">고객센터</a>
              <div className="w-[1px] h-3 bg-outline-variant self-center"></div>
              <a className="text-xs font-label text-outline hover:text-on-surface transition-colors" href="#">이용약관</a>
            </div>
          </div>
        </div>
      </main>
      
      {/* Decorative Background Elements */}
      <div className="fixed -z-10 top-0 right-0 w-1/3 h-1/2 bg-gradient-to-bl from-primary/5 to-transparent blur-3xl pointer-events-none"></div>
      <div className="fixed -z-10 bottom-0 left-0 w-1/4 h-1/3 bg-gradient-to-tr from-primary-container/10 to-transparent blur-3xl pointer-events-none"></div>
      <div className="fixed inset-0 -z-20 opacity-[0.03] pointer-events-none" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAnUX09aYIJp-fmTA6rDS9iXa_yGSLTLf5HeoG0dvsUQrDlytfuQqdikmmQss3wTeFj2PthAw8hJ9eL60wkh0bjk8x31AyBzd-BGPwe4ar3x558VBUKRuCQoInXLlcNqGEvhnmp_qmhAZcmoYMrxMhvjJ_NrTCBHuIS-kij05TRY0GtH3iYiMCzm0_ex95lX-_zdaRvGdQ73mT_hk7vXcO3rz-xzmXJVxtMZMvqFPtVKUTvnM1HE5P8PuVES3xBwwaTn6fHvooEO6s')" }}></div>
    </div>
  );
}
