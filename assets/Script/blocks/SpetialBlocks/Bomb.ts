import { AbstractBlock } from "../Common/AbstractBlock";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Bomb extends AbstractBlock {

    onBlockClick(): void {
        const connectedBlocks = this.getAdjacentBlocks(1,true);
        connectedBlocks.push(this)
        console.log(connectedBlocks);
        this.highlightBloks(connectedBlocks);
        this.scheduleOnce(() => this.destroyBlocks(connectedBlocks), 0.5);
    }

    private highlightBloks(blocks: AbstractBlock[]): void{
        blocks.forEach((block,index) => {
            cc.tween(block.node).delay(0.05).to(0.1, {scale:1.2}).to(0.1,{scale:1.0}).start()
        })
    }

    private destroyBlocks(blocks: AbstractBlock[]): void {
        // blocks.forEach(block => {
        //     this.createExplosion();
        // })

        if(this.gridManager){
            this.gridManager.removeBlocks(blocks)
        }
    }

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {

    }

    // update (dt) {}
}
