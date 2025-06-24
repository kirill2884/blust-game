import { AbstractBlock } from "../Common/AbstractBlock";
import { SpecialBlock } from "../Common/SpecialBlock";
import RocketBlock from "./RocketBlock";

const {ccclass, property} = cc._decorator;

@ccclass
export default class RocketsVertical extends RocketBlock {


    protected getSpecialType(): SpecialBlockType {
        return {
            rocket:true,
            isVertical:true
        }
    }


    // public getAdjacentBlocks(count: number = 1, bombEffect: boolean = false, rocketEffect: boolean = true, isVertical: boolean = false ): AbstractBlock[] {
    //     if (!this.gridManager) return [];
        
    //     const blocks = [];
        
    //     // Получаем всю строку или столбец
    //     for (let i = 0; i < this.gridManager.getGridWidth(); i++) {
    //         const block = isVertical 
    //             ? this.gridManager.getBlockAt(this.gridX, i)
    //             : this.gridManager.getBlockAt(i, this.gridY);
            
    //         if (block) blocks.push(block);
    //     }
        
    //     return blocks;
    // }


}
