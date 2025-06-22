import { AbstractBlock } from "../Common/AbstractBlock";

const {ccclass, property} = cc._decorator;

@ccclass
export default class RocketsHorizontal extends AbstractBlock {

    onBlockClick(): void {
        console.log("Rockets horizontal click");
        
    }

    @property(cc.Label)
    label: cc.Label = null;

    @property
    text: string = 'hello';

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {

    }

    // update (dt) {}
}
