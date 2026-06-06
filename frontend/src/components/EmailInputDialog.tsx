import { useState } from 'react';

interface EmailInputDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (email: string) => void;
}

export default function EmailInputDialog({ isOpen, onClose, onConfirm }: EmailInputDialogProps) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const emailTrimmed = email.trim();
    if (!emailTrimmed) {
      setError('이메일 주소를 입력해주세요.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailTrimmed)) {
      setError('유효한 이메일 형식이 아닙니다.');
      return;
    }

    localStorage.setItem('verified_email', emailTrimmed);
    onConfirm(emailTrimmed);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="absolute inset-0 bg-stone-950/40 backdrop-blur-sm transition-opacity" 
      />

      {/* Content Canvas */}
      <div className="relative bg-white dark:bg-stone-900 rounded-3xl p-6 shadow-2xl border border-outline-variant/10 max-w-sm w-full animate-fade-in text-on-surface">
        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto mb-3">
            <span className="material-symbols-outlined text-amber-600 dark:text-amber-400">mail</span>
          </div>
          <h3 className="text-lg font-headline font-extrabold text-stone-900 dark:text-stone-100">이메일 본인확인</h3>
          <p className="text-xs text-on-surface-variant mt-1.5 leading-relaxed">
            번호를 저장하고 나중에 다시 조회하기 위해 <br />
            본인의 이메일 주소를 입력해 주세요.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="email"
              placeholder="example@email.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full bg-surface-container px-4 py-3 rounded-2xl border border-outline-variant/20 text-sm outline-none placeholder:text-on-surface-variant/40 text-on-surface font-semibold"
            />
            {error && (
              <p className="text-xs text-red-500 font-bold mt-2 ml-1">{error}</p>
            )}
          </div>

          <div className="flex gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 text-sm font-bold text-on-surface-variant bg-surface-container-high rounded-xl hover:bg-surface-variant active:scale-95 transition-all"
            >
              취소
            </button>
            <button
              type="submit"
              className="flex-1 py-3 text-sm font-bold text-white gold-gradient rounded-xl active:scale-95 transition-all shadow-md shadow-amber-500/20"
            >
              확인
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
