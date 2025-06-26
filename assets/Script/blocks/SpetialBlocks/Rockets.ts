import { SpecialBlockType } from "../../types/SpecialBlockType";
import RocketBlock from "./RocketBlock";

const {ccclass, property} = cc._decorator;

@ccclass
export default class RocketsVertical extends RocketBlock {


    protected getSpecialType(): SpecialBlockType {
        return {
            rocket:true,
            isVertical:true
        }
    }

}
