import { IBuster } from "../Interfaces/IBuster";
import { IBusterView } from "../Interfaces/IBusterView";
import BusterView from "./BusterView";

const {ccclass, property} = cc._decorator;

@ccclass
export default abstract class AbstarctBuster extends cc.Component implements IBuster{

    @property
    maxCount: number = 3;

    remainder: number;
    view: IBusterView;

    onLoad () {       
        this.view = this.node.getComponent(BusterView)
        this.initBuster(this.view) 
        this.node.on(cc.Node.EventType.TOUCH_START, this.onActivate, this);
    }

    private onActivate (){
        if(this.remainder > 0) {
            this.activate()
        }
    }

    protected onDestroy(): void {
        this.view.destroy();
    }

    initBuster(view:IBusterView): void {
        this.remainder = this.maxCount;
        view.updateRemainder(this.remainder);
    }

    public abstract activate(): void;
    public abstract deactivate(isUsed:boolean): void;

}
