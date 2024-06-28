import { Enemy, Geometry, Point } from "@/types/CanvasTypes";
import { handleCollision } from "./PhysicsDraw";

function distance(x1: number, y1: number, x2: number, y2: number): number {
  return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
}

// 敌人数据库
export const enemyDatabase: { [key: string]: Enemy } = {
  gyonshi: {
    code: "gyonshi",
    x: 0,
    y: 0,
    radius: 25,
    angle: 0,
    speed: 0.7,
    health: 3000,
    maxHealth: 3000,
    attackRange: 10,
    attackType: "melee",
    damage: 5,
    active: true,
    imageSrc: "/images/Zombie/zoimbie1_hold.png",
    update(targetList: Point[], obstacleList: Geometry[]) {
      // 追踪玩家
      // 查找最近的目标
      let closestTarget = null;
      let minDist = Infinity;
      for (const target of targetList) {
        const dist = distance(this.x, this.y, target.x, target.y);

        if (dist < minDist) {
          minDist = dist;
          closestTarget = target;
        }
      }

      if (closestTarget) {
        // 计算前往目标的方向
        const dx = closestTarget.x - this.x;
        const dy = closestTarget.y - this.y;
        const distanceToTarget = Math.sqrt(dx * dx + dy * dy);
        const moveX = (dx / distanceToTarget) * this.speed;
        const moveY = (dy / distanceToTarget) * this.speed;

        const checkedNewX = this.x + moveX;
        const checkedNewY = this.y + moveY;
        // 检查与障碍物的碰撞
        const {
          collided,
          x: newX,
          y: newY,
        } = handleCollision(
          obstacleList,
          this.radius,
          checkedNewX,
          checkedNewY
        );

        // 如果不会碰撞则移动，否则尝试避让
        if (!collided) {
          this.x = checkedNewX;
          this.y = checkedNewY;
        } else {
          // 简单的避让逻辑，尝试绕过障碍物
          this.x = newX;
          this.y = newY;
        }
      }
    },
    attack() {
      console.log("Gyonshi attacks with melee!");
    },
  },
};

// 创建敌人
export function createEnemy(enemyType: string, x: number, y: number): Enemy {
  const enemyConfig = enemyDatabase[enemyType];

  if (!enemyConfig) {
    throw new Error(`Enemy type ${enemyType} not found`);
  }

  return {
    ...enemyConfig,
    x,
    y,
  };
}

const normalizeAngle = (angle: number): number => {
  // 将角度归一化到 [0, 2π] 范围内
  return ((angle % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
};

const isAngleInRange = (angle: number, start: number, end: number): boolean => {
  if (start < end) {
    return angle >= start && angle <= end;
  } else {
    return angle >= start || angle <= end;
  }
};

export const isEnemyInCircle = (
  enemy: Enemy,
  playerX: number,
  playerY: number,
  circleRadius: number
): boolean => {
  // 计算敌人到玩家的距离
  const dx = enemy.x - playerX;
  const dy = enemy.y - playerY;
  const distance = Math.sqrt(dx * dx + dy * dy);

  // 判断是否在圆形的半径内
  return distance <= circleRadius + enemy.radius;
};

export const isEnemyInSector = (
  enemy: Enemy,
  playerX: number,
  playerY: number,
  sectorRadius: number,
  sectorAngle?: number,
  sectorDirection?: number
): boolean => {
  if (!sectorAngle || !sectorDirection) {
    return isEnemyInCircle(enemy, playerX, playerY, sectorRadius);
  }
  // 计算敌人到玩家的距离
  const dx = enemy.x - playerX;
  const dy = enemy.y - playerY;
  const distance = Math.sqrt(dx * dx + dy * dy);

  // 判断是否在扇形的半径内
  if (distance > sectorRadius + enemy.radius) {
    return false;
  }

  // 计算敌人相对于玩家的角度
  const angleToEnemy = Math.atan2(dy, dx);
  const normalizedAngleToEnemy = normalizeAngle(angleToEnemy);
  const normalizedSectorDirection = normalizeAngle(sectorDirection);

  // 计算扇形的起始角度和结束角度
  const sectorStartAngle = normalizeAngle(
    normalizedSectorDirection - sectorAngle / 2
  );
  const sectorEndAngle = normalizeAngle(
    normalizedSectorDirection + sectorAngle / 2
  );

  // 检查敌人的圆是否与扇形相交
  const angleOffset = Math.asin(enemy.radius / distance); // 考虑敌人半径

  const enemyStartAngle = normalizeAngle(normalizedAngleToEnemy - angleOffset);
  const enemyEndAngle = normalizeAngle(normalizedAngleToEnemy + angleOffset);

  return (
    isAngleInRange(enemyStartAngle, sectorStartAngle, sectorEndAngle) ||
    isAngleInRange(enemyEndAngle, sectorStartAngle, sectorEndAngle) ||
    isAngleInRange(normalizedAngleToEnemy, sectorStartAngle, sectorEndAngle)
  );
};
