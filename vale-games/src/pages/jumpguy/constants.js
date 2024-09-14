export const CANVAS = {
    width: 600,
    height: 800
}

export const GUY = {
    x: CANVAS.width/2,
    y: CANVAS.height - (CANVAS.height / 5),
    width: 20,
    height: 20,
    jumpSpeed: -5.5
}

export const DIRECTIONS = {
    left: 0,
    right: 1
}

export const PLATFORM = {
    width: 60,
    height: 10
}

export const PLATFORM_TYPE = {
    STATIC: 0,
    BOUNCY: 1,
    SLIDING: 2,
    DESTROY: 3,
    FALSE: 4
}

export const PLATFORM_ROLES = [ {type: PLATFORM_TYPE.STATIC, roll: 80},
                                {type: PLATFORM_TYPE.SLIDING, roll: 92},
                                {type: PLATFORM_TYPE.BOUNCY, roll: 94},
                                {type: PLATFORM_TYPE.DESTROY, roll: 98},
                                {type: PLATFORM_TYPE.FALSE, roll: 101}
                            ]