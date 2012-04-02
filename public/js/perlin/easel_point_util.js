
Point.prototype.move_to = function (n) {
    n.x = this.x;
    n.y = this.y;
}

Point.prototype.distance_to = function (p) {
    if (!p instanceof Point){
        console.log('non point', p);
        throw new Error('Attempt to calc distance_to non-point');
    }
    var dx = this.x - p.x;
    var dy = this.y - p.y;

    return Math.sqrt(dx * dx + dy * dy);
}

Point.prototype.distance_to_xy = function (x, y) {
    var dx = this.x - x;
    var dy = this.y - y;

    return Math.sqrt(dx * dx + dy * dy);
}