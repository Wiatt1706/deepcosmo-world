import { Bullet, Weapon } from "@/types/CanvasTypes";

export const weaponDatabase: { [key: string]: Weapon } = {
  rifle: {
    speed: 20,
    bulletLength: 100,
    bulletWidth: 8.3,
    airResistance: 0.98,
    imageSrc: "/images/rifle_bullet.png",
  },
  pistol: {
    speed: 7,
    bulletLength: 8,
    bulletWidth: 2,
    airResistance: 0.98,
    imageSrc: "/images/pistol_bullet.png",
  },
  // 可以添加更多武器
};

// 创建子弹
export function createBullet(
  x: number,
  y: number,
  direction: number,
  weaponCode: string
): Bullet {
  const weapon = weaponDatabase[weaponCode];

  if (!weapon) {
    throw new Error(`Weapon code ${weaponCode} not found`);
  }

  return {
    code: weaponCode,
    x,
    y,
    speed: weapon.speed,
    direction,
    bulletLength: weapon.bulletLength,
    bulletWidth: weapon.bulletWidth,
    airResistance: weapon.airResistance,
    active: true,
    update() {
      // 更新子弹位置
      this.x += this.speed * Math.cos(this.direction);
      this.y += this.speed * Math.sin(this.direction);

      // 模拟空气阻力
      this.speed *= this.airResistance;

      // 检查子弹是否超出边界
      if (this.x < 0 || this.x > 3000 || this.y < 0 || this.y > 3000) {
        this.active = false;
      }
    },
    draw(ctx: CanvasRenderingContext2D, image: HTMLImageElement) {
      if (!this.active) return;

      // 绘制子弹图片
      const halfHeight = this.bulletWidth / 2;
      const halfWidth = this.bulletLength / 2;

      ctx.save(); // 保存当前绘图状态
      ctx.translate(this.x, this.y); // 移动到子弹位置
      ctx.rotate(this.direction + Math.PI / 2); // 旋转到子弹方向
      ctx.drawImage(
        image,
        -halfHeight,
        -halfWidth,
        this.bulletWidth,
        this.bulletLength
      ); // 绘制图片
      ctx.restore(); // 恢复绘图状态
    },
  };
}
