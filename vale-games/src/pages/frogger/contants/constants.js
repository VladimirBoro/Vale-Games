export const CANVAS_SIZE = 770;
export const CANVAS_WIDTH = 770;
export const CANVAS_HEIGHT = 715;

export const HOP_DIRECTIONS = {
    LEFT: [65, 37], 
    UP: [87, 38],
    RIGHT: [68, 39],
    DOWN: [83, 40]
};

export const IDLE_ANIMATION = {
    0: [387, 0, 48, 32],
    1: [436, 0, 48, 32],
    2: [387, 33, 48, 32]
}

export const ANIMATIONS = {
    IDLE: {
        0: [387, 0, 48, 32],
        1: [436, 0, 48, 32],
        2: [387, 33, 48, 32]
    },
    HOP: {
        0: [51, 181, 50, 42],
        1: [51, 181, 50, 42],
        2: [51, 181, 50, 42],
        3: [51, 181, 50, 42]
    },
    DIE: {
        0: [258, 0, 128, 32],
        1: [258, 0, 128, 32],
        2: [129, 33, 128, 32],
        3: [258, 66, 128, 32],
    }
}

export const TURTLE_ANIMATIONS = {
    0: [19, 29, 123, 28],
    2: [19, 67, 123, 28],
    1: [19, 105, 123, 28],
    3: [19, 144, 123, 28]
}

export const CAR_COORDS = {
    pinkLeft:       {x:6, y:7, width:48, height:18},
    pinkRight:      {x:6, y:27, width:48, height:18},
    oldBlueLeft:    {x:1, y:83, width:48, height:18},
    oldBlueRight:   {x:2, y:104, width:48, height:18},
    denimBlue:      {x:3, y:65, width:48, height:18},
    truck:          {x:5, y:123, width:48, height:18}
}

export const LOG_COORDS = { 
    smallLog: {x:15, y:15, width:80, height:32},
    medLog:   {x:15, y:55, width:121, height:32},
    largeLog: {x:15, y:90, width:154, height:32}
}

export const frogRadius = 14;

export const LANES = {
    1: {
        speed: 0.6,
        width: 72,
        height: 27,
        batchSize: 3,
        batchInterval: 7000, 
        spawnInterval: 1800,
        direction: -1,
        type: "oldBlueLeft",
        initX: CANVAS_WIDTH
    },
    2: {
        speed: 0.88,
        width: 72,
        height: 27,
        batchSize: 3,
        batchInterval: 9000,
        spawnInterval: 3000,
        direction: 1,
        type: "denimBlue",
        initX: -70
    },
    3: {
        speed: 1.25,
        width: 72,
        height: 27,
        batchSize: 3,
        batchInterval: 3500,
        spawnInterval: 1000,
        direction: -1,
        type: "oldBlueLeft",
        initX: CANVAS_WIDTH + 100
    },
    4: {
        speed: 2,
        width: 72,
        height: 27,
        batchSize: 2,
        batchInterval: 7500,
        spawnInterval: 5500,
        direction: 1,
        type: "pinkRight",
        initX: -70
    },
    5: {
        speed: 0.9,
        width: 72,
        height: 27,
        batchSize: 3,
        batchInterval: 5000,
        spawnInterval: 1750,
        direction: -1,
        type: "truck",
        initX: CANVAS_WIDTH
    },
    //  SIDEWALK
    6: {},
    7: { // TURTLE DOUBLE
        speed: 1,
        width: 110,
        height: 40,
        batchSize: 2,
        batchInterval: 5000,
        spawnInterval: 550,
        direction: -1,
        type: "turtle",
        initX: CANVAS_WIDTH
    },
    8: { // small log
        speed: 0.8,
        width: 80,
        height: 32,
        batchSize: 3,
        batchInterval: 5000,
        spawnInterval: 2000,
        direction: 1,
        type: "smallLog",
        initX: -70
    },
    9: { // big log
        speed: 1,
        width: 150,
        height: 32,
        batchSize: 3,
        batchInterval: 5000,
        spawnInterval: 1750,
        direction: 1,
        type: "largeLog",
        initX: -150
    },
    10: { // TURTLE SINGLE
        speed: 0.6,
        width: 110,
        height: 40,
        batchSize: 1,
        batchInterval: 7500,
        spawnInterval: 2750,
        direction: -1,
        type: "turtle",
        initX: CANVAS_WIDTH
    },
    11: { // med log
        speed: 0.8,
        width: 100,
        height: 32,
        batchSize: 3,
        batchInterval: 5250,
        spawnInterval: 1650,
        direction: 1,
        type: "medLog",
        initX: -100
    },
    // GOAL
    12: {}
}