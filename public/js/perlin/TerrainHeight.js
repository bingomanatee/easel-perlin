(function (w) {


    var TerrainHeight = easely('TerrainHeight', Bitmap, 'Bitmap');
    var p = TerrainHeight.prototype;
    _.extend(p, {

        _post_initialize:function (canvas) {
            this.image = document.createElement('canvas');
            this.image.width = canvas.width;
            this.image.height = canvas.height;
            this.make(canvas);
        },

        make:function (canvas) {
            var min_sd = 100000;
            var max_sd = 0;

            var terrain = new CanvasTerrain(canvas);

            /* ****************** height SD ************** */
            terrain.each_cell(function (cell) {
                var data = [cell.height];
                var nd = [];

                cell.slice(3).forEach(function (nc) {
                    nd.push(nc.toString());
                    data.push(nc.height);
                });


                var stat = new Stat(data);

                var sd = stat.std_dev();
                min_sd = Math.min(sd, min_sd);
                max_sd = Math.max(sd, max_sd);

                cell.sd = sd;

                /*   if ((cell.col < 10) && (cell.row < 10)) {
                 var cid = '#n_r_' + cell.row + '_c_' + cell.col;
                 var c_ele = $(cid);
                 if (!c_ele) {
                 throw new Error('cannot find cell ' + cid);
                 }
                 c_ele.html(nd.join('<br />') +
                 '<br /><b>sd: </b> ' + cell.sd);
                 } */
            });

            var range = max_sd - min_sd;

            /* ****************** Angle ******************* */

            var min_height = 100000;
            var max_height = -100000;


            terrain.each_cell(function (cell) {
           //     console.log('cell angle row: ', cell.row, ', c', cell.col);

                cell.angle = 0;

                var sum = 0;
                var weights = 0;

                var weight_list = [];

                var slice = cell.slice(PERLIN_CORE.angle_sample, Math.floor());

                var inc = Math.floor(slice/10);

                slice.forEach(function (n2, i) {
                    if (inc && (!i % inc)){
                        return;
                    }

                    var dist = cell.distance(n2);
                    if (dist > 0) {

                        var rise = cell.height - n2.height;

                        var weight = 1 / dist;
                        weights += weight;
                        sum += rise * weight;

                        if ((cell.col >= 390) && (cell.row >= 390)) {
                            weight_list.push({
                                base:cell.toString(),

                                n2:n2.toString(),

                                rise:rise,

                                weight:weight
                            });
                        }
                    }

                })

                cell.angle = sum / weights;

            /*    if ((cell.col >= 390) && (cell.row >= 390)) {

                    var cell_id = '#cd_r_' + (cell.row - 390) + '_c_' + (cell.col - 390) + '_height';
                    $(cell_id).html(cell.height);


                    var cell_id = '#cd_r_' + (cell.row - 390) + '_c_' + (cell.col - 390) + '_n';
                    $(cell_id).html('<b>Angle: </b>' + cell.angle);

                    weight_list.forEach(function(weight_item, i){
                        weight_list[i] = weight_item_template(weight_item);
                    })

                    var cell_id = '#cd_r_' + (cell.row - 390) + '_c_' + (cell.col - 390) + '_weights';
                    $(cell_id).html(weight_list.join(''));

                } */
            });

            var wstat = new Wstat();

            /* ******************** RENDER ************** */


            var ctx = this.image.getContext('2d');
            var id = ctx.getImageData(0, 0, this.image.width, this.image.height);
            var row_offset = this.image.width * 4;


            terrain.each_cell(function (cell) {
                cell.sd_range = (cell.sd - min_sd) / range;
                var cell_offset = (cell.col * 4) + (row_offset * cell.row);
                var op = _channel(cell.sd_range * 255);
                var a = cell.angle;

                if (a > PERLIN_CORE.angle_range) {
                    a = 255;
                } else if (a <= -PERLIN_CORE.angle_range) {
                    a = 0;
                } else {
                    a = 128;
                }

                id.data[cell_offset] = a;
                id.data[cell_offset + 1] = a;
                id.data[cell_offset + 2] = 0;
                id.data[cell_offset + 3] = 255;
                if (cell.row < 10 && cell.col < 10) {

                    var cid = '#op_r_' + cell.row + '_c_' + cell.col;
                    var c_ele = $(cid);
                    c_ele.html('<br /><b>OP:</b>' + op);
                }
            });

            ctx.putImageData(id, 0, 0);

        }

    });

    function _channel(v) {
        return Math.max(0, Math.min(255, Math.round(v)));
    }

    w.TerrainHeight = TerrainHeight;

})(window)