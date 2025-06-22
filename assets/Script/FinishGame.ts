const { ccclass, property } = cc._decorator;

@ccclass
export default class FinishGame extends cc.Component {

    @property(cc.Node)
    popupNode: cc.Node = null;

    @property(cc.Node)
    restartButton: cc.Node = null;

    @property(cc.RichText)
    messageLabel: cc.Label = null;

    @property(cc.Node)
    backgroundOverlay: cc.Node = null;

    onLoad() {
        // Устанавливаем правильный порядок отрисовки
        this.backgroundOverlay.zIndex = 0;
        this.popupNode.zIndex = 1;
        this.popupNode.active = false;
        this.backgroundOverlay.active = false;
        
        this.restartButton.on(cc.Node.EventType.TOUCH_END, this.onRestart, this);
    }

    showPopup(message: string = "Game Over", isWin: boolean = false): void {
        // Убедимся, что popup будет поверх overlay
        this.popupNode.zIndex = this.backgroundOverlay.zIndex + 1;
        
        this.messageLabel.string = message;
        this.popupNode.active = true;
        this.backgroundOverlay.active = true;
        
        this.messageLabel.node.color = isWin ? cc.Color.GREEN : cc.Color.RED;
        
        // Настройки прозрачности
        this.popupNode.opacity = 255;
        this.backgroundOverlay.opacity = 160; // Более прозрачный
        
        // Анимации
        this.popupNode.scale = 0;
        cc.tween(this.backgroundOverlay)
            .to(0.2, { opacity: 160 })
            .start();
            
        cc.tween(this.popupNode)
            .to(0.3, { scale: 1 }, { easing: 'backOut' })
            .start();
    }

    hidePopup(): void {
        cc.tween(this.popupNode)
            .to(0.2, { scale: 0 }, { easing: 'backIn' })
            .call(() => {
                this.popupNode.active = false;
                this.backgroundOverlay.active = false;
            })
            .start();
            
        cc.tween(this.backgroundOverlay)
            .to(0.2, { opacity: 0 })
            .start();
    }

    private onRestart(): void {
        this.hidePopup();
        this.node.emit('restart-game');
    }
}