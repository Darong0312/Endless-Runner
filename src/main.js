let config = {
    type: Phaser.CANVAS,
    width: 800,
    height: 600,
    scene: [ Menu ]
}

let game = new Phaser.Game(config);

// set UI sizes
let borderUISize = game.config.height / 15;
let borderPadding = borderUISize / 3;

// reserve keyboard variables
let keyF, keyR, keyLEFT, keyRIGHT;