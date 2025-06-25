import { AbstractBlock } from "./AbstractBlock";
const { ccclass } = cc._decorator;

@ccclass
export abstract class ColorBlock extends AbstractBlock {

    private countPoints:number = 10;
    
    protected abstract getColorClass(): typeof ColorBlock;

    onBlockClick(): void {

        if(this.gridManager.isBombBusterActive()){
            this.gridManager.bombBusterFire(this)
            return
        }

        if(this.gridManager.isTeleportBusterActive()){
            this.gridManager.teleportBusterFire(this)
            return
        }
        
        const connectedBlocks = this.findConnectedBlocks(this.getColorClass());
        this.highlightBlocks(connectedBlocks);
        this.scheduleOnce(() => this.destroyBlocks(connectedBlocks,this), 0.5);
    }

    protected findConnectedBlocks(blockClass: typeof ColorBlock): AbstractBlock[] {
        const visited = new Set<AbstractBlock>();
        this.findConnected(this, blockClass, visited);
        return Array.from(visited);
    }

    protected findConnected(block: AbstractBlock, blockClass: typeof ColorBlock, visited: Set<AbstractBlock>): void {
        if (visited.has(block)) return;
        visited.add(block);
        block.getAdjacentBlocks(1,false,false,false)
            .filter(adjacent => adjacent instanceof blockClass)
            .forEach(block => this.findConnected(block, blockClass, visited));
    }

public getAdjacentBlocks(count: number, bombEffect: boolean = false, rocketEffect: boolean = false, isVertical:boolean = false): AbstractBlock[] {
    if (!this.gridManager) return [];
    
    const directions = [
        { dx: 0, dy: count },   
        { dx: count, dy: 0 },   
        { dx: 0, dy: -count }, 
        { dx: -count, dy: 0 }   
    ];

    // диагонали  и центральный блок для для bombEffect
    if (bombEffect) {
        directions.push(
            { dx: count, dy: count },    
            { dx: count, dy: -count },  
            { dx: -count, dy: -count }, 
            { dx: -count, dy: count },
            { dx: 0, dy: 0} 
        );
    }

    const adjacent: AbstractBlock[] = [];
    
    directions.forEach(dir => {
        const block = this.gridManager.getBlockAt(this.gridX + dir.dx, this.gridY + dir.dy);
        if (block) {
            adjacent.push(block);
        }
    });

    return adjacent;
}

    public getCountPoints(): number{
        return this.countPoints;
    }

}