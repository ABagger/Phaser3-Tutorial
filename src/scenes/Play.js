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
    this.load.image('sparks', './assets/launchspark.png');
    this.load.image('controls', './assets/instructions.png');
    
    // preloading sfx
    this.load.audio('sfx_explosion', './assets/explosion.wav');
    this.load.audio('sfx_liftoff', './assets/liftoff.wav');

    this.load.spritesheet('explosion', './assets/explosion.png', {frameWidth : 64, frameHeight : 32, startFrame : 0, endFrame : 9});
    }

    create()
    {
        // implementing starfield scroll
        this.starfield = this.add.tileSprite(0, 0, 640, 480, 'starfield').setOrigin(0, 0);
    
        // adding spaceships x3
        this.spaceship01 = new Spaceship(this, game.config.width + borderUIsize * 6, borderUIsize * 4, 'spaceship', 0, 150).setOrigin(0, 0);
        this.spaceship02 = new Spaceship(this, game.config.width + borderUIsize * 3, borderUIsize * 5 + borderPadding * 2, 'spaceship', 0, 100).setOrigin(0, 0);
        this.spaceship03 = new Spaceship(this, game.config.width, borderUIsize * 6 + borderPadding * 4, 'spaceship', 0, 50).setOrigin(0, 0);
    
        // UI background/background
        this.add.rectangle(0, 0, borderUIsize + borderPadding * 2.2, borderUIsize * 3.1, 0x820404).setOrigin(0,0);

        // score background sprites & instructions
        this.add.sprite(borderUIsize * 1.5, borderUIsize + borderPadding * 2.2, 'scorebulb').setOrigin(0, 0);
        this.add.sprite(borderUIsize * 1.5, borderPadding * .6, 'scorebulb').setOrigin(0, 0);
        this.add.image(600, 30, 'controls').setOrigin(1, 0);

        // UI background
        this.add.rectangle(0, 0, borderUIsize + borderPadding * 1.9, borderUIsize * 3, 0xf64343).setOrigin(0, 0);
        this.add.rectangle(0, 0, borderUIsize + borderPadding * 1.5, borderUIsize * 3, 0xe13333).setOrigin(0, 0);
        
        this.add.sprite(borderUIsize / 2.5, borderUIsize * 2.1 - borderPadding, 'target').setOrigin(0, 0);
        this.add.sprite(borderUIsize / 2.5, borderPadding, 'clock').setOrigin(0, 0);

        // most canvas borders were removed because they were hella ugly
        this.add.rectangle(0, game.config.height - 1.5 * borderUIsize, game.config.width, borderUIsize * 1.5, 0x697678).setOrigin(0, 0);
        this.add.rectangle(0, game.config.height, game.config.width, borderUIsize / 2, 0x535353).setOrigin(0,1);

        // adding launchpad to go under the rocket
        this.p1Launchpad = new Launchpad(this, game.config.width / 2, game.config.height - borderUIsize - borderPadding * 0.9, 'launchpad').setOrigin(0.5, 0);
        // adding rocket (p1)
        this.p1Rocket = new Rocket(this, game.config.width/2, game.config.height - borderUIsize - borderPadding, 'rocket').setOrigin(.5, 0);

        // adding sparks to the rocket
        this.sparks = this.add.particles('sparks')
        
        this.emitter1 = this.sparks.createEmitter({
            x: 0,
            y: 0,
            angle: {min: 110, max: 70},
            speedY: 20,
            speedX: {min: -20, max: 20},
            gravityY: 10,
            scale: {min: .5, max: 2},
            lifespan: {min: 50, max: 100},
            blendMode: 'DIVIDE'
        })

        this.emitter2 = this.sparks.createEmitter({
            x: 0,
            y: 0,
            speedX: {min: -200, max: 200},
            speedY: {min: -150, max: 150},
            acceleration: true,
            scale: {min: .5, max: 1},
            lifespan: {min: 100, max: 250},
            tint: 'RED',
            blendMode: 'MULTIPLY'
        })

        this.emitter1.stop()
        this.emitter2.stop()

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

        let gameOverConfig = {
            fontFamily : 'Courier', // 'bold',
            fontSize : '28px',
            backgroundColor : '#000000',
            color : '#b1fb94',
            align : 'center',
            padding: 5,
            fixedWidth : 400,
        }

        this.gameOver = false;
        let gameTime = 59;

        // game over window
        this.clock = this.time.delayedCall(gameTime * 1000, () => {
            this.add.rectangle(game.config.width/2 + borderPadding / 4, game.config.height / 2  + borderPadding / 4, gameOverConfig.fixedWidth + borderPadding/3, 200, 0x278027).setOrigin(0.5);
            this.add.rectangle(game.config.width/2, game.config.height/2, gameOverConfig.fixedWidth + borderPadding/3, 200, 0xb1fb94).setOrigin(0.5);
            this.add.rectangle(game.config.width/2, game.config.height/2, gameOverConfig.fixedWidth, 200 - borderPadding/3, 0x000000).setOrigin(0.5);
            this.add.text(game.config.width/2, game.config.height/2 - borderUIsize, 'MISSION OVER', gameOverConfig).setOrigin(0.5);
            this.add.text(game.config.width/2, game.config.height/2 + 32 - borderUIsize, 'Press (R) to Restart', gameOverConfig).setOrigin(0.5);
            this.gameOver = true;
        }, null, this);

        let timeLeft = this.add.text(borderUIsize + borderPadding, borderPadding / 1.9, '0:' + gameTime, scoreConfig);
        
        function countdown()
        {
            if (gameTime > 0) 
                gameTime -= 1;

            // making sure countdown timer is appropriately formatted
            if (gameTime > 9)
                timeLeft.setText('0:' + (gameTime));
            else
            timeLeft.setText('0:0' + (gameTime));

        }

        let timedEvent = this.time.addEvent({ delay: 1000, callback: countdown, callbackScope: this, loop: true });
    }

    update()
    {
        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyR)) 
        {
            this.scene.restart();
        }

        // moving particle system to match ship
        if(this.p1Rocket.isFiring)
        {
            this.emitter1.start()
            this.emitter1.setPosition(this.p1Rocket.x, this.p1Rocket.y + 4)
        }
        else
        {
            this.emitter1.stop()
        }

        if(!this.gameOver)
        {
            this.starfield.tilePositionX -= 1;
            this.p1Rocket.update();
            this.spaceship01.update();
            this.spaceship02.update();
            this.spaceship03.update();
            this.p1Launchpad.update(this.p1Rocket);
        }

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
        // play explosion sound and effect
        this.sound.play('sfx_explosion');

        this.emitter2.explode(100, ship.x + ship.width/2, ship.y + ship.height/2)
        // hide real ship
        ship.alpha = 0;
        // reroll ship speed and period with reset
        ship.period = 8.0 + (15.0 * Math.random())
        ship.moveSpeed = 1 + 1.2 * Math.random()
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