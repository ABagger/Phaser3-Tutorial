class Menu extends Phaser.Scene 
{
    constructor() 
    {
        super('menuScene')
    }

    preload()
    {
        this.load.image('title', './assets/title.png');
    }

    create()
    {
        let menuConfig = {
            fontFamily : 'Courier', // 'bold',
            fontSize : '18px',
            //backgroundColor : '#ffffff',
            color : '#dcffce',
            align : 'center',
        }

        this.add.text(320, 260, 'Press F to begin', menuConfig).setOrigin(.5, 0);
        this.add.image(320, 260, 'title').setOrigin(.5, 1);

        keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
    }

    update()
    {
        if(Phaser.Input.Keyboard.JustDown(keyF))
            this.scene.start('playScene');
    }
}