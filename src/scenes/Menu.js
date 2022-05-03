class Menu extends Phaser.Scene {
    constructor() {
        super("menuScene");
    }

    preload(){
        this.load.image('OwlMenu','./assets/OwlMenu.png');
        this.load.audio('select','./assets/select.wav');
    }
    create() {
        // show menu image
        this.add.image(game.config.width/2, game.config.height/2,'OwlMenu');
        // define keys
        keySpace = this.input.keyboard.addKey(32);
    }

    update(){
        if(Phaser.Input.Keyboard.JustDown(keySpace)){
            this.sound.play('select');
            this.scene.start("teachScene");
        }
    }
}