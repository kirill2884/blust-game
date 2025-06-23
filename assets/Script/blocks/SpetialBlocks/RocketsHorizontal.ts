import { AbstractBlock } from "../Common/AbstractBlock";
import { SpecialBlock } from "../Common/SpecialBlock";

const {ccclass, property} = cc._decorator;

@ccclass
export default class RocketsHorizontal extends SpecialBlock {
    
    
    protected getSpecialType(): SpecialBlockType {
         return {
            rocket:true,
            isVertical:false
        }
    }

    public getAdjacentBlocks( count: number = 1, bombEffect: boolean = false, rocketEffect: boolean = true, isVertical: boolean = false): AbstractBlock[] {
        if (!this.gridManager) return [];
        const blocks = [];
        
        // Получаем всю строку или столбец
        for (let i = 0; i < this.gridManager.getGridWidth(); i++) {
            const block = isVertical 
                ? this.gridManager.getBlockAt(this.gridX, i)
                : this.gridManager.getBlockAt(i, this.gridY);
            
            if (block) blocks.push(block);
        }
        
        return blocks;
    }
    

}
