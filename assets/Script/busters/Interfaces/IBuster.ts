import { IBusterView } from "./IBusterView";

const {ccclass} = cc._decorator;

export interface IBuster {
    maxCount: number;
    remainder: number;
    view: IBusterView;
    initBuster(view: IBusterView)
    activate(): void;
    deactivate(isUsed: boolean): void;
    initBuster(view: IBusterView): void;
}