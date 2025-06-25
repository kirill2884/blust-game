import { IBlock } from "../../interfaces/IBlock";
import { SpecialBlock } from "../Common/SpecialBlock";

const {ccclass, property} = cc._decorator;

@ccclass
export default abstract class BombBlock extends SpecialBlock {

    public getAdjacentBlocks(count: number = 1, bombEffect: boolean = false, rocketEffect: boolean = true, isVertical: boolean = false): IBlock[] {
        if (!this.gridManager) return [];
        const directions = []

        for (let dy = -count; dy <= count; dy++) {
            for (let dx = -count; dx <= count; dx++) {

                if (dx === 0 && dy === 0) continue;
                directions.push({dx, dy});
            }
        }

        const adjacent: IBlock[] = [];
        
        directions.forEach(dir => {
            const block = this.gridManager.getBlockAt(this.gridX + dir.dx, this.gridY + dir.dy);
            if (block) {
                adjacent.push(block);
            }
        });

        return adjacent;
    }
    
}
