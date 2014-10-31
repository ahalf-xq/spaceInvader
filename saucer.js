var saucer = function(gameCallback) {
    var dx = (Math.floow(Math.random() * 2) * 2) - 1,
        x = 0,
        that, remove, hit,
        collider;
    dx *= 1.25;
    if (dx < 0) {
        x = SCREEN_WIDTH - 32;
    }
    that = DHTMLSprite(SYS_spriteParams);
    that.changeImage(20);
    remove = function() {
        that.destroy();
        collider.remove();
        that.removed = true;
    };
    hit = function() {
        remove();
        gameCallback({
            message: 'saucerHit',
            x: x,
            y: 32
        });
    };
    collider = SYS_collisionManager.newCollider(SAUCER, 0 ,32, 14, hit);
    that.rmove = function() {
        that.draw(x, 32);
        collider.update(x, 32);
        x += dx;
        if (x < 0 || x > SCREEN_WIDTH - 32) {
            remove();
        }
    };
    SYS_process.add(that);
};