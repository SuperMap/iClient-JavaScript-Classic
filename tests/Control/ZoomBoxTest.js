module("ZoomBox");

test("testZoomBox_constructor", function () {
    expect(7);
    var ZoomBox = new SuperMap.Control.ZoomBox({
        keyMask: SuperMap.Handler.MOD_SHIFT,
        "autoActivate": true
    }, {
        cursorCSS: "url('images/arr_left.cur'),auto"
    });
    ok(ZoomBox.handlerOptions, "this handlerOptions is true");
    equals(ZoomBox.autoActivate, true, "this autoActivate is true");
    equals(ZoomBox.keyMask, 1, "this keyMask is 1");
    equals(ZoomBox.CLASS_NAME, "SuperMap.Control.ZoomBox", "this CLASS_NAME is SuperMap.Control.ZoomBox");
    equals(ZoomBox.type, SuperMap.Control.TYPE_TOOL, "this type");
    equals(ZoomBox.out, false, "this default out is false");
    equals(ZoomBox.alwaysZoom, false, "this default alwaysZoom is false");
});

test("testZoomBox_draw", function () {
    expect(2);
    var ZoomBox = new SuperMap.Control.ZoomBox({
        keyMask: SuperMap.Handler.MOD_SHIFT,
        "autoActivate": true
    }, {
        cursorCSS: "url('images/arr_left.cur'),auto"
    });
    ZoomBox.draw();
    var handler = ZoomBox.handler;
    equals(handler.cursorCSS, ZoomBox.handlerOptions.cursorCSS, "this draw is true");
    equals(handler.keyMask, ZoomBox.keyMask, "this keyMask is 1");
});

test("testZoomBox_zoomBox", function () {
    expect(4);
    var host = document.location.toString().match(/file:\/\//) ? "http://localhost:8090" : 'http://' + document.location.host,
        url = host + "/iserver/services/map-world/rest/maps/World";
    var ZoomBox = new SuperMap.Control.ZoomBox({
        keyMask: SuperMap.Handler.MOD_SHIFT,
        "autoActivate": true
    }, {
        cursorCSS: "url('images/arr_left.cur'),auto"
    });
    var layer = new SuperMap.Layer.TiledDynamicRESTLayer("World", url, {
        transparent: true,
        cacheEnabled: true
    }, {maxResolution: "auto"});
    var map = new SuperMap.Map("map", {
        controls: [ZoomBox]
    });
    map.addLayer(layer);
    var options = {keyMask: 1, cursorCSS: "url('images/arr_left.cur'),auto"};
    ZoomBox.zoomBox(options);
    equals(ZoomBox.map.zoom, 1, "this zoomBox is true");
    var options2 = new SuperMap.Bounds(237, 335, 362, 204);
    ZoomBox.zoomBox(options2);
    equals(ZoomBox.map.zoom, 2, "this zoomBox is true");

    ZoomBox.out = true;
    var option = {keyMask: 1, cursorCSS: "url('images/arr_left.cur'),auto"};
    ZoomBox.zoomBox(option);
    equals(ZoomBox.map.zoom, 1, "this zoomBox is true");
    var option2 = new SuperMap.Bounds(237, 335, 362, 204);
    ZoomBox.zoomBox(option2);
    equals(ZoomBox.map.zoom, 0, "this zoomBox is true");
});