import { SwappedBloks } from "../../interfaces/BlockSoundConfig";
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
            this.teleportBusterFire(this)
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
        block.getAdjacentBlocks()
            .filter(adjacent => adjacent instanceof blockClass)
            .forEach(block => this.findConnected(block, blockClass, visited));
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

    protected destroyBlocks(blocks: AbstractBlock[], clickedBlock: AbstractBlock): void {
            if (!blocks || blocks.length < 2) return;

            // Создаем взрывы для каждого блока
            blocks.forEach((block, index) => {
                if (block && block.node) {
                    // Создаем взрыв в позиции блока
                    this.createExplosionAt(block.node.position);
                    
                    // Можно добавить небольшую задержку между взрывами для эффекта каскада
                    // if(!bombEffect){
                        block.node.runAction(cc.delayTime(index * 0.05));
                    // }
                }
            });
        
            // Затем удаляем блоки через Game
            if (this.gridManager) {               
                this.gridManager.removeBlocks(blocks, clickedBlock, this.countPoints);
            }
    }

    protected bombBusterFire(power:number) {

        const connectedBlocks: AbstractBlock[] = this.getAdjacentBlocks(power,true); 
        this.highlightBombBlocks(connectedBlocks);
        this.destroyBlocks(connectedBlocks, null)
        this.gridManager.bombBusterFinish(true)
    
    }

    protected teleportBusterFire(clickedBlock: AbstractBlock): void {
        const currentSelection = this.gridManager.getSwappedBlocks();
        
        if (!currentSelection.block1) {
            cc.tween(clickedBlock.node).to(0.1, { scale: 1.2 }).start();
            this.gridManager.setSwappedBlocks({
                block1: clickedBlock,
                block2: null
            });
        } else {
            cc.tween(clickedBlock.node).to(0.1, { scale: 1.2 })
            .call(() => {
                    currentSelection.block2 = clickedBlock
                    this.gridManager.swapBlocks(currentSelection);
                    cc.tween(currentSelection.block1.node).to(0.1, { scale: 1.0 }).start();
                    cc.tween(clickedBlock.node).to(0.1, { scale: 1.0 }).start();
                    this.gridManager.setSwappedBlocks({
                        block1: null,
                        block2: null
                    });
                })
                .start();
        }
    }


    public getCountPoints(): number{
        return this.countPoints;
    }

}