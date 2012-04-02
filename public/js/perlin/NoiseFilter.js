(function(w){

    var NoiseFilter = easely('NoiseFilter', Filter, 'Filter');

    var p = NoiseFilter.prototype;

    p.applyFilter = function (ctx, x, y, width, height, targetCtx, targetX, targetY) {
        targetCtx = targetCtx || ctx;
        if (targetX == null) {
            targetX = x;
        }
        if (targetY == null) {
            targetY = y;
        }

        try {
            var imageData = ctx.getImageData(x, y, width, height);
        } catch (e) {
            //if (!this.suppressCrossDomainErrors) throw new Error("unable to access local image data: " + e);
            return false;
        }

        var pixels = imageData.data;
        var c = Math.floor(Math.random() * 255);
        for (var i = 0; i < pixels.length; ++i) {
            if (!((i + 1) % 4)) {
                c = Math.floor(Math.random() * 255);
                pixels[i] = 255;
            } else {
                pixels[i] = c;
            }
        }
        targetCtx.putImageData(imageData, 0, 0);
    }

        w.NoiseFilter = NoiseFilter;
})(window);