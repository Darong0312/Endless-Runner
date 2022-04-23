class Menu extends Phaser.Scene {
    constructor() {
        super("menuScene");
    }

    preload(){
        this.load.image('OwlMenu','./assets/OwlMenu.png');
    }
    create() {
        // show menu image
        this.add.image(game.config.width/2, game.config.height/2,'OwlMenu');
        // define keys
        keySpace = this.input.keyboard.addKey(32);
    }

    update(){
        if(Phaser.Input.Keyboard.JustDown(keySpace)){
            this.scene.start("playScene");
        }
    }
}