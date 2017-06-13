module('Graphic');
test('testGraphic_constructor', function () {
    expect();
    var map = new SuperMap.Map('map', {
        controls: [new SuperMap.Control.Zoom(),
            new SuperMap.Control.Navigation(),
            new SuperMap.Control.ScaleLine(),
            new SuperMap.Control.LayerSwitcher()
        ]
    });
    var control = new SuperMap.Control();
    map.addControl(control);
    var graphicLayer = new SuperMap.Layer.Graphics("graphicLayer");
    var _callbacks = {};
    var graphic = new SuperMap.Handler.Graphic(control, graphicLayer, _callbacks);
    ok(graphic.map instanceof SuperMap.Map, "this map is SuperMap.Map");
    ok(graphic.layer instanceof SuperMap.Layer.Graphics, "this layer is graphicLayer");
});

test('testGraphic_handle', function () {
    expect(2);
    var geometry = new SuperMap.Geometry.Point(-115, 10);
    var style = {
        iamge: new SuperMap.Style.Circle({
            opacity: 1.0,
            scale: 1.0,
            radius: 6,
            fill: new SuperMap.Style.Fill({
                color: "rgba(238, 153, 0, 0.4)"
            }),
            stroke: new SuperMap.Style.Stroke({
                color: "rgba(238,153,0,1)",
                width: 1
            })
        })
    };
    var pointGraphic = new SuperMap.Graphic(geometry, null, style);

    var map = new SuperMap.Map('map', {
        controls: [new SuperMap.Control.Zoom(),
            new SuperMap.Control.Navigation(),
            new SuperMap.Control.ScaleLine(),
            new SuperMap.Control.LayerSwitcher()
        ]
    });
    var control = new SuperMap.Control();
    map.addControl(control);
    var graphicLayer = new SuperMap.Layer.Graphics("graphicLayer");
    graphicLayer.addGraphics(pointGraphic);
    var _callbacks = {};
    var graphic = new SuperMap.Handler.Graphic(control, graphicLayer, _callbacks);
    graphic.graphic = pointGraphic;

    var evt = {
        type: "touchstart",
        xy: {
            x: 560,
            y: 343
        }
    };
    var handled = graphic.handle(evt);
    equals(handled,false, "this handled is false");
    equals(graphic.graphic,null, "this graphic is null");
});

