(function (w) {
    function Cell(parent, row, col, height) {

        this.parent = this.terrain = parent;
        this.row = row;
        this.col = col;
        this.height = height ? height : 0;
        this.neighbors = {};
    }

    Cell.prototype = {
        each_neighbor:function (do_f) {
            for (var dir in this.neighbors) {
                var neighbor = this.neighbors[dir];
                do_f(this, neighbor, dir);
            }
        },

        direct_neighbors:function (do_f) {
            if (this.neighbors.n) {
                do_f(this, this.neighbors.n, 'n');
            }
            if (this.neighbors.e) {
                do_f(this, this.neighbors.e, 'e');
            }
            if (this.neighbors.s) {
                do_f(this, this.neighbors.s, 's');
            }
            if (this.neighbors.w) {
                do_f(this, this.neighbors.w, 'w');
            }
        },

        get_direct_neighbors:function () {
            var out = [];
            if (this.neighbors.n) {
                out.push(this.neighbors.n);
            }
            if (this.neighbors.e) {
                out.push(this.neighbors.e);
            }
            if (this.neighbors.s) {
                out.push(this.neighbors.s);
            }
            if (this.neighbors.w) {
                out.push(this.neighbors.w);
            }

            return out;
        },

        get_neighbors:function (filter) {
            var out = [];
            if (filter) {
                var n = this.neighbors[dir];
                if (filter(n)) {
                    out.push[n];
                }
            } else {
                for (var dir in this.neighbors) {
                    out.push(this.neighbors[dir]);
                }
            }
            return out;
        },

        neighborhood:function (do_f, range) {
            var t = this.terrain;
            var self = this;
            t.slice(this.col - range, this.row - range, this.col + range, this.row + range).forEach(function (n) {
                do_f(n, self);
            });
        },

        equals:function (n) {
            return ((n.row == this.row) && (n.col == this.col));
        },

        distance: function(cell){
            var xd = Math.abs(cell.row - this.row);
            var yd = Math.abs(cell.col - this.row);
            return xd + yd;
        },

        slice:function (distance) {

            var c_min = this.col - distance;
            var r_min = this.row - distance;

            var c_max = this.col + distance;
            var r_max = this.row + distance;

            return this.terrain.slice(c_min, r_min, c_max, r_max);

        },

        toString: function(){
         return 'r: ' + this.row + ', c: ' + this.col + ': ' + this.height;
    }

    }

    function CanvasTerrain(canvas) {
        this.rows = canvas.height;
        this.cols = canvas.width;
        this.data = _canvas_to_data(canvas);
        this._cell_data = [];
        this.make_cell_data();
        this.length = 10; // meters per region
    }

    CanvasTerrain.prototype = {

        export: function(){
            var rows = [];
            for (var ri = 0; ri < this.rows; ++ri){
                rows[ri] = [];
                for (var ci = 0; ci < this.cols; ++ci){
                    var cell = this.get(ri, ci);
                    if (!cell){
                        console.log('error: cannot get cell %s, %s', ri, ci);
                    } else {
                        rows[ri][ci] = cell.height;
                    }
                }
            }
            return rows;
        },

        clone: function(){
            var data = [];

            this.each_cell(function(c){ data.push(c.height)});

            return new Terrain(data, this.rows, this.cols);
        },

        make_cell_data:function () {
            for (var r = 0; r < this.rows; ++r) {
                if (!this._cell_data[r]) {
                    this._cell_data[r] = [];
                }

                for (var c = 0; c < this.cols; ++c) {
                    this._cell_data[r][c] = new Cell(this, r, c, this.data[r][c]);
                }
            }
            this.each_cell(_neighborhood);
        },

        get:function (r, c) {
            if ((r < 0) || (c < 0) || (r >= this.rows) || (c >= this.cols)) {
            //    console.log('off terrain request: %s, %s', r, c);
                return null;
            }
            return this._cell_data[r][c];
        },

        range: function(data){
            if (!data){
                data = this.data;
            }

            var out = {min: 0, max: 0}
            var first = true;
            data.forEach(function(rows){
                rows.forEach(function(h){
                    if (first){
                        out.min = out.max = h;
                    } else if (h > out.max){
                        out.max = h;
                    } else if (h < out.min) {
                        out.min = h;
                    }
                });
            });

            return out;
        },

        each_cell:function (do_f) {
            this._cell_data.forEach(function (row){
                row.forEach(function(cell){
                    do_f(cell);
                })
            })
        },

        echo:function (rows, cols) {
            if (!rows) {
                rows = this.rows;
            }
            if (!cols) {
                cols = this.cols;
            }

            var head = ['rows'];
            var colWidths = [8];
            for (var c = 0; c < cols; ++c) {
                head.push('h ' + c);
                head.push('a ' + c);
                head.push('w ' + c);
                head.push('m ' + c);
            }


            for (var r = 0; r < rows; ++r) {
                colWidths.push(8);
                colWidths.push(8);
                colWidths.push(8);
                colWidths.push(8);
            }
            var table = new Cli_Table({
                head:head,
                colWidths:colWidths
            });

            for (var r = 0; r < rows; ++r) {
                var out_row = [r];
                for (var c = 0; c < cols; ++c) {
                    var cell = this.get(r, c);
                    out_row.push(cell.height, Math.round(cell.angle * 180 / Math.PI), cell.water, cell.mud);
                }
                table.push(out_row);
            }

            return table.toString();
        },

        slice: function(c1, r1, c2, r2){
            c1 = Math.max(c1, 0);
            r1 = Math.max(r1, 0);

            c2 = Math.min(c2, this.cols - 1);
            r2 = Math.min(r2, this.rows - 1);

            var out = [];

            for (var c = c1; c <= c2; ++c) for (var r = r1; r <= r2; ++r){
                out.push(this.get(r, c));
            }
            return out;
        },
    }

    function _neighborhood(cell) {
        var neighbor;
        neighbor = cell.parent.get(cell.row, cell.col - 1);
        if (neighbor) {
            cell.neighbors.l = neighbor;
        }

        neighbor = cell.parent.get(cell.row, cell.col + 1);
        if (neighbor) {
            cell.neighbors.r = neighbor;
        }

        neighbor = cell.parent.get(cell.row - 1, cell.col);
        if (neighbor) {
            cell.neighbors.t = neighbor;
        }

        neighbor = cell.parent.get(cell.row + 1, cell.col);
        if (neighbor) {
            cell.neighbors.b = neighbor;
        }


        neighbor = cell.parent.get(cell.row-1, cell.col - 1);
        if (neighbor) {
            cell.neighbors.tl = neighbor;
        }

        neighbor = cell.parent.get(cell.row + 1, cell.col - 1);
        if (neighbor) {
            cell.neighbors.bl = neighbor;
        }

        neighbor = cell.parent.get(cell.row+1, cell.col + 1);
        if (neighbor) {
            cell.neighbors.br = neighbor;
        }

        neighbor = cell.parent.get(cell.row - 1, cell.col + 1);
        if (neighbor) {
            cell.neighbors.tr = neighbor;
        }

        var slope_x = _slope_vector(cell, cell.neighbors.l, cell.neighbors.r);

        var slope_y = _slope_vector(cell, cell.neighbors.t, cell.neighbors.b);

        var slope = Math.sqrt((slope_x * slope_x) + (slope_y * slope_y));
        cell.angle = Math.abs(Math.atan(slope));
        cell.sin = Math.sin(cell.angle);

    }

    function _slope_vector(cell, back_cell, fore_cell) {
        var slope = 0;
        var dist = 0;
        if (fore_cell) {
            dist += 1;
            slope += fore_cell.height;
        } else {
            slope += cell.height;
        }

        if (back_cell) {
            dist += 1;
            slope -= back_cell.height;
        } else {
            slope -= cell.height;
        }

        if (dist) {
            return slope / dist;
        } else {
            return 0;
        }
    }

    function _fix_series(series) {
        if (series[0] === null) {
            series[0] = series[1];
        }
        if (series[3] === null) {
            series[3] = series[2];
        }
    }

    function _spline_series(series) {
        var value_i_1;
        var value_i_2;
        value_i_1 = (series[1] - series[0]) / 2 + series[1];
        value_i_2 = (series[2] - series[3]) / 2 + series[2];
        return Math.round((value_i_1 + value_i_2) / 2);
    }

    function _canvas_to_data(canvas){
        var ctx = canvas.getContext('2d');
        var id = ctx.getImageData(0, 0, canvas.width, canvas.height);
        var rows = [];
        var row_offset = canvas.width * 4;

        for (var r = 0; r < canvas.height; ++r) {
            rows[r] = [];

            for (var c = 0; c < canvas.width; ++c){

                var rgba_start = (r * row_offset) + (4 * c);

                var rgba = [id.data[rgba_start],
                    id.data[rgba_start + 1],
                    id.data[rgba_start + 2]
                ]
                rows[r][c] = (rgba[0] + rgba[1] + rgba[2])/3;

            }
        }
        return rows;
    }

    function CanvasGrid(cavas) {
        var data = _canvas_to_data(canvas);
        this.data = data;
        this.rows = canvas.height;
        this.cols = canvas.width;
    }

    CanvasGrid.prototype = {

        get_value:function (r, c) {
            if ((r < 0) || (r >= this.rows) || (c < 0) || (c >= this.cols)) {
                return null;
            }
            return this.data[r][c];
        },

        set_value:function (r, c, v) {
            if ((r < 0) || (r >= this.rows) || (c < 0) || (c >= this.cols)) {
                return null;
            }

            return this.data[r][c] = v;
        },

        spline_double: function () {
            var d_grid = new CanvasGrid([], this.rows * 2 - 1, this.cols * 2 - 1);
            var r;
            var c;

            for (r = 0; r < this.rows; ++r) {
                for (c = 0; c < this.cols; ++c) {
                    d_grid.set_value(r * 2, c * 2, this.get_value(r, c));
                }
            }

            // spline interpolate the horizontal points between every two columns
            for (r = 1; r < d_grid.rows; r += 2) {
                for (c = 0; c < d_grid.cols; c += 2) {
                    var series = [d_grid.get_value(r - 2, c),
                        d_grid.get_value(r - 1, c),
                        d_grid.get_value(r + 1, c),
                        d_grid.get_value(r + 2, c)];
                    _fix_series(series);
                    d_grid.set_value(r, c, _spline_series(series));
                }
            }

            // spline interpolate the vertical points between every two rows
            for (r = 0; r < d_grid.rows; r += 2) {
                for (c = 1; c < d_grid.cols; c += 2) {
                    var series = [d_grid.get_value(r, c - 2),
                        d_grid.get_value(r, c - 1),
                        d_grid.get_value(r, c + 1),
                        d_grid.get_value(r, c + 2)];
                    _fix_series(series);
                    d_grid.set_value(r, c, _spline_series(series));
                }
            }

            // average the newly created points to find the middle point
            // not strictly splinish but close enough for now.
            for (r = 1; r < d_grid.rows; r += 2) {
                for (c = 1; c < d_grid.cols; c += 2) {
                    var series = [d_grid.get_value(r, c - 1),
                        d_grid.get_value(r, c + 1),
                        d_grid.get_value(r - 1, c),
                        d_grid.get_value(r + 1, c)];
                    var total = 0;
                    var count = 0;
                    series.forEach(function (v) {
                        if (!(v === null)) {
                            total += v;
                            ++count;
                        }
                    });
                    d_grid.set_value(r, c, Math.round(total / count));
                }
            }

            return d_grid;
        },

        max:function () {
            var maxs = [];

            this.data.forEach(function (row) {
                maxs.push(Math.max.apply(Math, row));
            })
            return Math.max.apply(Math, maxs);
        },

        min:function () {
            var mins = [];

            this.data.forEach(function (row) {
                mins.push(Math.min.apply(Math, row));
            })
            return Math.min.apply(Math, mins);
        },

        reset:function () {
            var new_data = [];
            for (var r = 0; r < this.rows; ++r) {
                var col = [];
                for (var c = 0; c < this.cols; ++c) {
                    col.push(0);
                }
                new_data.push(col);
            }
            this.data = new_data;
        },

        slice:function (r1, c1, r2, c2) {
            var data = [];
            var col_count = c2 - c1;
            // c1 = Math.max(0, c1);
            // c2 = Math.min(c2, this.cols);
            //  r1 = Math.max(0, r1);
            // r2 = Math.min(this.rows, r2);
            for (var r = r1; r < r2; ++r) {
                if (this.data[r]) {
                    var new_data = this.data[r].slice(c1, c2);
                } else if (r < 0) {
                    var new_data = this.data[r + 1].slice(c1, c2);
                } else if (r >= this.rows) {
                    var new_data = this.data[r - 1].slice(c1, c2);
                }

                while (new_data.length < col_count) {
                    var last = new_data[new_data.length - 1];
                    console.log('pushing value %s', last);
                    new_data.push(last);
                }

                if ((r1 % 16) == 0)  console.log('row %s length %s', r, new_data.length);

                data.push(new_data);
            }

            return new CanvasGrid(data);
        },

        _init_data:function () {
            this.data = [];
            for (var r = 0; r < this.rows; ++r) {
                this.data[r] = [];
                for (var c = 0; c < this.cols; ++c) {
                    this.data[r][c] = 0;
                }
            }
        }
    }

    w.CanvasGrid = CanvasGrid;
    w.CanvasTerrain = CanvasTerrain;

})(window)