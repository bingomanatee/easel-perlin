var PERLIN_CORE = {
    stage:null,
    update:false,
    angle_range:1,
    angle_sample: 3,
    opBase: 6,
    colors:{
        black:Graphics.getRGB(0, 0, 0, 0.4),
        button_back:Graphics.getRGB(230, 240, 240, 0.75)
    }
}


function tick() {

    if (PERLIN_CORE.update) {
        PERLIN_CORE.update = false;
        PERLIN_CORE.stage.update();
        PERLIN_CORE.astage.update();
        console.log('updating stage');
    }
}
$(function (w) {
    var canvas = document.getElementById('perlin');
    PERLIN_CORE.stage = new Stage(canvas);

    var acanvas = document.getElementById('perlin_analyze');
    PERLIN_CORE.astage = new Stage(acanvas);

    PERLIN_CORE.perlin_set = new PerlinSet(400, 400, PERLIN_CORE.opBase, 2.25);
    PERLIN_CORE.stage.addChild(PERLIN_CORE.perlin_set);

    _octave_button();
    _op_base_button();
    _analysis_button();
    _angle_button();
    _angle_sample_button();
    _filter_button();

    PERLIN_CORE.update = true;
    Ticker.addListener(window);

    function _analyze() {

        if (PERLIN_CORE.sd_layer) {
            PERLIN_CORE.astage.removeChild(PERLIN_CORE.sd_layer);
        }

        PERLIN_CORE.sd_layer = new TerrainHeight(PERLIN_CORE.perlin_set.image);
        PERLIN_CORE.astage.addChild(PERLIN_CORE.sd_layer);
        PERLIN_CORE.update = true;
    }

    function _filter(){
        Pixastic.process(acanvas, "edges2");
    }

    function _op_base_button() {
        var button = new Container();
        button.x = 150;
        button.y = 32;

        function _make_label() {
            if (button.label) {
                button.removeChild(button.label);
            }
            var label = new Text('OpBase: ' + PERLIN_CORE.perlin_set.opBase, "10pt Arial", PERLIN_CORE.colors.black);
            label.y = 14;
            label.x = 5;
            button.addChild(label);
            button.label = label;
        }

        var g = new Graphics();
        g.beginFill(PERLIN_CORE.colors.button_back);
        g.beginStroke(PERLIN_CORE.colors.black);
        g.rect(0, 0, 120, 20);
        g.endStroke();
        g.endFill();
        var bb = new Shape(g);
        button.addChild(bb);
        setTimeout(function(){_make_label(), PERLIN_CORE.update = true}, 1000);

        (function (target) {
            target.onPress = function (evt) {
                // bump the target in front of it's siblings:

                var offset = {x:target.x - evt.stageX, y:target.y - evt.stageY};

                // add a handler to the event object's onMouseMove callback
                // this will be active until the user releases the mouse button:
                evt.onMouseMove = function (ev) {
                    target.x = ev.stageX + offset.x;
                    PERLIN_CORE.perlin_set.set_op_base((target.x) / 50);
                    _make_label();
                    //target.y = ev.stageY+offset.y;
                    // indicate that the stage should be updated on the next tick:
                    PERLIN_CORE.update = true;
                }
            }
            target.onMouseOver = function () {
                PERLIN_CORE.update = true;
            }
            target.onMouseOut = function () {
                PERLIN_CORE.update = true;
            }
        })(button);
        PERLIN_CORE.stage.addChild(button);
    }

    function _angle_sample_button() {

        function _make_label() {
            if (button.label) {
                button.removeChild(button.label);
            }
            var label = new Text('Angle Sample: ' + PERLIN_CORE.angle_sample, "10pt Arial", PERLIN_CORE.colors.black);
            label.y = 14;
            label.x = 5;
            button.addChild(label);
            button.label = label;
        }

        var button = new Container();
        button.x =  25 * PERLIN_CORE.angle_sample;
        button.y = 75;
        var g = new Graphics();
        g.beginFill(PERLIN_CORE.colors.button_back);
        g.beginStroke(PERLIN_CORE.colors.black);
        g.rect(0, 0, 120, 20);
        g.endStroke();
        g.endFill();
        var bb = new Shape(g);
        button.addChild(bb);
        _make_label();

        (function (target) {
            target.onPress = function (evt) {
                // bump the target in front of it's siblings:

                var offset = {x:target.x - evt.stageX, y:target.y - evt.stageY};

                // add a handler to the event object's onMouseMove callback
                // this will be active until the user releases the mouse button:
                evt.onMouseMove = function (ev) {
                    target.x = ev.stageX + offset.x;
                    var new_range = Math.ceil(target.x / 25);
                    if (new_range != PERLIN_CORE.angle_sample) {
                        PERLIN_CORE.angle_sample = new_range;
                        _make_label();

                    }
                    PERLIN_CORE.update = true;
                }
            }
            target.onMouseOver = function () {
                PERLIN_CORE.update = true;
            }
            target.onMouseOut = function () {
                PERLIN_CORE.update = true;
            }
        })(button);
        PERLIN_CORE.stage.addChild(button);
    }

    function _angle_button() {

        function _make_label() {
            if (button.label) {
                button.removeChild(button.label);
            }
            var label = new Text('Angle Range: ' + PERLIN_CORE.angle_range, "10pt Arial", PERLIN_CORE.colors.black);
            label.y = 14;
            label.x = 5;
            button.addChild(label);
            button.label = label;
        }

        var button = new Container();
        button.x = 5;
        button.y = 55;
        var g = new Graphics();
        g.beginFill(PERLIN_CORE.colors.button_back);
        g.beginStroke(PERLIN_CORE.colors.black);
        g.rect(0, 0, 120, 20);
        g.endStroke();
        g.endFill();
        var bb = new Shape(g);
        button.addChild(bb);
        _make_label();

        (function (target) {
            target.onPress = function (evt) {
                // bump the target in front of it's siblings:

                var offset = {x:target.x - evt.stageX, y:target.y - evt.stageY};

                // add a handler to the event object's onMouseMove callback
                // this will be active until the user releases the mouse button:
                evt.onMouseMove = function (ev) {
                    target.x = ev.stageX + offset.x;
                    var new_range = Math.ceil(target.x / 5);
                    if (new_range != PERLIN_CORE.angle_range) {
                        PERLIN_CORE.angle_range = new_range;
                        console.log('changing angle range to ', new_range);
                        _make_label();

                    }
                    PERLIN_CORE.update = true;
                }
            }
            target.onMouseOver = function () {
                PERLIN_CORE.update = true;
            }
            target.onMouseOut = function () {
                PERLIN_CORE.update = true;
            }
        })(button);
        PERLIN_CORE.stage.addChild(button);
    }

    function _octave_button() {

        function _make_label() {
            if (button.label){
                button.removeChild(button.label);
            }
            var label = new Text('Octaves: ' + PERLIN_CORE.perlin_set.octaves, "10pt Arial", PERLIN_CORE.colors.black);
            label.y = 14;
            label.x = 5;
            button.addChild(label);
            button.label = label;
        }

        var button = new Container();
        button.x = 5;
        button.y = 10;
        var g = new Graphics();
        g.beginFill(PERLIN_CORE.colors.button_back);
        g.beginStroke(PERLIN_CORE.colors.black);
        g.rect(0, 0, 80, 20);
        g.endStroke();
        g.endFill();
        var bb = new Shape(g);
        button.addChild(bb);
        _make_label();

        (function (target) {
            target.onPress = function (evt) {
                // bump the target in front of it's siblings:

                var offset = {x:target.x - evt.stageX, y:target.y - evt.stageY};

                // add a handler to the event object's onMouseMove callback
                // this will be active until the user releases the mouse button:
                evt.onMouseMove = function (ev) {
                    target.x = ev.stageX + offset.x;
                    var octaves = PERLIN_CORE.perlin_set.octaves;

                    PERLIN_CORE.perlin_set.set_octaves((target.x - 5) / 25);
                    if (octaves != PERLIN_CORE.perlin_set.octaves){
                        _make_label();
                    }
                    //target.y = ev.stageY+offset.y;
                    // indicate that the stage should be updated on the next tick:
                    PERLIN_CORE.update = true;
                }
            }
            target.onMouseOver = function () {
                PERLIN_CORE.update = true;
            }
            target.onMouseOut = function () {
                PERLIN_CORE.update = true;
            }
        })(button);
        PERLIN_CORE.stage.addChild(button);
    }

    function _analysis_button() {
        var button = new Container();
        button.x = 200;
        button.y = 380;
        var g = new Graphics();
        g.beginFill(PERLIN_CORE.colors.button_back);
        g.beginStroke(PERLIN_CORE.colors.black);
        g.rect(0, 0, 70, 20);
        g.endStroke();
        g.endFill();
        var bb = new Shape(g);
        button.addChild(bb);
        var label = new Text('Analyze', "10pt Arial", PERLIN_CORE.colors.black);
        label.y = 14;
        label.x = 5;
        button.addChild(label);

        (function (target) {
            target.onClick = function (evt) {
                _analyze();
            }

        })(button);
        PERLIN_CORE.stage.addChild(button);
    }

    function _filter_button() {
        var button = new Container();
        var g = new Graphics();
        g.beginFill(PERLIN_CORE.colors.button_back);
        g.beginStroke(PERLIN_CORE.colors.black);
        g.rect(0, 0, 70, 20);
        g.endStroke();
        g.endFill();
        var bb = new Shape(g);
        button.addChild(bb);
        var label = new Text('Filter', "10pt Arial", PERLIN_CORE.colors.black);
        label.y = 14;
        label.x = 5;
        button.addChild(label);
        button.x = 300;
        button.y = 380;

        (function (target) {
            target.onClick = function (evt) {
                _filter();
            }

        })(button);
        PERLIN_CORE.stage.addChild(button);
    }

});
