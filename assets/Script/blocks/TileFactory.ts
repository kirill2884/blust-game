import { PositionCalculator } from "../Common/PositionCalculator";
import GridManager from "../GridManager";
import { IGridManager } from "../interfaces/IGridManager";
import { AbstractBlock } from "./Common/AbstractBlock";

const {ccclass, property} = cc._decorator;

@ccclass
export default class TileFactory extends cc.Component {

    @property(PositionCalculator)
    private positionCalculator: PositionCalculator;

    @property({ type: cc.Integer })
    tileSize: number = 64;
    
    @property({ type: cc.Integer })
    tilePadding: number = 2;

    @property({ type: cc.Node })
    gameGridNode: cc.Node = null;

    @property({ type: [cc.SpriteFrame] })
    blockSprites: cc.SpriteFrame[] = [];

    @property({ type: [cc.SpriteFrame] })
    specialBlockSprites: cc.SpriteFrame[] = [];

    @property({ type: cc.Prefab })
    explosionEffect: cc.Prefab = null;

    private gridManager:IGridManager = null
    private startX:number
    private startY:number


    onLoad () {
        this.gridManager = this.gameGridNode.getComponent(GridManager)
        const pos = this.positionCalculator.calculateGridStartPosition(this.gridManager.getGridWidth(), this.gridManager.getGridHeight(), this.tileSize, this.tilePadding);
        this.startX = pos.startX;
        this.startY = pos.startY;
    }

    public createTile(x: number, y: number, special:boolean): AbstractBlock {
            
                const tileNode = this.createBaseTileNode(x, y);
                const sprite = this.configureTileSprite(tileNode, special ? this.specialBlockSprites : this.blockSprites);
                const behavior = this.addBlockBehavior(tileNode, sprite.spriteFrame.name);
                    
                behavior.gridX = x;
                behavior.gridY = y;   
                this.gameGridNode.addChild(tileNode);
                
            return behavior;
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
                sprite.type = cc.Sprite.Type.SIMPLE;
                sprite.sizeMode = cc.Sprite.SizeMode.CUSTOM;
                sprite.node.width = node.width;
                sprite.node.height = node.height;
                const randomIndex = Math.floor(Math.random() * sprites.length);
                sprite.spriteFrame = sprites[randomIndex];

            return sprite;
        }

        public createSpecialTile(clickedBlock: AbstractBlock): AbstractBlock {
            const tileNode = this.createBaseTileNode(
                clickedBlock.gridX, 
                clickedBlock.gridY, 
                clickedBlock.node.position
            );
                
            const sprite = this.configureTileSprite(tileNode, this.specialBlockSprites);
            const behavior = this.addBlockBehavior(tileNode, sprite.spriteFrame.name, true);
                
            behavior.gridX = clickedBlock.gridX;
            behavior.gridY = clickedBlock.gridY;
                
            this.gameGridNode.addChild(tileNode);
            return behavior;
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
            behavior.setGameController(this.gameGridNode.getComponent(GridManager));
                
            if (this.explosionEffect) {
                behavior.setExplosionEffect(this.explosionEffect);
            }
                
            node.on(cc.Node.EventType.TOUCH_END, () => behavior.onBlockClick());
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

        public getCountSprites(){
            return this.blockSprites.length
        }

        public getTileSize(){
            return this.tileSize
        }

        public getTilepadding(){
            return this.tilePadding
        }

    start () {

    }
    
}
