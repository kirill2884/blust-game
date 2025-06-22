import BusterView from "./BusterView";

const {ccclass, property} = cc._decorator;

@ccclass
export default abstract class AbstarctBuster extends cc.Component{

    @property
    protected maxCount: number = 3;

    protected remainder: number;
    protected view: BusterView;

    onLoad () {       
        this.view = this.node.getComponent(BusterView)
        this.initBuster(this.view) 
        this.node.on(cc.Node.EventType.MOUSE_UP, this.onActivate, this); 
    }

    private onActivate (){
        if(this.remainder > 0) {
            this.activate()
        }
    }

    protected onDestroy(): void {
        this.view.destroy();
    }

    initBuster(view:BusterView): void {
        this.remainder = this.maxCount;
        view.updateRemainder(this.remainder);
    }

    public abstract activate(): void;
    public abstract deactivate(isUsed:boolean): void;

}
