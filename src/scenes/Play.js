let gameOptions = {
    platformStartSpeed: 350,
    spawnRange: [120, 180],
    hawkRange: [100,300],
    platformSizeRange: [150, 350],
    foxPercent: 25,
    gameTimer: 16000,
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
        this.load.image('back','./assets/Back.png');
        this.load.image('front','./assets/Front.png');
        this.load.image('mid','./assets/Middle.png');
        this.load.image('ground','./assets/ground.png');
        this.load.image('plat','./assets/platform.png');
        this.load.image('jump','./assets/owl flutter.png');
        this.load.image('score','./assets/score.png');
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
        this.load.spritesheet('fox','./assets/foxani.png', {
            frameWidth: 48,
            frameHeight: 72,
            startFrame:0,
            endFrame: 5
        });

        // load audio
        this.load.audio('jump','./assets/jump.wav');
        this.load.audio('hawkSound','./assets/jump1.wav');
        this.load.audio('hit','./assets/hit.wav');
        this.load.audio('bgm','./assets/OwlGame.wav');
    }


    create(){
        // setting background and scoreboard
        this.back = this.add.tileSprite(0,0,800,600,'back').setOrigin(0,0).setDepth(0).setScale(3.2);
        this.middle = this.add.tileSprite(0,0,800,600,'mid').setOrigin(0,0).setDepth(1).setScale(3.5);
        this.front = this.add.tileSprite(0,0,800,600,'front').setOrigin(0,0).setDepth(2).setScale(3.6);
        this.scoreBoard = this.add.image(borderUISize + borderPadding - 20, borderUISize + borderPadding*2 -5,'score').setOrigin(0).setDepth(3).setScale(2.7);

        // setting score
        this.point = 0;

        // setting jump variables
        this.jump = false;
        this.jumpCount = 0;

        // setting hawk spawn conditions
        this.hawkCount=0;
        this.maxHawk = 1;

        // set up background music
        this.bgm = this.sound.add('bgm');
        this.bgm.setVolume(0.3);
        this.bgm.loop = true;
        this.bgm.play();

        // game over condition
        this.gameOver = false;

        //setting left and right key.
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        
        // setting jump key to space bar
        keySpace = this.input.keyboard.addKey(32);

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

        // init owl
        owl = this.physics.add.sprite(game.config.width/15, game.config.height - borderUISize - borderPadding*10,'run').setDepth(4);
        owl.setCollideWorldBounds(true);

        // setting platform cycle
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

        // setting hawk cycle
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

        // setting fox cycle
        this.foxGroup = this.add.group({
 
            removeCallback: function(fox){
                fox.scene.foxPool.add(fox)
            }
        });
 
        this.foxPool = this.add.group({
 
            removeCallback: function(fox){
                fox.scene.foxGroup.add(fox)
            }
        });

        this.addedPlatforms = 0;

        this.addPlatform(game.config.width, game.config.width / 2);

    
        // adding collide with owl and platform
        this.platformCollider = this.physics.add.collider(owl,this.platformGroup);

        // adding overlap for hawk and player
        this.physics.add.overlap(owl,this.hawkGroup,function(owl){
            owl.anims.play('fly'); // play the animation

            // remove collision between player and platforms
            this.physics.world.removeCollider(this.platformCollider);
            
            // ensure sound hit only play once
            if(!this.gameOver){
                this.sound.play('hit');
            }
            
            // game over
            this.gameOver = true;

        },null,this)

        // adding overlap for fox and player
        this.physics.add.overlap(owl,this.foxGroup,function(owl){
            owl.anims.play('fly'); // play the animation

            // remove collision between player and platforms
            this.physics.world.removeCollider(this.platformCollider);
            
            // ensure sound hit only play once
            if(!this.gameOver){
                this.sound.play('hit');
            }
            
            // game over
            this.gameOver = true;

        },null,this)


        // set up timer
        this.currentTime = 0;
        this.clock = this.time.addEvent({
            delay:1000,
            callback: increaseTime,
            callbackScope: this,
            loop: true
        });

        // increase the time and point
        function increaseTime(){
            this.currentTime += 1000;
            if(this.currentTime >= gameOptions.gameTimer && !this.gameOver ){
                this.point += 20;
            }
            else{
                this.point += 10;
            }
        }
    }

    update(){
        let scoreConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#8c744c',
            color: '#843605',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 100
        }
        scoreConfig.fixedWidth = 0;

        if(this.currentTime >= gameOptions.gameTimer && !this.gameOver){
            this.maxHawk = 2;
        }
        else{
        //   do nothing
        }

        owl.setVelocityX(0);

        // if the player fall of the canvas or beyond the x axis, game over
        if(owl.y > game.config.height * 0.8 + 70){
            this.gameOver = true;
        }

        if(this.gameOver){
            this.point = 0; // reset points
            owl.setCollideWorldBounds(false);
            this.add.text(game.config.width/3, game.config.height/2.5, 'Press Space Bar to restart').setDepth(4);
        }

        // clear fox pool, stop looping bgm, and return to tutorial scene
        if(this.gameOver && Phaser.Input.Keyboard.JustDown(keySpace)) {
            this.foxPool.clear();
            this.bgm.stop();
            this.scene.start("teachScene");
        }

        // next platform spawn set up
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

        // next hawk spawn set up
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
        if(minHawkDistance > this.nextHawkDistance && this.hawkCount < this.maxHawk){
            var randomRange = Phaser.Math.Between(gameOptions.hawkRange[0], gameOptions.hawkRange[1]);
            this.addHawk(game.config.width,randomRange);
        }

        // recycle fox
        this.foxGroup.getChildren().forEach(function(fox){
            if(fox.x < - fox.displayWidth / 2){
                this.foxGroup.killAndHide(fox);
                this.foxGroup.remove(fox);
            }
        }, this);

        // set movespeed for player
        const movespeed = 300;
        
        if(keyLEFT.isDown && !this.gameOver){
            owl.setVelocityX(-movespeed);
        }else if(keyRIGHT.isDown && !this.gameOver){
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
                    this.sound.play('jump');
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

        // score text box
        this.scoreText = this.add.text(borderUISize + borderPadding + 25, borderUISize + borderPadding*2, this.point,scoreConfig).setOrigin(0).setDepth(4);
        
        this.back.tilePositionX += 0.5;
        this.middle.tilePositionX += 1;
        this.front.tilePositionX += 1.5;
        
    }

    // add platform
    // cite: https://www.emanueleferonato.com/2019/01/23/html5-endless-runner-built-with-phaser-and-arcade-physics-step-5-adding-deadly-fire-being-kind-with-players-by-setting-its-body-smaller-than-the-image/
    addPlatform(platformWidth, posX){
        this.addedPlatforms ++;
        let platform;
        if(this.platformPool.getLength()){
            platform = this.platformPool.getFirst();
            platform.x = posX;
            platform.active = true;
            platform.visible = true;
            this.platformPool.remove(platform);
        }
        else{
            platform = this.physics.add.sprite(posX, game.config.height * 0.8, "plat").setDepth(4);
            platform.setImmovable(true);
            platform.setVelocityX(gameOptions.platformStartSpeed * -1);
            this.platformGroup.add(platform);
        }

        // remove platform fiction, and disable gravity
        platform.setFrictionX(0);
        platform.body.allowGravity = false;

        // platform display width
        platform.displayWidth = platformWidth;

        // get next platform spawn distance
        this.nextPlatformDistance = Phaser.Math.Between(gameOptions.spawnRange[0], gameOptions.spawnRange[1]);

        // if there is a platform, calculate the chance for spawning a fox
        if(this.addedPlatforms > 1){
            //fox added
            if(Phaser.Math.Between(1, 100) <= gameOptions.foxPercent){
                if(this.foxPool.getLength()){
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
                    let fox = this.physics.add.sprite(posX - platformWidth / 2 + Phaser.Math.Between(1, platformWidth), game.config.height - borderUISize - borderPadding*10, "fox");
                    fox.setImmovable(true);
                    fox.setVelocityX(platform.body.velocity.x);
                    fox.setSize(44, 72, true)
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

    // add enemy hawk
    addHawk(posX,posY){
        let hawk;
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
        this.hawkCount ++; // hawk spawn condition

        // animation and audio for hawk
        hawk.anims.play("hawkF").setDepth(4);
        if(!this.gameOver){
            this.sound.play('hawkSound');
        }

        // remove hawk friction and gravity
        hawk.setFrictionX(0);
        hawk.body.allowGravity = false;

        // set up next hawk spawn distance
        this.nextHawkDistance = Phaser.Math.Between(gameOptions.hawkRange[0], gameOptions.hawkRange[1]);
    }
}