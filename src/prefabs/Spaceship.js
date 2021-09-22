class Spaceship extends Phaser.GameObjects.Sprite
{
    constructor(scene, x, y, texture, frame, pointValue)
    {
        super(scene, x, y, texture, frame);
        scene.add.existing(this);
        this.points = pointValue;
        this.moveSpeed = 1;
        this.displacement = 10;
        this.startY = this.y;
        this.period = 5.0 + (15.0 * Math.random())
    }

    update()
    {
        // adding sine-like movements w/ variable speed
        this.x -= 1 + this.moveSpeed * Math.abs(Math.cos(this.x + Math.PI / 2));
        this.y = this.startY + this.displacement * Math.cos((this.x / this.period) + this.startY);

        // adding 'wrap-around'
        if(this.x <= 0 - this.width)
        {
            this.reset();
        }
    }

    reset()
    {
        this.x = game.config.width;
    }
}