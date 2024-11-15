import confetti from "canvas-confetti";

function randomInRange(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

export function launchConfetti({
  randomDirection = false,
  count = 70,
}: { randomDirection?: boolean; count?: number } = {}) {
  const defaults = {
    origin: { y: 0.7 }, // 设置默认的起始位置
  };

  // Helper function to fire confetti with particle ratio and options
  function fire(particleRatio: number, opts: any) {
    confetti({
      ...defaults,
      ...opts,
      particleCount: Math.floor(count * particleRatio), // 控制粒子数
    });
  }

  (function frame() {
    // 控制不同的发射模式和粒子效果
    fire(0.25, {
      spread: randomDirection ? randomInRange(20, 30) : 26, // 随机范围或固定
      startVelocity: randomDirection ? randomInRange(45, 65) : 55, // 随机起始速度或固定
    });

    fire(0.2, {
      spread: randomDirection ? randomInRange(50, 70) : 60, // 随机范围或固定
    });

    fire(0.35, {
      spread: randomDirection ? randomInRange(80, 120) : 100, // 随机范围或固定
      decay: 0.91,
      scalar: randomDirection ? randomInRange(0.6, 1) : 0.8, // 随机或固定
    });

    fire(0.1, {
      spread: randomDirection ? randomInRange(100, 140) : 120, // 随机范围或固定
      startVelocity: randomDirection ? randomInRange(15, 30) : 25, // 随机起始速度或固定
      decay: 0.92,
      scalar: 1.2,
    });

    fire(0.1, {
      spread: randomDirection ? randomInRange(100, 140) : 120, // 随机范围或固定
      startVelocity: randomDirection ? randomInRange(35, 55) : 45, // 随机起始速度或固定
    });

    // 如果启用随机方向，可以继续生成不同的 confetti 特效
  })();
}
