import { AbstractBlock } from "./blocks/Common/AbstractBlock";
import Game from "./Game";
import { SwappedBloks } from "./interfaces/BlockSoundConfig";

const {ccclass, property} = cc._decorator;

@ccclass
export default class GridManager extends cc.Component {

    @property({ type: cc.Integer })
    gridWidth: number = 8;

    @property({ type: cc.Integer })
    gridHeight: number = 8;
    
    @property({ type: cc.Integer })
    tileSize: number = 64;
    @property({ type: cc.Integer })
    tilePadding: number = 2;
    
    @property({ type: cc.Node })
    bgFramePlay: cc.Node = null;
    
    @property({ type: [cc.SpriteFrame] })
    blockSprites: cc.SpriteFrame[] = [];

    @property({ type: [cc.SpriteFrame] })
    specialBlockSprites: cc.SpriteFrame[] = [];

    @property({ type: cc.Prefab })
    explosionEffect: cc.Prefab = null;

    private tileSprites: cc.SpriteFrame[] = [];

    private game:Game;

    private swappedBlocks: SwappedBloks = {};
    
    private grid: AbstractBlock[][] = [];

    private startX:number
    private startY:number

    onLoad() {
        this.game = this.bgFramePlay.getComponent('Game')
        this.game.busterBomb.on('bomb-buster',this.bombBusterEmitted,this)
        this.game.busterTeleport.on('teleport-buster',this.teleportBusterEmitted,this)
        const startPosition = this.calculateGridPosition();
        this.startX = startPosition.startX
        this.startY = startPosition.startY
    }

    public validateSettings(): boolean {
        if (!this.bgFramePlay) {
            cc.error("bgFramePlay not assigned!");
            return false;
        }
        if (this.blockSprites.length < 4) {
            cc.error("Not enough block sprites assigned!");
            return false;
        }
        return true;
    }

        
    public generateGrid(): void {
        this.tileSprites = this.blockSprites;
        this.grid = [];
        this.bgFramePlay.removeAllChildren();
                 
        for (let y = 0; y < this.gridHeight; y++) {
            this.grid[y] = [];
            for (let x = 0; x < this.gridWidth; x++) {
                this.grid[y][x] = this.createTile(x, y);
            }
        }
    }
    
    private calculateGridPosition() {
        const totalWidth = this.gridWidth * (this.tileSize + this.tilePadding) - this.tilePadding;
        const totalHeight = this.gridHeight * (this.tileSize + this.tilePadding) - this.tilePadding;
        return {
            startX: -totalWidth / 2 + this.tileSize / 2,
            startY: totalHeight / 2 - this.tileSize / 2
        };
    }
    

    private createBaseTileNode(x: number, y: number, position?: cc.Vec3): cc.Node {
            const tileNode = new cc.Node(`Tile_${x}_${y}`);
            tileNode.width = this.tileSize;
            tileNode.height = this.tileSize;
                
            if (position) {
                tileNode.setPosition(position);
            } else {
                tileNode.setPosition(
                    this.startX + x * (this.tileSize + this.tilePadding),
                    this.startY - y * (this.tileSize + this.tilePadding)
                );
            }
                
            return tileNode;
    }

    private configureTileSprite(node: cc.Node, sprites: cc.SpriteFrame[]): cc.Sprite {

            const sprite = node.addComponent(cc.Sprite);
            const randomIndex = Math.floor(Math.random() * sprites.length);
            sprite.spriteFrame = sprites[randomIndex];

        return sprite;
    }

    private createTile(x: number, y: number): AbstractBlock {
            const tileNode = this.createBaseTileNode(x, y);
            const sprite = this.configureTileSprite(tileNode, this.tileSprites);
            const behavior = this.addBlockBehavior(tileNode, sprite.spriteFrame.name);
                
            behavior.gridX = x;
            behavior.gridY = y;
                
            this.bgFramePlay.addChild(tileNode);
        return behavior;
    }

    private createSpecialTile(clickedBlock: AbstractBlock): AbstractBlock {
            const tileNode = this.createBaseTileNode(
                clickedBlock.gridX, 
                clickedBlock.gridY, 
                clickedBlock.node.position
            );
                
            const sprite = this.configureTileSprite(tileNode, this.specialBlockSprites);
            const behavior = this.addBlockBehavior(tileNode, sprite.spriteFrame.name, true);
                
            behavior.gridX = clickedBlock.gridX;
            behavior.gridY = clickedBlock.gridY;
                
            this.bgFramePlay.addChild(tileNode);
            return behavior;
        }

        private getBehaviorComponent(spriteName: string, isSpecial: boolean): string | null {
            const behaviorMaps = {
                normal: {
                    'block_red': 'Red',
                    'block_yellow': 'Yellow',
                    'block_green': 'Green',
                    'block_blue': 'Blue',
                    'block_purpure': 'Purpure'
                },
                special: {
                    'block_bomb': 'Bomb',
                    'block_bomb_max': 'BombMax',
                    'block_rakets': 'Rockets',
                    'block_rockets_horisontal': 'RocketsHorizontal'
                }
            };

            const map = isSpecial ? behaviorMaps.special : behaviorMaps.normal;
            return map[spriteName] || null;
        }

        private addBlockBehavior(node: cc.Node, spriteName: string, isSpecial: boolean = false): AbstractBlock {
            const componentName = this.getBehaviorComponent(spriteName, isSpecial);

            if (!componentName) {
                 cc.error(`Behavior component not found for sprite: ${spriteName}`);
                 return null;
            }

            const behavior = node.addComponent(componentName) as AbstractBlock;
                
            // Общая настройка поведения
            this.configureBlockBehavior(behavior, node);
                
            return behavior;
        }

        private configureBlockBehavior(behavior: AbstractBlock, node: cc.Node): void {
            behavior.setGameController(this);
                
            if (this.explosionEffect) {
                behavior.setExplosionEffect(this.explosionEffect);
            }
                
            node.on(cc.Node.EventType.TOUCH_END, () => behavior.onBlockClick());
        }
    
        // Методы для взаимодействия с блоками
        public getBlockAt(x: number, y: number): AbstractBlock | null {
            if (y >= 0 && y < this.grid.length && x >= 0 && x < this.grid[y].length) {
                return this.grid[y][x];
            }
            return null;
        }
    
    
        public removeBlocks(blocks: AbstractBlock[], clickedBlock:AbstractBlock, priceBlock:number = 0): void {
            if(blocks.length < 2) return

            let aggregatePoints:number = 0
            blocks.forEach((block,index) => {
                if (block && this.grid[block.gridY][block.gridX] === block) {
                        if(index > 0 && !this.game.getBombBusterActive()) {
                                aggregatePoints += (priceBlock * index);
                            } else {
                                aggregatePoints += priceBlock
                        } 
                    this.grid[block.gridY][block.gridX] = null;
                    if(block == clickedBlock && blocks.length > 3){
                        this.grid[block.gridY][block.gridX] = this.createSpecialTile(clickedBlock);  
                    }    
                    block.node.destroy();
                }
            });
            this.game.checkStatusGame(aggregatePoints);
            // Обрабатываем падение блоков
            this.processFallingBlocks();  
        }
    
        private processFallingBlocks(): void {
            // Проходим по всем колонкам
            for (let x = 0; x < this.gridWidth; x++) {
                let emptyY = -1;
                
                // Идем снизу вверх
                for (let y = this.gridHeight - 1; y >= 0; y--) {
                    if (this.grid[y][x] === null && emptyY === -1) {
                        emptyY = y; // Нашли пустое место
                    }
                    else if (this.grid[y][x] !== null && emptyY !== -1) {
                        // Перемещаем блок вниз
                        this.moveBlockDown(x, y, emptyY);
                        emptyY--; // Новое пустое место выше
                    }
                }
                // Генерация новых блоков сверху
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
            const newBlock = this.createTile(x, emptyY);
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
        const totalWidth = this.gridWidth * (this.tileSize + this.tilePadding) - this.tilePadding;
        const totalHeight = this.gridHeight * (this.tileSize + this.tilePadding) - this.tilePadding;
        
        const startX = -totalWidth / 2 + this.tileSize / 2;
        const startY = totalHeight / 2 - this.tileSize / 2;
        
        return new cc.Vec3(
            startX + x * (this.tileSize + this.tilePadding),
            startY - y * (this.tileSize + this.tilePadding),
            0
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
        this.teleportBusterFinish(false)
    }

    public isBombBusterActive(): boolean {
        console.log(this.game.getBombBusterActive());
        return this.game.getBombBusterActive(); // Всегда получаем актуальное состояние
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

    public getSwappedBlocks(): SwappedBloks {
    return  {...this.swappedBlocks}
    }

    public setFirstSwappedBlock(block: AbstractBlock): void {
        this.swappedBlocks = { block1: block, block2: null };
    }

    public setSecondSwappedBlock(block: AbstractBlock) {
        if (!this.swappedBlocks.block1) return;
        this.swappedBlocks.block2 = block;
    }

    public clearSwappedBlocks(): void {
        this.swappedBlocks = { block1: null, block2: null };
    }

    public setSwappedBlocks(swappedBlocks:SwappedBloks):void{
        this.swappedBlocks = swappedBlocks
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
//===========================SWAPPED BUSTER=========================================

}
