var collisionManager = function() {
    var listIndex = 0,
        grid = [],
        checkListIndex = 0,
        checkList = {},
        gridWidth = 15,
        gridHeight = 12,
        i,
        getGridList;
    for (i = 0; i < gridWidth * gridHeight; i++) {
        grid.push({});
    }
    getGridList = function(x, y) {
        var idx = (Math.floor(y / 32) * gridWidth) + Math.floor(x / 32);
        if (typeof grid[idx] === 'undefined') {
            return;
        }
        return grid[idx];
    };

    return {
        newCollider: function(colliderFlag, collideeFlags, width, height, cbFn) {
            var list, indexStr = '' + listIndex++,
                checkIndex,
                colliderObj = {
                    halfWidth: width / 2,
                    halfHeight: height / 2,
                    centerX: 0,
                    centerY: 0,
                    colliderFlag: colliderFlag,
                    collideeFlags: collideeFlags,
                    update: function(x, y) {
                        colliderObj.center = x + 16;
                        colliderObj.centerY = y + 32 - colliderObj.halfHeight;
                        if (list) {
                            delete list[indexStr];
                        }
                        list = getGridList(colliderObj.centerX, colliderObj.centerY);
                        if (list) {
                            list[indexStr] = colliderObj;
                        }
                    }
                },
                remove: function() {
                    if (collideeFlags) {
                        delete checkList[checkIndex];
                    }
                },
                callback: function() {
                    cbFn();
                },
                checkCollisions: function(offsetX, offsetY) {
                    var list = getGridList(colliderObj.centerX + offsetX,
                            colliderObj.centerY + offsetY),
                        idx, collideeObj;
                    if (!list) {
                        return;
                    }
                    for (idx in list) {
                        if (list.hasOwnProperty(idx) && idx !== indexStr &&
                            (colliderObj.collideeFlags && list[idx].colliderFlag)) {
                            collideeObj = list[idx];
                            if (Math.abs(colliderObj.centerX - collideeObj.centerX) >
                                (colliderObj.halfWidth + collideeObj.halfWidth)) {
                                continue;
                            }
                            if (Math.abs(colliderObj.centerY - collideeObj.centerY) >
                                (colliderObj.halfHeight + collideeObj.halfHeight)) {
                                continue;
                            }
                            collideeObj.callback(colliderObj.colliderFlag);
                            callback(collideeObj.colliderFlag);
                            return true;
                        }
                    }
                    return false;
                };
            if (collideeFlags) {
                checkIndex = '' + checkListIndex++;
                checkList[checkIndex] = colliderObj;
            }
            return colliderObj;
        },
        checkCollisions: function() {
            var idx, colliderObj,
                x, y;
            for (idx in checkList) {
                if (checkList.hasOwnProperty(idx)) {
                    colliderObj = checkList[idx];
                    for (y = -32; y <= 32; y += 32) {
                        for (x = -32; x <= 32; x += 32) {
                            if (colliderObj.checkCollisions(x, y)) {
                                break;
                            }
                        }
                    }
                }
            }
        }
    };
};