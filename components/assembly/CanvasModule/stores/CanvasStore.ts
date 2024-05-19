// CanvasStore.ts
import { makeAutoObservable } from 'mobx';
import { Position, CssSize } from '../interface/CanvasTypes';

class CanvasStore {
    editColor: string = '#3470ff'; // 绘制颜色
    animationId: number | null = null; // 动画主键
    pixelSize: number = 30; // 像素大小
    brushSize: number = 1; // 刷子大小
    borderSize: number = 2; // 边框大小
    scale: number = 1; // 样式寸尺
    actScale: number = 1; // 选中样式寸尺
    deltaX: number = 0; // 缩放造成的X偏移
    deltaY: number = 0; // 缩放造成的Y偏移
    toTop: boolean = false; // 是否触发向上
    toLeft: boolean = false; // 是否触发向左
    toRight: boolean = false; // 是否触发向右
    toBottom: boolean = false; // 是否触发向下
    isAnimating: boolean = false; // 动画是否触发
    positionDown: Position = { x: 0, y: 0 }; // 鼠标按下时的坐标
    scroll: Position = { x: 0, y: 0 }; // 当前缓冲定位
    scrollMax: Position = { x: 0, y: 0 }; // 当前缓冲最大定位
    centerPosition: Position = { x: 0, y: 0 }; // 中心点
    cssSize: CssSize = { width: 0, height: 0 }; // 缩放比例
    imgSrc: string | null = null; // 实时存储的canvas 在合法范围内的图片

    constructor() {
        makeAutoObservable(this);
    }

    // 移动画板
    moveCanvas = (canvas: HTMLCanvasElement | null, buffer: HTMLCanvasElement | null, left: number = 0, top: number = 0) => {
        const dpr = window.devicePixelRatio;
        if (!canvas || !buffer) {
            return;
        }

        const scale = this.scale;
        const bufferNum = 50;
        const deltaX = this.deltaX;
        const deltaY = this.deltaY;
        const scroll = this.scroll;
        const scrollMax = this.scrollMax;

        let twidth = canvas.clientWidth / scale - buffer.width / dpr;
        let theight = canvas.clientHeight / scale - buffer.height / dpr;

        let dx = scroll.x + deltaX + left / scale;
        let dy = scroll.y + deltaY + top / scale;

        if (left !== 0) {
            this.toLeft = left > 0 ? false : true;
            this.toRight = !this.toLeft;
        }
        if (top !== 0) {
            this.toTop = top > 0 ? false : true;
            this.toBottom = !this.toTop;
        }

        if (dx < -canvas.clientWidth / scale + twidth + bufferNum) {
            scroll.x = -canvas.clientWidth / scale + twidth + bufferNum - deltaX;
            this.toLeft = true;
            this.toRight = false;
        } else if (dx > scrollMax.x / dpr + twidth - bufferNum) {
            scroll.x = scrollMax.x / dpr + twidth - bufferNum - deltaX;
            this.toLeft = false;
            this.toRight = true;
        } else {
            scroll.x = dx - deltaX;
        }

        if (dy < -canvas.clientHeight / scale + theight + bufferNum) {
            scroll.y = -canvas.clientHeight / scale + theight + bufferNum - deltaY;
            this.toTop = true;
            this.toBottom = false;
        } else if (dy > scrollMax.y / dpr + theight - bufferNum) {
            scroll.y = scrollMax.y / dpr + theight - bufferNum - deltaY;
            this.toTop = false;
            this.toBottom = true;
        } else {
            scroll.y = dy - deltaY;
        }

        this.setScroll({ ...scroll });
    };

    getMouseupPixel = (e: MouseEvent, cvs: HTMLCanvasElement | null): Position => {
        if (!cvs) {
            return { x: 0, y: 0 };
        }

        const canvasRect = cvs.getBoundingClientRect();
        const position = this.getPosition(e, cvs);
        let canvasLeft = position.x - canvasRect.left / this.scale;
        let canvasTop = position.y - canvasRect.top / this.scale;

        let x = Math.floor((canvasLeft -= this.scroll.x + this.deltaX) / this.pixelSize) * this.pixelSize;
        let y = Math.floor((canvasTop -= this.scroll.y + this.deltaY) / this.pixelSize) * this.pixelSize;

        return { x, y };
    };

    getPosition = (e: MouseEvent, cvs: HTMLCanvasElement): Position => {
        if (!e) {
            e = window.event as MouseEvent;
        }

        let x = Math.floor(e.pageX - cvs.offsetLeft) / this.scale;
        let y = Math.floor(e.pageY - cvs.offsetTop) / this.scale;
        return { x, y };
    };

    smoothlyAnimateScroll = (targetScroll: Position) => {
        const that = this;
        const duration = 200; // 动画持续时间（毫秒）
        const startTime = performance.now();
        const initialScroll = that.scroll;
        that.isAnimating = true;
        function animate(currentTime: number) {
            const elapsedTime = currentTime - startTime;
            if (elapsedTime >= duration) {
                that.scroll = targetScroll;
                that.isAnimating = false;
                return;
            }
            const newScroll = {
                x:
                    initialScroll.x +
                    (targetScroll.x - initialScroll.x) * (elapsedTime / duration),
                y:
                    initialScroll.y +
                    (targetScroll.y - initialScroll.y) * (elapsedTime / duration),
            };
            that.scroll = newScroll;
            // 递归调用，实现平滑动画
            requestAnimationFrame(animate);
        }

        requestAnimationFrame(animate);
    };

    // Easing function for smoother animation
    easeInOutQuad(t: number): number {
        return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    }

    setEditColor(color: string) {
        this.editColor = color;
    }

    setBrushSize(size: number) {
        this.brushSize = size;
    }

    setBorderSize(size: number) {
        this.borderSize = size;
    }

    setPositionDown(position: Position) {
        this.positionDown = position;
    }

    setCssSize(size: CssSize) {
        this.cssSize = size;
    }

    setScale(scale: number) {
        this.scale = scale;
    }

    setActScale(actScale: number) {
        this.actScale = actScale;
    }

    setScroll(scroll: Position) {
        this.scroll = scroll;
    }

    setCenterPosition(centerPosition: Position) {
        this.centerPosition = centerPosition;
    }

    setScrollMax(scrollMax: Position) {
        this.scrollMax = scrollMax;
    }

    setDeltaX(deltaX: number) {
        this.deltaX = deltaX;
    }

    setDeltaY(deltaY: number) {
        this.deltaY = deltaY;
    }

    setImgSrc(imgSrc: any) {
        this.imgSrc = imgSrc;
    }

}

export default CanvasStore;
