class Play extends Phaser.Scene{
    constructor(){
        super("playScene");
    }

    create(){
        this.field = this.add.tileSprite(0,0,640,480).setOrigin(0,0);
    }
}