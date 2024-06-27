import {
  Bullet,
  Weapon,
  Geometry,
  Enemy,
  Particle,
  FloatingStains,
} from "@/types/CanvasTypes";
import { getLineSegmentIntersection } from "./PhysicsDraw";

// 更新武器数据库
export const weaponDatabase: { [key: string]: Weapon } = {
  rifle: {
    code: "rifle",
    speed: 35,
    bulletLength: 100,
    bulletWidth: 8.3,
    airResistance: 1,
    knockbackDistance: 5,
    imageSrc: "/images/rifle_bullet.png",
    soundSrc: "/sounds/weapon/rifle_shot.wav",
    collisionEffect: {
      color: "rgba(253, 160, 20, 0.5)",
      radius: 10,
      duration: 200,
    },
    damage: 5, // 伤害
    fireRate: 50, // 每次射击的间隔时间（毫秒）
    magazineSize: 300, // 弹夹容量
    reloadTime: 2000, // 重新装弹时间（毫秒）
    weaponState: {
      lastFireTime: 0,
      currentAmmo: 0,
      currentBulletCount: 2000,
      isReloading: false,
      lastReloadime: 0,
      isFiring: false,
    },
  },
  // 可以添加更多武器
};

// 创建子弹
export function createBullet(
  x: number,
  y: number,
  direction: number,
  weapon: Weapon
): Bullet {
  const creationTime = Date.now();

  // 渲染粒子
  const particles: Particle[] = [];
 

  let effectStartTime = 0;
  function generateParticles(
    x: number,
    y: number,
    direction: number,
    color: string
  ) {
    const particleCount = Math.ceil(weapon.damage / 3); // 根据武器伤害生成粒子数量
    for (let i = 0; i < particleCount; i++) {
      const baseVelocityX = -Math.cos(direction) * (Math.random() * 2 + 0.5);
      const baseVelocityY = -Math.sin(direction) * (Math.random() * 2 + 0.5);

      particles.push({
        x,
        y,
        velocityX: baseVelocityX + (Math.random() - 0.5) * 0.5,
        velocityY: baseVelocityY + (Math.random() - 0.5) * 0.5,
        life: 1000,
        alpha: 1,
        color,
      });
    }
  }

  return {
    code: weapon.code,
    x, // 子弹x位置
    y, // 子弹y位置
    speed: weapon.speed, // 子弹速度
    direction, // 子弹方向
    bulletLength: weapon.bulletLength,
    bulletWidth: weapon.bulletWidth,
    airResistance: weapon.airResistance,
    active: true,
    collision: false,
    collisionX: 0,
    collisionY: 0,
    update(geometryList: Geometry[], enemyList: Enemy[]) {
      const currentTime = Date.now();
      if (currentTime - creationTime > 10000) {
        this.active = false;
        return;
      }
      if (this.collision) {
        return;
      }

      // 更新子弹位置
      const nextX = this.x + this.speed * Math.cos(this.direction);
      const nextY = this.y + this.speed * Math.sin(this.direction);

      // 检查子弹是否碰到敌人
      for (const enemy of enemyList) {
        const distance = Math.sqrt(
          (nextX - enemy.x) ** 2 + (nextY - enemy.y) ** 2
        );
        if (distance <= enemy.radius) {
          this.collision = true;
          this.collisionX = nextX;
          this.collisionY = nextY;
          effectStartTime = Date.now();
          generateParticles(
            nextX,
            nextY,
            this.direction,
            "rgba(100, 253, 150, 0.7)"
          );

          // 处理敌人伤害和击退
          enemy.health -= weapon.damage;
          enemy.x += weapon.knockbackDistance * Math.cos(this.direction);
          enemy.y += weapon.knockbackDistance * Math.sin(this.direction);

          // if (enemy.health <= 0) {
          //   enemy.active = false;
          // }
          return;
        }
      }

      // 检查子弹是否碰到墙体
      for (const geometry of geometryList) {
        for (const segment of geometry.segments) {
          const intersection = getLineSegmentIntersection(
            this.x,
            this.y,
            nextX,
            nextY,
            segment.a.x,
            segment.a.y,
            segment.b.x,
            segment.b.y
          );
          if (intersection) {
            this.collision = true;
            this.collisionX = intersection.x;
            this.collisionY = intersection.y;
            effectStartTime = Date.now();
            generateParticles(
              intersection.x,
              intersection.y,
              this.direction,
              weapon.collisionEffect.color
            );
            return;
          }
        }
      }

      // 如果没有碰撞，更新位置
      this.x = nextX;
      this.y = nextY;

      // 模拟空气阻力
      this.speed *= this.airResistance;
    },
    draw(ctx: CanvasRenderingContext2D, image: HTMLImageElement) {
      if (this.collision) {
        const effectDuration = weapon.collisionEffect.duration;
        const elapsed = Date.now() - effectStartTime;

        // 绘制碰撞效果
        if (elapsed < effectDuration) {
          const effectRadius =
            (elapsed / effectDuration) * weapon.collisionEffect.radius;
          ctx.fillStyle = weapon.collisionEffect.color;
          ctx.beginPath();
          ctx.arc(
            this.collisionX,
            this.collisionY,
            effectRadius,
            0,
            2 * Math.PI
          );
          ctx.fill();
          ctx.closePath();
        }

        // 绘制粒子效果
        particles.forEach((particle) => {
          particle.x += particle.velocityX;
          particle.y += particle.velocityY;
          particle.alpha -= 0.03;
          particle.life -= 16;

          ctx.fillStyle = `rgba(${parseInt(
            particle.color.slice(5, 8)
          )}, ${parseInt(particle.color.slice(10, 13))}, ${parseInt(
            particle.color.slice(15, 18)
          )}, ${particle.alpha})`;
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, 2, 0, 2 * Math.PI);
          ctx.fill();
        });
        particles.filter((particle) => particle.life > 0);

        if (particles.length === 0) {
          this.active = false;
        }

       
      } else if (this.active) {
        const halfHeight = this.bulletWidth / 2;

        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.direction + Math.PI / 2);
        ctx.drawImage(
          image,
          -halfHeight,
          -10,
          this.bulletWidth,
          this.bulletLength
        );
        ctx.restore();
      }
    },
  };
}

const canFire = (weapon: Weapon) => {
  const currentTime = Date.now();

  return (
    !weapon.weaponState.isReloading &&
    weapon.weaponState.currentAmmo > 0 &&
    currentTime - weapon.weaponState.lastFireTime >= weapon.fireRate
  );
};

export const fireWeapon = (
  weapon: Weapon,
  x: number,
  y: number,
  direction: number,
  sound: HTMLAudioElement
) => {
  if (canFire(weapon)) {
    weapon.weaponState.currentAmmo--;
    weapon.weaponState.lastFireTime = Date.now();

    if (sound) {
      sound.currentTime = 0;
      sound.play();
    }

    // 创建子弹并返回
    return createBullet(x, y, direction, weapon);
  }
  return null;
};

export const reloadWeapon = (weapon: Weapon, sound: HTMLAudioElement) => {
  if (
    !weapon.weaponState.isReloading &&
    weapon.weaponState.currentAmmo < weapon.magazineSize
  ) {
    weapon.weaponState.isReloading = true;
    weapon.weaponState.lastReloadime = performance.now();
    if (sound) {
      sound.currentTime = 0;
      sound.play();
    }
  }
};

export const drawReloadAnimation = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  progress: number
) => {
  const endAngle = 2 * Math.PI * progress;
  ctx.save();

  // 绘制根据进度填充的半透明圆
  ctx.beginPath();
  ctx.arc(x, y, 50, 0, endAngle);
  ctx.lineTo(x, y); // 将线条连到圆心
  ctx.closePath(); // 闭合路径
  ctx.fillStyle = "rgba(253, 160, 20, 0.2)"; // 半透明填充颜色
  ctx.fill();

  // 绘制进度弧线
  ctx.beginPath();
  ctx.arc(x, y, 50, 0, endAngle);
  ctx.strokeStyle = "rgba(253, 160, 20, 0.6)";
  ctx.lineWidth = 3;
  ctx.stroke();
  ctx.restore();
};
