/**
 * Class representing a tetramino.
 * Handles both logical and sprite values.
 */
class Tetramino {
    /**
     * @param {Grid} grid 
     * @param {Model.*} model 
     * @param {String} letter 
     */
    constructor(grid, model, letter) {
        this.model = model;
        this.matrix = [];
        this.grid = grid;
        this.row = 0;// - this.getDownmostCellY();
        this.col = Phatris.GRID_COLS / 2 - 1;
        this.letter = letter;
        this.sprites = [];
        this.fillMatrix(model);
    }
    /**
     * @private
     * @param {ShapeModel.*} model - The model of the tetramino.
     */
    fillMatrix(model) {
        this.matrix = TetraminoGenerator.getMatrix(model);
    }
    /**
     * Performs an action on the tetramino.
     * @param {ActionEnum.*} action - The action to perform.
     */
    move(action) {
        switch (action) {
            case ActionEnum.LEFT:
                if (this.grid.tetraminoCanFit(this, this.row, this.col - 1)) {
                    this.col--;
                    this.updateSprites(0, -1);
                }
                break;
            case ActionEnum.RIGHT:
                if (this.grid.tetraminoCanFit(this, this.row, this.col + 1)) {
                    this.col++;
                    this.updateSprites(0, 1);
                }
                break;
            case ActionEnum.ROTATE:
                this.matrix = rotate(this.matrix);
                if (this.grid.tetraminoCanFit(this, this.row, this.col)) {
                    this.grid.scene.redrawSprites();
                } else {
                    //reset the rotation as it was before the call, because it cannot rotate
                    this.matrix = rotate(this.matrix);
                    this.matrix = rotate(this.matrix);
                    this.matrix = rotate(this.matrix);
                    console.log("Unable to rotate the tetramino");
                }
                break;
            case ActionEnum.HARDDROP:
                let counter = 0;
                while (this.grid.tetraminoCanFit(this, this.row + 1, this.col)) {
                    this.row++;
                    counter++;
                }
                this.updateSprites(counter, 0);
                this.grid.scene.gameInfo.addPoints(2 * counter);
                this.place();
                break;
            case ActionEnum.SOFTDROP:
                if (this.grid.tetraminoCanFit(this, this.row + 1, this.col)) {
                    this.row++;
                    this.updateSprites(1, 0);
                    this.grid.scene.gameInfo.addPoints(1);
                    this.grid.scene.updateScoring();
                } else {
                    this.place();
                }
                break;
            case ActionEnum.SYSTEM_SOFTDROP:
                if (this.grid.tetraminoCanFit(this, this.row + 1, this.col)) {
                    this.row++;
                    this.updateSprites(1, 0);
                } else {
                    this.place();
                }
                break;
            case ActionEnum.HOLD:
                this.grid.scene.hold();
                break;
            default:
                throw new Error("Unperformable action: " + action);
        }
    }
    place() {
        this.grid.insertTetramino(this);
        this.grid.detectAndClearRows();
        this.grid.scene.newTetramino();
    }
    reset() {
        this.destroySprites();
        this.row = 0;
        this.col = Phatris.GRID_COLS / 2 - 1;
    }
    destroySprites() {
        for (const sprite of this.sprites) {
            sprite.destroy();
            this.sprites = [];
        }
    }
    spriteAt(row, col) {
        let counter = 0;
        for (let i = 0; i < this.matrix.length; i++) {
            for (let j = 0; j < this.matrix[i].length; j++) {
                const cell = this.matrix[i][j];
                if (i == row && col == j) {
                    return this.sprites[counter];
                }
                if (cell) {
                    counter++;
                }
            }
        }
    }
    /**
     * @param {Number} rowChange
     * @param {Number} colChange
     */
    updateSprites(rowChange, colChange) {
        for (const sprite of this.sprites) {
            sprite.x += this.grid.getCellSize() * colChange;
            sprite.y += this.grid.getCellSize() * rowChange;
        }
    }
    getUpmostCellY() {
        for (let i = 0; i < this.matrix.length; i++) {
            if (this.matrix[i].some((value) => value)) {
                let row = this.row ? this.row : 0;
                return row + i;
            }
        }
    }
    getDownmostCellY() {
        for (let i = this.matrix.length - 1; i >= 0; i--) {
            if (this.matrix[i].some((value) => value)) {
                let row = this.row ? this.row : 0;
                return row + i;
            }
        }
    }
}
/**
 * rotate a matrix 90 degrees clockwise
 * @param {[][]} matrix - The NxN matrix to rotate
 * @returns - The rotated matrix
 * @see https://codereview.stackexchange.com/a/186834
 */
function rotate(matrix) {
    const N = matrix.length - 1;
    const result = matrix.map((row, i) =>
        row.map((val, j) => matrix[N - j][i])
    );
    return result;
}