class Menu extends Phaser.Scene 
{
    constructor() 
    {
        super('menuScene')
    }

    preload()
    {
        this.load.image('title', './assets/title.png');
        this.load.image('controls', './assets/instructions.png');
        this.load.audio('sfx_select', './assets/select.wav');
        this.load.audio('sfx_liftoff', './assets/liftoff.wav');
        this.load.audio('sfx_start', './assets/title_theme.wav');
        this.load.spritesheet('title anim', './assets/title_anim.png', {frameWidth : 256, frameHeight : 128, startFrame : 0, endFrame : 29});
    }

    create()
    {
        let titleHasPlayed = false;
        let soundHasPlayed = false;
        let soundHasStarted = false;
        let isInitialized = false;

        this.menuConfig = {
            fontFamily : 'Courier', // 'bold',
            fontSize : '18px',
            //backgroundColor : '#ffffff',
            color : '#dcffce',
            align : 'center',
        }
        this.introConfig = {
            fontFamily : 'Courier', // 'bold',
            fontSize : '20px',
            //backgroundColor : '#ffffff',
            color : '#dcffce',
            align : 'center',
        }

        this.anims.create({
            key: 'fade in',
            frames: this.anims.generateFrameNumbers('title anim', {start : 0, end : 29, first : 0}),
            framerate: 17
        })

        this.introBG1 = this.add.rectangle(game.config.width/2 + borderPadding / 4, game.config.height * (6/14)  + borderPadding / 4, 400 + borderPadding/3, 200, 0x278027).setOrigin(0.5);
        this.introBG1 = this.add.rectangle(game.config.width/2, game.config.height * (6/14), 400 + borderPadding/3, 200, 0xb1fb94).setOrigin(0.5);
        this.introBG1 = this.add.rectangle(game.config.width/2, game.config.height * (6/14), 400, 200 - borderPadding/3, 0x000000).setOrigin(0.5);
        this.introTextA = this.add.text(320, 150, 'terminal initializing', this.introConfig).setOrigin(.5, 0);

        this.clock = this.time.delayedCall(750, ()=> {
            this.introTextA.text += '.';
        }, null, this);

        this.time.delayedCall(1300, ()=> {
            this.introTextA.text += '.';
        }, null, this);

        this.time.delayedCall(2000, ()=> {
            this.introTextA.text += '.';
        }, null, this);

        this.time.delayedCall(2500, () => {
            this.introTextB = this.add.text(320, 190, 'new software detected!', this.menuConfig).setOrigin(.5, 0);
        }, null, this);

        this.time.delayedCall(3500, () => {
            this.introTextC = this.add.text(320, 220, 'press \'y\' to run program', this.menuConfig).setOrigin(.5, 0);
            this.isInitialized = true;
        }, null, this);

        keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
        keyY = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Y);
    }

    update()
    {
        if(this.isInitialized && Phaser.Input.Keyboard.JustDown(keyY) && !this.titleHasPlayed)
        {
            this.introTextA.destroy();
            this.introTextB.destroy();
            this.introTextC.destroy();
            //this.introTextD.destroy();
            this.playTitle();
            this.isInitialized = false;
        }

        if(!this.soundHasStarted && this.titleHasPlayed)
        {
            this.sound.play('sfx_start');
            this.soundHasStarted = true;

            this.time.delayedCall(1300, () => {
                this.add.text(320, 260, 'press \'f\' to play', this.menuConfig).setOrigin(.5, 0);
                this.add.text(27, 450, '↓ click here to learn more about the project!', this.menuConfig)
                this.soundHasPlayed = true;
            }, null, this);
        }

        if(Phaser.Input.Keyboard.JustDown(keyF) && this.titleHasPlayed && this.soundHasPlayed)
        {
            this.scene.start('playScene');
        }
    }

    playTitle()
    {
        let title = this.add.sprite(320, 260, 'title anim').setOrigin(0.5,1);
        title.anims.play('fade in');
        title.on('animationcomplete', () => {
            this.add.image(320, 260, 'title').setOrigin(.5, 1);
            this.add.image(320, 320, 'controls').setOrigin(.5, 0);
            title.destroy();
            this.titleHasPlayed = true;
        })
    }
}