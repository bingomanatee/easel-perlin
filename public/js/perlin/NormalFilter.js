(function(w){

    var NormalFilter = easely('NormalFilter', Filter, 'Filter');

    var p = NormalFilter.prototype;
    p._post_initialize = function(r){
        this.range = r;
    }

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
        var rs = [];
        for (var i = 0; i < pixels.length; i += 4) {
            rs.push(pixels[i]);
        }
        var stat = new Stat(rs);
        var a = stat.avg();
        var sd = stat.std_dev();
        var min = a - sd * this.range/2;
        var max = a + sd * this.range/2;
        var range_scale = 255 / (sd * this.range);

       // console.log('min: ', min, 'max: ', max, 'scale: ', range_scale);

        for (var i = 0; i < pixels.length; ++i) {
            if (!((i % 4) == 3)){
                var c = pixels[i];
                c -= min;
                c *= range_scale;
                c = Math.max(0, Math.min(255, Math.floor(c)));
                pixels[i] = c;
            }
        }
        targetCtx.putImageData(imageData, 0, 0);
    }

        w.NormalFilter = NormalFilter;
})(window);