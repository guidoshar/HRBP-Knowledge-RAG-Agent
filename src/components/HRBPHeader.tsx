'use client';

import { useState } from 'react';
import { Dropdown, Avatar } from '@heroui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faRightFromBracket, faUser, faShield, faBars, faXmark,
} from '@fortawesome/free-solid-svg-icons';

interface HRBPHeaderProps {
  user: { name: string; role: string; dept: string } | null;
}

const roleLabel: Record<string, { label: string; color: 'warning' | 'accent' | 'default' }> = {
  admin:        { label: '管理员', color: 'warning' },
  hrbp_manager: { label: 'HRBP',   color: 'accent' },
  employee:     { label: '员工',   color: 'default' },
};

const navItems = ['首页', '知识库管理', '关于我们'];

export default function HRBPHeader({ user }: HRBPHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const roleInfo = roleLabel[user?.role ?? ''] ?? { label: '访客', color: 'default' as const };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    window.location.href = '/login';
  };

  return (
    <header className="sticky top-0 z-40 bg-black/60 backdrop-blur-2xl border-b border-white/[0.06]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">

        {/* Brand */}
        <div className="flex items-center gap-3 shrink-0">
          <img
            src="/shark-logo.svg"
            alt="SharkNinja"
            className="h-5 w-auto brightness-0 invert"
          />
          <span className="text-xs font-medium text-white/40 hidden sm:block tracking-widest uppercase">
            HRBP Platform
          </span>
        </div>

        {/* Desktop nav */}
        <nav className="hidden sm:flex items-center gap-8 flex-1 justify-center">
          {navItems.map(item => (
            <span
              key={item}
              className="text-sm text-white/60 hover:text-white cursor-pointer transition-colors"
            >
              {item}
            </span>
          ))}
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-3">
          {user ? (
            <Dropdown>
              <Dropdown.Trigger>
                <div className="flex items-center gap-3 cursor-pointer group">
                  <div className="text-right hidden sm:block">
                    <p className="text-sm font-medium text-white leading-tight">{user.name}</p>
                    <p className="text-xs text-white/40">{user.dept}</p>
                  </div>
                  <div className="relative">
                    <Avatar>
                      <Avatar.Fallback className="bg-orange-500/20 text-orange-400 border border-orange-500/30 w-8 h-8 text-sm font-semibold rounded-full flex items-center justify-center">
                        {user.name.charAt(0)}
                      </Avatar.Fallback>
                    </Avatar>
                    <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-400 rounded-full border-2 border-black" />
                  </div>
                  <span className={`hidden sm:inline-flex items-center text-xs px-2 py-0.5 rounded-full font-medium ${
                    roleInfo.color === 'warning' ? 'bg-yellow-500/15 text-yellow-400' :
                    roleInfo.color === 'accent'  ? 'bg-blue-500/15 text-blue-400' :
                    'bg-white/10 text-white/60'
                  }`}>
                    {roleInfo.label}
                  </span>
                </div>
              </Dropdown.Trigger>
              <Dropdown.Popover className="bg-[#1a1a1a] border border-white/10 rounded-xl shadow-2xl min-w-[180px]">
                <Dropdown.Menu className="p-1">
                  <Dropdown.Item className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg hover:bg-white/[0.06] cursor-pointer transition-colors text-white/70 text-sm">
                    <FontAwesomeIcon icon={faUser} className="w-3 text-white/40" />
                    我的档案
                  </Dropdown.Item>
                  <Dropdown.Item className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg hover:bg-white/[0.06] cursor-pointer transition-colors text-white/70 text-sm">
                    <FontAwesomeIcon icon={faShield} className="w-3 text-white/40" />
                    角色：{roleInfo.label}
                  </Dropdown.Item>
                  <Dropdown.Item
                    className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg hover:bg-red-500/10 cursor-pointer transition-colors text-red-400 text-sm mt-1 border-t border-white/[0.06] pt-2"
                    onPress={handleLogout}
                  >
                    <FontAwesomeIcon icon={faRightFromBracket} className="w-3" />
                    退出登录
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown.Popover>
            </Dropdown>
          ) : (
            <button
              onClick={() => { window.location.href = '/login'; }}
              className="px-4 py-2 rounded-lg bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium transition-colors"
            >
              开始使用
            </button>
          )}

          {/* Mobile toggle */}
          <button
            onClick={() => setMenuOpen(v => !v)}
            className="sm:hidden p-2 text-white/60 hover:text-white transition-colors"
          >
            <FontAwesomeIcon icon={menuOpen ? faXmark : faBars} />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="sm:hidden border-t border-white/[0.06] bg-black/90 backdrop-blur-2xl px-4 py-4 space-y-3">
          {navItems.map(item => (
            <div key={item} className="text-white/70 text-base py-1">{item}</div>
          ))}
          {user && (
            <button onClick={handleLogout} className="text-red-400 text-base py-1 block">
              退出登录
            </button>
          )}
        </div>
      )}
    </header>
  );
}
