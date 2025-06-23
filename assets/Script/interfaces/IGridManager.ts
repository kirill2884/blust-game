import { AbstractBlock } from "../blocks/Common/AbstractBlock";

export interface IGridManager {

    gridWidth: number;
    gridHeight: number;

    getBlockAt(x: number, y: number): AbstractBlock | null;
    removeBlocks(blocks: AbstractBlock[], clickedBlock:AbstractBlock, priceBlock:number): Promise<void>;
    getGridWidth():number
    getGridHeight():number
}