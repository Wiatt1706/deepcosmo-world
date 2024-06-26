import { Enemy } from "@/types/CanvasTypes";

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
