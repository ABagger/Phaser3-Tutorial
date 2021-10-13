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

        let menuConfig = {
            fontFamily : 'Courier', // 'bold',
            fontSize : '18px',
            //backgroundColor : '#ffffff',
            color : '#dcffce',
            align : 'center',
        }

        this.anims.create({
            key: 'fade in',
            frames: this.anims.generateFrameNumbers('title anim', {start : 0, end : 29, first : 0}),
            framerate: 17
        })

        let title = this.add.sprite(320, 260, 'title anim').setOrigin(0.5,1);
        title.anims.play('fade in');
        title.on('animationcomplete', () => {
            this.add.text(320, 260, 'Press F to begin', menuConfig).setOrigin(.5, 0);
            this.add.image(320, 260, 'title').setOrigin(.5, 1);
            this.add.image(600, 30, 'controls').setOrigin(1, 0);
            title.destroy();
            this.titleHasPlayed = true;
        })
        keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
    }

    update()
    {
        if(!this.soundHasPlayed)
        {
            // this.sound.play('sfx_start');
            this.soundHasPlayed = true;
        }

        if(Phaser.Input.Keyboard.JustDown(keyF) && this.titleHasPlayed)
        {
            this.scene.start('playScene');
        }
    }
}