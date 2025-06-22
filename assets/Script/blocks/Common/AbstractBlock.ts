import GridManager from "../../GridManager";

const { ccclass } = cc._decorator;

@ccclass
export abstract class AbstractBlock extends cc.Component {
    public gridX: number = -1;
    public gridY: number = -1;
    
    protected gridManager: GridManager = null;
    protected explosionEffect: cc.Prefab = null;

    public abstract onBlockClick(): void;

    public setGameController(gridManager: GridManager): void {
        this.gridManager = gridManager;
    }

    public setExplosionEffect(effect: cc.Prefab): void {
        this.explosionEffect = effect;
    }


    public getAdjacentBlocks(count:number = 1, bombFire:boolean = false): AbstractBlock[] {
        if (!this.gridManager) return [];
        
        const directions = this.getSearchDirections(count,bombFire);
        const adjacent: AbstractBlock[] = [];
        
        directions.forEach(dir => {
            const block = this.gridManager.getBlockAt(this.gridX + dir.dx, this.gridY + dir.dy);
            if (block) {
                adjacent.push(block);
            }
        });
    
        return adjacent;
    }

    private getSearchDirections(count: number, bombFire:boolean = false): {dx: number, dy: number}[] {
        const directions: {dx: number, dy: number}[] = [];
        
        // Генерируем все возможные смещения в радиусе count
        for (let dy = -count; dy <= count; dy++) {
            for (let dx = -count; dx <= count; dx++) {

                if (dx === 0 && dy === 0) continue;
                if (!bombFire && dx !== 0 && dy !== 0) continue;
                // Добавляем направление
                directions.push({dx, dy});
            }
        }
        
        return directions;
    }

    protected createExplosionAt(position: cc.Vec3): void {
        if (!this.explosionEffect) return;

            const parentNode = cc.Canvas.instance?.node || cc.director.getScene();
            if (!parentNode) return;

            const explosion = cc.instantiate(this.explosionEffect);
            this.runExplosion(explosion, parentNode, position)

    }


    private runExplosion(explosion: cc.Node, parentNode: cc.Node ,position: cc.Vec3) {

            explosion.setPosition(position);
            parentNode.addChild(explosion);

            // Начальные параметры для анимации
            explosion.setScale(0.1); // Начинаем с маленького размера
            explosion.opacity = 0;   // Полностью прозрачный

            // Создаем последовательность анимаций
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

}