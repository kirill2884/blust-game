import { SpecialBlock } from "../Common/SpecialBlock";
import { IBlock } from "../Interfaces/IBlock";

const {ccclass, property} = cc._decorator;

@ccclass
export default abstract class RocketBlock extends SpecialBlock {

        public getAdjacentBlocks(count: number = 1, bombEffect: boolean = false, rocketEffect: boolean = true, isVertical: boolean = false ): IBlock[] {
        if (!this.gridManager) return [];
        
        const blocks = [];
        
        for (let i = 0; i < this.gridManager.getGridWidth(); i++) {
            const block = isVertical 
                ? this.gridManager.getBlockAt(this.gridX, i)
                : this.gridManager.getBlockAt(i, this.gridY);
            
            if (block) blocks.push(block);
        }
        
        return blocks;
    }

}
