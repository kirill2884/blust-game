import { ColorBlock } from "../Common/ColorBlock";


const { ccclass } = cc._decorator;

@ccclass
export default class Green extends ColorBlock {

    protected getColorClass(): typeof ColorBlock {
        return Green;
    }

}
