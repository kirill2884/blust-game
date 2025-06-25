import { IBusterView } from "./IBusterView";

const {ccclass} = cc._decorator;

/**
 * Интерфейс для бустеров в игре
 */
export interface IBuster {
    maxCount: number;
    remainder: number;
    view: IBusterView;

    activate(): void;
    deactivate(isUsed: boolean): void;
    initBuster(view: IBusterView): void;
}