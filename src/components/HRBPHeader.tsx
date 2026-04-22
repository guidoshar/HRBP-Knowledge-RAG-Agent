'use client';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRightFromBracket, faCircleUser } from '@fortawesome/free-solid-svg-icons';

interface HRBPHeaderProps {
  user: {
    name: string;
    role: string;
    dept: string;
  } | null;
}

const roleMap: Record<string, string> = {
  admin: '管理员',
  hrbp_manager: 'HRBP',
  employee: '员工',
};

export default function HRBPHeader({ user }: HRBPHeaderProps) {
  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    window.location.href = '/login';
  };

  return (
    <header className="border-b border-white/10 bg-[#111] sticky top-0 z-30">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <img src="/shark-logo.svg" alt="SharkNinja" className="h-7 w-auto" />
          <nav className="hidden md:flex items-center gap-4 text-sm text-white/75">
            <span>首页</span>
            <span>HR 政策</span>
            <span>我的档案</span>
            <span>帮助</span>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          {user ? (
            <div className="text-right text-xs">
              <p className="text-white font-semibold">
                {user.name} <span className="text-[#C8102E]">({roleMap[user.role] || user.role})</span>
              </p>
              <p className="text-white/60">{user.dept}</p>
            </div>
          ) : null}
          <FontAwesomeIcon icon={faCircleUser} className="text-white/80 text-xl" />
          <button
            onClick={handleLogout}
            className="rounded-md border border-white/20 px-3 py-2 text-sm hover:border-[#C8102E] hover:text-[#C8102E] transition-colors"
          >
            <FontAwesomeIcon icon={faArrowRightFromBracket} className="mr-2" />
            退出
          </button>
        </div>
      </div>
    </header>
  );
}
