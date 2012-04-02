(function (w) {

    var Perlin = easely('Perlin', Bitmap, 'Bitmap');
    var p = Perlin.prototype;
    _.extend(p, {

        _post_initialize:function (w, h) {
            var canvas = document.createElement('canvas');
            canvas.width = w;
            canvas.height = h;
            this.image = canvas;
            var ctx = canvas.getContext("2d");
            new NoiseFilter().applyFilter(ctx, 0, 0, w, h);
        }

    });

    w.Perlin = Perlin;

})(window)