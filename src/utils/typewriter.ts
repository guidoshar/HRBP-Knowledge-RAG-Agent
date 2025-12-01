/**
 * 打字机效果工具函数
 */

export interface TypewriterOptions {
  speed?: number; // 每个字符的显示间隔（毫秒）
  onChar?: (char: string, fullText: string) => void;
  onComplete?: () => void;
}

/**
 * 使用Promise的打字机效果
 */
export function typewriterEffect(
  text: string,
  onUpdate: (displayText: string) => void,
  options: TypewriterOptions = {}
): Promise<void> {
  const { speed = 30, onChar, onComplete } = options;
  
  return new Promise((resolve) => {
    let index = 0;
    const chars = text.split('');
    
    const interval = setInterval(() => {
      if (index < chars.length) {
        const currentText = text.substring(0, index + 1);
        onUpdate(currentText);
        onChar?.(chars[index], currentText);
        index++;
      } else {
        clearInterval(interval);
        onComplete?.();
        resolve();
      }
    }, speed);
  });
}

/**
 * 创建一个可取消的打字机效果
 */
export function createCancelableTypewriter(
  text: string,
  onUpdate: (displayText: string) => void,
  options: TypewriterOptions = {}
) {
  const { speed = 30, onChar, onComplete } = options;
  
  let index = 0;
  let intervalId: NodeJS.Timeout | null = null;
  let isCancelled = false;
  
  const start = () => {
    intervalId = setInterval(() => {
      if (isCancelled) {
        if (intervalId) clearInterval(intervalId);
        return;
      }
      
      if (index < text.length) {
        const currentText = text.substring(0, index + 1);
        onUpdate(currentText);
        onChar?.(text[index], currentText);
        index++;
      } else {
        if (intervalId) clearInterval(intervalId);
        onComplete?.();
      }
    }, speed);
  };
  
  const cancel = () => {
    isCancelled = true;
    if (intervalId) {
      clearInterval(intervalId);
    }
  };
  
  const complete = () => {
    cancel();
    onUpdate(text);
    onComplete?.();
  };
  
  return { start, cancel, complete };
}

/**
 * 数字滚动效果
 */
export function animateNumber(
  from: number,
  to: number,
  duration: number,
  onUpdate: (value: number) => void,
  onComplete?: () => void
): () => void {
  const startTime = performance.now();
  let animationId: number;
  
  const animate = (currentTime: number) => {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    
    // 使用easeOutExpo缓动函数
    const easeOut = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
    const currentValue = Math.round(from + (to - from) * easeOut);
    
    onUpdate(currentValue);
    
    if (progress < 1) {
      animationId = requestAnimationFrame(animate);
    } else {
      onComplete?.();
    }
  };
  
  animationId = requestAnimationFrame(animate);
  
  // 返回取消函数
  return () => cancelAnimationFrame(animationId);
}

/**
 * 延迟执行
 */
export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * 带延迟的序列执行
 */
export async function sequentialWithDelay<T>(
  items: T[],
  action: (item: T, index: number) => void | Promise<void>,
  delayMs: number
): Promise<void> {
  for (let i = 0; i < items.length; i++) {
    await action(items[i], i);
    if (i < items.length - 1) {
      await delay(delayMs);
    }
  }
}

