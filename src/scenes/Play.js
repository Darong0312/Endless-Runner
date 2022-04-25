let gameOptions = {
    platformStartSpeed: 350,
    spawnRange: [100, 350],
    platformSizeRange: [50, 250],
}

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

        this.platformGroup = this.add.group({
 
            // once a platform is removed, it's added to the pool
            removeCallback: function(platform){
                platform.scene.platformPool.add(platform)
            }
        });
 
        // pool
        this.platformPool = this.add.group({
 
            // once a platform is removed from the pool, it's added to the active platforms group
            removeCallback: function(platform){
                platform.scene.platformGroup.add(platform)
            }
        });

        this.addPlatform(game.config.width, game.config.width / 2);

        //timer = game.time.create(false);

        //timer.loop(2000,"jump+1", this);

        // init owl
        owl = this.physics.add.sprite(game.config.width/15, game.config.height - borderUISize - borderPadding*10,'BabyOwl');

        // setting jump key to space bar
        keySpace = this.input.keyboard.addKey(32);

        // adding collide with owl and platform
        this.physics.add.collider(owl,this.platformGroup);
        
        //setting left and right key.
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);

        this.jump = false;

        this.gameOver = false;
        this.jumpCount = 0;

        

    }

    addPlatform(platformWidth, posX){
        let platform;
        if(this.platformPool.getLength()){
            console.log("inside if");
            platform = this.platformPool.getFirst();
            platform.x = posX;
            platform.active = true;
            platform.visible = true;
            this.platformPool.remove(platform);
        }
        else{
            console.log("inside else");
            platform = this.physics.add.sprite(posX, game.config.height * 0.8, "plat");
            platform.setImmovable(true);
            platform.setVelocityX(gameOptions.platformStartSpeed * -1);
            this.platformGroup.add(platform);
        }
        platform.displayWidth = platformWidth;
        this.nextPlatformDistance = Phaser.Math.Between(gameOptions.spawnRange[0], gameOptions.spawnRange[1]);
    }

    update(){
        owl.setVelocityX(0);

        if(this.gameOver && Phaser.Input.Keyboard.JustDown(keySpace)) {
            this.scene.restart();
        }

        if(this.gameOver && Phaser.Input.Keyboard.JustDown(keySpace)) {
            this.scene.start("menuScene");
        }

        let minDistance = game.config.width;
        this.platformGroup.getChildren().forEach(function(platform){
            let platformDistance = game.config.width - platform.x - platform.displayWidth / 2;
            minDistance = Math.min(minDistance, platformDistance);
            if(platform.x < - platform.displayWidth / 2){
                this.platformGroup.killAndHide(platform);
                this.platformGroup.remove(platform);
            }
        }, this);
 
        // adding new platforms
        if(minDistance > this.nextPlatformDistance){
            var nextPlatformWidth = Phaser.Math.Between(gameOptions.platformSizeRange[0], gameOptions.platformSizeRange[1]);
            this.addPlatform(nextPlatformWidth, game.config.width + nextPlatformWidth / 2);
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