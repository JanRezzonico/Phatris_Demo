/**
 * Class containing informations about the game and handles levels, points, etc.
 */
class GameInfo {
    constructor(username, mode) {
        this.username = username;
        this.level = 0;
        this.linesCleared = 0;
        this.points = 0;
        this.currentTetramino = null;
        this.heldTetramino = null;
        this.canHold = false;
        this.mode = mode;
        this.startingLevel = 0;
        if (this.mode == gameSettings.modes.TIME) {
            this.startingLevel = gameSettings.modes.STARTING_LEVEL;
            this.level = gameSettings.modes.STARTING_LEVEL;
        }
        this.POINTS_FOR_LINES = [0, 40, 100, 300, 1200];//from https://tetris.fandom.com/wiki/Scoring
    }
    /**
     * @returns How many frames it takes for the tetramino to drop of 1 grid cell.
     */
    getFramesPerGridCell() {
        let multiplier = 2;
        let a = [48, 43, 38, 33, 28, 23, 18, 13, 8, 6, 5, 5, 5, 4, 4, 4, 3, 3, 3];
        if (this.level < a.length) {
            return a[this.level] * multiplier;
        }
        if (this.level >= 19 && this.level <= 28) {
            return 2 * multiplier;
        }
        return a[0];
    }
    /**
     * Registers the lines being cleared.
     * @param {Number} count - How many lines have been cleared.
     */
    registerLinesCleared(count) {
        count = Math.max(0, Math.min(4, parseInt(count)));
        this.linesCleared += count;
        this.points += (this.POINTS_FOR_LINES[count] * (this.level + 1));
        this.updateLevel();
    }
    /**
     * Adds points to the current points.
     * @param {Number} points - Points to add.
     */
    addPoints(points = 0) {
        points = Math.max(0, parseInt(points));
        this.points += points;
        this.updateLevel();
    }
    /**
     * Updates level to make sense with the lines cleared.
     */
    updateLevel() {
        this.level = this.startingLevel + parseInt(this.linesCleared / 10);
    }
}