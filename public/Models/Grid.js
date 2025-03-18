/**
 * Class that represents the game grid in the scene.
 * This class handles both boolean and sprite matrixes.
 */
class Grid {
    constructor(scene, minMargin) {
        /**
         * Cell access -> matrix[row][col]
         */
        this.matrix = [];
        for (let i = 0; i < Phatris.GRID_ROWS; i++) {
            let row = [];
            for (let j = 0; j < Phatris.GRID_COLS; j++) {
                row.push(false);
            }
            this.matrix.push(row);
        }
        this.spriteMatrix = [];
        for (let i = 0; i < Phatris.GRID_ROWS; i++) {
            let row = [];
            for (let j = 0; j < Phatris.GRID_COLS; j++) {
                row.push(null);
            }
            this.spriteMatrix.push(row);
        }
        this.scene = scene;
        this.minMargin = minMargin;
    }
    /**
     * @returns {Number} - Width of the playable area.
     */
    getWidth() {
        return this.getCellSize() * Phatris.GRID_COLS;
    }

    /**
     * @returns {Number} - Height of the playable area.
     */
    getHeight() {
        return this.getCellSize() * Phatris.GRID_ROWS;
    }

    /**
     * @returns {Number} - Leftmost pixel of the playable area.
     */
    getX() {
        return (this.scene.sys.game.canvas.width - this.getWidth()) / 2;
    }

    /**
     * @returns {Number} - Topmost of the playable area.
     */
    getY() {
        return (this.scene.sys.game.canvas.height - this.getHeight()) / 2;
    }


    /**
     * @returns {Number} - Size of a cell in pixel.
     */
    getCellSize() {
        return Math.floor(Math.min(
            (this.scene.sys.game.canvas.width - 2 * this.minMargin) / Phatris.GRID_COLS,
            (this.scene.sys.game.canvas.height - 2 * this.minMargin) / Phatris.GRID_ROWS
        ));
    }

    /**
     * @param {Number} row - Row to check.
     * @param {Number} col - Column to check.
     * @returns {Boolean} - Whether the given cell is occupied.
     */
    isOccupied(row, col) {
        if (!this.inBounds(row, col)) {
            return false;
        }
        return this.matrix[row][col];//if occupied, true
    }
    /**
     * Returns whether or not the column given is valid
     */
    isValidColumn(col) {
        return col >= 0 && col < Phatris.GRID_COLS;
    }
    /**
     * Returns whether or not the row given is valid
     */
    isValidRow(row) {
        return row >= 0 && row < Phatris.GRID_ROWS;
    }
    /**
     * Returns whether or not the row and column given are valid
     */
    inBounds(row, col) {
        return this.isValidRow(row) && this.isValidColumn(col);
    }


    /**
     * This method does not use the values of row and column stored in the Tetramino object
     * @param {Tetramino} tetramino - The tetramino to check
     * @param {Number} row - The (top left cell) row in which the tetramino wants to be
     * @param {Number} col - The (top left cell) column in which the tetramino wants to be
     * @return Whether or not a tetramino is in bounds.
     */
    tetraminoInBounds(tetramino, row, col) {
        for (let i = 0; i < tetramino.matrix.length; i++) {
            for (let j = 0; j < tetramino.matrix[i].length; j++) {
                if (tetramino.matrix[i][j]) {
                    if (!(this.inBounds(row + i, col + j))) {
                        return false;
                    }
                }
            }
        }
        return true;
    }


    /**
     * @param {Tetramino} tetramino - Tetramino object that has to fit in
     * @param {Number} row - Top left corner row of the tetramino matrix where the tetramino wants to be
     * @param {Number} col - Top left corner column of the tetramino matrix where the tetramino wants to be
     * @returns Whether or not the tetramino can fit in the given place
     */
    tetraminoCanFit(tetramino, row, col) {
        if (!(this.tetraminoInBounds(tetramino, row, col))) {
            return false;
        }
        let currentTetramino = tetramino.matrix;
        for (let i = 0; i < currentTetramino.length; i++) {
            for (let j = 0; j < currentTetramino[i].length; j++) {
                if ((this.isOccupied(row + i, col + j)) && currentTetramino[i][j]) {//cell is occupied and tetramino wants to occupy it
                    return false;
                }
            }
        }
        return true;
    }


    /**
     * Insert in the game grid a cell.
     * @param {Number} row 
     * @param {Number} col 
     * @param {Phaser.GameObjects.Sprite} sprite 
     */
    insertCell(row, col, sprite) {
        if (!this.inBounds(row, col)) {
            return;
        }
        if (!this.isOccupied(row, col)) {
            this.matrix[row][col] = true;
            this.spriteMatrix[row][col] = sprite;
        }
    }


    /**
     * Insert in the game grid a tetramino.
     * @param {Tetramino} tetramino 
     */
    insertTetramino(tetramino) {
        let row = tetramino.row;
        let col = tetramino.col;
        if (this.triggersGameOver(tetramino) || !(this.tetraminoCanFit(tetramino, row, col))) {
            this.gameOver();
            return;
        }
        for (let i = row; i < row + tetramino.matrix.length; i++) {
            for (let j = col; j < col + tetramino.matrix[i - row].length; j++) {
                if (tetramino.matrix[i - row][j - col]) {
                    this.insertCell(i, j, tetramino.spriteAt(i - row, j - col));
                }
            }
        }
    }


    /**
     * Clears a row of its boolean and sprite values. Also shifts down upper rows both logically and spritewise.
     * @param {Number} row - The row that needs to be cleared.
     */
    clearRow(row) {
        if ((this.matrix[row]).some((value) => !value)) {
            return;
        }
        for (const sprite of this.spriteMatrix[row]) {
            sprite.destroy();
            //shift upper sprites y += this.getCellSize() (down)
            let rowArray = [];
            for (let j = 0; j < Phatris.GRID_COLS; j++) {
                rowArray.push(false);
            }
            this.matrix[row] = rowArray;
        }
        for (let i = 0; i < this.spriteMatrix.length; i++) {
            const spriteRow = this.spriteMatrix[i];
            if (i < row) {
                for (const sprite of spriteRow) {
                    if (sprite) {
                        sprite.y += this.getCellSize();
                    }
                }
            }
        }
        for (let i = row; i > 0; i--) {
            this.matrix[i] = this.matrix[i - 1];
            this.spriteMatrix[i] = this.spriteMatrix[i - 1];
        }
        let uppestRow = [];
        let uppestRowMatrix = [];
        for (let j = 0; j < Phatris.GRID_COLS; j++) {
            uppestRow.push(false);
            uppestRowMatrix.push(null);
        }
        this.matrix[0] = uppestRow;
        this.spriteMatrix[0] = uppestRowMatrix;

    }


    /**
     * Detects the full lines (they need to be cleared) and calls the clearRow function on them.
     * Also plays sounds of line clearing and registers to gameInfo the total lines cleared.
     */
    detectAndClearRows() {
        let clearedCounter = 0;
        for (let i = 0; i < this.matrix.length; i++) {
            if (this.matrix[i].some((value) => !value)) {
                continue;
            }
            this.clearRow(i);
            clearedCounter++;
        }
        if (clearedCounter == 4) {
            this.scene.sound.add('fullClearSound', audioSettings.SFX.config).play();
        } else if (clearedCounter > 0) {
            this.scene.sound.add('clearSound', audioSettings.SFX.config).play();
        }
        this.scene.gameInfo.registerLinesCleared(clearedCounter);
        this.scene.updateScoring();
    }


    /**
     * If the upmost cell of the tetramino would go over the top row, returns true, otherwise returns false.
     * @param {Tetramino} t
     */
    triggersGameOver(tetramino) {
        return tetramino.getUpmostCellY() < 0;
    }


    /**
     * This function calls the gameOver function of the gamescene.
     */
    gameOver() {
        this.scene.gameOver();
    }
}