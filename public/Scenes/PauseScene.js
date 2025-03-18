/**
 * Popup scene when pausing the game.
 */
class PauseScene extends Phaser.Scene {
    constructor() {
        super("PauseScene");
    }
    init(scene) {
        this.escapeKey = this.input.keyboard.addKey(27);
        this.gameScene = scene;
    }
    create() {
        //#region Background

        this.cameras.main.setBackgroundColor(colors.tBlack);
        //#endregion
        //#region Constants
        const screenCenterX = this.cameras.main.worldView.x + this.cameras.main.width / 2;
        const screenCenterY = this.cameras.main.worldView.y + this.cameras.main.height / 2;
        const { width, height } = this.scale;
        const buttonWidth = width / 2;
        const buttonHeight = height / 10;
        //#endregion
        this.add.image(50, 50, 'home')
            .setOrigin(0.5)
            .setDisplaySize(50, 50)
            .setInteractive()
            .on('pointerdown', (pointer) => {
                this.scene.stop('GameScene');
                this.scene.stop('PauseScene');
                this.scene.start("MenuScene");
            });
        this.add.bitmapText(screenCenterX, 50, 'atari', 'Pause')
            .setOrigin(0.5)
            .setScale(0.7);
        this.resumeButton = this.add.image(screenCenterX, height * 0.5, 'button')
            .setDisplaySize(buttonWidth, buttonHeight)
            .setInteractive()
            .on('pointerdown', (pointer) => {
                this.scene.resume('GameScene');
                this.scene.stop('PauseScene');
            })
        this.add.bitmapText(this.resumeButton.x, this.resumeButton.y, 'atari', 'Resume')
            .setOrigin(0.5)
            .setScale(0.4);
        this.quitAndSave = this.add.image(screenCenterX, height * 0.7, 'button')
            .setDisplaySize(buttonWidth, buttonHeight)
            .setInteractive()
            .on('pointerdown', (pointer) => {
                this.scene.resume('GameScene');
                this.scene.stop('PauseScene');
                this.gameScene.gameOver();
            })
        this.add.bitmapText(this.quitAndSave.x, this.quitAndSave.y, 'atari', 'Quit & Save')
            .setOrigin(0.5)
            .setScale(0.4);
        this.quitWithoutSaving = this.add.image(screenCenterX, height * 0.9, 'button')
            .setDisplaySize(buttonWidth, buttonHeight)
            .setInteractive()
            .on('pointerdown', (pointer) => {
                this.scene.stop('GameScene');
                this.scene.stop('PauseScene');
                this.scene.start("MenuScene");
            })
        this.add.bitmapText(this.quitWithoutSaving.x, this.quitWithoutSaving.y, 'atari', 'Just Quit')
            .setOrigin(0.5)
            .setScale(0.4);
    }
    update() {
        const escapeJustPressed = this.input.keyboard.checkDown(this.escapeKey);
        if (escapeJustPressed) {
            this.scene.resume('GameScene');
            this.scene.stop('PauseScene');
        }
    }
}