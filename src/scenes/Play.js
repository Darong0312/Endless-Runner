class Play extends Phaser.Scene{
    constructor(){
        super("playScene");
    }

    // adding img
    preload(){
        this.load.image('BabyOwl','./assets/BabyOwl.png');
        this.load.image('OwlFlutter','./assets/OwlFlutter.png');
        this.load.image('field','./assets/field.png');
        this.load.image('ground','./assets/ground.png');
    }

    create(){
        // setting background
        this.field = this.add.tileSprite(0,0,800,600,'field').setOrigin(0,0);

        
        // init ground
        platforms = this.physics.add.staticGroup();
        platforms.create(400,700, 'ground').setScale(2).refreshBody();

        // init owl
        owl = this.physics.add.sprite(game.config.width/15, game.config.height - borderUISize - borderPadding*10,'BabyOwl');

        // setting jump key to space bar
        keySpace = this.input.keyboard.addKey(32);

        this.gameOver = false;

        // adding collide with owl and platform
        this.physics.add.collider(owl,platforms);
    }

    update(){
        if(this.gameOver && Phaser.Input.Keyboard.JustDown(keySpace)) {
            this.scene.restart();
        }

        if(this.gameOver && Phaser.Input.Keyboard.JustDown(keySpace)) {
            this.scene.start("menuScene");
        }

        // give the owl an upward velocity when space bar is hit
        if(Phaser.Input.Keyboard.JustDown(keySpace)){
            owl.setVelocityY(-330);
        }

        // background move speed
        this.field.tilePositionX -= 3;
    }
}