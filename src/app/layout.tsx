import type { Metadata } from 'next';
import '@/styles/globals.css';
import FABAgent from '@/components/FABAgent';

export const metadata: Metadata = {
  title: 'SharkNinja HRBP 智能问答平台',
  description: '基于 RBAC + Azure GPT-5 的 HR 政策智能问答平台',
  keywords: ['SharkNinja', 'HRBP', 'RBAC', 'Azure GPT-5', 'HR Policy'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link 
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" 
          rel="stylesheet" 
        />
      </head>
      <body className="antialiased">
        {children}
        <FABAgent />
      </body>
    </html>
  );
}

