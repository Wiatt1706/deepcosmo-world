import { Enemy, Sector } from "@/types/CanvasTypes";

// 敌人数据库
export const enemyDatabase: { [key: string]: Enemy } = {
  gyonshi: {
    code: "gyonshi",
    x: 0,
    y: 0,
    radius: 25,
    angle: 0,
    speed: 2,
    health: 3000,
    maxHealth: 3000,
    attackRange: 10,
    attackType: "melee",
    damage: 5,
    active: true,
    imageSrc: "/images/Zombie/zoimbie1_hold.png",
    update(playerX, playerY) {
      // 追踪玩家
      const dx = playerX - this.x;
      const dy = playerY - this.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
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

export const isEnemyInSector = (
  enemy: Enemy,
  playerX: number,
  playerY: number,
  sectorRadius: number,
  sectorAngle: number,
  sectorDirection: number
): boolean => {
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
