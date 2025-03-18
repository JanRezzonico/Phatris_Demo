/**
 * Scene containing additional informations.
 */
class InfoScene extends Phaser.Scene {
    constructor() {
        super("InfoScene");
    }
    preload() {
        this.load.scenePlugin('rexuiplugin', 'Plugins/rexuiplugin.min.js', 'rexUI', 'rexUI');
    }
    create() {
        //#region Background
        this.cameras.main.setBackgroundColor(colors.black);
        //#endregion
        //#region Constants
        const screenCenterX = this.cameras.main.worldView.x + this.cameras.main.width / 2;
        const screenCenterY = this.cameras.main.worldView.y + this.cameras.main.height / 2;
        //#endregion
        this.add.image(50, 50, 'home')
            .setOrigin(0.5)
            .setDisplaySize(50, 50)
            .setInteractive()
            .on('pointerdown', (pointer) => { this.scene.start("MenuScene"); });
        this.add.bitmapText(screenCenterX, 50, 'atari', 'Info')
            .setOrigin(0.5)
            .setScale(0.7);
        this.add.bitmapText(25, screenCenterY, 'atari', "The goal of the Phatris game is to align the tetraminos falling from the top. Every time a tetramino collides with the bottom of the playable area or collides with its bottom part with another tetramino, it is placed there, score increments and you are given a new tetramino. If an entire row is occupied, that row gets removed, the rows on top shift down and the score goes up. The game is over when a tetramino can't fit in the playable area anymore.\n\nThe time limit gamemode works the same way, but you start playing at a faster level and you have only a fixed amount of time to get the most points you can.")
            .setMaxWidth(600)
            .setLetterSpacing(5)
            .setOrigin(0)
            .setScale(0.25);
        //Keybinding table

        generateKeyBindingTable(this);
    }
}

function generateKeyBindingTable(scene) {
    let height = 100;
    scene.add.bitmapText(25, height, 'atari', 'Function')
        .setOrigin(0)
        .setScale(0.4);
    scene.add.bitmapText(400, height, 'atari', 'key')
        .setOrigin(0)
        .setScale(0.4);
    height += 40;
    Object.keys(keyBindings).forEach(element => {
        scene.add.bitmapText(25, height, 'atari', element)
            .setOrigin(0)
            .setScale(0.3);
        scene.add.bitmapText(400, height, 'atari', keyboardMap[keyBindings[element]])
            .setOrigin(0)
            .setScale(0.3);
        height += 35;
    });
}