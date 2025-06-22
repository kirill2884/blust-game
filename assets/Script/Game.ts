import { BusterManager } from "./busters/Common/BusterManager";
import FinishGame from "./FinishGame";
import GridManager from "./GridManager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Game extends cc.Component {

    @property({type: cc.Integer})
    countMoves: number = 3;

    @property({type: cc.Integer})
    targetPonts: number = 500;

    @property(cc.Node)
    finishGameNode: cc.Node = null;

    @property({ type: cc.Node })
    busterBomb:cc.Node = null

    @property({ type: cc.Node })
    busterTeleport:cc.Node = null

    @property(cc.RichText)
    private pontsTextBlock: cc.RichText;
    
    @property(cc.RichText)
    private movesTextBlock: cc.RichText;
    
    @property(cc.RichText)
    private targetTextBlock: cc.RichText;

    @property(cc.Node)
    private busters: cc.Node = null;

    private finishGame: FinishGame = null;

    private currentCountMoves: number;

    private currentPoints: number; 

    private gridManager:GridManager;

    private busterManager:BusterManager;

    private bombBusterActive = false;

    private teleportBusterActive:boolean = false

    private bombPower:number = 1;
    
    onLoad() {
        this.gridManager = this.getComponent('GridManager')       
        this.finishGameNode.on('restart-game',this.initGame,this)
        this.finishGame = this.finishGameNode.getComponent('FinishGame');
        this.busterManager = this.busters.getComponent('BusterManager')        
        this.initGame();   
    }

    private initGame(): void {
        if (!this.gridManager.validateSettings()) return;
        this.currentCountMoves = this.countMoves;
        this.busterManager.init()
        this.currentPoints = 0;
        this.movesTextBlock.string = this.currentCountMoves.toString() 
        this.targetTextBlock.string = `/ ${this.targetPonts}`   
        this.pontsTextBlock.string = `${this.currentPoints}` 

        this.gridManager.generateGrid();
        
    }

    public checkStatusGame(aggregatePoint: number) {
            this.currentPoints += aggregatePoint;
            this.pontsTextBlock.string = this.currentPoints.toString() 
            this.makeMove() 
    }

    public makeMove(){
        this.currentCountMoves--;
        this.movesTextBlock.string = this.currentCountMoves.toString()

        if(this.currentPoints >= this.targetPonts){
            this.stopGame(true);
        } else if (this.currentCountMoves === 0){
            this.stopGame(false);
        }          
    }

    private stopGame(win:boolean){
        win ? this.finishGame.showPopup("You win", win) : this.finishGame.showPopup("Game over", win)        
    }

    public getBombBusterActive(): boolean {
        return this.bombBusterActive;
        }

    public setBombBusterActive(state: boolean): void {
        this.bombBusterActive = state;
    }

    public getTeleportBusterActive(): boolean {
        return this.teleportBusterActive;
        }

    public setTeleportBusterActive(state: boolean): void {
        this.teleportBusterActive = state;
    }

    public getBombPower(): number {
        return this.bombPower;
        }

    public setBombPower(power: number): void {
        this.bombPower = power;
    }

}