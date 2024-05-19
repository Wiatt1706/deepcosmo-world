import React, { useRef, useState, useCallback, useEffect } from "react";
import styles from './ImageUploader.module.css';
import Alerts from "../../system/Alerts";

const MAX_SIZE = 2 * 1024 * 1024; // 最大文件大小限制（2MB）

const ImageUploader = ({ onCanvasChange }) => {
    const [error, setError] = useState(null);
    const [showCanvas, setShowCanvas] = useState(false);
    const fileInputRef = useRef(null);
    const canvasRef = useRef(null);
    const hiddenCanvasRef = useRef(null);
    const imageRef = useRef(null);

    const isDraggingRef = useRef(false);
    const lastCoordRef = useRef({ left: 0, top: 0 });
    const offsetXRef = useRef(0);
    const offsetYRef = useRef(0);
    const scaleRef = useRef(1);

    const handlePhotoSelect = () => {
        fileInputRef.current.click();
    };
    const handleRemovePhoto = () => {
        imageRef.current = null; // 将图片引用设置为null，相当于删除图片
        setShowCanvas(false); // 隐藏canvas，回到"Add a cover image"状态
        onCanvasChange(null) // 清空选择
    };

    const handleMouseDown = (event) => {
        event.preventDefault();
        isDraggingRef.current = true;
        lastCoordRef.current = {
            left: event.clientX,
            top: event.clientY
        };
        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);
    };

    const handleMouseMove = (event) => {
        event.preventDefault();
        if (isDraggingRef.current) {
            const delta = {
                left: event.clientX - lastCoordRef.current.left,
                top: event.clientY - lastCoordRef.current.top
            };
            moveCanvas(delta);
            lastCoordRef.current = {
                left: event.clientX,
                top: event.clientY
            };
        }
    };

    const handleMouseUp = (event) => {
        event.preventDefault();

        isDraggingRef.current = false;
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
    };

    const handleTouchStart = (event) => {
        event.preventDefault();
        const touch = event.touches[0];
        isDraggingRef.current = true;
        lastCoordRef.current = {
            left: touch.clientX,
            top: touch.clientY
        };
        document.addEventListener("touchmove", handleTouchMove);
        document.addEventListener("touchend", handleTouchEnd);
    };

    const handleTouchMove = (event) => {
        event.preventDefault();
        if (isDraggingRef.current) {
            const touch = event.touches[0];
            const delta = {
                left: touch.clientX - lastCoordRef.current.left,
                top: touch.clientY - lastCoordRef.current.top
            };
            moveCanvas(delta);
            lastCoordRef.current = {
                left: touch.clientX,
                top: touch.clientY
            };
        }
    };

    const handleTouchEnd = (event) => {
        event.preventDefault();

        isDraggingRef.current = false;
        document.removeEventListener("touchmove", handleTouchMove);
        document.removeEventListener("touchend", handleTouchEnd);
    };

    const handleWheel = useCallback((event) => {
        event.preventDefault();
        const delta = event.deltaY || event.wheelDelta; // 兼容不同浏览器

        const scrollDelta = delta > 0 ? 1 : -1;
        wheelCanvas(scrollDelta > 0);
    }, []);

    const wheelCanvas = (wheelDelta, pos) => {
        const scale = scaleRef.current;
        const offsetX = offsetXRef.current;
        const offsetY = offsetYRef.current;
        const n = 1.25;
        const n2 = 1 / n;

        const { width, height } = canvasRef.current;
        const { x, y } = pos || { x: width / 2, y: height / 2 };

        const newScale = wheelDelta ? scale * n2 : scale * n;
        const newOffsetX = wheelDelta ? offsetX * n2 + x * (1 - n2) : offsetX * n - x * (n - 1);
        const newOffsetY = wheelDelta ? offsetY * n2 + y * (1 - n2) : offsetY * n - y * (n - 1);

        offsetXRef.current = newOffsetX;
        offsetYRef.current = newOffsetY;
        scaleRef.current = newScale;

        drawCanvas();
    };

    const moveCanvas = (delta) => {
        const canvas = canvasRef.current;
        const { width: imageWidth, height: imageHeight } = imageRef.current;
        const { width: canvasWidth, height: canvasHeight } = canvas;

        let mixW = -imageWidth * scaleRef.current;
        let mixH = -imageHeight * scaleRef.current;
        let dx = offsetXRef.current + delta.left;
        let dy = offsetYRef.current + delta.top;

        offsetXRef.current = Math.max(Math.min(dx, canvasWidth), mixW);
        offsetYRef.current = Math.max(Math.min(dy, canvasHeight), mixH);
        // 重新绘制图像
        drawCanvas();
    };

    const handlePhotoChange = (event) => {
        const file = event.target.files[0];
        if (!file) {
            return;
        }
        const image = new Image();
        // 图片加载完毕后显示canvas
        setShowCanvas(true);

        const handleImageLoad = () => {
            // Check if the image exceeds the size limits
            const file = fileInputRef.current.files[0];
            if (file.size > MAX_SIZE) {
                setError('Image size exceeds the limit.');
                setShowCanvas(false);

                return
            }

            const hiddenCanvas = hiddenCanvasRef.current;
            if (!hiddenCanvas) {
                return;
            }
            const hiddenContext = hiddenCanvas.getContext('2d');
            hiddenContext.clearRect(0, 0, hiddenCanvas.width, hiddenCanvas.height);
            hiddenCanvas.width = image.width;
            hiddenCanvas.height = image.height;
            hiddenContext.drawImage(image, 0, 0);

            const canvas = canvasRef.current;

            // 重置 scale 为初始值
            scaleRef.current = 1;

            // 初始图片居中
            offsetXRef.current = (canvas.width - image.width * scaleRef.current) / 2;
            offsetYRef.current = (canvas.height - image.height * scaleRef.current) / 2;

            imageRef.current = image;
            // Convert the canvas to a data URL
            const dataURL = hiddenCanvas.toDataURL('image/png');
            // Pass the data URL to the parent component
            if (typeof onCanvasChange === 'function') {
                onCanvasChange(file);
            }
            
            drawCanvas(); // 在确保imageRef.current已设置后调用drawCanvas
            setShowCanvas(true); // 在hiddenCanvas设置完宽高后显示canvas

        };

        image.onload = handleImageLoad;
        image.src = URL.createObjectURL(file);

        return () => {
            image.onload = null; // 取消图片的加载
        };
    };


    const drawCanvas = () => {
        const sourceCanvas = hiddenCanvasRef.current;
        const targetCanvas = canvasRef.current;
        if (!sourceCanvas || !targetCanvas) {
            return;
        }

        const offsetX = offsetXRef.current;
        const offsetY = offsetYRef.current;

        const targetContext = targetCanvas.getContext('2d');
        targetContext.clearRect(0, 0, targetCanvas.width, targetCanvas.height);
        targetContext.drawImage(
            sourceCanvas,
            0, 0,
            sourceCanvas.width, sourceCanvas.height,
            offsetX, offsetY,
            sourceCanvas.width * scaleRef.current, sourceCanvas.height * scaleRef.current
        );

        // // Convert the canvas to a data URL
        // const dataURL = targetCanvas.toDataURL('image/png');

        // // Pass the data URL to the parent component
        // if (typeof onCanvasChange === 'function') {
        //     onCanvasChange(dataURL);
        // }
    };

    useEffect(() => {
        const canvas = canvasRef.current;

        if (canvas) {

            canvas.addEventListener("wheel", handleWheel, false);

            return () => {
                canvas.removeEventListener("wheel", handleWheel, false);
                document.removeEventListener("mousemove", handleMouseMove);
                document.removeEventListener("mouseup", handleMouseUp);
                document.removeEventListener("mousemove", handleMouseMove);
                document.removeEventListener("mouseup", handleMouseUp);
            };
        }
    }, [showCanvas]);


    return (
        <div>
            <input
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                style={{ display: "none" }}
                ref={fileInputRef}
            />
            <canvas ref={hiddenCanvasRef} style={{ display: 'none' }} />

            {error && ( // 根据错误状态显示错误提示
                <Alerts type="error" message={error} onClose={() => setError(null)} />
            )}

            {!showCanvas && (
                <div className={styles['image-placeholder']} onClick={handlePhotoSelect}>
                    Add a cover image
                </div>
            )}

            {showCanvas && (
                <div className={styles['image-form']}>
                    <canvas
                        className={styles['image-canvas']}
                        ref={canvasRef}
                        width={175}
                        height={116}
                        onMouseDown={handleMouseDown}
                        onTouchStart={handleTouchStart}
                        onTouchMove={handleTouchMove}
                        onTouchEnd={handleTouchEnd}
                    />
                    <div className={styles['image-form-btnList']}>
                        <button onClick={handlePhotoSelect} className={`${styles['btn']} ${styles['change-btn']}`}>Change</button>
                        <button onClick={handleRemovePhoto} className={`${styles['btn']} ${styles['remove-btn']}`}>remove</button>
                    </div>
                </div>
            )}

        </div>
    );
};

export default ImageUploader;
