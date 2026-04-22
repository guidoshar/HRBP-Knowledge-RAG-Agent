'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';

const DEMO_ACCOUNTS = [
  { username: 'admin', password: 'Admin@2026', role: 'admin' },
  { username: 'hrbp', password: 'HRBP@2026', role: 'hrbp_manager' },
  { username: 'emp001', password: 'Emp@2026', role: 'employee' },
];

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('hrbp');
  const [password, setPassword] = useState('HRBP@2026');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      const resp = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await resp.json();
      if (!resp.ok) {
        throw new Error(data?.message || '登录失败');
      }

      router.push('/');
      router.refresh();
    } catch (err: any) {
      setError(err?.message || '登录失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#101010] text-white flex items-center justify-center px-4">
      <div className="w-full max-w-5xl grid md:grid-cols-2 rounded-2xl overflow-hidden border border-white/10">
        <div className="bg-gradient-to-b from-[#C8102E] to-[#1A1A1A] p-10 flex flex-col justify-between">
          <div>
            <img src="/shark_logo_large.svg" alt="SharkNinja" className="h-12 w-auto mb-8" />
            <h1 className="text-3xl font-bold mb-3">SharkNinja HRBP</h1>
            <p className="text-white/80">
              基于 RBAC 的智能政策问答平台，支持 Azure GPT-5 与 HR_Policy 知识库检索。
            </p>
          </div>
          <div className="text-sm text-white/80 space-y-2">
            <p className="font-semibold">Mock 登录账号</p>
            {DEMO_ACCOUNTS.map((acc) => (
              <p key={acc.username}>
                {acc.username} / {acc.password} ({acc.role})
              </p>
            ))}
          </div>
        </div>

        <div className="p-10 bg-[#151515]">
          <h2 className="text-2xl font-semibold mb-6">登录平台</h2>
          <form className="space-y-4" onSubmit={onSubmit}>
            <div>
              <label className="block text-sm text-white/70 mb-2" htmlFor="username">
                用户名
              </label>
              <input
                id="username"
                className="w-full rounded-lg bg-[#232323] border border-white/15 px-4 py-3 outline-none focus:border-[#C8102E]"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="请输入用户名"
              />
            </div>
            <div>
              <label className="block text-sm text-white/70 mb-2" htmlFor="password">
                密码
              </label>
              <input
                id="password"
                type="password"
                className="w-full rounded-lg bg-[#232323] border border-white/15 px-4 py-3 outline-none focus:border-[#C8102E]"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="请输入密码"
              />
            </div>
            {error ? <p className="text-sm text-red-300">{error}</p> : null}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-[#C8102E] hover:bg-[#b50d29] disabled:opacity-70 transition-colors py-3 font-semibold"
            >
              {loading ? '登录中...' : '登录'}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
