import { ColorBlock } from "../Common/ColorBlock";

const { ccclass } = cc._decorator;

@ccclass
export default class Yellow extends ColorBlock {

    protected getColorClass(): typeof ColorBlock {
        return Yellow;
    }

}