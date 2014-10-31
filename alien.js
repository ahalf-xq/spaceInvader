var alienBomb = function(x, y, removedCallback) {
    var that = DHTMLSprite(SYS_spriteParams),
        collider;
    that.changeImage(19);
    that.remove = function() {
        animEffect(x, y + 8, [18], 250, null);
        that.destroy();
        collider.remove();
        that.removed = true;
        removedCallback();
    };
    collider = SYS_collisionManager.newCollider(ALIEN_BOMB, SHIELD, 6, 12, that.remove);
    that.move = function() {
        y += 3.5 * SYS_timeInfo.coeff;
        that.draw(x, y);
        collider.update(x, y);
        if (y >= TANK_Y) {
            that.remove();
        }
    };
    SYS_process.add(that);
}, alien = function(x, y, frame, points, hitCallback) {
    var animFlag = 0,
        that = DHTMLSprite(SYS_spriteParams),
        collider, collisionWidth = 16;
    that.canFire = false;
    that.remove = function(colliderFlag) {
        if (colliderFlag & SHIELD) {
            return;
        }
        animEffect(x, y, [8], 250, null);
        that.destroy();
        collider.remove();
        that.removed = true;
        hitCallback(points);
    };
    if (frame === 2) {
        collisionWidth = 22;
    } else if (frame === 4) {
        collisionWidth = 25;
    }
    collider = SYS_collisionManager.newCollider(ALIEN, 0, collisionWidth, 16, that.remove);
    collider.update(x, y);
    that.move = function(dx, dy) {
        that.changeImage(frame + animFlag);
        animFlag ^= 1;
        x += dx;
        y += dy;
        if (!collider.collideeFlags && y >= SHIELD_Y - 16) {
            collider.remove();
            collider = SYS_collisionManager.newCollider(ALIEN, SHIELD, collisionWidth, 16, that.remove);
        }
        collider.update(x, y);
        that.draw(x, y);
        if ((dx > 0 && x > SCREEN_WIDTH - 32 -16) || (dx < 0 && x <= 16)) {
            return true;
        }
        return false;
    };
    that.getXY = function() {
        return {
            x: x,
            y: y
        };
    };
    return that;
}, aliensManager = function(gameCallback, startY) {
    var aliensList = [],
        aliensFireList = [],
        paused = false,
        moveIndex,
        dx = 4,
        dy = 0,
        images = [0, 2, 2, 4, 4],
        changeDir = false,
        waitFire = false,
        scores = [40, 20, 20, 10, 10],
        that,
        hitFun = function(points) {
            if (!paused) {
                that.pauseAliens(150);
            }
            gameCallback({
                message: 'alienKilled',
                score: points
            });
        }, x, y, anAlien;
    for (y = 0; y < ALIEN_ROWS; y++) {
        for (x = 0; x < ALIEN_COLUMNS; x++) {
            anAlien = alien((x * 32) + 16, (y * 32) + startY, images[y], scores[y], hitFun);
            aliensList.push(anAlien);
            if (y === ALIEN_ROWS - 1) {
                aliensList[aliensList.length - 1].canFire = true;
            }
        }
    }
    moveIndex = aliensList.length - 1;
    that = {
        pauseAliens: function(pauseTime) {
            paused = true;
            setTimeout(function() {
                paused = false;
            }, pauseTime);
        },
        move: function() {
            var anAlien, i,
                dx2, coeff,
                fireAlien, xy;
            if (paused) {
                return;
            }
            if (!aliensList.length) {
                that.removed = true;
                gameCallback({
                    message: 'AllAliensKillde'
                });
                return;
            }
            anAlien = aliensList[moveIndex];
            if (anAlien.removed) {
                for (i = aliensList.length - 1; i >= 0; i--) {
                    if (aliensList[i].getXY().x === anAlien.getXY().x && i !== moveIndex) {
                        if (i < moveIndex) {
                            aliensList[i].canFire = true;
                        }
                        break;
                    }
                }
                aliensList.splice(moveIndex, 1);
                moveIndex--;
                if (moveIndex === -1) {
                    moveIndex = aliensList.length - 1;
                }
                return;
            }
            if (anAlien.canFire) {
                aliensFireList.push(anAlien);
            }
            dx2 = dy ? 0 : dx;
            if (anAlien.move(dx2, dy)) {
                changeDir = true;
            }
            if (anAlien.getXY().y >= TANK_Y) {
                gameCallback({
                    message: 'aliensAtBottom'
                });
                return;
            }
            moveIndex--;
            if (moveIndex === -1) {
                moveIndex = aliensList.length - 1;
                dy = 0;
                coeff = SYS_timeInfo.avarageCoeff;
                dx = 4 * (dx < 0 ? -coeff : coeff);
                if (changeDir) {
                    dx = -dx;
                    changeDir = false;
                    dy = 16;
                }
                if (!waitFire) {
                    fireAlien = aliensFireList[Math.floor(Math.random() * (aliensList.length))];
                    xy = fireAlien.getXY();
                    alienBomb(xy.x, xy.y, function() {
                        waitFire = false;
                    });
                    aliensFireList = [];
                    waitFire = true;
                }
            }
        }
    };
    SYS_process.add(that);
    return that;
};