(function (w) {

    var PerlinLayer = easely('PerlinLayer', Bitmap, 'Bitmap');
    var p = PerlinLayer.prototype;
    _.extend(p, {

        _post_initialize:function (h, w, scale, a, b) {
            this.image = document.createElement('canvas');
            this.image.width = w;
            this.image.height = h;

            var stage = new Stage(this.image);
            var pc = 100;
            var sx = pc * scale;
            var sy = pc * scale;

            for (var x = 0; x < w; x += sx)
                for (var y = 0; y < h; y += sy) {

                    var p = new Perlin(pc, pc);
                    p.scaleX = p.scaleY = scale;

                    p.x = x;
                    p.y = y;

                    stage.addChild(p);

                }
            stage.update();

            var ctx = this.image.getContext('2d');

            if (a) {
               // var bf = new BoxBlurFilter(a, b, 4);
               // bf.applyFilter(ctx, 0, 0, 400, 400);

                var nf = new NormalFilter(3);
                nf.applyFilter(ctx, 0, 0, 400, 400);
            }
        }

    });

    w.PerlinLayer = PerlinLayer;

})(window)