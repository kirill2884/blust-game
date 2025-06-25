import GridManager from "../../GridManager";
import { IBlock } from "../../interfaces/IBlock";

const { ccclass } = cc._decorator;

@ccclass
export abstract class AbstractBlock extends cc.Component implements IBlock {

    public gridX: number = -1;
    public gridY: number = -1;
    
    protected gridManager: GridManager = null;
    protected explosionEffect: cc.Prefab = null;

    public abstract onBlockClick(): void;

    public abstract getAdjacentBlocks(count: number, bombEffect:boolean, rocketEffect: boolean, isVertical: boolean): IBlock[] 

    public setGameController(gridManager: GridManager): void {
        this.gridManager = gridManager;
    }

    public setExplosionEffect(effect: cc.Prefab): void {
        this.explosionEffect = effect;
    }

    public createExplosionAt(position: cc.Vec2): void {
        if (!this.explosionEffect) return;

            const parentNode = this.node.parent
            if (!parentNode) return;

            const explosion = cc.instantiate(this.explosionEffect);
            this.runExplosion(explosion, parentNode, position)

    }


    private runExplosion(explosion: cc.Node, parentNode: cc.Node ,position: cc.Vec2) {        
            explosion.setPosition(position);
            parentNode.addChild(explosion);

            explosion.setScale(0.1); 
            explosion.opacity = 0; 

            const scaleUp = cc.scaleTo(0.1, 2.0).easing(cc.easeBackOut());
            const scaleDown = cc.scaleTo(0.2, 0.8).easing(cc.easeSineIn());
            const fadeIn = cc.fadeTo(0.1, 255);
            const fadeOut = cc.fadeTo(0.3, 0);
            
            // Комплексная анимация
            explosion.runAction(
                cc.sequence(
                    cc.spawn(fadeIn, scaleUp),       // Появление и увеличение
                    cc.spawn(scaleDown, fadeOut),    // Исчезновение и уменьшение
                    cc.callFunc(() => {
                        explosion.destroy();
                })
            )
        );
        
    }

    public destroyBlocks(blocks: IBlock[], clickedBlock: IBlock): void {
            if (!blocks || blocks.length < 2) return;

            blocks.forEach((block, index) => {
                if (block && block.node) {

                    this.createExplosionAt(block.node.getPosition());
                    
                        block.node.runAction(cc.delayTime(index * 0.05));

                }
            });
        
            if (this.gridManager) {               
                this.gridManager.removeBlocks(blocks, clickedBlock, 10);
            }
    }

    public highlightBlocks(blocks: IBlock[]): void {
        blocks.forEach((block, index) => {
            cc.tween(block.node)
                .delay(index * 0.05)
                .to(0.1, { scale: 1.2 })
                .to(0.1, { scale: 1.0 })
                .start();
        });
    }

}