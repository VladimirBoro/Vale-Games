
export class LaneObject {
    constructor(speed, position, size) {
        this.speed = speed;
        this.position = position;
        this.size = size;
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

    drawHitbox(context, position, size) {
        context.strokeStyle = "white";
        context.lineWidth = 2;
        context.strokeRect(position.x, position.y, size.width, size.height);
    }
}