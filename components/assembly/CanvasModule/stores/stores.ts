// stores.ts
import { createContext, useContext } from 'react';
import CanvasStore from './CanvasStore';

class RootStore {
    canvasStore: CanvasStore;

    constructor() {
        this.canvasStore = new CanvasStore();
    }
}

const StoresContext = createContext(new RootStore());

export const useStores = () => useContext(StoresContext);
