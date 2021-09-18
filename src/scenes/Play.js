class Play extends Phaser.Scene 
{
    constructor() 
    {
        super('playScene')
    }

    create()
    {
        this.add.text(320, 240, 'Super happy funtime for play').setOrigin(0.5, 0.5);
    }
}