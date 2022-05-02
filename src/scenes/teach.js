class teach extends Phaser.Scene {
    constructor() {
        super("teachScene");
    }

    preload(){
        this.load.image('Owlteach','./assets/owl controls.png');
        this.load.audio('select','./assets/select.wav');
    }
    create() {
        // show menu image
        this.add.image(game.config.width/2, game.config.height/2,'Owlteach');
        // define keys
        keySpace = this.input.keyboard.addKey(32);
    }

    update(){
        if(Phaser.Input.Keyboard.JustDown(keySpace)){
            this.sound.play('select');
            this.scene.start("playScene");
            console.log("save");
        }
    }
}