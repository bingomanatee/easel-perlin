(function (w) {

    var Perlin = easely('Perlin', Bitmap, 'Bitmap');
    var p = Perlin.prototype;
    _.extend(p, {

        _post_initialize:function (w, h, colored) {
            var canvas = document.createElement('canvas');
            canvas.width = w;
            canvas.height = h;
            this.image = canvas;
            var ctx = canvas.getContext("2d");
            var nf = new NoiseFilter();
            nf.colored = colored;
            nf.applyFilter(ctx, 0, 0, w, h);
        }

    });

    w.Perlin = Perlin;

})(window)