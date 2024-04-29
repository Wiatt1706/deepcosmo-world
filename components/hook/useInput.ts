import { useEffect, useState } from "react";

const initialValue = {
    forward: false,
    backward: false,
    left: false,
    right: false,
    shift: false,
    jump: false,
}
export const useInput = () => {
    const [input, setInput] = useState(initialValue);

    const keys: Record<string, string> = {
        KeyW: 'forward',
        KeyS: 'backward',
        KeyA: 'left',
        KeyD: 'right',
        ShiftLeft: 'shift',
        Space: 'jump',
    }

    const findKey = (key: keyof typeof keys): string | undefined => keys[key];

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            const key = findKey(e.code);
            if (key !== undefined) {
                setInput(prev => ({ ...prev, [key]: true }));
            }
        }
        const handleKeyUp = (e: KeyboardEvent) => {
            const key = findKey(e.code);
            if (key !== undefined) {
                setInput(prev => ({ ...prev, [key]: false }));
            }
        }
        document.addEventListener('keydown', handleKeyDown)
        document.addEventListener('keyup', handleKeyUp)

        return () => {
            document.removeEventListener('keydown', handleKeyDown)
            document.removeEventListener('keyup', handleKeyUp)
        }
    }, [])
    return input;
}