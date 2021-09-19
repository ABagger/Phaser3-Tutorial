let config = {
    type : Phaser.CANVAS,
    width : 640,
    height : 480,
    scene : [Menu, Play]
}

let game = new Phaser.Game(config);

// reserve keyboard vars
let keyF, keyR, keyLEFT, keyRIGHT;

// setting UI sizes
let borderUIsize = game.config.height / 15;
let borderPadding = borderUIsize / 3;