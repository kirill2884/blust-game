import { Position } from "../types/Position";

const {ccclass} = cc._decorator;

@ccclass
export class PositionCalculator extends cc.Component{
    
    calculateGridStartPosition(width: number, height: number, tileSize: number, padding: number): Position {
        const totalWidth = width * (tileSize + padding) - padding;
        const totalHeight = height * (tileSize + padding) - padding;
        
        return {
            startX: -totalWidth / 2 + tileSize / 2,
            startY: totalHeight / 2 - tileSize / 2
        };
    }

    getWorldPosition(x: number, y: number, startX: number, startY: number, tileSize: number, padding: number): cc.Vec3 {
        return new cc.Vec3(startX + x * (tileSize + padding), startY - y * (tileSize + padding), 0);
    }
}