/**
 * Class used to generate Tetraminos during the game.
 */
class TetraminoGenerator {
    constructor(grid) {
        this.PREVIEW_COUNT = 3;
        this.grid = grid;
        this.unshuffledBag = [
            ShapeModel.L, ShapeModel.L,
            ShapeModel.J, ShapeModel.J,
            ShapeModel.I, ShapeModel.I,
            ShapeModel.T, ShapeModel.T,
            ShapeModel.Z, ShapeModel.Z,
            ShapeModel.S, ShapeModel.S,
            ShapeModel.O, ShapeModel.O
        ];
        /** @private */
        this.bag = [];
        this.fillBag();
    }
    /** @private */
    fillBag() {
        this.bag.push(...JSON.parse(JSON.stringify(shuffle(this.unshuffledBag))));
    }
    /**
     * Draws out of the bag a tetramino.
     * @returns {Tetramino} - The next tetramino.
     */
    drawOutNext() {
        if (this.bag.length <= this.PREVIEW_COUNT) {
            this.fillBag();
        }
        let model = this.bag.pop();
        let letter = "NOLETTER";
        Object.keys(ShapeModel).forEach(e => {
            if (ShapeModel[e] == model) {
                letter = e;
            }
        });
        return new Tetramino(this.grid, model, letter);
    }
    /**
     * Previews the next tetraminos in the bag without drawing them out.
     */
    previewNext(count = this.PREVIEW_COUNT) {
        let returns = [];
        for (let i = 0; i < count; i++) {
            const element = this.bag[this.bag.length - (i + 1)];
            let letter = "NOLETTER";
            Object.keys(ShapeModel).forEach(e => {
                if (ShapeModel[e] == element) {
                    letter = e;
                }
            });
            returns.push(new Tetramino(this.grid, element, letter));
        }
        return returns;
    }
    /**
     * @param {ShapeModel.*} model - The model of the tetramino.
     * @returns {Boolean[][]} - Array of NxN size of the Tetramino, if not valid returns null.
     */
    static getMatrix(model) {
        switch (model) {
            case ShapeModel.L:
                return [
                    [false, true, false],
                    [false, true, false],
                    [false, true, true]
                ];
            case ShapeModel.J:
                return [
                    [false, true, false],
                    [false, true, false],
                    [true, true, false]
                ];
            case ShapeModel.I:
                return [
                    [false, false, false, false],
                    [true, true, true, true],
                    [false, false, false, false],
                    [false, false, false, false]
                ];
            case ShapeModel.T:
                return [
                    [false, true, false],
                    [true, true, true],
                    [false, false, false]
                ];
            case ShapeModel.Z:
                return [
                    [true, true, false],
                    [false, true, true],
                    [false, false, false]
                ];
            case ShapeModel.S:
                return [
                    [false, true, true],
                    [true, true, false],
                    [false, false, false]
                ];
            case ShapeModel.O:
                return [
                    [true, true],
                    [true, true]
                ];
            default:
                throw new Error("Model " + model + " is not a shape model");
        }
    }
}
/**
 * From https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
 * @param {[]} array - The array to shuffle 
 * @returns - The shuffled array
 */
function shuffle(array) {
    let currentIndex = array.length, randomIndex;
    // While there remain elements to shuffle.
    while (currentIndex != 0) {
        // Pick a remaining element.
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
    return array;
}