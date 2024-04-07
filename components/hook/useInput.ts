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

    const keys = {
        KeyW: 'forward',
        KeyS: 'backward',
        KeyA: 'left',
        KeyD: 'right',
        ShiftLeft: 'shift',
        Space: 'jump',
    }

    const findKey = (key: string) => keys[key];

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            setInput(prev => ({ ...prev, [findKey(e.code)]: true }))
        }
        const handleKeyUp = (e: KeyboardEvent) => {
            setInput(prev => ({ ...prev, [findKey(e.code)]: false }))
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