var animEffect = function(x, y, imageList, timeout) {
    var imageIndex = 0,
        that = DHTMLSprite(SYS_spriteParams);
    setTimeout(function() {
        that.removed = true;
        that.destroy();
    }, timeout);

    that.move = function() {
        that.changeImage(imageList[imageIndex]);
        imageIndex++;
        if (imageIndex === imageList.length) {
            imageIndex = 0;
        }
        that.draw(x, y);
    };
    SYS_process.add(that);
}