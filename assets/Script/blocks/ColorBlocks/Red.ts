import { ColorBlock } from "../Common/ColorBlock";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Red extends ColorBlock {

    protected getColorClass(): typeof ColorBlock {
        return Red;
    }

}
