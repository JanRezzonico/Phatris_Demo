let username = "";
/**
 * Main menu scene.
 */
class MenuScene extends Phaser.Scene {
    constructor() {
        super("MenuScene");
    }
    init() {
        this.cursors = this.input.keyboard.createCursorKeys();
        this.enterKey = this.input.keyboard.addKey(13);
    }
    preload() {
        this.load.scenePlugin('rexuiplugin', 'Plugins/rexuiplugin.min.js', 'rexUI', 'rexUI');
        this.load.plugin('rexbbcodetextplugin', 'Plugins/rexbbcodetextplugin.min.js', true);
        this.load.plugin('rextexteditplugin', 'Plugins/rextexteditplugin.min.js', true);
    }
    create() {
        //button creation and management inspired by https://blog.ourcade.co/posts/2020/phaser-3-ui-menu-selection-cursor-selector/
        //#region Constants
        const screenCenterX = this.cameras.main.worldView.x + this.cameras.main.width / 2;
        const { width, height } = this.scale;
        const buttonWidth = width / 3;
        const buttonHeight = height / 10;
        this.selectedButtonIndex = 0;
        //#endregion
        //#region Background
        this.background = this.add.tileSprite(0, 0, config.width, config.height, "background")
            .setOrigin(0, 0)
            .setDisplaySize(this.sys.canvas.width, this.sys.canvas.height);
        //#endregion
        //#region Audio
        audioSettings.menuToMenuRoutine(this);
        //#endregion
        //#region Titles
        this.add.bitmapText(screenCenterX, 100, 'atari', 'Phatris')
            .setOrigin(0.5);
        this.add.bitmapText(screenCenterX, 150, 'atari', 'Use arrows to move')
            .setOrigin(0.5)
            .setScale(0.2);
        this.add.bitmapText(screenCenterX, 170, 'atari', 'Use space to select')
            .setOrigin(0.5)
            .setScale(0.2);
        //#endregion
        //#region Textbox
        const printText = this.add.rexBBCodeText(screenCenterX, height * 0.35, username, {
            space: { top: 8, bottom: 8, left: 8, right: 8 },
            fontFamily: 'AtariClassicChunky',
            fixedWidth: 300,
            fixedHeight: 80,
            fontSize: '18px',
            halign: 'center',
            valign: 'center',
            backgroundColor: colors.blue,
            backgroundStrokeLineWidth: 5,
            backgroundStrokeColor: 'black',
            padding: 20
        }).setOrigin(0.5)

        this.plugins.get('rextexteditplugin').add(printText, {
            onTextChanged: (textObject, text) => {
                textObject.text = text;
                username = text;
            },
            selectAll: true,
        });
        //#endregion






        //#endregion
        //#region Buttons
        const playButton = this.add.image(screenCenterX, height * 0.5, 'button')
            .setDisplaySize(buttonWidth, buttonHeight)
            .setInteractive()
            .on('pointerdown', (pointer) => { this.startGame(); })
            .on('pointerover', (pointer) => { this.selectButton(0) })
            .on('selected', () => {
                this.startGame();
            });
        this.add.bitmapText(playButton.x, playButton.y, 'atari', 'Play')
            .setOrigin(0.5)
            .setScale(0.4);
        modeButtons = this.rexUI.add.buttons({
            x: playButton.x,
            y: playButton.y + 80,
            buttons: [
                createButton(this, "Classic", true),
                createButton(this, "Time Limit", false)
            ],
            space: { item: 8 }
        }).setOrigin(0.5, 0.5)
            .layout()
            .on('button.click', function (button, index, pointer, event) {
                modeClick(index);
                modeButtons.setButtonEnable(false);
                setTimeout(() => {
                    modeButtons.setButtonEnable(true)
                }, 100);
            });
        const settingsButton = this.add.image(screenCenterX - (buttonHeight + (buttonHeight / 2)), playButton.y + buttonHeight * 2, 'settings')
            .setDisplaySize(buttonHeight, buttonHeight)
            .setInteractive()
            .on('pointerdown', (pointer) => { this.scene.start("SettingsScene"); })
            .on('pointerover', (pointer) => { this.selectButton(1) })
            .on('selected', () => {
                this.scene.start("SettingsScene");
            });
        const infoButton = this.add.image(screenCenterX, playButton.y + buttonHeight * 2, 'info')
            .setDisplaySize(buttonHeight, buttonHeight)
            .setInteractive()
            .on('pointerdown', (pointer) => { this.scene.start("InfoScene"); })
            .on('pointerover', (pointer) => { this.selectButton(2) })
            .on('selected', () => {
                this.scene.start("InfoScene");
            });
        const scoreboardButton = this.add.image(screenCenterX + (buttonHeight + (buttonHeight / 2)), playButton.y + buttonHeight * 2, 'scoreboard')
            .setDisplaySize(buttonHeight, buttonHeight)
            .setInteractive()
            .on('pointerdown', (pointer) => { this.scene.start("ScoreboardScene"); })
            .on('pointerover', (pointer) => { this.selectButton(3) })
            .on('selected', () => {
                this.scene.start("ScoreboardScene");
            });
        this.buttons = [playButton, settingsButton, infoButton, scoreboardButton];
        this.cursor = this.add.image(0, 0, 'cursor')
            .setOrigin(0.5)
            .setScale(0.4);
        this.selectButton(0);
        //#endregion
        //#region Buttons
        this.add.bitmapText(screenCenterX, 650, 'atari', 'Theme').setOrigin(0.5).setScale(0.4);
        let options = [];
        for (const theme of Phatris.THEMES) {
            options.push(createButton(this, theme.name, gameSettings.theme.name == theme.name));
        }
        themeButtons = this.rexUI.add.buttons({
            x: 125,
            y: 700,
            buttons: options,
            space: { item: 8 }
        }).setOrigin(0.0, 0.5)
            .layout()
            .on('button.click', function (button, index, pointer, event) {
                themeClick(index);
                themeButtons.setButtonEnable(false);
                setTimeout(() => {
                    themeButtons.setButtonEnable(true)
                }, 100);
            });
        //#endregion
    }
    update() {
        //#region Buttons
        const upJustPressed = Phaser.Input.Keyboard.JustDown(this.cursors.up);
        const downJustPressed = Phaser.Input.Keyboard.JustDown(this.cursors.down);
        const leftJustPressed = Phaser.Input.Keyboard.JustDown(this.cursors.left);
        const rightJustPressed = Phaser.Input.Keyboard.JustDown(this.cursors.right);
        const enterJustPressed = this.input.keyboard.checkDown(this.enterKey);
        const padMap = padHandler.getPresses(this.input.gamepad.gamepads[0]);
        if (upJustPressed || leftJustPressed || padMap.up || padMap.left) {
            this.selectNextButton(-1);
        }
        else if (downJustPressed || rightJustPressed || padMap.right) {
            this.selectNextButton(1);
        }
        else if (enterJustPressed || padMap.a) {
            this.confirmSelection();
        }
        //#endregion
    }
    //#region Buttons
    selectButton(index) {
        this.buttons[this.selectedButtonIndex]
            .setTint(0xffffff);//reset tint on unselect
        const newButton = this.buttons[index];
        newButton.setTint(0x66ff7f);//set tint of new selection
        this.cursor.x = newButton.x + newButton.displayWidth * 0.5;
        this.cursor.y = newButton.y;
        this.selectedButtonIndex = index;
    }
    selectNextButton(count = 1) {
        let index = this.selectedButtonIndex + count;
        if (index >= this.buttons.length) {
            index = 0;
        }
        if (index < 0) {
            index = this.buttons.length - 1;
        }
        this.selectButton(index);
    }
    confirmSelection() {
        this.buttons[this.selectedButtonIndex].emit('selected');
    }
    //#endregion
    startGame() {
        username = username.trim().normalize().replace(/[\u0300-\u036f]/g, "");//remove accents from https://stackoverflow.com/questions/990904/remove-accents-diacritics-in-a-string-in-javascript
        if (username.length <= 0) {
            Alert(this, 'Username', 'Choose an username');
            return;
        } else if (username.length > 15) {
            Alert(this, 'Username', 'Choose an username\nshorter than\n15 characters');
            return;
        }
        this.scene.start("GameScene", { username: username, mode: gameSettings.modes.selected });
    }
}



//#region Popup alert dialog code inspired by https://codepen.io/rexrainbow/pen/qBdQRmq
let AlertDialog = undefined;
function CreateAlertDialog(scene) {
    let dialog = scene.rexUI.add.dialog({
        width: 100,
        background: scene.rexUI.add.roundRectangle(0, 0, 100, 100, 5, 0x5474bc),
        title: scene.add.bitmapText(0, 0, 'atari', '')
            .setOrigin(0.5)
            .setScale(0.4),
        content: scene.add.bitmapText(0, 0, 'atari', '')
            .setOrigin(0.5)
            .setScale(0.2),
        actions: [
            scene.rexUI.add.label({
                background: scene.rexUI.add.roundRectangle(0, 0, 0, 0, 5, 0x000000),
                text: scene.add.bitmapText(0, 0, 'atari', 'Ok')
                    .setOrigin(0.5)
                    .setScale(0.2),
                space: 10
            })
        ],
        space: {
            title: 25,
            content: 25,
            action: 15,
            left: 20,
            right: 20,
            top: 20,
            bottom: 20,
        },
        align: { actions: 'center' },
        expand: { content: false }
    })
        .on('button.over', function (button, groupName, index, pointer, event) {
            button.getElement('background').setStrokeStyle(1, 0xffffff);
        })
        .on('button.out', function (button, groupName, index, pointer, event) {
            button.getElement('background').setStrokeStyle();
        });

    return dialog;
}
function SetAlertDialog(dialog, title, content) {
    if (title === undefined) {
        title = '';
    }
    if (content === undefined) {
        content = '';
    }
    if (dialog.getElement('title')) {
        dialog.getElement('title').text = title;
    }
    if (dialog.getElement('content')) {
        dialog.getElement('content').text = content;
    }
    return dialog;
}
function Alert(scene, title, content, x, y) {
    if (x === undefined) {
        x = 500;
    }
    if (y === undefined) {
        y = 725;
    }
    if (!AlertDialog) {
        AlertDialog = CreateAlertDialog(scene)
    }
    SetAlertDialog(AlertDialog, title, content);
    AlertDialog
        .setPosition(x, y)
        .setVisible(true)
        .layout();

    return AlertDialog
        .moveFromPromise(1000, '-=100', undefined, 'Elastic')
        .then(function () {
            return scene.rexUI.waitEvent(AlertDialog, 'button.click');
        })
        .then(function () {
            return AlertDialog.moveToPromise(1000, '+=500', undefined, 'Back');
        })
        .then(function () {
            AlertDialog.setVisible(false);
            return Promise.resolve();
        })
}

//#endregion

//#region Button functions
function themeClick(themeIndex) {
    gameSettings.changeTheme(themeIndex);
    let counter = 0;
    themeButtons.buttons.forEach(button => {
        counter == themeIndex ?
            button.backgroundChildren[0].setFillStyle(0x84a4ec, 1) :
            button.backgroundChildren[0].setFillStyle(0x5474bc, 1);
        counter++;
    });
}
function modeClick(modeIndex) {
    gameSettings.modes.selected = modeIndex;
    let counter = 0;
    modeButtons.buttons.forEach(button => {
        counter == modeIndex ?
            button.backgroundChildren[0].setFillStyle(0x84a4ec, 1) :
            button.backgroundChildren[0].setFillStyle(0x5474bc, 1);
        counter++;
    });
}
//from https://codepen.io/rexrainbow/pen/eYvxqLJ
function createButton(scene, text, isSelected) {
    return scene.rexUI.add.label({
        width: 100,
        height: 40,
        background: scene.rexUI.add.roundRectangle(0, 0, 0, 0, 5, isSelected ? 0x84a4ec : 0x5474bc),
        text: scene.add.bitmapText(0, 0, 'atari', text).setOrigin(0.5).setScale(0.3),
        space: {
            left: 10,
            right: 10,
        }
    });
}
//#endregion