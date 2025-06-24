import InfoArea from "../InfoArea";

const {ccclass, property} = cc._decorator;

@ccclass
export default class BusterView extends cc.Component {

    infoArea:InfoArea = null;
    remainder:number

    onLoad () {     
        this.infoArea = this.node.getComponent(InfoArea);  
        this.node.on(cc.Node.EventType.MOUSE_DOWN, this.onMouseDown, this);
        this.node.on(cc.Node.EventType.MOUSE_UP, this.onMouseUp, this);     
        this.node.on(cc.Node.EventType.TOUCH_START, this.onMouseUp, this);    
    }

    onMouseDown(e:cc.Event.EventTouch){       
        cc.tween(e.currentTarget).to(0.1,{scale:0.8}).start()   
    }

    onMouseUp(e:cc.Event.EventMouse){        
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
        this.node.off(cc.Node.EventType.MOUSE_DOWN, this.onMouseDown, this);
        this.node.off(cc.Node.EventType.MOUSE_UP, this.onMouseUp, this);
        this.node.off(cc.Node.EventType.TOUCH_START, this.onMouseUp, this); 
    }
}
