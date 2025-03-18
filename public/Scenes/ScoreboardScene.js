let thisScoreBoardScene = undefined;
/**
 * Scene where the user can see the scoreboard.
 */
class ScoreboardScene extends Phaser.Scene{
    constructor(){
        super("ScoreboardScene");
    }
    preload() {
        this.load.scenePlugin('rexuiplugin', 'Plugins/rexuiplugin.min.js', 'rexUI', 'rexUI');
        this.load.plugin('rexbbcodetextplugin', 'Plugins/rexbbcodetextplugin.min.js', true);
        this.load.plugin('rextexteditplugin', 'Plugins/rextexteditplugin.min.js', true);
    }
    create(){
        thisScoreBoardScene = this;
        NodeDataSender.loadData(0).then(result => {
            scores = result;
            this.waitingText.text = "";
            this.scoreboardValues = generateScoreboard(this);
        });

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
            .on('pointerdown', (pointer) => {
                this.scene.start("MenuScene");
            });
        this.add.bitmapText(screenCenterX, 50, 'atari', 'Scoreboard')
            .setOrigin(0.5)
            .setScale(0.7);

        this.waitingText = this.add.bitmapText(screenCenterX, 400, 'atari', "Temporarily unavailable")
            .setOrigin(0.5)
            .setScale(0.5);


         //#region scoreboard button
        scoreboardButtons = this.rexUI.add.buttons({
            x: 200,
            y: 110,
            buttons: [
                createButton(this, "Normal", true),
                createButton(this, "Timer", false)
            ],
            space: { item: 8 }
        }).setOrigin(0.0, 0.5)
            .layout()
            .on('button.click', function (button, index, pointer, event) {
                selectScoreboard(index);
                changeScoreboard(index);
            });
        //#endregion
    }


}

function changeScoreboard(mode){
    for (const value of thisScoreBoardScene.scoreboardValues) {
        value.destroy();
    }
    NodeDataSender.loadData(mode).then(result => {
        scores = result;
        fillScoreboard(thisScoreBoardScene, 180)
    });
}

function selectScoreboard(themeIndex) {
    let counter = 0;
    scoreboardButtons.buttons.forEach(button => {
        counter == themeIndex ?
            button.backgroundChildren[0].setFillStyle(0x84a4ec, 1) :
            button.backgroundChildren[0].setFillStyle(0x5474bc, 1);
        counter++;
    });
}

function generateScoreboard(scene) {
    let height = 150;
    scene.add.bitmapText(25, height, 'atari', 'Pos.')
        .setOrigin(0)
        .setScale(0.3);
    scene.add.bitmapText(150, height, 'atari', 'Username')
        .setOrigin(0)
        .setScale(0.3);
    scene.add.bitmapText(450, height, 'atari', 'Points')
        .setOrigin(0)
        .setScale(0.3);
    height += 30;
    for(let i = 1; i <= 20; i++){
        switch(i){
            case 1:
                scene.add.image(25, height, 'first')
                    .setOrigin(0);
                break;
            case 2:
                scene.add.image(25, height, 'second')
                    .setOrigin(0);
                break;
            case 3:
                scene.add.image(25, height, 'third')
                    .setOrigin(0);
                break;
            default:
                scene.add.bitmapText(25, height, 'atari', i)
                    .setOrigin(0)
                    .setScale(0.3);
                break;
        }
        height += 30;
    }
    return fillScoreboard(scene, 180);
}

/**
 * Fill the scoreboard with the data stored in db
 * 
 * @param {Phaser.Scene} scene 
 * @param {Number} startHeight 
 */
function fillScoreboard(scene, startHeight) {
    let scoreboardValues = [];
    for (const user of scores) {
        scoreboardValues.push(scene.add.bitmapText(150, startHeight, 'atari', user.username)
            .setOrigin(0)
            .setScale(0.3));
        scoreboardValues.push(scene.add.bitmapText(450, startHeight, 'atari', user.points)
            .setOrigin(0)
            .setScale(0.3));
        startHeight += 30;
    }
    scene.scoreboardValues = scoreboardValues;
    return scoreboardValues;
}