import BusterBomb from "../BusterBomb";
import BusterTeleport from "../BusterTeleport";
import AbstarctBuster from "./AbstarctBuster";
import BusterView from "./BusterView";

const {ccclass, property} = cc._decorator;

@ccclass
export class BusterManager extends cc.Component{

    private busters: AbstarctBuster[] = []

    public onLoad() {

        const busterNodes:cc.Node[] = this.node.children
        busterNodes.forEach(busterNode => {
            const view = busterNode.getComponent(BusterView)
            const buster = busterNode.getComponent(AbstarctBuster);
            buster.initBuster(view)
            this.busters.push(buster);
        })       
    }

    public getBusters():AbstarctBuster[]{
        return JSON.parse(JSON.stringify(this.busters));
    }

    getBusterTeleport():Readonly<BusterTeleport>{
        const teleport: BusterTeleport = this.busters.find(buster => buster instanceof BusterTeleport)
        if(!teleport){
            cc.error('Buster teleport not found')  
            throw new Error ('Buster teleport not found') 
        }
        return teleport;  
        
    }

    getBusterBomb():Readonly<BusterBomb> {
        const bombBuster: BusterBomb = this.busters.find(buster => buster instanceof BusterBomb)
        if(!bombBuster){
              cc.error('Buster bomb not found')
              throw new Error ('Buster bomb not found')  
        }
        return bombBuster;
        
    }
}