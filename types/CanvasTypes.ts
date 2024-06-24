
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

interface Ray {
    a: Point;
    b: Point;
}


interface Geometry {
    name: string;
    type: number;
    segments: Segment[];
}

interface Character {
    x: number; // 角色在地图的x坐标
    y: number; // 角色在地图的y坐标
    radius: number; // 体型半径
    angle: number; // 视觉角度
    speed: number; // 角色移动速度
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
    speed: number;
    bulletLength: number;
    bulletWidth: number;
    airResistance: number;
    imageSrc: string;
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
    update(): void;
    draw(ctx: CanvasRenderingContext2D, image: HTMLImageElement): void;
}


export type { Position, CssSize, BoardProps, Character, Point, Segment, Ray, Geometry, CanvasInfo, Bullet, Weapon };
