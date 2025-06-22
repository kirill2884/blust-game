import { ColorBlock } from "../Common/ColorBlock";


const { ccclass } = cc._decorator;

@ccclass
export default class Blue extends ColorBlock {

    protected getColorClass(): typeof ColorBlock {
        return Blue;
    }

}