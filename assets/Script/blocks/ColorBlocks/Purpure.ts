import { ColorBlock } from "../Common/ColorBlock";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Purpure extends ColorBlock {

    protected getColorClass(): typeof ColorBlock {
        return Purpure;
    }

}
