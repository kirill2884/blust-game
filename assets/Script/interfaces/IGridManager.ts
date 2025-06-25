import { IBlock } from "./IBlock";

export interface IGridManager {

    gridWidth: number;
    gridHeight: number;

    getBlockAt(x: number, y: number): IBlock | null;
    removeBlocks(blocks: IBlock[], clickedBlock:IBlock, priceBlock:number): Promise<void>;
    getGridWidth():number
    getGridHeight():number
}