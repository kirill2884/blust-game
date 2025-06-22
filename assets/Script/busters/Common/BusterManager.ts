import AbstarctBuster from "./AbstarctBuster";
import BusterView from "./BusterView";

const {ccclass, property} = cc._decorator;

@ccclass
export class BusterManager extends cc.Component{

    private busters: AbstarctBuster[] = []

    public init() {

        const busterNodes:cc.Node[] = this.node.children
        busterNodes.forEach(busterNode => {
            const view = busterNode.getComponent(BusterView)
            const buster = busterNode.getComponent(AbstarctBuster);
            buster.initBuster(view)
            this.busters.push(buster);
        })
    }
}