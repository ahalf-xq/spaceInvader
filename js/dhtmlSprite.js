var DHTMLSprite = function(params) {
    var width = params.width,
        height = params.height,
        imageWidth = params.imageWidth,
        $el = params.$drawTarget.append('<div/>').find(':last'),
        elStyle = $el[0].style,
        mathFloor = Math.floor,
        that;
    $el.css({
        position: 'absolute',
        width: width,
        height: height,
        backgroundImage: 'url(' + params.images + ')'
    });

    that = {
        draw: function(x, y) {
            elStyle.left = x + 'px';
            elStyle.top = y + 'px';
        },
        changeImage: function(index) {
            var vOffset, hOffset;
            index *= width;
            vOffset = -mathFloor(index / imageWidth) * height;
            hOffset = -index % imageWidth;
            elStyle.backgroundPosition = hOffset + 'px ' + vOffset + 'px';
        },
        show: function() {
            elStyle.display = 'block';
        },
        hide: function() {
            elStyle.display = 'none';
        },
        destroy: function() {
            $el.remove();
        }
    };
    return that;
}
