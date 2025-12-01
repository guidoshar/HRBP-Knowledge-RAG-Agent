'use client';

import Image from 'next/image';
import Header from '@/components/Header';
import Hero from '@/components/Hero';

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      {/* 背景图片 + 遮罩 */}
      <div className="fixed inset-0 z-0">
        {/* 上海夜景背景 */}
        <Image
          src="https://guidoshar.com/wp-content/uploads/2025/12/20230411175037_7394_0.jpg"
          alt="Background"
          fill
          className="object-cover"
          priority
          quality={85}
        />
        
        {/* 深色遮罩层 */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/80 to-black/90" />
        
        {/* 额外的渐变效果 */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary-dark/10 via-transparent to-accent-purple/10" />
        
        {/* 网格纹理（可选） */}
        <div 
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
          }}
        />
      </div>

      {/* 内容层 */}
      <div className="relative z-10">
        {/* 顶部导航 */}
        <Header />

        {/* 主内容区域 */}
        <Hero />

        {/* 页脚信息 */}
        <footer className="relative py-8 text-center">
          <div className="max-w-4xl mx-auto px-4">
            <div className="glass-dark rounded-2xl p-6">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="text-sm text-gray-400">
                  © 2024 MOOV International Logistics. All rights reserved.
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    隐私政策
                  </a>
                  <span className="text-gray-600">|</span>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    服务条款
                  </a>
                  <span className="text-gray-600">|</span>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    联系我们
                  </a>
                </div>
              </div>
              
              {/* Demo标识 */}
              <div className="mt-4 pt-4 border-t border-white/10">
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                  Demo Version - 仅供演示
                </span>
              </div>
            </div>
          </div>
        </footer>
      </div>

      {/* 装饰性粒子效果（可选） */}
      <ParticleBackground />
    </main>
  );
}

// 粒子背景效果
function ParticleBackground() {
  return (
    <div className="fixed inset-0 z-[1] pointer-events-none overflow-hidden">
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 bg-primary/30 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animation: `float ${5 + Math.random() * 10}s ease-in-out infinite`,
            animationDelay: `${Math.random() * 5}s`,
          }}
        />
      ))}
    </div>
  );
}

