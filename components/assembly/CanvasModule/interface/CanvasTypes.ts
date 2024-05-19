
interface Position {
    x: number;
    y: number;
}

interface CssSize {
    width: number;
    height: number;
}

interface CanvasModuleRef {
    clipImage: () => string | null; // Updated to reflect that it can return a string or null
    // Add other methods or properties as needed
}

interface CanvasModuleProps {
    className?: string;
    imageFile: HTMLImageElement; // Assuming imageFile is an HTMLImageElement
    showSize: CssSize
    onChange?: (file: File | null) => void;
    ref?: React.RefObject<CanvasModuleRef>;
}

export type { Position, CssSize, CanvasModuleProps, CanvasModuleRef };
