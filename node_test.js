var perlin = require('perlin');
var easel = require('easel');
var draw_canvas = require('support/draw_canvas');
var Canvas = require('canvas');

module.exports = function(data, cb){

    var canvas = new Canvas(400, 400);

    var stage = new easel.Stage(canvas);

    var perlin_set = new perlin.PerlinSet (400, 400, 5, 1.8);

    stage.addChild(perlin_set);
    stage.update();

    draw_canvas(canvas, __dirname + '/perlin_test.png',  cb);

    cb();

}