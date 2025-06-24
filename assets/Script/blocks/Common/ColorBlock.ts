import { AbstractBlock } from "./AbstractBlock";
const { ccclass } = cc._decorator;

@ccclass
export abstract class ColorBlock extends AbstractBlock {

    private countPoints:number = 10;
    
    protected abstract getColorClass(): typeof ColorBlock;

    onBlockClick(): void {

        if(this.gridManager.isBombBusterActive()){
            this.bombBusterFire(this.gridManager.getBombPower())
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

public getAdjacentBlocks(count: number, bombEffect: boolean = false): AbstractBlock[] {
    if (!this.gridManager) return [];
    
    const directions = [
        { dx: 0, dy: count },   
        { dx: count, dy: 0 },   
        { dx: 0, dy: -count }, 
        { dx: -count, dy: 0 }   
    ];

    // диагонали для bombEffect
    if (bombEffect) {
        directions.push(
            { dx: count, dy: count },    
            { dx: count, dy: -count },  
            { dx: -count, dy: -count }, 
            { dx: -count, dy: count }  
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

    protected highlightBlocks(blocks: AbstractBlock[]): void {
        blocks.forEach((block, index) => {
            cc.tween(block.node)
                .delay(index * 0.05)
                .to(0.1, { scale: 1.2 })
                .to(0.1, { scale: 1.0 })
                .start();
        });
    }

    protected highlightBombBlocks(blocks: AbstractBlock[]): void {
        blocks.forEach((block) => {
            cc.tween(block.node)
                .to(0.1, { scale: 1.2 })
                .to(0.1, { scale: 1.0 })
                .start();
        });
    }

    protected bombBusterFire(power:number) {

        const connectedBlocks: AbstractBlock[] = this.getAdjacentBlocks(power,true); 
        this.highlightBombBlocks(connectedBlocks);
        this.destroyBlocks(connectedBlocks, null)
        this.gridManager.bombBusterFinish(true)
    
    }

    public getCountPoints(): number{
        return this.countPoints;
    }

}