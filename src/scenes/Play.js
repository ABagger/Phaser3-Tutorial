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

        // green UI background
        this.add.rectangle(0, borderUIsize + borderPadding, game.config.width, borderUIsize * 2, 0x00FF00).setOrigin(0,0);
        
        // white canvas borders
        this.add.rectangle(0, 0, game.config.width, borderUIsize, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(0, game.config.height - borderUIsize, game.config.width, borderUIsize, 0xFFFFFF).setOrigin(0,0);
        this.add.rectangle(0, 0, borderUIsize, game.config.height, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(game.config.width - borderUIsize, 0, borderUIsize, game.config.height, 0xFFFFFF).setOrigin(0, 0);
    
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
            framerate:30
        })

        this.p1Score = 0;

        let scoreConfig = {
            fontFamily : 'Courier',
            fontSize : '28px',
            backgroundColor : '#F3B141',
            color : '#843605',
            align : 'right',
            padding: {
                top : 5,
                bottom : 5
            },
            fixedWidth : 100
        }
        this.scoreLeft = this.add.text(borderUIsize + borderPadding, borderUIsize + borderPadding*2, this.p1Score, scoreConfig)
    }

    update()
    {
        this.starfield.tilePositionX -= 2;
        this.p1Rocket.update();
        this.spaceship01.update();
        this.spaceship02.update();
        this.spaceship03.update();

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