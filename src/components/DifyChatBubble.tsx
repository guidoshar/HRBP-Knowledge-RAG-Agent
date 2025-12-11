'use client';

import { useEffect } from 'react';

declare global {
  interface Window {
    difyChatbotConfig?: Record<string, unknown>;
  }
}

// 配置常量
const BUBBLE_ID = 'NXCPXdtWJ0ibL0M4';
const MOOV_LOGO_URL = 'https://guidoshar.com/wp-content/uploads/2025/12/Group-1312319561.webp';

export default function DifyChatBubble() {
  useEffect(() => {
    // 1. 注入配置脚本
    const existingConfig = document.getElementById(`${BUBBLE_ID}-config`);
    if (!existingConfig) {
      const configScript = document.createElement('script');
      configScript.id = `${BUBBLE_ID}-config`;
      configScript.innerHTML = `
        window.difyChatbotConfig = {
          token: '${BUBBLE_ID}',
          inputs: {},
        };
      `;
      document.head.appendChild(configScript);
    }

    // 2. 注入“世界级”样式 - MOOV 定制版
    const styleId = `${BUBBLE_ID}-styles`;
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.innerHTML = `
        /* --- 悬浮按钮样式 --- */
        #dify-chatbot-bubble-button {
          background-color: #051125 !important; /* MOOV 深色底 */
          background-image: url('${MOOV_LOGO_URL}') !important;
          background-size: 55% !important; /* Logo 大小适中 */
          background-repeat: no-repeat !important;
          background-position: center center !important;
          border: 1px solid rgba(60, 130, 246, 0.3) !important; /* 科技蓝边框 */
          box-shadow: 0 0 20px rgba(28, 100, 242, 0.4), inset 0 0 10px rgba(28, 100, 242, 0.2) !important;
          width: 60px !important;
          height: 60px !important;
          border-radius: 50% !important;
          transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1) !important;
          backdrop-filter: blur(5px) !important;
        }

        /* 隐藏 Dify 默认的 SVG 图标，只显示我们的 Logo */
        #dify-chatbot-bubble-button svg {
          display: none !important;
        }

        /* 按钮悬停效果：上浮 + 辉光增强 */
        #dify-chatbot-bubble-button:hover {
          transform: translateY(-4px) scale(1.05) !important;
          box-shadow: 0 15px 35px rgba(28, 100, 242, 0.6), 0 0 0 2px rgba(255, 255, 255, 0.15) !important;
          border-color: rgba(60, 130, 246, 0.8) !important;
        }

        /* --- 聊天窗口样式 (Glassmorphism) --- */
        #dify-chatbot-bubble-window {
          width: 24rem !important; /* 约 384px */
          height: 42rem !important; /* 更修长的比例 */
          max-height: 85vh !important;
          border-radius: 24px !important; /* 更圆润的角 */
          
          /* 核心：高级磨砂玻璃质感 */
          background: rgba(5, 17, 37, 0.85) !important; 
          backdrop-filter: blur(24px) saturate(180%) !important;
          -webkit-backdrop-filter: blur(24px) saturate(180%) !important;
          
          /* 边框和阴影 */
          border: 1px solid rgba(255, 255, 255, 0.08) !important;
          box-shadow: 
            0 20px 50px -12px rgba(0, 0, 0, 0.8), 
            0 0 0 1px rgba(255, 255, 255, 0.05) inset !important;
          
          overflow: hidden !important;
          transition: opacity 0.3s ease, transform 0.3s cubic-bezier(0.25, 0.8, 0.25, 1) !important;
        }

        /* 确保 iframe 背景透明，透出玻璃效果 */
        #dify-chatbot-bubble-window iframe {
          background: transparent !important;
        }
        
        /* 移动端适配优化 */
        @media (max-width: 768px) {
           #dify-chatbot-bubble-window {
             width: 90vw !important;
             height: 80vh !important;
             bottom: 80px !important;
             right: 5vw !important;
           }
        }
      `;
      document.head.appendChild(style);
    }

    // 3. 注入 embed 脚本
    if (!document.getElementById(BUBBLE_ID)) {
      const script = document.createElement('script');
      script.src = 'https://udify.app/embed.min.js';
      script.id = BUBBLE_ID;
      script.defer = true;
      document.body.appendChild(script);
    }
  }, []);

  return null;
}
