export const CANVAS = {
    width: 600,
    height: 800
}

export const GUY = {
    x: CANVAS.width/2,
    y: CANVAS.height - (CANVAS.height / 5),
    width: CANVAS.width / 15,
    height: CANVAS.height / 15,
    jumpSpeed: -5.5
}

// x,y,height (no width it's custom)
export const GUY_JUMPING_FRAMES = [
    [138, 320, 64],
    [202, 320, 64],
    [267, 320, 64],
    [331, 320, 64],
    [395, 320, 64],
    [459, 320, 64],
]

export const GUY_FALLING_FRAMES = [
    [395, 320, 64],
    [459, 320, 64],
]

export const CLOUD_FRAMES = [
    [0,0,200,200],
    [200,0,200,200],
    [400,0,200,200],
    [600,0,200,200],
    [800,0,200,200],
    [1000,0,200,200]
]

export const DIRECTIONS = {
    left: 0,
    right: 1
}

export const PLATFORM = {
    width: CANVAS.width / 10,
    height: CANVAS.width / 60
}

export const PLATFORM_TYPE = {
    STATIC: 0,
    BOUNCY: 1,
    SLIDING: 2,
    DESTROY: 3,
    FALSE: 4
}

export const PLATFORM_ROLES = [ {type: PLATFORM_TYPE.STATIC, roll: 75},
                                {type: PLATFORM_TYPE.SLIDING, roll: 88},
                                {type: PLATFORM_TYPE.BOUNCY, roll: 94},
                                {type: PLATFORM_TYPE.DESTROY, roll: 100}
                            ]