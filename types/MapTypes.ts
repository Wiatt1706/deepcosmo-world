
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
    description?: string;
    status?: number;
    landCoverImg?: string | null;
    showCoverImgList?: Photo[] | [];
    groupId?: string;
    skipUrl?: string;
    useExternalLink?: boolean; // 是否使用外部链接
    externalLinkType?: string; // 外部链接类型
    externalLink?: string; // 外部链接
    isInland?: boolean; // 是否存在里世界
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
export const defaultSginImages = [
    { id: 'sign_home', src: '/images/sign/home.png' },
    { id: 'sign_location', src: '/images/sign/location.png' },
    { id: 'sign_play', src: '/images/sign/play.png' },
    { id: 'sign_gold', src: '/images/sign/gold.png' },
];
export const LAND_LEVEL = [
    { key: "0", label: "1x1" },
    { key: "1", label: "2x2" },
    { key: "2", label: "3x3" },
    { key: "3", label: "4x4" },
    { key: "4", label: "5x5" },
    { key: "5", label: "6x6" },
    { key: "6", label: "7x7" },
    { key: "7", label: "8x8" },
    { key: "8", label: "9x9" },
    { key: "9", label: "10x10" },
];

export const LAND_TYPE = [
    { key: "0", label: "像素块" },
    { key: "1", label: "地图块" },
    { key: "2", label: "展示块" },
    { key: "3", label: "Game" },
];
export const OPTION_TEST_LIST4 = [
    { key: "0", label: "空置", color: "#0d2235" },
    { key: "1", label: "预公开", color: "#f9721f" },
    { key: "2", label: "公开", color: "#0080ff" },
    { key: "3", label: "上架", color: "#2e4065" },
    { key: "4", label: "停止", color: "#c0d3e8" },
];
export const OPTION_TEST_LIST5 = [
    { key: "1", label: "小组1号", color: "#2e4065" },
    { key: "2", label: "小组2号", color: "#0080ff" },
    { key: "3", label: "小组3号", color: "#f9721f" },
    { key: "4", label: "小组4号", color: "#c0d3e8" },
    { key: "5", label: "小组5号", color: "#0d2235" },
];
export const OPTION_TEST_LIST_2 = [
    { key: "1", label: "已发布内容" },
    { key: "2", label: "自定义路径" },
];

export const OPTION_TEST_LIST_3 = [
    { key: "", label: "未绑定" },
    { key: "https://developer.mozilla.org/zh-CN/docs/Web/CSS/::placeholder", label: "文章1" },
    { key: "https://www.google.com/", label: "文字2" },
    { key: "https://www.baidu.com/", label: "资源3" },
];
export type { Position, CssSize, PositionAndSize, Pixel, PixelBlock, ImgBlock, PixelBoardProps, PixelArtProps };
