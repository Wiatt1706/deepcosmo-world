
interface Position {
    x: number;
    y: number;
}

interface Character {
    x: number; // 角色在地图的x坐标
    y: number; // 角色在地图的y坐标
    radius: number; // 体型半径
    angle: number; // 视觉角度
    speed: number; // 角色移动速度
    velocityX: number; // 角色x方向速度
    velocityY: number; // 角色y方向速度
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


export type { Position, CssSize, BoardProps, Character };
