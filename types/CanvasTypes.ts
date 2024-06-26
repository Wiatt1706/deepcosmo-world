
interface Position {
    x: number;
    y: number;
}


interface Point {
    x: number;
    y: number;
    angle?: number;
    param?: number;
}

interface Segment {
    a: Point;
    b: Point;
}

interface Geometry {
    name: string;
    type: number;
    segments: Segment[];
}

interface Ray {
    a: Point;
    b: Point;
}

// 粒子效果类型
type Particle = {
    x: number;
    y: number;
    velocityX: number;
    velocityY: number;
    life: number;
    alpha: number;
    color: string;
};

// 浮动污渍效果类型
type FloatingStains = {
    x: number;
    y: number;
    radius: number;
    alpha: number;
    life: number;
};
interface Character {
    x: number; // 角色在地图的x坐标
    y: number; // 角色在地图的y坐标
    radius: number; // 体型半径
    angle: number; // 视觉角度
    speed: number; // 角色移动速度
    health: number; // 生命值
    shield: number; // 护盾值
    maxHealth: number; // 最大生命值
    maxShield: number; // 最大护盾值
}
interface CssSize {
    width: number;
    height: number;
}

interface BoardProps {
    width: number;
    height: number;
    lightIntensity: number;
    mouseSensitivity: number;
}
interface CanvasInfo {
    offsetX: number,
    offsetY: number,
    offseAngle: number
}

interface Weapon {
    code: string;
    speed: number;// 子弹初始移动速度
    damage: number; // 伤害
    knockbackDistance: number;// 击退距离
    fireRate: number;// 射击间隔
    magazineSize: number;// 弹夹容量
    reloadTime: number;// 重新装弹时间
    bulletLength: number;// 子弹长度
    bulletWidth: number;// 子弹宽度
    airResistance: number;// 空气阻力
    imageSrc: string;// 子弹图片
    soundSrc: string;// 子弹音效
    collisionEffect: { color: string, radius: number, duration: number }; // 子弹碰撞效果
    weaponState: {
        lastFireTime: number;// 上次射击时间
        currentBulletCount: number;// 当前子弹数
        currentAmmo: number;// 当前弹匣子弹数
        isReloading: boolean;// 是否正在装弹
        lastReloadime: number;// 上次装弹时间
        isFiring: boolean;// 是否正在射击
        soundPlayed?: boolean;// 是否已播放音效
    };

}

interface Bullet {
    code: string;
    x: number;
    y: number;
    speed: number;
    direction: number;
    bulletLength: number;
    bulletWidth: number;
    airResistance: number;
    active: boolean;
    collision: boolean;
    collisionX: number;
    collisionY: number;
    update(geometryList: Geometry[], enemyList: Enemy[]): void;
    draw(ctx: CanvasRenderingContext2D, image: HTMLImageElement): void;
}
// 定义攻击方式类型
type AttackType = "melee" | "ranged" | "magic";
// 定义敌人类型
type Enemy = {
    code: string;
    x: number;
    y: number;
    radius: number; // 敌人半径
    angle: number; // 视觉角度
    speed: number; // 敌人移动速度
    health: number; // 敌人生命值
    maxHealth: number; // 敌人最大生命值
    attackRange: number; // 攻击范围
    attackType: AttackType; // 攻击方式
    damage: number; // 伤害
    active: boolean; // 敌人是否激活
    imageSrc: string; // 敌人图片
    update: (playerX: number, playerY: number) => void;
    attack: () => void;
};



export type { Position, CssSize, BoardProps, Character, Point, Segment, Ray, Geometry, CanvasInfo, Bullet, Weapon, Enemy, Particle, FloatingStains };
