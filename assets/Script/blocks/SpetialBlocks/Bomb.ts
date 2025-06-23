import { AbstractBlock } from "../Common/AbstractBlock";
import { SpecialBlock } from "../Common/SpecialBlock";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Bomb extends SpecialBlock {
  
   
    @property({type:cc.Integer})
    power: number = 1;

    protected getSpecialType(): SpecialBlockType {
        return {
            bomb:true,
            power:this.power
        }
    }

    public getAdjacentBlocks(count: number = 1, bombEffect: boolean = false, rocketEffect: boolean = true, isVertical: boolean = false): AbstractBlock[] {
        if (!this.gridManager) return [];
        
        const directions = [
            { dx: 0, dy: count },   
            { dx: count, dy: 0 },  
            { dx: 0, dy: -count },  
            { dx: -count, dy: 0 },   
            { dx: count, dy: count },    
            { dx: count, dy: -count },  
            { dx: -count, dy: -count },
            { dx: -count, dy: count }  
        ];

        const adjacent: AbstractBlock[] = [];
        
        directions.forEach(dir => {
            const block = this.gridManager.getBlockAt(this.gridX + dir.dx, this.gridY + dir.dy);
            if (block) {
                adjacent.push(block);
            }
        });

        return adjacent;
    }  
}
