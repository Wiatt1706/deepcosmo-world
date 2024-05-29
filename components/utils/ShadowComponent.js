import React, { useEffect } from 'react';

export default function ShadowComponent({ visible, children, className, onClose }) {
    useEffect(() => {
        if (visible) {
            // 遮罩可见时，禁用滚动
            document.body.style.overflow = 'hidden';
        } else {
            // 遮罩隐藏时，启用滚动
            document.body.style.overflow = 'auto';
        }
    }, [visible]);

    const overlayStyles = {
        position: 'fixed',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        left: 0,
        bottom: 0,
        top: 0,
        right: 0,
        backgroundColor: 'rgba(10, 10, 10, 0.6)',
        backdropFilter: 'blur(5px)',
        zIndex: 9999,
        color: '#AAAAAA',
    };

    const handleClick = (e) => {
        e.stopPropagation(); // 阻止事件冒泡
    };

    if (!visible) {
        return null;
    }

    return (
        <div className={className} style={overlayStyles} onClick={handleClick}>
            {children}
        </div>
    );
}
