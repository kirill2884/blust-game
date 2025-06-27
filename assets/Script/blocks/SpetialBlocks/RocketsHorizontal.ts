import { SpecialBlockType } from "../../types/SpecialBlockType";
import RocketBlock from "./RocketBlock";

const {ccclass} = cc._decorator;

@ccclass
export default class RocketsHorizontal extends RocketBlock {
    
    
    protected getSpecialType(): SpecialBlockType {
         return {
            rocket:true,
            isVertical:false
        }
    }  

}
