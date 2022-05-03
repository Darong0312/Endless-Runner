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

// code blocks
We implemented the random generator which generate the platforms, the foxes, and the hawks in a random place within a random range.
This was interesting because we were encounter platforms falling in the first place, which involved with the physics.
We are proud of able to get thw random generators to work together. 
We learned from the platform random generator, and implement our own hawk generator.

// art blocks

*/