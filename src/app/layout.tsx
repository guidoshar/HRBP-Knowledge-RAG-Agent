import type { Metadata } from 'next';
import '@/styles/globals.css';
import FABAgent from '@/components/FABAgent';

export const metadata: Metadata = {
  title: 'SharkNinja HRBP — 智能政策问答平台',
  description: '基于 RBAC + Azure GPT-5 + HR_Policy 知识库的企业 HR 智能助手',
  keywords: ['SharkNinja', 'HRBP', 'HR', 'RBAC', 'Azure GPT-5', 'HR Policy'],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap"
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
