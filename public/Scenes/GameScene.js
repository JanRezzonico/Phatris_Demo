/**
 * Scene that handles all about the game that is currently running.
 */
class GameScene extends Phaser.Scene {
    constructor() {
        super("GameScene");
    }
    init(params) {
        let { username, mode } = params;
        this.pauseKey = this.input.keyboard.addKey(keyBindings.pauseKey);
        username = String(username);
        username.normalize();
        username.slice(0, 15);
        gameSettings.defaultUsername = username;
        this.gameInfo = new GameInfo(username, mode);
        this.ghost = undefined;
        if (mode == gameSettings.modes.TIME) {
            this.countDownDate = Date.now() + gameSettings.modes.TIMELIMIT;
            this.interval = setInterval(() => {
                let now = Date.now();
                let distance = this.countDownDate - now;
                let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                let seconds = Math.floor((distance % (1000 * 60)) / 1000);
                if (this.timeText) {
                    this.timeText.setText(minutes + ":" + seconds);
                }
                if (distance < 0) {
                    clearInterval(this.interval);
                    this.gameOver();
                }
            }, 500);
        }
    }
    preload() {
        this.textures.remove("gameBg");
        this.load.image("gameBg", gameSettings.theme.bgPath);
    }
    create() {
        this.background = this.add.tileSprite(0, 0, undefined, undefined, "gameBg")
            .setOrigin(0, 0)
            .setDisplaySize(this.sys.canvas.width, this.sys.canvas.height);
        audioSettings.menuToGameRoutine(this);
        this.frameCounter = 0;
        this.grid = new Grid(this, gameSettings.minMargin);
        this.gen = new TetraminoGenerator(this.grid);
        this.nextTetramini = [];
        this.heldSprites = [];
        this.newTetramino();
        this.assignKeyBindings();
        for (let col = 0; col < Phatris.GRID_COLS; col++) {
            for (let row = 0; row < Phatris.GRID_ROWS; row++) {
                let x = this.grid.getX() + this.grid.getCellSize() * col;
                let y = this.grid.getY() + this.grid.getCellSize() * row;
                let size = this.grid.getCellSize();
                this.add.rectangle(x, y, size, size).setStrokeStyle(1, 0xefc53f);
            }
        }
        //#region Points, lines cleared and level
        let conf = {
            img: {
                title: {
                    x: 12.5,
                    y: this.grid.getX(),
                    w: 125,
                    h: 100 / 3
                },
                data: {
                    x: 12.5,
                    y: undefined,
                    w: 125,
                    h: 100 / 3 * 2
                }
            },
            txt: {
                title: {
                    x: undefined,
                    y: undefined
                },
                data: {
                    x: undefined,
                    y: undefined
                }
            },
            offset: 150,
            yCounter: 0,
            getOffsetY() { return this.offset * this.yCounter },
        };
        conf.img.data.y = conf.img.title.y + conf.img.title.h;
        conf.txt.title.x = conf.img.title.x + (conf.img.title.w / 2);
        conf.txt.title.y = conf.img.title.y + (conf.img.title.h / 2);
        conf.txt.data.x = conf.img.data.x + (conf.img.data.w / 2);
        conf.txt.data.y = conf.img.data.y + (conf.img.data.h / 2);
        this.add.image(conf.img.title.x, conf.img.title.y + conf.getOffsetY(), 'textHolder')
            .setOrigin(0)
            .setDisplaySize(conf.img.title.w, conf.img.title.h);
        this.add.image(conf.img.data.x, conf.img.data.y + conf.getOffsetY(), 'dataHolder')
            .setOrigin(0)
            .setDisplaySize(conf.img.data.w, conf.img.data.h);
        this.add.bitmapText(conf.txt.title.x, conf.txt.title.y + conf.getOffsetY(), 'atari', "Points")
            .setOrigin(0.5)
            .setScale(0.3);
        this.pointsText = this.add.bitmapText(conf.txt.data.x, conf.txt.data.y + conf.getOffsetY(), 'atari', this.gameInfo.points)
            .setOrigin(0.5)
            .setScale(0.25);
        conf.yCounter++;
        this.add.image(conf.img.title.x, conf.img.title.y + conf.getOffsetY(), 'textHolder')
            .setOrigin(0)
            .setDisplaySize(conf.img.title.w, conf.img.title.h);
        this.add.image(conf.img.data.x, conf.img.data.y + conf.getOffsetY(), 'dataHolder')
            .setOrigin(0)
            .setDisplaySize(conf.img.data.w, conf.img.data.h);
        this.add.bitmapText(conf.txt.title.x, conf.txt.title.y + conf.getOffsetY(), 'atari', "Level")
            .setOrigin(0.5)
            .setScale(0.3);
        this.levelText = this.add.bitmapText(conf.txt.data.x, conf.txt.data.y + conf.getOffsetY(), 'atari', this.gameInfo.level)
            .setOrigin(0.5)
            .setScale(0.3);
        conf.yCounter++;
        this.add.image(conf.img.title.x, conf.img.title.y + conf.getOffsetY(), 'textHolder')
            .setOrigin(0)
            .setDisplaySize(conf.img.title.w, conf.img.title.h);
        this.add.image(conf.img.data.x, conf.img.data.y + conf.getOffsetY(), 'dataHolder')
            .setOrigin(0)
            .setDisplaySize(conf.img.data.w, conf.img.data.h);
        this.add.bitmapText(conf.txt.title.x, conf.txt.title.y + conf.getOffsetY(), 'atari', "Lines")
            .setOrigin(0.5)
            .setScale(0.3);
        this.linesText = this.add.bitmapText(conf.txt.data.x, conf.txt.data.y + conf.getOffsetY(), 'atari', this.gameInfo.linesCleared)
            .setOrigin(0.5)
            .setScale(0.3);

        conf.yCounter = 0;
        this.add.image(500, conf.img.title.y + conf.getOffsetY() - 50, 'textHolder')
            .setOrigin(0)
            .setDisplaySize(conf.img.title.w, conf.img.title.h);
        this.add.bitmapText(560, conf.txt.title.y + conf.getOffsetY() - 50, 'atari', "Next")
            .setOrigin(0.5)
            .setScale(0.3);

        this.add.image(500, conf.img.title.y + conf.getOffsetY() + conf.img.title.h - 50, 'nextContainer')
            .setOrigin(0)
            .setDisplaySize(conf.img.title.w, conf.img.title.h * 3);
        this.add.image(500, conf.img.title.y + conf.getOffsetY() + conf.img.title.h * 4 - 50, 'nextContainer')
            .setOrigin(0)
            .setDisplaySize(conf.img.title.w, conf.img.title.h * 3);
        this.add.image(500, conf.img.title.y + conf.getOffsetY() + conf.img.title.h * 7 - 50, 'nextContainer')
            .setOrigin(0)
            .setDisplaySize(conf.img.title.w, conf.img.title.h * 3);

        conf.yCounter += 2.5;

        this.add.image(500, conf.img.title.y + conf.getOffsetY(), 'textHolder')
            .setOrigin(0)
            .setDisplaySize(conf.img.title.w, conf.img.title.h);
        this.add.image(500, conf.img.data.y + conf.getOffsetY(), 'dataHolder')
            .setOrigin(0)
            .setDisplaySize(conf.img.data.w, conf.img.data.h * 1.5);
        this.add.bitmapText(560, conf.txt.title.y + conf.getOffsetY(), 'atari', "Hold")
            .setOrigin(0.5)
            .setScale(0.3);
        const screenCenterX = this.cameras.main.worldView.x + this.cameras.main.width / 2;
        this.timeText = this.add.bitmapText(screenCenterX, 50, 'atari', "")
            .setOrigin(0.5)
            .setScale(0.6);
        //#endregion
        this.add.bitmapText(screenCenterX, 775, 'atari', this.gameInfo.username)
            .setOrigin(0.5)
            .setScale(0.6);

        this.drawGhost();
    }
    update() {
        this.handleInput();
        this.handlePieceFalling();
        this.checkPause();
    }
    checkPause() {
        let pauseJustPressed = this.input.keyboard.checkDown(this.pauseKey);
        if (pauseJustPressed) {
            this.scene.pause('GameScene');
            this.scene.launch('PauseScene', this);
        }
    }
    drawGhost() {
        if (this.ghost) {
            for (const cell of this.ghost.sprites) {
                cell.destroy();
            }
        }
        this.ghost = new Tetramino(this.gameInfo.currentTetramino.grid, this.gameInfo.currentTetramino.model, this.gameInfo.currentTetramino.letter);
        this.ghost.matrix = this.gameInfo.currentTetramino.matrix;
        this.ghost.col = this.gameInfo.currentTetramino.col;
        this.ghost.row = this.gameInfo.currentTetramino.row;
        while (this.grid.tetraminoCanFit(this.ghost, this.ghost.row + 1, this.ghost.col)) {
            this.ghost.row++;
        }
        this.genGhostSprites();
    }
    genGhostSprites() {
        this.ghost.sprites = [];
        for (let i = 0; i < this.ghost.matrix.length; i++) {
            const element = this.ghost.matrix[i];
            for (let j = 0; j < element.length; j++) {
                const cell = element[j];
                if (cell) {
                    this.genGhostCell(
                        this.ghost.col + j,
                        this.ghost.row + i
                    );
                }
            }
        }
    }
    genGhostCell(row, col) {
        let texture = gameSettings.theme.name + "/" + this.ghost.letter + ".png";
        let x = row * this.grid.getCellSize() + this.grid.getX();
        let y = col * this.grid.getCellSize() + this.grid.getY();
        let cellSize = this.grid.getCellSize();
        let sprite = this.add.tileSprite(x, y, 0, 0, 'blocks', texture)
            .setDisplaySize(cellSize, cellSize)
            .setOrigin(0.5, 0.5);
        sprite.alpha = 0.5;
        this.ghost.sprites.push(sprite);

    }
    assignKeyBindings() {
        /**
         * For each keybind, creates this.nameOfKeyBind as a Phaser key with value valueOfKeyBind 
         * @see https://stackoverflow.com/questions/8312459/iterate-through-object-properties
         */
        Object.keys(keyBindings).forEach(e => { this[e] = this.input.keyboard.addKey(keyBindings[e]) });
        this.canRotate = true;
        this.canDrop = true;
    }
    handleInput() {
        let any = false;
        let leftKeyDown = this.input.keyboard.checkDown(this.leftKey, Phatris.AUTOREPEAT_DELAY);
        let rightKeyDown = this.input.keyboard.checkDown(this.rightKey, Phatris.AUTOREPEAT_DELAY);
        let rotateKeyDown = this.rotateKey.isDown && !this.rotateFlipFlop;
        let downKeyDown = this.input.keyboard.checkDown(this.downKey, Phatris.AUTOREPEAT_DELAY);
        let dropKeyDown = this.dropKey.isDown && !this.dropFlipFlop;
        let holdKeyDown = this.holdKey.isDown && !this.holdFlipFlop;

        let padMap = padHandler.getPresses(this.input.gamepad.gamepads[0]);
        leftKeyDown =  leftKeyDown || padMap.left;
        rightKeyDown =  rightKeyDown || padMap.right;
        rotateKeyDown =  rotateKeyDown || padMap.up;
        downKeyDown =  downKeyDown || padMap.down;
        dropKeyDown =  dropKeyDown || padMap.a;
        holdKeyDown =  holdKeyDown || padMap.x;
        
        if (leftKeyDown) {
            this.gameInfo.currentTetramino.move(ActionEnum.LEFT);
            any = true;
        }
        if (rightKeyDown) {
            this.gameInfo.currentTetramino.move(ActionEnum.RIGHT);
            any = true;
        }
        if (rotateKeyDown) {
            if (this.canRotate) {
                this.gameInfo.currentTetramino.move(ActionEnum.ROTATE);
                this.canRotate = false;
                any = true;
            }
        }
        if (downKeyDown) {
            this.gameInfo.currentTetramino.move(ActionEnum.SOFTDROP);
            any = true;
        }
        if (dropKeyDown) {
            if (this.canDrop) {
                this.gameInfo.currentTetramino.move(ActionEnum.HARDDROP);
                this.sound.add('dropSound', audioSettings.SFX.config).play();
                this.canDrop = false;
                any = true;
            }
        }
        if (holdKeyDown) {
            this.gameInfo.currentTetramino.move(ActionEnum.HOLD);
            any = true;
        }
        if (any) {
            this.drawGhost();
        }
        //#region Flipflops
        if (this.rotateKey.isUp) {
            this.canRotate = true;
        }
        if (this.dropKey.isUp) {
            this.canDrop = true;
        }
        //#endregion
    }
    handlePieceFalling() {
        this.frameCounter++;
        if (this.frameCounter >= this.gameInfo.getFramesPerGridCell()) {
            this.frameCounter = 0;
            this.gameInfo.currentTetramino.move(ActionEnum.SYSTEM_SOFTDROP);
        }
    }
    newTetramino(cannotHold) {
        this.gameInfo.currentTetramino = this.gen.drawOutNext();
        if (!(this.grid.tetraminoCanFit(this.gameInfo.currentTetramino, this.gameInfo.currentTetramino.row, this.gameInfo.currentTetramino.col))) {
            this.gameOver();
            return;
        }
        this.generateSprites();
        this.gameInfo.canHold = !cannotHold;
        this.generateNext();
    }
    generateCellSprite(row, col) {
        let texture = gameSettings.theme.name + "/" + this.gameInfo.currentTetramino.letter + ".png";
        let x = row * this.grid.getCellSize() + this.grid.getX();
        let y = col * this.grid.getCellSize() + this.grid.getY();
        let cellSize = this.grid.getCellSize();
        this.gameInfo.currentTetramino.sprites.push(
            this.add.tileSprite(x, y, 0, 0, 'blocks', texture)
                .setDisplaySize(cellSize, cellSize)
                .setOrigin(0.5, 0.5));
    }
    generateSprites() {
        for (let i = 0; i < this.gameInfo.currentTetramino.matrix.length; i++) {
            const element = this.gameInfo.currentTetramino.matrix[i];
            for (let j = 0; j < element.length; j++) {
                const cell = element[j];
                if (cell) {
                    this.generateCellSprite(
                        this.gameInfo.currentTetramino.col + j,
                        this.gameInfo.currentTetramino.row + i
                    );
                }
            }
        }
    }
    generateNext() {
        this.nextTetramini.forEach((t) => {
            t.destroy();
        })
        this.nextTetramini = [];
        let nexts = this.gen.previewNext();
        let cellSize = 70 / 4;
        const START_NEXT_CONTAINER = 500 + (125 / 2) - (cellSize);
        let x = START_NEXT_CONTAINER;
        let y = this.grid.getX() + (cellSize * 2) - 10;
        nexts.forEach((t) => {
            for (let i = 0; i < t.matrix.length; i++) {
                for (let j = 0; j < t.matrix[i].length; j++) {
                    if (t.matrix[i][j]) {
                        let texture = gameSettings.theme.name + "/" + t.letter + ".png";
                        this.nextTetramini.push(
                            this.add.tileSprite(x, y, 0, 0, 'blocks', texture)
                                .setDisplaySize(cellSize, cellSize)
                                .setOrigin(0.5, 0.5)
                                .setDepth(1)
                        );
                    }
                    x += cellSize;
                }
                y += cellSize;
                x = START_NEXT_CONTAINER;
            }
            y -= (cellSize * t.matrix.length);
            x = START_NEXT_CONTAINER;
            y += 100;
        });
    }
    redrawSprites() {//called when piece is rotated
        this.gameInfo.currentTetramino.destroySprites();
        this.generateSprites();
    }
    hold() {
        if (this.gameInfo.canHold) {
            this.gameInfo.canHold = false;
        } else {
            return;
        }
        this.gameInfo.currentTetramino.reset();
        if (this.gameInfo.heldTetramino) {
            let tmp = this.gameInfo.currentTetramino;
            this.gameInfo.currentTetramino = this.gameInfo.heldTetramino;
            this.gameInfo.heldTetramino = tmp;
            this.generateSprites();
        } else {
            this.gameInfo.heldTetramino = this.gameInfo.currentTetramino;
            this.newTetramino(true);
        }
        this.writeHold();
    }
    writeHold() {
        this.heldSprites.forEach((t) => {
            t.destroy();
        })
        this.heldSprites = [];
        let cellSize = 70 / 4;
        const START_NEXT_CONTAINER = 500 + (125 / 2) - (cellSize);
        let x = START_NEXT_CONTAINER;
        let y = this.grid.getX() + (cellSize * 2) + 400;
        let held = this.gameInfo.heldTetramino;
        for (let i = 0; i < held.matrix.length; i++) {
            for (let j = 0; j < held.matrix[i].length; j++) {
                if (held.matrix[i][j]) {
                    let texture = gameSettings.theme.name + "/" + held.letter + ".png";
                    this.heldSprites.push(
                        this.add.tileSprite(x, y, 0, 0, 'blocks', texture)
                            .setDisplaySize(cellSize, cellSize)
                            .setOrigin(0.5, 0.5)
                            .setDepth(1)
                    );
                }
                x += cellSize;
            }
            y += cellSize;
            x = START_NEXT_CONTAINER;
        }

    }
    updateScoring() {
        this.pointsText.text = this.gameInfo.points;
        this.levelText.text = this.gameInfo.level;
        this.linesText.text = this.gameInfo.linesCleared;
    }
    gameOver() {
        clearInterval(this.interval);
        this.scene.start("ScoreScene", this.gameInfo);
    }
}