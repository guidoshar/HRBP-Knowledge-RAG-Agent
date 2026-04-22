import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';
import HRBPHeader from '@/components/HRBPHeader';
import QuickExperienceCards from '@/components/QuickExperienceCards';
import HeroSection from '@/components/HeroSection';

export default async function Home() {
  const token = (await cookies()).get('hrbp_token')?.value;
  const user  = token ? await verifyToken(token) : null;

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">
      <HRBPHeader user={user ? { name: user.name, role: user.role, dept: user.dept } : null} />
      <HeroSection />
      <QuickExperienceCards />

      {/* Footer */}
      <footer className="border-t border-white/[0.04] py-8 mt-8">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img src="/shark-logo.svg" alt="SharkNinja" className="h-4 brightness-0 invert opacity-30" />
            <span className="text-xs text-white/25">© 2026 SharkNinja. HRBP Platform Demo.</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse inline-block" />
            <span className="text-xs text-white/25">Demo Version · 仅供内部演示</span>
          </div>
        </div>
      </footer>
    </main>
  );
}
