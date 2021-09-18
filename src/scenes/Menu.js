class Menu extends Phaser.Scene 
{
    constructor() 
    {
        super('menuScene')
    }

    create()
    {
        this.add.text(320, 240, 'Menu: ').setOrigin(0.5, 0.5);
        this.scene.start('playScene');
    }
}