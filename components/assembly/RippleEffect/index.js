import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styles from './RippleEffect.module.css';
import classNames from 'classnames'; // 使用 classNames 库来合并类名

const RippleEffect = ({ children, rippleColor, className }) => {
    const [ripples, setRipples] = useState([]);

    const addRipple = (event) => {
        const { left, top, width, height } = event.currentTarget.getBoundingClientRect();
        const size = Math.max(width, height);
        const x = event.clientX - left - size / 2;
        const y = event.clientY - top - size / 2;

        const newRipple = { x, y, size, id: Date.now() };
        setRipples([...ripples, newRipple]);

        setTimeout(() => {
            setRipples((prevRipples) => prevRipples.filter((ripple) => ripple.id !== newRipple.id));
        }, 1000);
    };

    // 合并传入的 className 到根元素
    const containerClassName = classNames(styles.rippleContainer, className);

    return (
        <div
            className={containerClassName}
            onClick={addRipple}
            style={{ position: 'relative', overflow: 'hidden', display: 'inline-block' }}
        >
            {ripples.map((ripple) => (
                <span
                    key={ripple.id}
                    className={styles.ripple}
                    style={{
                        top: ripple.y,
                        left: ripple.x,
                        width: ripple.size,
                        height: ripple.size,
                        backgroundColor: rippleColor || 'rgba(0, 0, 0, 0.3)',
                    }}
                />
            ))}
            {children}
        </div>
    );
};

RippleEffect.propTypes = {
    children: PropTypes.node.isRequired,
    rippleColor: PropTypes.string,
    className: PropTypes.string, // 新增 className 属性
};

export default RippleEffect;
