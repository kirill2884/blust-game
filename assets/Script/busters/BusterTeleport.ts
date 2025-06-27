import AbstarctBuster from "./Common/AbstarctBuster";

const { ccclass } = cc._decorator;

@ccclass
export default class BusterTeleport extends AbstarctBuster {

    public activate(): void {
        this.node.emit('teleport-buster')
        this.node.on('buster-teleport-finish',this.deactivate,this)
    }

    public deactivate(isUsed:boolean): void {       
        cc.tween(this.node).to(0.1,{scale:1.0}).start()
        if(isUsed){
            this.remainder--
            this.view.updateRemainder(this.remainder)
        }
        this.node.off('buster-teleport-finish');
    }
    
    onDestroy() {
        this.node.off('buster-teleport-finish');
    }



    
}
