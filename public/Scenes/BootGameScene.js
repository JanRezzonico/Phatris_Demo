/**
 * Scene that handles the boot of the game and the load of all assets.
 */
class BootGameScene extends Phaser.Scene {
    constructor() {
        super("BootGameScene");
    }
    preload() {
        this.cameras.main.setBackgroundColor(colors.black);
        const screenCenterX = this.cameras.main.worldView.x + this.cameras.main.width / 2;
        const screenCenterY = this.cameras.main.worldView.y + this.cameras.main.height / 2;
        this.add.text(screenCenterX, screenCenterY, "Loading game...")
            .setOrigin(0.5);
        this.load.bitmapFont('atari', 'Assets/Fonts/atari-classic.png', 'Assets/Fonts/atari-classic.xml');
        this.load.image("background", "Assets/Images/Backgrounds/Menu.jpg");
        this.load.image("button", "Assets/Images/Textures/button.png");
        this.load.image("cursor", "Assets/Images/Textures/cursor.png");
        this.load.image("settings", "Assets/Images/Textures/settings.png");
        this.load.image("info", "Assets/Images/Textures/info.png");
        this.load.image("home", "Assets/Images/Textures/home.png");
        this.load.image("scoreboard", "Assets/Images/Textures/scoreboard.png");
        this.load.image("first", "Assets/Images/Textures/firstPlace.png");
        this.load.image("second", "Assets/Images/Textures/secondPlace.png");
        this.load.image("third", "Assets/Images/Textures/thirdPlace.png");
        this.load.image("genericContainer", "Assets/Images/Textures/genericContainer.png");
        this.load.image("textHolder", "Assets/Images/Textures/textHolder.png");
        this.load.image("dataHolder", "Assets/Images/Textures/dataHolder.png");
        this.load.image("nextContainer", "Assets/Images/Textures/nextContainer.png");
        this.load.atlas('blocks', 'Assets/Images/Textures/Block_Spritesheets.png', 'Assets/Images/Textures/Block_Spritesheets.json');
        this.load.audio('dropSound', 'Assets/Audio/SoundEffects/effectSpace.ogg');
        this.load.audio('clearSound', 'Assets/Audio/SoundEffects/clear123.ogg');
        this.load.audio('fullClearSound', 'Assets/Audio/SoundEffects/clear.mp3');
        this.load.audio(audioSettings.menuMusic.name, audioSettings.menuMusic.path);
        for (const song of Phatris.SONGS) {
            this.load.audio(song.name, song.path);
        }
    }
    create() {
        this.scene.start("MenuScene");
    }
}