import { AbstractBlock } from "../Common/AbstractBlock";
import { SpecialBlock } from "../Common/SpecialBlock";

const {ccclass, property} = cc._decorator;

@ccclass
export default class BombMax extends SpecialBlock {
    
    @property({type:cc.Integer})
    power: number = 2;

    protected getSpecialType(): SpecialBlockType {
        return {
            bomb:true,
            power:this.power
        }
    }

    public getAdjacentBlocks(count: number = 1, bombEffect: boolean = false, rocketEffect: boolean = true, isVertical: boolean = false): AbstractBlock[] {
        if (!this.gridManager) return [];
        const directions = []
        // Генерируем все возможные смещения в радиусе count
        for (let dy = -count; dy <= count; dy++) {
            for (let dx = -count; dx <= count; dx++) {

                if (dx === 0 && dy === 0) continue;
                directions.push({dx, dy});
            }
        }

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
