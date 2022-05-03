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
We countered a bug that it keeps saying that something is not defined.
We spent some time on it and found out that the position of codes matters in Java Script. When you define anything, you should always place it at the beginning.
Not like c or c++, you can define a global variable and use it anywhere.
// art blocks
Art Style: We made the game in a distinctive forest and cutesy style, while making it in pixel art.
It was our first time making art of animals, and also we were not very experienced making pixel art, so there were some learning curves.
But we think it turned out well! We're really happy with the results, and are happy that we learned so much.
We also didn't have much experience with animation, let alone pixel art aninmation. But again, we're happy wuth how it turned out!!
Music and SFX: We also made our own sound effects and music, Annika did the SFX and Sadie did the music. It was also our first time making sfx and music.
We had to find a program to make our audio with, but it was worth it because it did what we wanted it to do.


*/
