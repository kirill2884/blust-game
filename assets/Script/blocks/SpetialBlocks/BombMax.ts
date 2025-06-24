import BombBlock from "./BombBlock";

const {ccclass, property} = cc._decorator;

@ccclass
export default class BombMax extends BombBlock {
    
    @property({type:cc.Integer})
    power: number = 2;

    protected getSpecialType(): SpecialBlockType {
        return {
            bomb:true,
            power:this.power
        }
    }

}
