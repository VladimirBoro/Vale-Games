export class LaneObject {
    constructor(speed, direction, position, size, destroy) {
        this.speed = speed * direction;
        this.position = position;
        this.size = size;
        this.destroy = destroy;
    }

    getPosition() {
        const coords = this.position;
        return coords;
    }

    getSpeed() {
        return this.speed;
    }

    getSize() {
        return this.size;
    }

    setPosition(position) {
        this.position = position;
    }

    update() {
        this.position.x += this.speed;
    }

    drawHitbox(context, position, size) {
        context.strokeStyle = "white";
        context.lineWidth = 2;
        context.strokeRect(position.x, position.y, size.width, size.height);
    }
}