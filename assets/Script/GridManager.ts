import TileFactory from "./blocks/TileFactory";
import { AbstractBlock } from "./blocks/Common/AbstractBlock";
import Game from "./Game";
import { SwappedBloks } from "./interfaces/BlockSoundConfig";
import { IGridManager } from "./interfaces/IGridManager";
import { PositionCalculator } from "./Common/PositionCalculator";
import { SpecialBlock } from "./blocks/Common/SpecialBlock";

const {ccclass, property} = cc._decorator;

@ccclass
export default class GridManager extends cc.Component implements IGridManager{

    @property(PositionCalculator)
    private positionCalculator: PositionCalculator;

    @property({ type: cc.Integer })
    gridWidth: number = 8;

    @property({ type: cc.Integer })
    gridHeight: number = 8;
    
    @property(cc.Node) 
    tileFactoryNode: cc.Node;
    
    @property({ type: cc.Node })
    gameGrid: cc.Node = null;

    @property({ type: cc.Prefab })
    explosionEffect: cc.Prefab = null;

    @property(cc.Node)
    private gameNode: cc.Node;

    private tileFactory:TileFactory;

    private game: Game;

    private swappedBlocks: SwappedBloks = {};
    
    private grid: AbstractBlock[][] = [];

    private startX:number
    private startY:number

    onLoad() {
        this.tileFactory = this.tileFactoryNode.getComponent(TileFactory);
        this.tileFactory.onLoad()        
        const pos = this.positionCalculator.calculateGridStartPosition(this.gridWidth, 
                                                            this.gridHeight, 
                                                            this.tileFactory.getTileSize(),
                                                            this.tileFactory.getTilepadding());
        this.startX = pos.startX;
        this.startY = pos.startY;
        this.game = this.gameNode.getComponent(Game);
        this.game.busterBomb.on('bomb-buster',this.bombBusterEmitted,this)
        this.game.busterTeleport.on('teleport-buster',this.teleportBusterEmitted,this)
    }

    public validateSettings(): boolean {
        if (!this.game) {
            cc.error("Game not assigned!");
            return false;
        }
        if (this.tileFactory.getCountSprites() < 4) {
            cc.error("Not enough block sprites assigned!");
            return false;
        }
        return true;
    }

    public generateGrid(): void {        
        this.grid = [];
        this.gameGrid.removeAllChildren();
                 
        for (let y = 0; y < this.gridHeight; y++) {
            this.grid[y] = [];
            for (let x = 0; x < this.gridWidth; x++) {
                this.grid[y][x] = this.tileFactory.createTile(x, y, false);
            }
        }
    }
    
        public getBlockAt(x: number, y: number): AbstractBlock | null {
            if (y >= 0 && y < this.grid.length && x >= 0 && x < this.grid[y].length) {
                return this.grid[y][x];
            }
            return null;
        }
    
    
         public async removeBlocks(blocks: AbstractBlock[], clickedBlock:AbstractBlock, priceBlock:number = 0): Promise<void> {
            if(blocks.length < 2) return
            const spetialEffect = clickedBlock instanceof SpecialBlock
            let aggregatePoints:number = 0
            blocks.forEach((block,index) => {
                if (block && this.grid[block.gridY][block.gridX] === block) {
                        if(index > 0 && !this.game.getBombBusterActive() && !spetialEffect) {
                                aggregatePoints += (priceBlock * index);
                            } else {
                                aggregatePoints += priceBlock
                        } 
                    this.grid[block.gridY][block.gridX] = null;
                    if(block == clickedBlock && blocks.length > 4 && !spetialEffect){
                        this.grid[block.gridY][block.gridX] = this.tileFactory.createSpecialTile(clickedBlock);  
                    }    
                    block.node.destroy();
                }
            });
            this.game.checkStatusGame(aggregatePoints);
            // Обрабатываем падение блоков
            this.processFallingBlocks();  
        }
    
        private processFallingBlocks(): void {
           for (let x = 0; x < this.gridWidth; x++) {
                let emptyY = -1;
                
                for (let y = this.gridHeight - 1; y >= 0; y--) {
                    if (this.grid[y][x] === null && emptyY === -1) {
                        emptyY = y;
                    }
                    else if (this.grid[y][x] !== null && emptyY !== -1) {
                        this.moveBlockDown(x, y, emptyY);
                        emptyY--;
                    }
                }
                this.generateNewBlocksForColumn(x, emptyY);
            }
        }
    
    private moveBlockDown(x: number, fromY: number, toY: number): void {
        const block = this.grid[fromY][x];
        this.grid[fromY][x] = null;
        this.grid[toY][x] = block;
        
        block.gridY = toY;
        
        const targetPos = this.getWorldPosition(x, toY);
        cc.tween(block.node)
            .to(0.3, { position: targetPos }, { easing: 'sineOut' })
            .start();
    }

    private generateNewBlocksForColumn(x: number, emptyY: number): void {
        while (emptyY >= 0) {
            const newBlock = this.tileFactory.createTile(x, emptyY, false);
            this.grid[emptyY][x] = newBlock;
        
            const startY = emptyY - (this.gridHeight + 1);
            const startPos = this.getWorldPosition(x, startY);
            const targetPos = this.getWorldPosition(x, emptyY);
            
            newBlock.node.position = startPos;
            
            cc.tween(newBlock.node)
                .to(0.9, { position: targetPos }, { easing: 'backOut' })
                .start();
                
            emptyY--;
        }
    }

    private getWorldPosition(x: number, y: number): cc.Vec3 {
        return this.positionCalculator.getWorldPosition(
            x, y, 
            this.startX, this.startY,
            this.tileFactory.getTileSize(), this.tileFactory.getTilepadding()
        );
    }

//===========================BOMB BUSTER=========================================

    private bombBusterEmitted(power:number){
        this.game.setBombPower(power)
        if(this.game.getBombBusterActive()){
            this.bombBusterFinish(false)
        } else {
            this.game.setBombBusterActive(true);
        }
        this.normalizeBlock(this.swappedBlocks.block1)
        this.teleportBusterFinish(false)
    }

    public isBombBusterActive(): boolean {
        return this.game.getBombBusterActive();
    }

    public bombBusterFire(block:AbstractBlock) {

        const connectedBlocks: AbstractBlock[] = block.getAdjacentBlocks(this.getBombPower(),true,false,false); 
        block.highlightBlocks(connectedBlocks);
        block.destroyBlocks(connectedBlocks, null)
        this.bombBusterFinish(true)
    
    }

    public bombBusterFinish(isUsed:boolean):void{
        this.game.setBombBusterActive(false);
        this.game.busterBomb.emit('buster-bomb-finish',isUsed)     
    }

    public getBombPower():number{
        return this.game.getBombPower();
    }

    
//===========================BOMB BUSTER=========================================

//===========================TELEPORT BUSTER=========================================

    private teleportBusterEmitted(){
        
        if(this.game.getTeleportBusterActive()){
            this.normalizeBlock(this.swappedBlocks.block1)
            this.teleportBusterFinish(false)
        } else {
                this.game.setTeleportBusterActive(true)
        }
            
        this.bombBusterFinish(false)       
    }

    public isTeleportBusterActive():boolean{
        return this.game.getTeleportBusterActive();
    }

    public teleportBusterFinish(isUsed:boolean):void{       
        this.game.busterTeleport.emit('buster-teleport-finish',isUsed)
        this.game.setTeleportBusterActive(false)
        this.clearSwappedBlocks();         
    }

    public teleportBusterFire(block:AbstractBlock){

        const currentSelection = this.getSwappedBlocks();
        
        if (!currentSelection.block1) {
            cc.tween(block.node).to(0.1, { scale: 1.2 }).start();
            this.setSwappedBlocks({
                block1: block,
                block2: null
            });
        } else {
            cc.tween(block.node).to(0.1, { scale: 1.2 })
            .call(this.startProcessTeleport.bind(this,block)).start();
        }

    }

    private startProcessTeleport(block:AbstractBlock){
        const currentSelection = this.getSwappedBlocks();
        currentSelection.block2 = block
        this.swapBlocks(currentSelection);

        Object.keys(currentSelection).forEach(key => {
            this.normalizeBlock(currentSelection[key])
        })

        this.setSwappedBlocks(this.getEmptySwappedBlocks());
    }

    public swapBlocks(swapped:SwappedBloks){

        if (!this.validateSwapInput(swapped)) {
            return;
        }

        const block1Data = this.getBlockData(swapped.block1);
        const block2Data = this.getBlockData(swapped.block2);
        this.updateGridPositions(swapped);
        this.swapBlockProperties(swapped.block1, block2Data);
        this.swapBlockProperties(swapped.block2, block1Data);
        this.teleportBusterFinish(true);
    }

    private validateSwapInput(swapped: SwappedBloks): boolean {
        if (!swapped?.block1?.node?.isValid || !swapped?.block2?.node?.isValid) {
            cc.error("Invalid blocks for swap!");
            return false;
        }

        return true;
    }

    private getBlockData(block: AbstractBlock): BlockData {
        return {
            position: block.node.position.clone(),
            gridX: block.gridX,
            gridY: block.gridY,
            name: `Tile_${block.gridX}_${block.gridY}`
        };
    }

    private updateGridPositions(swapped: SwappedBloks): void {
        const { block1, block2 } = swapped;
        this.grid[block1.gridY][block1.gridX] = block2;
        this.grid[block2.gridY][block2.gridX] = block1;
    }

    private swapBlockProperties(block: AbstractBlock, targetData: BlockData): void {
        block.node.position = targetData.position;
        block.gridX = targetData.gridX;
        block.gridY = targetData.gridY;
        block.node.name = targetData.name;
    }

    private getEmptySwappedBlocks():SwappedBloks {
        return {block1: null, block2: null}
    }

    public getSwappedBlocks(): SwappedBloks {
        return  {...this.swappedBlocks}
    }

    public setSwappedBlocks(swappedBlocks:SwappedBloks):void{
        this.swappedBlocks = swappedBlocks
    }

    public clearSwappedBlocks(): void {
        this.swappedBlocks = { block1: null, block2: null };
    }

    private normalizeBlock(block: AbstractBlock){
        if(block){
            cc.tween(block.node).to(0.1, { scale: 1.0 }).start();
        }  
    }

//===========================SWAPPED BUSTER=========================================


public getGridWidth(){
    return this.gridWidth
}

public getGridHeight(){
    return this.gridHeight
}

}
