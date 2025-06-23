// import { AbstractBlock } from "./blocks/Common/AbstractBlock";
// import { IGridManager } from "./interfaces/IGridManager";
// import { BlockFactory } from "./BlockFactory";
// import { BusterManager } from "./BusterManager";
// import { AnimationManager } from "./AnimationManager";

// const {ccclass, property} = cc._decorator;

// @ccclass
// export default class GridManager extends cc.Component implements IGridManager {
//     // Grid configuration
//     @property({ type: cc.Integer }) gridWidth: number = 8;
//     @property({ type: cc.Integer }) gridHeight: number = 8;
//     @property({ type: cc.Integer }) tileSize: number = 64;
//     @property({ type: cc.Integer }) tilePadding: number = 2;
//     @property(cc.Node) gameGrid: cc.Node = null;

//     // Dependencies
//     @property(BlockFactory) blockFactory: BlockFactory;
//     @property(BusterManager) busterManager: BusterManager;
//     @property(AnimationManager) animationManager: AnimationManager;

//     private grid: AbstractBlock[][] = [];
//     private startPosition: cc.Vec2 = cc.v2(0, 0);

//     // Initialization
//     public initialize(): void {
//         this.calculateGridPosition();
//         this.generateGrid();
//     }

//     // Grid generation
//     public generateGrid(): void {
//         this.clearGrid();
        
//         for (let y = 0; y < this.gridHeight; y++) {
//             this.grid[y] = [];
//             for (let x = 0; x < this.gridWidth; x++) {
//                 this.grid[y][x] = this.createBlock(x, y);
//             }
//         }
//     }

//     private clearGrid(): void {
//         this.grid = [];
//         this.gameGrid.removeAllChildren();
//     }

//     // Block management
//     public getBlockAt(x: number, y: number): AbstractBlock | null {
//         if (this.isValidCoordinate(x, y)) {
//             return this.grid[y][x];
//         }
//         return null;
//     }

//     private isValidCoordinate(x: number, y: number): boolean {
//         return y >= 0 && y < this.grid.length && 
//                x >= 0 && x < this.grid[y].length;
//     }

//     private createBlock(x: number, y: number): AbstractBlock {
//         const position = this.getWorldPosition(x, y);
//         return this.blockFactory.createTile(x, y, position);
//     }

//     // Position calculations
//     private calculateGridPosition(): void {
//         const totalWidth = this.calculateTotalDimension(this.gridWidth);
//         const totalHeight = this.calculateTotalDimension(this.gridHeight);
        
//         this.startPosition = cc.v2(
//             -totalWidth / 2 + this.tileSize / 2,
//             totalHeight / 2 - this.tileSize / 2
//         );
//     }

//     private calculateTotalDimension(count: number): number {
//         return count * (this.tileSize + this.tilePadding) - this.tilePadding;
//     }

//     public getWorldPosition(x: number, y: number): cc.Vec3 {
//         return new cc.Vec3(
//             this.startPosition.x + x * (this.tileSize + this.tilePadding),
//             this.startPosition.y - y * (this.tileSize + this.tilePadding),
//             0
//         );
//     }

//     // Block operations
//     public async removeBlocks(blocks: AbstractBlock[], clickedBlock?: AbstractBlock): Promise<void> {
//         if (blocks.length < 2) return;

//         await this.destroyBlocks(blocks, clickedBlock);
//         await this.processFallingBlocks();
//     }

//     private async destroyBlocks(blocks: AbstractBlock[], clickedBlock?: AbstractBlock): Promise<void> {
//         const destroyPromises = blocks.map(block => {
//             if (!block || !this.isValidCoordinate(block.gridX, block.gridY)) {
//                 return Promise.resolve();
//             }

//             this.grid[block.gridY][block.gridX] = null;
            
//             if (block === clickedBlock && blocks.length > 3) {
//                 this.createSpecialBlock(block);
//             }
            
//             return this.animationManager.playDestroyAnimation(block.node);
//         });

//         await Promise.all(destroyPromises);
//     }

//     private createSpecialBlock(block: AbstractBlock): void {
//         const specialBlock = this.blockFactory.createSpecialTile(
//             block.gridX, 
//             block.gridY, 
//             block.node.position
//         );
//         this.grid[block.gridY][block.gridX] = specialBlock;
//     }

//     // Falling blocks processing
//     private async processFallingBlocks(): Promise<void> {
//         for (let x = 0; x < this.gridWidth; x++) {
//             await this.processColumn(x);
//         }
//     }

//     private async processColumn(x: number): Promise<void> {
//         let emptyY = this.findLowestEmptyY(x);
//         while (emptyY >= 0) {
//             await this.moveBlocksDown(x, emptyY);
//             emptyY = this.findLowestEmptyY(x);
//         }
//         await this.generateNewBlocks(x);
//     }

//     private findLowestEmptyY(x: number): number {
//         for (let y = this.gridHeight - 1; y >= 0; y--) {
//             if (this.grid[y][x] === null) {
//                 return y;
//             }
//         }
//         return -1;
//     }

//     private async moveBlocksDown(x: number, emptyY: number): Promise<void> {
//         for (let y = emptyY - 1; y >= 0; y--) {
//             const block = this.grid[y][x];
//             if (block) {
//                 await this.moveBlock(block, x, emptyY);
//                 emptyY--;
//             }
//         }
//     }

//     private async moveBlock(block: AbstractBlock, x: number, newY: number): Promise<void> {
//         this.grid[block.gridY][x] = null;
//         this.grid[newY][x] = block;
//         block.gridY = newY;
        
//         const targetPos = this.getWorldPosition(x, newY);
//         await this.animationManager.playMoveAnimation(block.node, targetPos);
//     }

//     private async generateNewBlocks(x: number): Promise<void> {
//         let emptyY = this.findLowestEmptyY(x);
//         while (emptyY >= 0) {
//             const newBlock = this.createBlock(x, emptyY);
//             this.grid[emptyY][x] = newBlock;
            
//             const startPos = this.getWorldPosition(x, emptyY - (this.gridHeight + 1));
//             const targetPos = this.getWorldPosition(x, emptyY);
            
//             newBlock.node.position = startPos;
//             await this.animationManager.playSpawnAnimation(newBlock.node, targetPos);
            
//             emptyY--;
//         }
//     }
// }