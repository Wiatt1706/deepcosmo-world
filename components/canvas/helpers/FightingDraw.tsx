import { Bullet, Weapon, Geometry, Enemy, Particle } from "@/types/CanvasTypes";
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
    magazineSize: 30, // 弹夹容量
    reloadTime: 5000, // 重新装弹时间（毫秒）
    weaponState: {
      lastFireTime: 0,
      currentAmmo: 30,
      isReloading: false,
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
    x,
    y,
    speed: weapon.speed,
    direction,
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
        const dx = nextX - enemy.x;
        const dy = nextY - enemy.y;
        const distance = Math.sqrt(dx * dy + dy * dy);

        if (distance < enemy.radius) {
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
        });
        particles.filter((particle) => particle.life > 0);

        particles.forEach((particle) => {
          ctx.fillStyle = `rgba(${parseInt(
            particle.color.slice(5, 8)
          )}, ${parseInt(particle.color.slice(10, 13))}, ${parseInt(
            particle.color.slice(15, 18)
          )}, ${particle.alpha})`;
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, 2, 0, 2 * Math.PI);
          ctx.fill();
        });
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
          0,
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

export const reloadWeapon = (weapon: Weapon, ctx: CanvasRenderingContext2D) => {
  if (
    !weapon.weaponState.isReloading &&
    weapon.weaponState.currentAmmo < weapon.magazineSize
  ) {
    weapon.weaponState.isReloading = true;
    setTimeout(() => {
      weapon.weaponState.currentAmmo = weapon.magazineSize;
      weapon.weaponState.isReloading = false;
    }, weapon.reloadTime);
  }
};
