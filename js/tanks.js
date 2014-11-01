var tank = function(gameCallback) {
    var x = SCREEN_WIDTH / 2 - 160,
        canFire = true,
        collider,
        waitFireRelease = true,
        that = DHTMLSprite(SYS_spriteParams);
    that.changeImage(6);
    that.draw(x, TANK_Y);
    that.move = function() {
        var dx = keys.left ? -2 : 0;
        dx = keys.right ? 2 : dx;
        x += dx * SYS_timeInfo.coeff;
        if (dx > 0 && x >= (SCREEN_WIDTH / 2) + 168) {
            x = (SCREEN_WIDTH / 2) + 168;
        }
        if (dx < 0 && x <= (SCREEN_WIDTH / 2) - 200) {
            x = (SCREEN_WIDTH / 2) - 200;
        }
        that.draw(x, TANK_Y);
        collider.update(x, TANK_Y);
        if (canFire) {
            if (keys.fire) {
                if (!waitFireRelease) {
                    laser(x, TANK_Y + 8, function() {
                        canFire = true;
                    });
                    canFire = false;
                    waitFireRelease = true;
                } else {
                    waitFireRelease = false;
                }
            }
        }
    };
    that.hit = function() {
        collider.remove();
        that.destroy();
        that.removed = true;
        animEffect(x, TANK_Y, [8], 250, null);
        gameCallback({
            message: 'playerKilled'
        });
    };
    collider = SYS_collisionManager.newCollider(PLAYER, ALIEN_BOMB, 30, 12, that.hit);
    SYS_process.add(that);
}, laser = function(x, y, callback) {
    var that = DHTMLSprite(SYS_spriteParams),
        collider;
    that.remove = function(collideeFlags) {
        if (collideeFlags && (TOP_OF_SCREEN + SHIELD + ALIEN_BOMB)) {
            animEffect(x, y, [18], 250, null);
        }
        that.destroy();
        collider.remove();
        that.removed = true;
        setTimeout(callback, 200);
    };
    collider = SYS_collisionManager.newCollider(LASER,
        ALIEN + ALIEN_BOMB + SHIELD + SAUCER, 2, 10, that.remove);
    that.changeImage(7);
    that.move = function() {
        y -= 7 * SYS_timeInfo.coeff;
        that.draw(x, y);
        collider.update(x, y);
        if (y <= -8) {
            that.remove(TOP_OF_SCREEN);
        }
    };
    SYS_process.add(that);
}, shield = function(x, y) {
    var shieldBrick = function(x, y, image) {
        var that = DHTMLSprite(SYS_spriteParams),
            collider,
            hit = function() {
                that.destroy();
                collider.remove();
            };
        collider = SYS_collisionManager.newCollider(SHIELD, 0, 4, 8, hit);
        that.removed = false;
        that.changeImage(image);
        that.draw(x, y);
        collider.update(x, y);
    }, brickLayout = [
        1, 2, 3, 3, 3, 3, 3, 3, 3, 3, 4, 5,
        3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3,
        3, 3, 3, 6, 7, 0, 0, 8, 9, 3, 3, 3,
        3, 3, 3, 0, 0, 0, 0, 0, 0, 3, 3, 3
    ], i;
    for (i = 0; i < brickLayout.length; i++) {
        if (brickLayout[i]) {
            shieldBrick(x + (i % 12) * 4, y + (Math.floor(i / 12) * 8), brickLayout[i] + 8);
        }
    }
};
