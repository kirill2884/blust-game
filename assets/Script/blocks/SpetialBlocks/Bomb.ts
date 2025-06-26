import { SpecialBlockType } from "../../types/SpecialBlockType";
import BombBlock from "./BombBlock";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Bomb extends BombBlock {
  
   
    @property({type:cc.Integer})
    power: number = 1;

    protected getSpecialType(): SpecialBlockType {
        return {
            bomb:true,
            power:this.power
        }
    } 
}
