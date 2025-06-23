const { ccclass, property } = cc._decorator;

@ccclass
export default class PlatformLoader extends cc.Component {
    start() {
        
        const isMobile = this.isMobile();

        if (isMobile) {
            console.log('isMobile');
            cc.director.loadScene("MobileScene");
        } else {
            console.log('isDesctop');
            cc.director.loadScene("DesktopScene");
        }
    }


    isMobile(){
        
    if (cc.sys.isMobile) return true; 

    if (document.getElementById('GameDiv').offsetWidth < 500) {
        return true;
    }
    return false;
};

}