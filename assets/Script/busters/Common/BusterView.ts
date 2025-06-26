import InfoArea from "../InfoArea";
import { IBusterView } from "../Interfaces/IBusterView";

const {ccclass, property} = cc._decorator;

@ccclass
export default class BusterView extends cc.Component implements IBusterView{
    
    @property(cc.Node)
    infoNode:cc.Node = null;

    remainder:number
    infoArea:InfoArea

    onLoad () {      
        this.infoArea = this.infoNode.getComponent(InfoArea) 
        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
    }

    public onTouchStart(){        
        if(this.remainder > 0){
            cc.tween(this.node).to(0.1,{scale:1.2}).start()
        } else {
            cc.tween(this.node).to(0.1,{scale:1.0}).start() 
        }
    }

    public updateRemainder(remainder: number): void {
        this.remainder = remainder
        if (this.infoArea) {
            this.infoArea.setCurrentCount(remainder);
        }
    }

    public onDestroy(): void {
        this.node.off(cc.Node.EventType.TOUCH_START, this.onTouchStart, this); 
    }
}
