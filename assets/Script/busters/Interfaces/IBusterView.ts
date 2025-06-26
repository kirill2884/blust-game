const {ccclass} = cc._decorator;

export interface IBusterView {
    infoNode: cc.Node;
    remainder: number;
    node: cc.Node;
    
    updateRemainder(remainder: number): void;
    onTouchStart(): void;
    onDestroy(): void;
    destroy(): void;
}