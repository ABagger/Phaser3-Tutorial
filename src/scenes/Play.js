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
    this.load.image('launchpad', './assets/launchpad.png');
    this.load.image('scorebulb', './assets/scorebulb.png');
    this.load.image('target', './assets/target.png');
    this.load.image('clock', './assets/clock.png');
    this.load.spritesheet('explosion', './assets/explosion.png', {frameWidth : 64, frameHeight : 32, startFrame : 0, endFrame : 9});
    }


    create()
    {
        // implementing starfield scroll
        this.starfield = this.add.tileSprite(0, 0, 640, 480, 'starfield').setOrigin(0, 0);
    
        // adding spaceships x3
        this.spaceship01 = new Spaceship(this, game.config.width + borderUIsize * 6, borderUIsize * 4, 'spaceship', 0, 30).setOrigin(0, 0);
        this.spaceship02 = new Spaceship(this, game.config.width + borderUIsize * 3, borderUIsize * 5 + borderPadding * 2, 'spaceship', 0, 20).setOrigin(0, 0);
        this.spaceship03 = new Spaceship(this, game.config.width, borderUIsize * 6 + borderPadding * 4, 'spaceship', 0, 10).setOrigin(0, 0);
    
        // UI background/background
        this.add.rectangle(0, 0, borderUIsize + borderPadding * 2.2, borderUIsize * 3.1, 0x820404).setOrigin(0,0);

        // score background sprites
        this.add.sprite(borderUIsize * 1.5, borderUIsize + borderPadding * 2.2, 'scorebulb').setOrigin(0, 0);
        this.add.sprite(borderUIsize * 1.5, borderPadding * .6, 'scorebulb').setOrigin(0, 0);

        // UI background
        this.add.rectangle(0, 0, borderUIsize + borderPadding * 1.9, borderUIsize * 3, 0xf64343).setOrigin(0, 0);
        this.add.rectangle(0, 0, borderUIsize + borderPadding * 1.5, borderUIsize * 3, 0xe13333).setOrigin(0, 0);
        
        this.add.sprite(borderUIsize / 2.5, borderUIsize * 2.1 - borderPadding, 'target').setOrigin(0, 0);
        this.add.sprite(borderUIsize / 2.5, borderPadding, 'clock').setOrigin(0, 0);

        // most canvas borders were removed because they were hella ugly
        this.add.rectangle(0, game.config.height - 1.5 * borderUIsize, game.config.width, borderUIsize * 1.5, 0x697678).setOrigin(0, 0);
        this.add.rectangle(0, game.config.height, game.config.width, borderUIsize / 2, 0x535353).setOrigin(0,1);

        /*
        this.add.rectangle(0, game.config.height - borderUIsize, game.config.width, borderUIsize, 0x1fd24c).setOrigin(0,0);
        this.add.rectangle(0, game.config.height, game.config.width, borderUIsize / 2, 0x8bffa8).setOrigin(0,1);
        this.add.rectangle(0, 0, borderUIsize, game.config.height, 0x8bffa8).setOrigin(0, 0);
        this.add.rectangle(game.config.width - borderUIsize, 0, borderUIsize, game.config.height, 0x8bffa8).setOrigin(0, 0);
        */

        // adding launchpad to go under the rocket
        this.p1Launchpad = new Launchpad(this, game.config.width / 2, game.config.height - borderUIsize - borderPadding * 0.9, 'launchpad').setOrigin(0.5, 0);
        // adding rocket (p1)
        this.p1Rocket = new Rocket(this, game.config.width/2, game.config.height - borderUIsize - borderPadding, 'rocket').setOrigin(.5, 0);


        keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
        keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);

        // adding animations
        this.anims.create({
            key: 'explode',
            frames: this.anims.generateFrameNumbers('explosion', {start : 0, end : 9, first : 0}),
            framerate: 24
        })

        this.p1Score = 0;

        let scoreConfig = {
            fontFamily : 'Courier', // 'bold',
            fontSize : '28px',
            //backgroundColor : '#ffffff',
            //image : 'scorebulb',
            color : '#dcffce',
            align : 'right',
            padding: {
                top : 7,
                bottom : 0,
                right : 5
            },
            fixedWidth : 100
        }
        this.scoreLeft = this.add.text(borderUIsize + borderPadding, borderUIsize + borderPadding * 2.2, this.p1Score, scoreConfig)
    }

    update()
    {
        this.starfield.tilePositionX -= 1;
        this.p1Rocket.update();
        this.spaceship01.update();
        this.spaceship02.update();
        this.spaceship03.update();
        this.p1Launchpad.update(this.p1Rocket);

        if(this.checkCollision(this.p1Rocket, this.spaceship01))
        {
            this.p1Rocket.reset();
            this.shipExplode(this.spaceship01)
        }        
        if(this.checkCollision(this.p1Rocket, this.spaceship02))
        {
            this.p1Rocket.reset();
            this.shipExplode(this.spaceship02)
        }        
        if(this.checkCollision(this.p1Rocket, this.spaceship03))
        {
            this.p1Rocket.reset();
            this.shipExplode(this.spaceship03)
        }
    }

    checkCollision(rocket, ship)
    {
        // "simple aabb" checking apparently
        if (rocket.x < ship.x + ship.width &&
            rocket.x + rocket.width > ship.x &&
            rocket.y < ship.y + ship.height &&
            rocket.y + rocket.height > ship.y)
        {
            return true;
        }
        else
        {
            return false
        }
    }

    shipExplode(ship)
    {
        // hide real ship
        ship.alpha = 0;
        // create explosion
        let boom = this.add.sprite(ship.x, ship.y, 'explosion').setOrigin(0,0);
        boom.anims.play('explode');
        boom.on('animationcomplete', () =>{
            ship.reset();
            ship.alpha = 1;
            boom.destroy();
        })
        // increment score and increase counter
        this.p1Score += ship.points;
        this.scoreLeft.text = this.p1Score;


    }
}