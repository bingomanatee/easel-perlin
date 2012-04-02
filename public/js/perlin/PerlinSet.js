(function (w) {

    var PerlinSet = easely('PerlinSet', Bitmap, 'Bitmap');
    var p = PerlinSet.prototype;
    _.extend(p, {

        _post_initialize:function (h, w, octaves, opBase) {
            this.image = document.createElement('canvas');
            this.image.width = w;
            this.image.height = h;
            this.octaves = octaves;
            this.opBase = opBase ? opBase : 2;
            this.layers = [];

            this.make();

        },

        set_octaves:function (o) {
            this.octaves = Math.max(1, Math.floor(o));
            this.make();
        },

        set_op_base: function(obase){
            this.opBase = Math.max(0.25, Math.min(3, obase));
            this.make();
        },

        make:function () {

            var stage = new Stage(this.image);
            var inc = 1;
            var xy = 0;
            console.log('ocataves from ', this.octaves, 'to 0');
            for (var octave = this.octaves; octave >= 0; --octave) {
                var op = Math.pow(this.opBase, octave) / Math.pow(this.opBase, this.octaves);

                if (!this.layers[octave]) {
                    var scale = Math.pow(2, octave);
                    var s = scale * 2;
                    console.log('ADDING LAYER: opacity ', op,
                        'scale', scale, 'octaves', octave, 'blur: ', s);
                    var p2 = new PerlinLayer(this.image.height, this.image.width, scale, s, s);
                    this.layers[octave] = p2

                }

                this.layers[octave].alpha = op;

                inc *= 2;
                stage.addChild(this.layers[octave]);
            }
            stage.update();
        }

    });

    w.PerlinSet = PerlinSet;

})(window)