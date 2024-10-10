import { useEffect, useCallback } from 'react';

export function useKeyboardEvent(keys,
    onKeyDown = () => { },
    onKeyUp = () => { }
) {
    const normalizedKeys = Array.isArray(keys) ? keys : [keys];

    const handleKeyDown = useCallback((event) => {
        const isKeyPressed = normalizedKeys.every(key => event.getModifierState(key) || event.key === key);
        if (isKeyPressed && event.type === 'keydown') {
            onKeyDown();
        }
    }, [normalizedKeys, onKeyDown]);

    const handleKeyUp = useCallback((event) => {
        const isKeyPressed = normalizedKeys.every(key => event.getModifierState(key) || event.key === key);
        if (isKeyPressed && event.type === 'keyup') {
            onKeyUp();
        }
    }, [normalizedKeys, onKeyUp]);

    useEvent('keydown', handleKeyDown);
    useEvent('keyup', handleKeyUp);
}


export function useEvent(eventName, callback, target) {
    useEffect(() => {
        const eventTarget = target || window;
        const eventHandler = (event) => {
            event.preventDefault();
            callback(event);
        };

        eventTarget.addEventListener(eventName, eventHandler);

        return () => {
            eventTarget.removeEventListener(eventName, eventHandler);
        };
    }, [eventName, callback, target]);
}

export function removeEvent(event, callback, target = window) {
    target.removeEventListener(event, callback);
}

export const Sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));