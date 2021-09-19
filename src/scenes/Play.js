class Play extends Phaser.Scene 
{
    constructor() 
    {
        super('playScene')
    }

    preload()
    {
    // preloading assets
    this.load.image('rocket', './assets/rocket.png');
    this.load.image('spaceship', './assets/spaceship.png');
    this.load.image('starfield', './assets/starfield.png');
    }


    create()
    {
        // implementing starfield scroll
        this.starfield = this.add.tileSprite(0, 0, 640, 480, 'starfield').setOrigin(0, 0);
        
        // green UI background
        this.add.rectangle(0, borderUIsize + borderPadding, game.config.width, borderUIsize * 2, 0x00FF00).setOrigin(0,0);
        
        // white canvas borders
        this.add.rectangle(0, 0, game.config.width, borderUIsize, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(0, game.config.height - borderUIsize, game.config.width, borderUIsize, 0xFFFFFF).setOrigin(0,0);
        this.add.rectangle(0, 0, borderUIsize, game.config.height, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(game.config.width - borderUIsize, 0, borderUIsize, game.config.height, 0xFFFFFF).setOrigin(0, 0);
    
        // adding rocket (p1)
        this.p1Rocket = new Rocket(this, game.config.width/2, game.config.height - borderUIsize - borderPadding, 'rocket').setOrigin(.5, 0);
    
        // adding spaceships x3
        this.spaceship01 = new Spaceship(this, game.config.width + borderUIsize * 6, borderUIsize * 4, 'spaceship', 0, 30).setOrigin(0, 0);
        this.spaceship02 = new Spaceship(this, game.config.width + borderUIsize * 3, borderUIsize * 5 + borderPadding * 2, 'spaceship', 0, 20).setOrigin(0, 0);
        this.spaceship03 = new Spaceship(this, game.config.width, borderUIsize * 6 + borderPadding * 4, 'spaceship', 0, 10).setOrigin(0, 0);

        keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
        keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
    }

    update()
    {
        this.starfield.tilePositionX -= 1;
        this.p1Rocket.update();
        this.spaceship01.update();
        this.spaceship02.update();
        this.spaceship03.update();
    }
}