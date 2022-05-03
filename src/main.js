let config = {
    type: Phaser.CANVAS,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y:700},
            debug: true
        }
    },
    scene: [ Menu, Play , teach]
}

let game = new Phaser.Game(config);

// set UI sizes
let borderUISize = game.config.height / 15;
let borderPadding = borderUISize / 3;

// reserve keyboard variables
var keySpace,keyUP,keyLEFT,keyRIGHT, timer;

var owl;

/*
Sarah Hower, Yuanzheng Ji, Annika Kennedy, Darong Li

Game Name: Baby Owl

Data completed: 5/2/2022

// comment blocks
*/