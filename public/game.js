//#region Config
/**
 * Phaser config variable.
 */
const config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 640,
        height: 820,
        backgroundColor: '#4488aa'
    },
    dom: {
        createContainer: true
    },
    input: {
        gamepad: true
    },
    pixelArt: true,//here
    //antialias: false,
    scene: [BootGameScene, MenuScene, InfoScene, SettingsScene, ScoreboardScene, GameScene, ScoreScene, PauseScene]
};
/**
 * Global variable for scores.
 */
var scores = [];
/**
 * Contains settings and functions regarding the audio.
 */
const audioSettings = {
    menuMusic: {
        name: "menuMusic",
        path: 'Assets/Audio/menuMusic.mp3',
        phaserObject: undefined,
        config: {
            loop: true,
            volume: 1, /** @private */
            volumeBefore: 1 /** @private */
        },
        toggleVolume: () => {
            if (audioSettings.menuMusic.config.volume <= 0) {//unmute
                audioSettings.menuMusic.config.volume = audioSettings.menuMusic.config.volumeBefore;
            } else {//mute
                audioSettings.menuMusic.config.volumeBefore = audioSettings.menuMusic.config.volume;
                audioSettings.menuMusic.config.volume = 0;
            }
            if (audioSettings.menuMusic.phaserObject) {
                audioSettings.menuMusic.phaserObject.setVolume(audioSettings.menuMusic.config.volume);
            }
        },
        setVolume: (value) => {
            audioSettings.menuMusic.config.volume = Math.max(0, Math.min(1, Math.floor(value * 100) / 100));
            if (audioSettings.menuMusic.phaserObject) {
                audioSettings.menuMusic.phaserObject.setVolume(audioSettings.menuMusic.config.volume);
            }
        },
        getVolume: () => {
            return audioSettings.menuMusic.config.volume;
        }
    },
    gameMusic: {
        index: 1, /** @private */
        phaserObject: undefined,
        config: {
            loop: true,
            volume: 1, /** @private */
            volumeBefore: 1 /** @private */
        },
        toggleVolume: () => {
            if (audioSettings.gameMusic.config.volume <= 0) {//unmute
                audioSettings.gameMusic.config.volume = audioSettings.gameMusic.config.volumeBefore;
            } else {//mute
                audioSettings.gameMusic.config.volumeBefore = audioSettings.gameMusic.config.volume;
                audioSettings.gameMusic.config.volume = 0;
            }
            if (audioSettings.gameMusic.phaserObject) {
                audioSettings.gameMusic.phaserObject.setVolume(audioSettings.gameMusic.config.volume);
            }
        },
        setVolume: (value) => {
            audioSettings.gameMusic.config.volume = Math.max(0, Math.min(1, Math.floor(value * 100) / 100));
            if (audioSettings.gameMusic.phaserObject) {
                audioSettings.gameMusic.phaserObject.setVolume(audioSettings.gameMusic.config.volume);
            } else if (audioSettings.previewPhaserObject) {
                audioSettings.previewPhaserObject.setVolume(audioSettings.gameMusic.config.volume);
            }
        },
        getVolume: () => {
            return audioSettings.gameMusic.config.volume;
        },
        setSongIndex: (index) => {
            if (Phatris.SONGS[index]) {
                audioSettings.gameMusic.index = index;
            }
        },
        getSongIndex: () => {
            return audioSettings.gameMusic.index;
        }
    },
    SFX: {
        config: {
            loop: false,
            volume: 1, /** @private */
            volumeBefore: 1 /** @private */
        },
        toggleVolume: () => {
            if (audioSettings.SFX.config.volume <= 0) {//unmute
                audioSettings.SFX.config.volume = audioSettings.SFX.config.volumeBefore;
            } else {//mute
                audioSettings.SFX.config.volumeBefore = audioSettings.SFX.config.volume;
                audioSettings.SFX.config.volume = 0;
            }
        },
        setVolume: (value) => {
            audioSettings.SFX.config.volume = Math.max(0, Math.min(1, Math.floor(value * 100) / 100));
        },
        getVolume: () => {
            return audioSettings.SFX.config.volume;
        }
    },
    previewPhaserObject: undefined, /** @private */
    /**
     * @param {Phaser.Scene} loadedScene - The scene you are working on now (this).
     */
    menuToMenuRoutine: (loadedScene) => {
        if (audioSettings.previewPhaserObject) {
            audioSettings.previewPhaserObject.stop();
            audioSettings.previewPhaserObject = undefined;
        }
        if (audioSettings.gameMusic.phaserObject) {
            audioSettings.gameMusic.phaserObject.stop();
        }
        if (audioSettings.menuMusic.phaserObject) {
            if (audioSettings.menuMusic.phaserObject.isPlaying) {
                return;
            }
        }
        audioSettings.menuMusic.phaserObject = loadedScene.sound.add(audioSettings.menuMusic.name, audioSettings.menuMusic.config);
        audioSettings.menuMusic.phaserObject.play();
    },
    /**
     * @param {Phaser.Scene} loadedScene - The game scene (this inside GameScene.js).
     */
    menuToGameRoutine: (loadedScene) => {
        if (audioSettings.menuMusic.phaserObject) {
            audioSettings.menuMusic.phaserObject.stop();
        }
        if (audioSettings.previewPhaserObject) {
            audioSettings.previewPhaserObject.stop();
            audioSettings.previewPhaserObject = undefined;
        }
        audioSettings.gameMusic.phaserObject = loadedScene.sound.add(Phatris.SONGS[audioSettings.gameMusic.index].name, audioSettings.gameMusic.config);
        audioSettings.gameMusic.phaserObject.play();
    },
    /**
     * @param {Number} songIndex - Index of the song (referencing Phatris.SONGS).
     * @param {Phaser.Scene} loadedScene - The scene you are working on now (this).
     */
    settingsPreviewRoutine: (songIndex, loadedScene) => {
        if (audioSettings.menuMusic.phaserObject) {
            audioSettings.menuMusic.phaserObject.stop();
        }
        if (audioSettings.previewPhaserObject) {
            audioSettings.previewPhaserObject.stop();
        }
        if (Phatris.SONGS[songIndex]) {
            audioSettings.gameMusic.setSongIndex(songIndex);
            audioSettings.previewPhaserObject = loadedScene.sound.add(Phatris.SONGS[songIndex].name, audioSettings.gameMusic.config);
            audioSettings.previewPhaserObject.play();
        }
    }
}
/**
 * Constants for colors in the game.
 */
const colors = {
    white: Phaser.Display.Color.ValueToColor("#ffffff"),
    black: Phaser.Display.Color.ValueToColor("#0d1117"),
    tBlack: Phaser.Display.Color.ValueToColor("rgba(13,17,23,0.5)"),
    blue: Phaser.Display.Color.ValueToColor("#5474bc"),
}
/**
 * Additional game settings, not related directly with the Phaser game object.
 */
const gameSettings = {
    defaultUsername: "",
    modes: {
        NORMAL: 0,
        TIME: 1,
        TIMELIMIT: 3 * 60 * 1000,
        STARTING_LEVEL: 10,
        selected: 0
    },
    theme: {},
    minMargin: 100,
    COLOR_BG: '#0d1117',//used for background
    COLOR_PRIMARY: '#5474bc',//used for button bgs, slider color
    COLOR_SECONDARY: '#ffffff',//used for button text, slider thumb
    scores: [],
    changeTheme: (index) => {
        if (Phatris.THEMES[index]) {
            gameSettings.theme = Phatris.THEMES[index];
            audioSettings.gameMusic.setSongIndex(index);
        }
    }
};
/**
 * Object containing the manual handling of the gamepad (thanks Phaser for having bad support).
 */
const padHandler = {
    pad: undefined,
    leftFF: false,
    rightFF: false,
    upFF: false,
    downFF: false,
    xFF: false,
    aFF: false,
    bFF: false,
    yFF: false,
    getPresses: (pad) => {
        this.pad = pad;
        let map = {
            left: false,
            right: false,
            up: false,
            down: false,
            x: false,
            a: false,
            b: false,
            y: false
        };
        if (pad) {
            if (pad.left && !padHandler.leftFF) {
                map.left = true;
                padHandler.leftFF = true;
            } else if (!pad.left) {//has been released
                padHandler.leftFF = false;
            }


            if (pad.right && !padHandler.rightFF) {
                map.right = true;
                padHandler.rightFF = true;
            } else if (!pad.right) {//has been released
                padHandler.rightFF = false;
            }


            if (pad.up && !padHandler.upFF) {
                map.up = true;
                padHandler.upFF = true;
            } else if (!pad.up) {//has been released
                padHandler.upFF = false;
            }


            if (pad.down && !padHandler.downFF) {
                map.down = true;
                padHandler.downFF = true;
            } else if (!pad.downFF) {//has been released
                padHandler.downFF = false;
            }


            if (pad.X && !padHandler.xFF) {
                map.x = true;
                padHandler.xFF = true;
            } else if (!pad.X) {//has been released
                padHandler.xFF = false;
            }


            if (pad.Y && !padHandler.yFF) {
                map.y = true;
                padHandler.yFF = true;
            } else if (!pad.Y) {//has been released
                padHandler.yFF = false;
            }


            if (pad.A && !padHandler.aFF) {
                map.a = true;
                padHandler.aFF = true;
            } else if (!pad.A) {//has been released
                padHandler.aFF = false;
            }


            if (pad.B && !padHandler.bFF) {
                map.b = true;
                padHandler.bFF = true;
            } else if (!pad.B) {//has been released
                padHandler.bFF = false;
            }
        }
        return map;
    }
}
/**
 * Object containing the default keyBindings for keyboard interactions.
 */
const keyBindings = {
    leftKey: 37,
    rightKey: 39,
    rotateKey: 38,
    downKey: 40,
    dropKey: 32,
    holdKey: 67,
    pauseKey: 27
};
/**
 * Map containing name of key at the index of its char value.
 * @see https://stackoverflow.com/questions/1772179/get-character-value-from-keycode-in-javascript-then-trim
 */
const keyboardMap = [
    "", // [0]
    "", // [1]
    "", // [2]
    "CANCEL", // [3]
    "", // [4]
    "", // [5]
    "HELP", // [6]
    "", // [7]
    "BACK_SPACE", // [8]
    "TAB", // [9]
    "", // [10]
    "", // [11]
    "CLEAR", // [12]
    "ENTER", // [13]
    "ENTER_SPECIAL", // [14]
    "", // [15]
    "SHIFT", // [16]
    "CONTROL", // [17]
    "ALT", // [18]
    "PAUSE", // [19]
    "CAPS_LOCK", // [20]
    "KANA", // [21]
    "EISU", // [22]
    "JUNJA", // [23]
    "FINAL", // [24]
    "HANJA", // [25]
    "", // [26]
    "ESCAPE", // [27]
    "CONVERT", // [28]
    "NONCONVERT", // [29]
    "ACCEPT", // [30]
    "MODECHANGE", // [31]
    "SPACE", // [32]
    "PAGE_UP", // [33]
    "PAGE_DOWN", // [34]
    "END", // [35]
    "HOME", // [36]
    "LEFT", // [37]
    "UP", // [38]
    "RIGHT", // [39]
    "DOWN", // [40]
    "SELECT", // [41]
    "PRINT", // [42]
    "EXECUTE", // [43]
    "PRINTSCREEN", // [44]
    "INSERT", // [45]
    "DELETE", // [46]
    "", // [47]
    "0", // [48]
    "1", // [49]
    "2", // [50]
    "3", // [51]
    "4", // [52]
    "5", // [53]
    "6", // [54]
    "7", // [55]
    "8", // [56]
    "9", // [57]
    "COLON", // [58]
    "SEMICOLON", // [59]
    "LESS_THAN", // [60]
    "EQUALS", // [61]
    "GREATER_THAN", // [62]
    "QUESTION_MARK", // [63]
    "AT", // [64]
    "A", // [65]
    "B", // [66]
    "C", // [67]
    "D", // [68]
    "E", // [69]
    "F", // [70]
    "G", // [71]
    "H", // [72]
    "I", // [73]
    "J", // [74]
    "K", // [75]
    "L", // [76]
    "M", // [77]
    "N", // [78]
    "O", // [79]
    "P", // [80]
    "Q", // [81]
    "R", // [82]
    "S", // [83]
    "T", // [84]
    "U", // [85]
    "V", // [86]
    "W", // [87]
    "X", // [88]
    "Y", // [89]
    "Z", // [90]
    "OS_KEY", // [91] Windows Key (Windows) or Command Key (Mac)
    "", // [92]
    "CONTEXT_MENU", // [93]
    "", // [94]
    "SLEEP", // [95]
    "NUMPAD0", // [96]
    "NUMPAD1", // [97]
    "NUMPAD2", // [98]
    "NUMPAD3", // [99]
    "NUMPAD4", // [100]
    "NUMPAD5", // [101]
    "NUMPAD6", // [102]
    "NUMPAD7", // [103]
    "NUMPAD8", // [104]
    "NUMPAD9", // [105]
    "MULTIPLY", // [106]
    "ADD", // [107]
    "SEPARATOR", // [108]
    "SUBTRACT", // [109]
    "DECIMAL", // [110]
    "DIVIDE", // [111]
    "F1", // [112]
    "F2", // [113]
    "F3", // [114]
    "F4", // [115]
    "F5", // [116]
    "F6", // [117]
    "F7", // [118]
    "F8", // [119]
    "F9", // [120]
    "F10", // [121]
    "F11", // [122]
    "F12", // [123]
    "F13", // [124]
    "F14", // [125]
    "F15", // [126]
    "F16", // [127]
    "F17", // [128]
    "F18", // [129]
    "F19", // [130]
    "F20", // [131]
    "F21", // [132]
    "F22", // [133]
    "F23", // [134]
    "F24", // [135]
    "", // [136]
    "", // [137]
    "", // [138]
    "", // [139]
    "", // [140]
    "", // [141]
    "", // [142]
    "", // [143]
    "NUM_LOCK", // [144]
    "SCROLL_LOCK", // [145]
    "WIN_OEM_FJ_JISHO", // [146]
    "WIN_OEM_FJ_MASSHOU", // [147]
    "WIN_OEM_FJ_TOUROKU", // [148]
    "WIN_OEM_FJ_LOYA", // [149]
    "WIN_OEM_FJ_ROYA", // [150]
    "", // [151]
    "", // [152]
    "", // [153]
    "", // [154]
    "", // [155]
    "", // [156]
    "", // [157]
    "", // [158]
    "", // [159]
    "CIRCUMFLEX", // [160]
    "EXCLAMATION", // [161]
    "DOUBLE_QUOTE", // [162]
    "HASH", // [163]
    "DOLLAR", // [164]
    "PERCENT", // [165]
    "AMPERSAND", // [166]
    "UNDERSCORE", // [167]
    "OPEN_PAREN", // [168]
    "CLOSE_PAREN", // [169]
    "ASTERISK", // [170]
    "PLUS", // [171]
    "PIPE", // [172]
    "HYPHEN_MINUS", // [173]
    "OPEN_CURLY_BRACKET", // [174]
    "CLOSE_CURLY_BRACKET", // [175]
    "TILDE", // [176]
    "", // [177]
    "", // [178]
    "", // [179]
    "", // [180]
    "VOLUME_MUTE", // [181]
    "VOLUME_DOWN", // [182]
    "VOLUME_UP", // [183]
    "", // [184]
    "", // [185]
    "SEMICOLON", // [186]
    "EQUALS", // [187]
    "COMMA", // [188]
    "MINUS", // [189]
    "PERIOD", // [190]
    "SLASH", // [191]
    "BACK_QUOTE"
];

window.onload = function () {
    document.body.style.backgroundColor = colors.black._rgba;
    Phatris.THEMES.push(new Theme("Light"));
    Phatris.THEMES.push(new Theme("Colorful"));
    Phatris.THEMES.push(new Theme("Dark"));
    Phatris.SONGS.push({
        name: "Light",
        path: "Assets/Audio/Light.mp3"
    });
    Phatris.SONGS.push({
        name: "Colorful",
        path: "Assets/Audio/Colorful.mp3"
    });
    Phatris.SONGS.push({
        name: "Dark",
        path: "Assets/Audio/Dark.mp3"
    });
    gameSettings.changeTheme(1);
    var game = new Phaser.Game(config);
}
//#endregion