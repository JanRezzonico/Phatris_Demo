let themeButtons = undefined;
let songButtons = undefined;
let modeButtons = undefined;
let scoreboardButtons = undefined;
let thisScene;
/**
 * Scene where the user can change settings.
 */
class SettingsScene extends Phaser.Scene {
    constructor() {
        super("SettingsScene");
        thisScene = this;
    }
    preload() {
        this.load.scenePlugin('rexuiplugin', 'Plugins/rexuiplugin.min.js', 'rexUI', 'rexUI');
    }
    create() {
        //#region Background
        this.cameras.main.setBackgroundColor(colors.black)
        //#endregion
        //#region Constants
        const screenCenterX = this.cameras.main.worldView.x + this.cameras.main.width / 2;
        const screenCenterY = this.cameras.main.worldView.y + this.cameras.main.height / 2;
        //#endregion
        this.add.image(50, 50, 'home')
            .setOrigin(0.5)
            .setDisplaySize(50, 50)
            .setInteractive()
            .on('pointerdown', (pointer) => {
                this.scene.start("MenuScene");
            });
        this.add.bitmapText(screenCenterX, 50, 'atari', 'Settings')
            .setOrigin(0.5)
            .setScale(0.7);
        this.add.bitmapText(100, 150, 'atari', 'Game VU')
            .setOrigin(0.5)
            .setScale(0.4);
        const percGameMusic = this.add.bitmapText(560, 150, 'atari', (audioSettings.gameMusic.getVolume() * 100 + "%"))
            .setOrigin(0.5)
            .setScale(0.4);
        this.add.bitmapText(100, 250, 'atari', 'Menu VU')
            .setOrigin(0.5)
            .setScale(0.4);
        const percMenuMusic = this.add.bitmapText(560, 250, 'atari', (audioSettings.menuMusic.getVolume() * 100 + "%"))
            .setOrigin(0.5)
            .setScale(0.4);
        this.add.bitmapText(100, 350, 'atari', 'SFX VU')
            .setOrigin(0.5)
            .setScale(0.4);
        const percSFX = this.add.bitmapText(560, 350, 'atari', (audioSettings.SFX.getVolume() * 100 + "%"))
            .setOrigin(0.5)
            .setScale(0.4);
        createSlider(
            this,
            audioSettings.gameMusic.getVolume(),
            200,
            150,
            (value) => {
                audioSettings.gameMusic.setVolume(value);
                percGameMusic.text = Math.round(audioSettings.gameMusic.getVolume() * 100) + "%";
            });
        createSlider(
            this,
            audioSettings.menuMusic.getVolume(),
            200,
            250,
            (value) => {
                audioSettings.menuMusic.setVolume(value);
                percMenuMusic.text = Math.round(audioSettings.menuMusic.getVolume() * 100) + "%";
            });
        createSlider(
            this,
            audioSettings.SFX.getVolume(),
            200,
            350,
            (value) => {
                audioSettings.SFX.setVolume(value);
                percSFX.text = Math.round(audioSettings.SFX.getVolume() * 100) + "%";
            });
            this.add.bitmapText(20, 650, 'atari', "Music by GeoffreyBurch, AlexiAction, sinneschlösen and 23843807 from Pixabay\n\nSound effects from https://www.youtube.com/watch?v=Xm9O2iJLWxY \n\nBackground images from:\nColorful: wall.alphacoders.com\nDark: imgur.com\nLight: wallpaperacces.com\nMenu: encrypted-tbn3.gstatic.com").setOrigin(0.0, 0).setScale(0.2).setMaxWidth(620);
    }
}

/**
 * 
 * @param {Phaser.Scene} scene 
 * @param {Number} value 
 * @param {Function} valuechangeCallback 
 */
function createSlider(scene, value, x, y, valuechangeCallback) {
    return scene.rexUI.add.slider({
        x: x, y: y, width: 300, height: 25, orientation: 'x',
        track: scene.rexUI.add.roundRectangle(0, 0, 0, 0, 6).setFillStyle(colors.blue._color),
        thumb: scene.rexUI.add.roundRectangle(0, 0, 0, 0, 20).setFillStyle(colors.white._color),
        valuechangeCallback: valuechangeCallback,
        value: value
    }).setOrigin(0.0, 0.5).layout();
}