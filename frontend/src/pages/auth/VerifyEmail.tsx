import { Link } from 'react-router-dom';

export default function VerifyEmail() {
  return (
    <div className="bg-surface-container-low text-on-surface antialiased min-h-screen flex items-center justify-center p-4">
      {/* Email Container */}
      <div className="max-w-[600px] w-full bg-surface-bright shadow-[0_40px_80px_-15px_rgba(27,28,25,0.04)] rounded-lg overflow-hidden flex flex-col items-center">
        {/* Header */}
        <header className="w-full bg-[#fbf9f4] dark:bg-stone-950 flex items-center justify-between px-8 py-6 max-w-2xl mx-auto">
          <div className="flex flex-col items-center mx-auto space-y-2">
            <div className="flex items-center space-x-2">
              <span className="material-symbols-outlined text-[#735c00] dark:text-[#d4af37] text-3xl">security</span>
              <h1 className="text-2xl font-extrabold text-[#735c00] dark:text-[#d4af37] uppercase tracking-widest font-['Manrope']">Win-Way</h1>
            </div>
            {/* Premium Gold Bar Accent */}
            <div className="h-1 w-16 bg-gradient-to-r from-primary to-primary-container rounded-full"></div>
          </div>
        </header>

        {/* Content Canvas */}
        <main className="w-full px-8 py-12 text-center flex flex-col items-center">
          {/* Icon Decoration */}
          <div className="w-16 h-16 bg-surface-container-low rounded-full flex items-center justify-center mb-8">
            <span className="material-symbols-outlined text-primary text-4xl">key</span>
          </div>

          {/* Title */}
          <h2 className="text-2xl font-bold text-on-background mb-4 tracking-tight leading-snug">
            인증번호를 확인해 주세요.
          </h2>

          {/* Subtext */}
          <p className="text-on-surface-variant text-base leading-relaxed mb-10 max-w-[400px]">
            나의 행운 관리 접근을 위해 아래의 6자리 인증번호를 앱 화면에 입력해 주세요.
          </p>

          {/* Verification Code Area */}
          <div className="w-full bg-surface-container-low rounded-lg p-8 mb-10 border border-outline-variant/15">
            <div className="flex justify-center space-x-3 sm:space-x-4">
              <div className="w-12 h-16 sm:w-14 sm:h-20 bg-surface-container-lowest flex items-center justify-center rounded-md shadow-sm">
                <span className="text-3xl sm:text-4xl font-extrabold text-primary font-['Manrope']">8</span>
              </div>
              <div className="w-12 h-16 sm:w-14 sm:h-20 bg-surface-container-lowest flex items-center justify-center rounded-md shadow-sm">
                <span className="text-3xl sm:text-4xl font-extrabold text-primary font-['Manrope']">2</span>
              </div>
              <div className="w-12 h-16 sm:w-14 sm:h-20 bg-surface-container-lowest flex items-center justify-center rounded-md shadow-sm">
                <span className="text-3xl sm:text-4xl font-extrabold text-primary font-['Manrope']">4</span>
              </div>
              <div className="w-12 h-16 sm:w-14 sm:h-20 bg-surface-container-lowest flex items-center justify-center rounded-md shadow-sm">
                <span className="text-3xl sm:text-4xl font-extrabold text-primary font-['Manrope']">1</span>
              </div>
              <div className="w-12 h-16 sm:w-14 sm:h-20 bg-surface-container-lowest flex items-center justify-center rounded-md shadow-sm">
                <span className="text-3xl sm:text-4xl font-extrabold text-primary font-['Manrope']">0</span>
              </div>
              <div className="w-12 h-16 sm:w-14 sm:h-20 bg-surface-container-lowest flex items-center justify-center rounded-md shadow-sm">
                <span className="text-3xl sm:text-4xl font-extrabold text-primary font-['Manrope']">5</span>
              </div>
            </div>
          </div>

          <div className="w-full h-px bg-surface-container-high mb-8"></div>

          <div className="flex flex-col space-y-2 text-sm text-on-surface-variant">
            <div className="flex items-center justify-center space-x-2 text-primary font-medium">
              <span className="material-symbols-outlined text-sm">timer</span>
              <span>인증번호는 5분간 유효합니다.</span>
            </div>
            <p>본인이 요청하지 않은 경우 이 메일을 무시하셔도 됩니다.</p>
          </div>
        </main>

        {/* Footer */}
        <footer className="w-full mt-12 pb-12 bg-[#fbf9f4] dark:bg-stone-950 border-t border-[#d0c5af]/15 max-w-2xl mx-auto px-8 flex flex-col items-center text-center space-y-4 pt-12">
          <div className="text-sm font-bold text-[#4d4635] tracking-tight">윈웨이 분석 시스템</div>
          <div className="flex space-x-4 text-[12px] font-['Noto_Sans_KR'] text-[#4d4635] dark:text-stone-500">
            <Link to="#" className="hover:text-[#d4af37] transition-colors">개인정보처리방침</Link>
            <span className="text-outline-variant">|</span>
            <Link to="#" className="hover:text-[#d4af37] transition-colors">이용약관</Link>
            <span className="text-outline-variant">|</span>
            <Link to="#" className="hover:text-[#d4af37] transition-colors">고객센터</Link>
          </div>
          <p className="font-['Noto_Sans_KR'] text-[12px] leading-relaxed text-stone-500 opacity-90">
            © 2024 Win-Way Analytical Intelligence. 모든 권리 보유.
          </p>
          {/* Decorative Branding Element */}
          <div className="pt-4">
            <img className="h-6 w-auto opacity-20 grayscale" alt="minimalist gold leaf or abstract oracle symbol representing analytical intelligence and luck" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDlLvC0pkE5TpMpbXd3gwd1FnyW6MSog_qD2iwbBwA6Qbo1cJIUMw57F7VLSfeInmZ8h64gDUSZRP1-c4RXvqfC7K_JLFj-R6EG1pFqHVp7bZrRzkq9k5Q3jegaeg_fiix46_e1RN0ddF6evwRNh4mlLDEKWWFe214b37DZEwU-XUuCcWwpPEvbydtyhN1fUwySSTHfcp9WALbqfiAbg_6XBkOxsbgHjEmdOJmZQoJEmJ6diuDPPeCw0M49afMnlddo993zHKkRttA" />
          </div>
        </footer>
      </div>
    </div>
  );
}
