import { IGridManager } from "../../Interfaces/IGridManager";

export interface IBlock {

    gridX: number;
    gridY: number;
    node: cc.Node;

    onBlockClick(): void;
    getAdjacentBlocks(count: number, bombEffect: boolean, rocketEffect: boolean, isVertical: boolean): IBlock[];

    setGameController(gridManager: IGridManager): void;
    setExplosionEffect(effect: cc.Prefab): void;
    createExplosionAt(position: cc.Vec2): void;
    destroyBlocks(blocks: IBlock[], clickedBlock: IBlock): void;
    highlightBlocks(blocks: IBlock[]): void;
}