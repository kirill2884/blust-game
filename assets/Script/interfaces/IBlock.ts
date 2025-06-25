import GridManager from "../GridManager";

const { ccclass } = cc._decorator;

export interface IBlock {

    gridX: number;
    gridY: number;
    node: cc.Node;

    onBlockClick(): void;
    getAdjacentBlocks(count: number, bombEffect: boolean, rocketEffect: boolean, isVertical: boolean): IBlock[];

    setGameController(gridManager: GridManager): void;
    setExplosionEffect(effect: cc.Prefab): void;
    createExplosionAt(position: cc.Vec2): void;
    destroyBlocks(blocks: IBlock[], clickedBlock: IBlock): void;
    highlightBlocks(blocks: IBlock[]): void;
}