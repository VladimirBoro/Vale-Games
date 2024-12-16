export const GRID_DIMENSIONS = {
    rowCount: 13,
    columnCount: 14
}

export const CANVAS_SIZE = {
    width: 770,
    height: 715
}

export const HOP_DISTANCE = {
    x: CANVAS_SIZE.width / GRID_DIMENSIONS.columnCount,
    y: CANVAS_SIZE.height / GRID_DIMENSIONS.rowCount
}

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
        0: [258, 15, 128, 20],
        1: [129, 48, 128, 20],
        2: [258, 81, 128, 20],
        3: [258, 81, 128, 20],
        4: [258, 81, 128, 20],
        5: [258, 81, 128, 20],
        6: [258, 81, 128, 20],
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
        speed: 3,
        width: 72,
        height: 27,
        batchSize: 3,
        batchInterval: 5500, 
        spawnInterval: 1500,
        direction: -1,
        type: "oldBlueLeft",
        initX: CANVAS_SIZE.width
    },
    2: {
        speed: 3.5,
        width: 72,
        height: 27,
        batchSize: 3,
        batchInterval: 7500,
        spawnInterval: 2500,
        direction: 1,
        type: "denimBlue",
        initX: -70
    },
    3: {
        speed: 4,
        width: 72,
        height: 27,
        batchSize: 3,
        batchInterval: 3000,
        spawnInterval: 850,
        direction: -1,
        type: "oldBlueLeft",
        initX: CANVAS_SIZE.width + 100
    },
    4: {
        speed: 5,
        width: 72,
        height: 27,
        batchSize: 2,
        batchInterval: 6500,
        spawnInterval: 3500,
        direction: 1,
        type: "pinkRight",
        initX: -70
    },
    5: {
        speed: 3,
        width: 72,
        height: 27,
        batchSize: 3,
        batchInterval: 5000,
        spawnInterval: 1250,
        direction: -1,
        type: "truck",
        initX: CANVAS_SIZE.width
    },
    7: { // TURTLE DOUBLE
        speed: 3,
        width: 110,
        height: 40,
        batchSize: 2,
        batchInterval: 4250,
        spawnInterval: 350,
        direction: -1,
        type: "turtle",
        initX: CANVAS_SIZE.width
    },
    8: { // small log
        speed: 2.5,
        width: 80,
        height: 32,
        batchSize: 3,
        batchInterval: 4000,
        spawnInterval: 1750,
        direction: 1,
        type: "smallLog",
        initX: -70
    },
    9: { // big log
        speed: 3,
        width: 150,
        height: 32,
        batchSize: 2,
        batchInterval: 5000,
        spawnInterval: 750,
        direction: 1,
        type: "largeLog",
        initX: -150
    },
    10: { // TURTLE SINGLE
        speed: 2,
        width: 110,
        height: 40,
        batchSize: 1,
        batchInterval: 4500,
        spawnInterval: 1250,
        direction: -1,
        type: "turtle",
        initX: CANVAS_SIZE.width
    },
    11: { // med log
        speed: 2.25,
        width: 100,
        height: 32,
        batchSize: 3,
        batchInterval: 5000,
        spawnInterval: 1500,
        direction: 1,
        type: "medLog",
        initX: -100
    },
}