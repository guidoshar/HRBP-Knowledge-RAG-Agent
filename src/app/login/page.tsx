'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faLock, faShield, faRobot } from '@fortawesome/free-solid-svg-icons';

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const resp = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username.trim(), password }),
      });
      const data = await resp.json();
      if (!resp.ok) throw new Error(data?.message || '登录失败');
      router.push('/');
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : '登录失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-orange-500/[0.05] blur-[130px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-orange-600/[0.03] blur-[100px] pointer-events-none" />

      <div className="w-full max-w-4xl grid md:grid-cols-2 rounded-3xl overflow-hidden relative z-10"
        style={{ border: '1px solid rgba(255,255,255,0.07)', background: 'rgba(255,255,255,0.02)', backdropFilter: 'blur(20px)' }}>

        {/* ── Left branding panel ── */}
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="p-10 flex flex-col justify-between"
          style={{ background: 'linear-gradient(135deg, rgba(249,115,22,0.12) 0%, rgba(234,88,12,0.05) 100%)' }}
        >
          <div>
            <img src="/shark_logo_large.svg" alt="SharkNinja" className="h-8 w-auto mb-8 brightness-0 invert" />

            <h1 className="text-3xl font-bold text-white mb-3 leading-tight">
              HRBP<br />
              <span className="gradient-text-orange">智能问答平台</span>
            </h1>
            <p className="text-sm text-white/50 leading-relaxed">
              企业级人力资源智能助手，基于 Azure GPT-5 与 HR_Policy 知识库，为员工提供专业、快速的 HR 政策查询服务。
            </p>

            <div className="mt-10 space-y-4">
              {[
                { icon: faShield, title: '标准 JWT 鉴权',    desc: 'HS256 · httpOnly Cookie · 8h 会话' },
                { icon: faRobot,  title: 'Azure GPT-5 驱动', desc: '接入 HR_Policy 知识库 RAG 检索' },
                { icon: faLock,   title: 'RBAC 角色权限',    desc: '管理员 / HRBP / 员工三级权限体系' },
              ].map(item => (
                <div key={item.title} className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-orange-500/15 border border-orange-500/20 flex items-center justify-center shrink-0 mt-0.5">
                    <FontAwesomeIcon icon={item.icon} className="text-orange-400 text-xs" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white/80">{item.title}</p>
                    <p className="text-xs text-white/40 mt-0.5">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <p className="mt-10 text-xs text-white/20 leading-relaxed">
            如需获取账号，请联系所在部门 HR Business Partner 或 IT 管理员。
          </p>
        </motion.div>

        {/* ── Right login panel ── */}
        <motion.div
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="p-10 bg-[#111111] flex flex-col justify-center"
        >
          <h2 className="text-2xl font-bold text-white mb-2">欢迎登录</h2>
          <p className="text-sm text-white/40 mb-8">请输入您的企业账号凭证</p>

          <form onSubmit={onSubmit} className="space-y-5">
            {/* Username */}
            <div className="space-y-1.5">
              <label className="text-xs text-white/40 uppercase tracking-wider font-medium">用户名</label>
              <div className="relative">
                <FontAwesomeIcon
                  icon={faUser}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-white/25 text-sm pointer-events-none"
                />
                <input
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  className="w-full bg-white/[0.04] border border-white/[0.1] focus:border-orange-500/60 rounded-xl px-4 py-3.5 pl-11 text-white text-sm outline-none transition-all placeholder-white/20"
                  placeholder="请输入用户名"
                  autoComplete="username"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-xs text-white/40 uppercase tracking-wider font-medium">密码</label>
              <div className="relative">
                <FontAwesomeIcon
                  icon={faLock}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-white/25 text-sm pointer-events-none"
                />
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full bg-white/[0.04] border border-white/[0.1] focus:border-orange-500/60 rounded-xl px-4 py-3.5 pl-11 text-white text-sm outline-none transition-all placeholder-white/20"
                  placeholder="请输入密码"
                  autoComplete="current-password"
                  required
                />
              </div>
            </div>

            {error && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3"
              >
                {error}
              </motion.p>
            )}

            <button
              type="submit"
              disabled={loading || !username || !password}
              className="w-full rounded-xl py-4 font-semibold text-sm text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                background: 'linear-gradient(135deg, #F97316 0%, #EA580C 100%)',
                boxShadow: loading || !username || !password ? 'none' : '0 8px 24px rgba(249,115,22,0.3)',
              }}
            >
              {loading ? '登录中…' : '登录平台'}
            </button>
          </form>

          <div className="mt-10 pt-6 border-t border-white/[0.05]">
            <p className="text-xs text-white/20 text-center">
              遇到登录问题？请联系 HR 或 IT 支持
            </p>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
