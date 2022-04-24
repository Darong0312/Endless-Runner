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
        this.load.image('plat','./assets/platform.png');
    }

    create(){
        // setting background
        this.field = this.add.tileSprite(0,0,800,600,'field').setOrigin(0,0);

        this.jump = false;

        // init ground
        platforms = this.physics.add.staticGroup();
        platforms.create(300,600, 'plat').setScale(2).refreshBody();

        // init owl
        owl = this.physics.add.sprite(game.config.width/15, game.config.height - borderUISize - borderPadding*10,'BabyOwl');
        //this.owl = new owl(this,game.config.width/15, game.config.height - borderUISize - borderPadding*10,'BabyOwl').setOrigin(0.5, 0);

        // setting jump key to space bar
        keySpace = this.input.keyboard.addKey(32);

        // adding collide with owl and platform
        this.physics.add.collider(owl,platforms);

        //this.physics.add.collider(owl, this.platformGroup);
        
        //setting left and right key.
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);

        this.jump = false;

        this.gameOver = false;
        this.jumpCount = 0;

        

    }


    update(){
        owl.setVelocityX(0);

        if(this.gameOver && Phaser.Input.Keyboard.JustDown(keySpace)) {
            this.scene.restart();
        }

        if(this.gameOver && Phaser.Input.Keyboard.JustDown(keySpace)) {
            this.scene.start("menuScene");
        }

        //let the owl move
        const movespeed = 200;
        
        if(keyLEFT.isDown){
            owl.setVelocityX(-movespeed);
        }else if(keyRIGHT.isDown){
            owl.setVelocityX(movespeed);
        }

        // give the owl an upward velocity when space bar is hit
        // double jump
        if(keySpace.isDown){
            if(!this.jump){
                if(this.jumpCount > 0){
                    owl.setVelocityY(-200);
                    this.jump = true;
                    --this.jumpCount;
                }
            }
        }

        if(keySpace.isUp){
            this.jump = false;
        }

        if(owl.body.touching.down){
            this.jumpCount = 1;

        }

        // background move speed
        this.field.tilePositionX -= 3;

    }
}