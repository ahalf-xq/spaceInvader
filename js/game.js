var game = function() {
    var time,
        aliens,
        gameState = 'titleScreen',
        aliensStartY,
        lives,
        score = 0,
        hightScore = 0,
        extraLifeScore = 0,
        saucerTimeout = 0,
        newTankTimeout,
        newWaveTimeour,
        gameOverFlag = false,
        startText = '<div class="message">' +
            '<p>ORBIT ASSAULT</p>' +
            '<p>Press FIRE To Start</p>' +
            '<p>Z - LEFT</p>' +
            '<p>X - RIGHT</p>' +
            '<p>M - FIRE</p>' +
            '<p>EXTRA TANK EVERY 5000 POINTS</p>' +
            '</div>',
        initShields = function() {
            var x = 0;
            for (x = 0; x < 4; x++) {
                shield((SCREEN_WIDTH / 2) - 192 + 12 + (x * 96), SHIELD_Y);
            }
        },
        updateScores = function() {
            if (score - extraLifeScore >= 5000) {
                extraLifeScore += 5000;
                lives++;
            }
            if (!$('#score').length) {
                $('#draw-target').append('<div id="score"></div>' +
                    '<div id="lives"></div><div id="highScore"></div>');
            }
            if (score > hightScore) {
                hightScore = score;
            }
            $('#score').text('SCORE:' + score);
            $('#highScore').text('HIGH:' + hightScore);
            $('#lives').text('LIVES:' + lives);
        },
        newSaucer = function() {
            clearTimeout(saucerTimeout);
            saucerTimeout = setTimeout(function() {
                saucer(gameCallback);
                newSaucer();
            }, (Math.random() * 5000) + 15000);
        },
        init = function() {
            $('#draw-target').children().remove();
            SYS_process = processor();
            SYS_collisionManager = collisionManager();
            aliens = aliensManager(gameCallback, aliensStartY);
            setTimeout(function() {
                tank(gameCallback);
            }, 2000);
            initShields();
            newSaucer();
            updateScores();
        },
        gameOver = function() {
            gameOverFlag = true;
            clearTimeout(newTankTimeout);
            clearTimeout(newWaveTimeour);
            clearTimeout(saucerTimeout);
            setTimeout(function() {
                $('#draw-target').children().remove();
                $('#draw-target').append('<div class="message">' +
                    '<p>***GAME OVER***</p></div>' + startText);
                gameState = 'titleScreen';
            }, 2000);
        },
        gameCallback = function(messageObj) {
            var pts;
            if (gameOverFlag) {
                return;
            }
            switch (messageObj.message) {
                case 'alienKilled':
                    score += messageObj.score;
                    updateScores();
                    break;
                case 'saucerHit':
                    pts = Math.floor((Math.random() * 3) + 1);
                    score += pts * 50;
                    updateScores();
                    animEffect(messageObj.x, messageObj.y, [pts + 20], 500, null);
                    break;
                case 'playerKilled':
                    aliens.pauseAliens(2500);
                    lives--;
                    updateScores();
                    if (!lives) {
                        gameOver();
                    } else {
                        newTankTimeout = setTimeout(function() {
                            tank(gameCallback);
                        }, 2000);
                    }
                    break;
                case 'aliensAtBottom':
                    gameOver();
                    break;
            }
        },
        gameLoop = function() {
            switch (gameState) {
                case 'playing':
                    SYS_timeInfo = time.getInfo();
                    SYS_process.process();
                    SYS_collisionManager.checkCollisions();
                    break;
                case 'titleScreen':
                    if (keys.fire) {
                        gameOverFlag = false;
                        time = timeInfo(60);
                        keys.fire = 0;
                        lives = 3;
                        score = 0;
                        extraLifeScore = 0;
                        aliensStartY = 64;
                        gameState = 'playing';
                        init();
                    }
                    break;
            }
            setTimeout(gameLoop, 15);
        };

    $('#draw-target').append(startText);
    gameLoop();
}();
