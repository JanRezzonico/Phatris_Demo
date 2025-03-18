/**
 * Scene that pops up when player loses or quits saving.
 * This scene shows information on the game that just ended.
 */
class ScoreScene extends Phaser.Scene {
    constructor() {
        super("ScoreScene");
    }
    init(gameInfo) {
        this.info = gameInfo;
        NodeDataSender.sendData({ username: this.info.username, points: this.info.points, mode: this.info.mode });
    }
    preload() {
        this.load.scenePlugin('rexuiplugin', 'Plugins/rexuiplugin.min.js', 'rexUI', 'rexUI');
        this.enterKey = this.input.keyboard.addKey(13);
    }
    create() {
        audioSettings.menuToMenuRoutine(this);
        //#region Constants
        const screenCenterX = this.cameras.main.worldView.x + this.cameras.main.width / 2;
        const screenCenterY = this.cameras.main.worldView.y + this.cameras.main.height / 2;
        const { width, height } = this.scale;
        const buttonWidth = width / 3;
        const buttonHeight = height / 10;
        //#endregion
        this.background = this.add.tileSprite(0, 0, config.width, config.height, "background")
            .setOrigin(0, 0)
            .setDisplaySize(this.sys.canvas.width, this.sys.canvas.height);

        this.add.bitmapText(screenCenterX, screenCenterY - 200, 'atari', 'Game Over')
            .setOrigin(0.5)
            .setScale(0.7);
        this.add.bitmapText(screenCenterX, screenCenterY, 'atari', 'Points: ' + this.info.points)
            .setOrigin(0.5)
            .setScale(0.4);
        this.add.bitmapText(screenCenterX, screenCenterY + 40, 'atari', 'Level: ' + this.info.level)
            .setOrigin(0.5)
            .setScale(0.4);
        this.add.bitmapText(screenCenterX, screenCenterY + 80, 'atari', 'Lines Cleared: ' + this.info.linesCleared)
            .setOrigin(0.5)
            .setScale(0.4);

        const backButton = this.add.image(screenCenterX, screenCenterY + 300, 'button')
            .setDisplaySize(buttonWidth + 200, buttonHeight)
            .setInteractive()
            .on('pointerdown', (pointer) => {
                this.scene.start("MenuScene");
            });
        this.add.bitmapText(backButton.x, backButton.y, 'atari', 'Back to Menu')
            .setOrigin(0.5)
            .setScale(0.4);

    }
    update() {
        let padMap = padHandler.getPresses(this.input.gamepad.gamepads[0]);
        if (this.input.keyboard.checkDown(this.enterKey) || padMap.x) {
            this.scene.start("MenuScene");
        }
    }
}