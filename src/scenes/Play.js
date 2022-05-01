let gameOptions = {
    platformStartSpeed: 350,
    spawnRange: [120, 180],
    hawkRange: [200,400],
    platformSizeRange: [150, 250],
    hawkPercent: 5,
    foxPercent: 25,
}
// scene.physics

class Play extends Phaser.Scene{
    constructor(){
        super("playScene");
    }

    // adding img
    preload(){
        this.load.image('BabyOwl','./assets/BabyOwl.png');
        this.load.image('field','./assets/field.png');
        this.load.image('ground','./assets/ground.png');
        this.load.image('plat','./assets/platform.png');
        this.load.image('jump','./assets/owl flutter.png');
        this.load.spritesheet('fox','./assets/foxani.png', {
            frameWidth: 48,
            frameHeight: 72,
            startFrame:0,
            endFrame: 5
        });
        this.load.spritesheet('owlJump','./assets/owl jump.png', {
            frameWidth: 46,
            frameHeight: 57,
            startFrame: 0,
            endFrame: 6
        });
        this.load.spritesheet('hawk','./assets/Hawk.png',{
            frameWidth: 96,
            frameHeight: 96,
            startFrame:0,
            endFrame: 5
        });
        this.load.spritesheet('run','./assets/Run.png',{
            frameWidth: 46,
            frameHeight: 57,
            startFrame: 0, 
            endFrame: 7
        });
    }


    create(){
        // setting background
        this.field = this.add.tileSprite(0,0,800,600,'field').setOrigin(0,0);
        this.point = 0;
        this.scoreTimes = 10;
        this.jump = false;
        this.hawkCount=0;

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

        this.hawkGroup = this.add.group({
 
            // once a platform is removed, it's added to the pool
            removeCallback: function(hawk){
                hawk.scene.hawkPool.add(hawk)
            }
        });
 
        // pool
        this.hawkPool = this.add.group({
 
            // once a platform is removed from the pool, it's added to the active platforms group
            removeCallback: function(hawk){
                hawk.scene.hawkGroup.add(hawk)
            }
        });
        this.addHawk(game.config.width,gameOptions.hawkRange[1]);

        this.foxGroup = this.add.group({
 
            // once a firecamp is removed, it's added to the pool
            removeCallback: function(fox){
                fox.scene.foxPool.add(fox)
            }
        });
 
        // fire pool
        this.foxPool = this.add.group({
 
            // once a fire is removed from the pool, it's added to the active fire group
            removeCallback: function(fox){
                fox.scene.foxGroup.add(fox)
            }
        });

        this.addedPlatforms = 0;
/*
        this.addHawk(200);
        this.addHawk(400);
*/
        //timer = game.time.create(false);

        //timer.loop(2000,"jump+1", this);

        // init owl
        owl = this.physics.add.sprite(game.config.width/15, game.config.height - borderUISize - borderPadding*10,'run');

        // setting jump key to space bar
        keySpace = this.input.keyboard.addKey(32);
    
        // adding collide with owl and platform
        this.platformCollider = this.physics.add.collider(owl,this.platformGroup,function(){
            // play "run" animation if the player is on a platform
        }, null, this);
//        this.physics.add.collider(owl,hawk);

        //setting left and right key.
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);

        this.jump = false;
        timer = 0;
        this.gameOver = false;
        this.jumpCount = 0;

        this.physics.add.overlap(owl,this.hawkGroup,function(owl,hawk){
            owl.anims.play('fly');
            this.physics.world.removeCollider(this.platformCollider);
            owl.setVelocityX(0);
            owl.setVelocityY(200);
            this.gameOver = true;
        },null,this)

        this.physics.add.overlap(owl,this.foxGroup,function(owl,fox){
            owl.anims.play('fly');
            this.physics.world.removeCollider(this.platformCollider);
            owl.setVelocityX(0);
            owl.setVelocityY(200);
            this.gameOver = true;
        },null,this)
        
        // animation
        this.anims.create({
            key: 'fly',
            frames:[{key: 'jump'}],
        });

        this.anims.create({
            key: 'owlFly',
            frames: this.anims.generateFrameNumbers("owlJump", {
                start: 3,
                end: 6,
                first: 3
            }),
            repeat: -1
        });

        this.anims.create({
            key: 'walk',
            frames: this.anims.generateFrameNumbers("run", {
                start: 0,
                end: 7,
                first: 0
            }),
            repeat:-1
        });
        
        this.anims.create({
            key: 'hawkF',
            frames: this.anims.generateFrameNumbers("hawk" ,{
                start: 0,
                end: 5,
                first:0
            }),
            // debug fps
            frameRate: 10,
            repeat: -1
        })

        this.anims.create({
            key: 'foxl',
            frames: this.anims.generateFrameNumbers("fox" ,{
                start: 0,
                end: 5,
                first:0
            }),
            // debug fps
            frameRate: 10,
            repeat: -1
        })
    }

    update(){
        timer = this.time.now * 0.001;
        let scoreConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 100
        }
        scoreConfig.fixedWidth = 0;

        owl.setVelocityX(0);
        if(owl.y > config.height ){
            this.gameOver = true;
        }

        if(this.gameOver){
            timer = 0;
            this.scoreTimes = 10;
            this.point = 0;
            this.add.text(game.config.width/3, game.config.height/2.5, 'Press Space Bar to restart');
        }

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
        },this);
 
        // adding new platforms
        if(minDistance > this.nextPlatformDistance){
            var nextPlatformWidth = Phaser.Math.Between(gameOptions.platformSizeRange[0], gameOptions.platformSizeRange[1]);
            this.addPlatform(nextPlatformWidth, game.config.width + nextPlatformWidth / 2);
        }

        let minHawkDistance = game.config.width;
        this.hawkGroup.getChildren().forEach(function(hawk){
            let hawkDistance = game.config.width - hawk.x - hawk.displayWidth / 2;
            minHawkDistance = Math.min(minHawkDistance, hawkDistance);
            if(hawk.x < - hawk.displayWidth / 2){
                this.hawkGroup.killAndHide(hawk);
                this.hawkGroup.remove(hawk);
                this.hawkCount --;
            }
        },this);
 
        // adding new hawk
        if(minHawkDistance > this.nextHawkDistance && this.hawkCount < 2){
            var randomRange = Phaser.Math.Between(gameOptions.hawkRange[0], gameOptions.hawkRange[1]);
            this.addHawk(game.config.width,randomRange);
        }

        this.foxGroup.getChildren().forEach(function(fox){
            if(fox.x < - fox.displayWidth / 2){
                this.foxGroup.killAndHide(fox);
                this.foxGroup.remove(fox);
            }
        }, this);

        //let the owl move
        const movespeed = 300;
        
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
                    owl.setVelocityY(-450);
                    this.jump = true;
                    --this.jumpCount;
                }
            }
            owl.anims.play("owlFly",true);
        }

        if(keySpace.isUp){
            this.jump = false;
        }

        if(owl.body.touching.down && !this.gameOver){
            this.jumpCount = 1;
            owl.anims.play("walk",true);
        }

        if(timer >= 20){
            this.scoreTimes = 20;
            this.point = timer*this.scoreTimes;
        }
        else{
            this.point = Math.round(timer) *this.scoreTimes;
        }
        this.timeText = this.add.text(borderUISize + borderPadding, borderUISize + borderPadding*2, Math.round(this.point),scoreConfig);
        // background move speed
        this.field.tilePositionX += 3;
    }

    addPlatform(platformWidth, posX){
        this.addedPlatforms ++;
        let platform;
        console.log("platform pool length");
        console.log(this.platformPool.getLength());
        if(this.platformPool.getLength()){
            platform = this.platformPool.getFirst();
            platform.x = posX;
            platform.active = true;
            platform.visible = true;
            this.platformPool.remove(platform);
        }
        else{
            platform = this.physics.add.sprite(posX, game.config.height * 0.8, "plat");
            platform.setImmovable(true);
            platform.setVelocityX(gameOptions.platformStartSpeed * -1);
            this.platformGroup.add(platform);
        }
        platform.setVelocityY(0);
        platform.setFrictionX(0);
        platform.body.allowGravity = false;
        platform.displayWidth = platformWidth;
        this.nextPlatformDistance = Phaser.Math.Between(gameOptions.spawnRange[0], gameOptions.spawnRange[1]);

        if(this.addedPlatforms > 1){
            //fox added
            if(Phaser.Math.Between(1, 100) <= gameOptions.foxPercent){
                if(this.foxPool.getLength()){
                    console.log("fox 1")
                    let fox = this.foxPool.getFirst();
                    fox.x = posX - platformWidth / 2 + Phaser.Math.Between(1, platformWidth);
                    fox.y = game.config.height - borderUISize - borderPadding*10;
                    fox.alpha = 1;
                    fox.active = true;
                    fox.visible = true;
                    this.foxPool.remove(fox);
                    fox.anims.play("foxl");
                    fox.setVelocityY(0);
                    fox.setFrictionX(0);
                    fox.body.allowGravity = false;
                }
                else{
                    console.log("fox 2")
                    let fox = this.physics.add.sprite(posX - platformWidth / 2 + Phaser.Math.Between(1, platformWidth), game.config.height - borderUISize - borderPadding*10, "fox");
                    fox.setImmovable(true);
                    fox.setVelocityX(platform.body.velocity.x);
                    fox.setSize(8, 2, true)
                    fox.setDepth(2);
                    this.foxGroup.add(fox);
                    fox.anims.play("foxl");
                    fox.setVelocityY(0);
                    fox.setFrictionX(0);
                    fox.body.allowGravity = false;
                }
            }
        }
    }

    // enemy
    addHawk(posX,posY){
        let hawk;
        console.log("hawk pool length");
        console.log(this.hawkPool.getLength());
        if(this.hawkPool.getLength()){
            hawk = this.hawkPool.getFirst();
            hawk.x = posX;
            hawk.y = posY;
            hawk.active = true;
            hawk.visible = true;
            this.hawkPool.remove(hawk);
        }
        else{
            hawk = this.physics.add.sprite(posX, posY, "hawk");
            hawk.setImmovable(true);
            hawk.setVelocityX(gameOptions.platformStartSpeed * -1);
            this.hawkGroup.add(hawk);
        }
        this.hawkCount ++;
        hawk.anims.play("hawkF");
        hawk.setVelocityY(0);
        hawk.setFrictionX(0);
        hawk.body.allowGravity = false;
        this.nextHawkDistance = Phaser.Math.Between(gameOptions.hawkRange[0], gameOptions.hawkRange[1]);
    }

}