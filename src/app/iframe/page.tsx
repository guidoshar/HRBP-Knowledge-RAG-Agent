'use client';

export default function IframeShowcase() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-[#0b1a33] via-[#0f2346] to-[#0b1a33] text-white flex items-center justify-center px-6 py-10">
      <div className="w-full max-w-5xl glass-strong rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
        <header className="px-8 py-6 border-b border-white/10 bg-white/5">
          <h1 className="text-2xl font-semibold">荷瑞工作流 Iframe 展示</h1>
          <p className="text-sm text-gray-300 mt-2">
            纯文字展示，嵌入独立 iframe，方便在平台中单独预览。
          </p>
        </header>

        <div className="p-8 bg-[#0c1c38]">
          <div className="aspect-video w-full rounded-2xl overflow-hidden border border-white/10 bg-[#0a152b]">
            <iframe
              title="Horei Workflow Iframe"
              srcDoc={`
                <style>
                  body {
                    margin: 0;
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
                    background: linear-gradient(135deg, #0b1a33 0%, #0f2346 50%, #0b1a33 100%);
                    color: #e6eefc;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    height: 100vh;
                  }
                  .card {
                    max-width: 720px;
                    padding: 32px;
                    border-radius: 20px;
                    background: rgba(255,255,255,0.04);
                    border: 1px solid rgba(255,255,255,0.12);
                    box-shadow: 0 10px 40px rgba(0,0,0,0.35);
                  }
                  h2 { margin: 0 0 12px; font-size: 24px; color: #9ac6ff; }
                  p { margin: 0 0 8px; line-height: 1.7; }
                  .pill {
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    padding: 8px 12px;
                    border-radius: 999px;
                    background: linear-gradient(90deg, #1f4b99, #2d66d1);
                    color: #e9f1ff;
                    font-size: 12px;
                    letter-spacing: 0.4px;
                  }
                  .muted { color: #9db4d8; font-size: 14px; }
                </style>
                <div class="card">
                  <div class="pill">Horei · Dify Workflow</div>
                  <h2>远程调用结果</h2>
                  <p>此区域可替换为真实的工作流输出文本，保持纯文字展示，适配荷瑞平台的深邃蓝白风格。</p>
                  <p class="muted">如需对接真实数据，可将 srcDoc 替换为后端输出或远程页面地址。</p>
                </div>
              `}
              className="w-full h-full border-0"
            />
          </div>
        </div>
      </div>
    </main>
  );
}





