var keys = function() {
    var keyMap = {
        '90': 'left', //Z
        '88': 'right', //X
        '77': 'fire'//M
    }, kInfo = { //1-press;0-unpress
        'left': 0,
        'right': 0,
        'fire': 0
    }, key;

    $(document).bind('keydown keyup', function(e) {
        key = '' + e.which;
        if (keyMap[key]) {
            kInfo[keyMap[key]] = e.type === 'keydown' ? 1 : 0;
            return false;
        }
    });

    return kInfo;
}();
