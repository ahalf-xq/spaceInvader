var timeInfo = function(goalFPS) {
    var oldTime, paused = true,
        iterCount = 0,
        totalFPS = 0,
        totalCoeff = 0;
    return {
        getInfo: function() {
            var newTime, elapsed, FPS, coeff;
            if (paused) {
                paused = false;
                oldTime = +new Date();
                return {
                    elapsed: 0,
                    coeff: 0,
                    FPS: 0,
                    averageFPS: 0,
                    averageCoeff: 0
                };
            }
            newTime = +new Date();
            elapsed = newTime - oldTime;
            oldTime = newTime;
            FPS = 1000 / elapsed;
            iterCount++;
            totalFPS += FPS;
            coeff = goalFPS / FPS;
            totalCoeff += coeff;
            return {
                elapsed: elapsed,
                coeff: goalFPS / FPS,
                FPS: FPS,
                averageFPS: totalFPS / iterCount,
                avaerageCoeff: totalCoeff / iterCount
            };
        },
        pause: function() {
            paused = true;
        }
    };
};
