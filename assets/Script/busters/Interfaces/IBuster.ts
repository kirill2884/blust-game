import { IBusterView } from "./IBusterView";

export interface IBuster {
    maxCount: number;
    remainder: number;
    view: IBusterView;
    initBuster(view: IBusterView)
    activate(): void;
    deactivate(isUsed: boolean): void;
    initBuster(view: IBusterView): void;
}