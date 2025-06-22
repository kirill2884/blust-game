
const {ccclass, property} = cc._decorator;

@ccclass
export default class InfoArea extends cc.Component {

    @property(cc.RichText)
    countLabel: cc.RichText = null;

    public setCurrentCount(count:number){
        this.countLabel.string = count.toString()
    }

}
