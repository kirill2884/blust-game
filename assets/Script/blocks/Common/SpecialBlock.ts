import { SpecialBlockType } from "../../types/SpecialBlockType";
import { IBlock } from "../Interfaces/IBlock";
import { AbstractBlock } from "./AbstractBlock";

const { ccclass } = cc._decorator;

@ccclass
export abstract class SpecialBlock extends AbstractBlock {

    protected abstract getSpecialType(): SpecialBlockType;

    onBlockClick(): void {

        const specialType:SpecialBlockType = this.getSpecialType();
        
        const connectedBlocks = this.getAdjacentBlocks(specialType.power,specialType.bomb,specialType.rocket,specialType.isVertical);
        connectedBlocks.push(this)
        this.highlightBloks(connectedBlocks);
        this.scheduleOnce(() => this.destroyBlocks(connectedBlocks, this), 0.5);
    }

    private  highlightBloks(blocks: IBlock[]): void{
        blocks.forEach((block) => {
            cc.tween(block.node).delay(0.05).to(0.1, {scale:1.2}).to(0.1,{scale:1.0}).start()
        })
    }

}