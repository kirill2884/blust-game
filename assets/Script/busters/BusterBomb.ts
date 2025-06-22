import AbstarctBuster from "./Common/AbstarctBuster";


const {ccclass, property} = cc._decorator;

@ccclass
export default class BusterBomb extends AbstarctBuster {
    
    @property
    power:number = 1;

    public activate(): void {
        this.node.emit('bomb-buster',this.power)
        this.node.on('buster-bomb-finish',this.deactivate,this)
    }

    public deactivate(isUsed:boolean): void {
        cc.tween(this.node).to(0.1,{scale:1.0}).start()
        if(isUsed){
            this.remainder--
            this.view.updateRemainder(this.remainder)
        }
    }
        
}
