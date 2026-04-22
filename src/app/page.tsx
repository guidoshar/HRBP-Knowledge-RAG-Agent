import { cookies } from 'next/headers';
import HRBPHeader from '@/components/HRBPHeader';
import QuickExperienceCards from '@/components/QuickExperienceCards';
import { verifyToken } from '@/lib/auth';

export default async function Home() {
  const token = (await cookies()).get('hrbp_token')?.value;
  const user = token ? await verifyToken(token) : null;

  return (
    <main className="min-h-screen bg-[#0f0f0f] text-white">
      <HRBPHeader user={user ? { name: user.name, role: user.role, dept: user.dept } : null} />

      <section className="max-w-6xl mx-auto px-4 pt-10 pb-4">
        <div className="rounded-2xl border border-white/10 bg-gradient-to-r from-[#C8102E] to-[#57111d] p-8">
          <p className="text-sm uppercase tracking-widest text-white/70 mb-2">SharkNinja HRBP Platform</p>
          <h1 className="text-3xl md:text-4xl font-bold mb-3">AI 政策问答 + RBAC 快速体验</h1>
          <p className="text-white/85 max-w-3xl">
            当前平台已接入 Azure GPT-5 与 HR_Policy 知识库检索，主页下方六个弹窗均为全 Mock 富媒体演示，仅 FAB Agent 会调用 AI。
          </p>
        </div>
      </section>

      <QuickExperienceCards />
    </main>
  );
}

