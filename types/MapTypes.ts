
interface Position {
    x: number;
    y: number;
}

interface CssSize {
    width: number;
    height: number;
}
interface PositionAndSize extends Position, CssSize { }
// 像素块存储实体
interface PixelBlock {
    id: string;
    name?: string;
    x: number;
    y: number;
    width: number;
    height: number;
    color: string | CanvasGradient | CanvasPattern;
    borderSize?: number;
    blockCount: number;
    type: number;
    status?: number;
    landCoverImg?: string | null;
    showCoverImgList?: Photo[] | [];
    groupId?: string;
    skipUrl?: string;
    useExternalLink?: boolean; // 是否使用外部链接
    externalLinkType?: string; // 外部链接类型
    externalLink?: string; // 外部链接
}

export interface Photo {
    id: string;
    src: string;
    alt?: string;
    type?: string;
}

// 图片块存储实体
interface ImgBlock {
    id?: string;
    x: number;
    y: number;
    width: number;
    height: number;
    imageSrc?: string;
}

interface Pixel {
    id?: string;
    name?: string;
    x?: number;
    y?: number;
    width?: number;
    height?: number;
    borderSize?: number;
    fillColor?: string | CanvasGradient | CanvasPattern;
    type?: string;
    imageSrc?: string;
    imageArray?: string[];
    skipType?: string;
    skipUrl?: string;
}

interface PixelArtProps {
    bufferSize: { width: number; height: number };
    type?: "OBSERVE" | "EDIT" | "FIXED";
    location?: string;
}

interface PixelBoardProps {
    bufferSize?: { width: number; height: number };
    openHeadbar?: boolean | null;
    openToolMenu?: boolean | null;
    type?: "OBSERVE" | "EDIT" | "FIXED";
    location?: string;
}


export const SAVE_LOCATE_LIST_KEY = "SAVE_LOCATE_LIST_KEY"; // 测试像素块缓存
export const SAVE_IMG_LIST_KEY = "SAVE_IMG_LIST_KEY"; // 测试图片块缓存
export const MODEL_LIST = ["OBSERVE", "EDIT", "FIXED"]; // 定义类型：观察模式、编辑模式、固定模式
export const DEF_SIZE: CssSize = { width: 300, height: 300 }; // 定义默认地图寸尺
export const ZOOM_LEVELS = [0.15, 0.25, 0.5, 1, 2]; // 定义缩放档次
export const COLOR_LEVELS = ['#2e4065', '#0080ff', '#f9721f', '#c0d3e8', '#0d2235']; // 定义颜色档次
export const SIZE_LEVELS = [[30, 30], [60, 60], [90, 90], [120, 120], [150, 150],]; // 定义尺寸档次
export const PROB_LEVELS = [0.90, 0.05, 0.025, 0.015, 0.01]; // 定义概率档次

export const LAND_LEVEL = [
    { value: "1", name: "1x1" },
    { value: "2", name: "2x2" },
    { value: "3", name: "3x3" },
    { value: "4", name: "4x4" },
    { value: "5", name: "5x5" },
    { value: "6", name: "6x6" },
    { value: "7", name: "7x7" },
    { value: "8", name: "8x8" },
    { value: "9", name: "9x9" },
    { value: "10", name: "10x10" },
];

export const LAND_TYPE = [
    { value: "1", name: "像素块" },
    { value: "2", name: "地图块" },
    { value: "3", name: "展示块" },
    { value: "4", name: "Game" },
];
export const OPTION_TEST_LIST4 = [
    { value: "1", name: "空置", color: "#0d2235" },
    { value: "2", name: "预公开", color: "#f9721f" },
    { value: "3", name: "公开", color: "#0080ff" },
    { value: "4", name: "上架", color: "#2e4065" },
    { value: "5", name: "停止", color: "#c0d3e8" },
];
export const OPTION_TEST_LIST5 = [
    { value: "1", name: "小组1号", color: "#2e4065" },
    { value: "2", name: "小组2号", color: "#0080ff" },
    { value: "3", name: "小组3号", color: "#f9721f" },
    { value: "4", name: "小组4号", color: "#c0d3e8" },
    { value: "5", name: "小组5号", color: "#0d2235" },
];
export const OPTION_TEST_LIST_2 = [
    { value: "1", name: "已发布内容" },
    { value: "2", name: "自定义路径" },
];

export const OPTION_TEST_LIST_3 = [
    { value: "", name: "未绑定" },
    { value: "https://developer.mozilla.org/zh-CN/docs/Web/CSS/::placeholder", name: "文章1" },
    { value: "https://www.google.com/", name: "文字2" },
    { value: "https://www.baidu.com/", name: "资源3" },
];
export type { Position, CssSize, PositionAndSize, Pixel, PixelBlock, ImgBlock, PixelBoardProps, PixelArtProps };
