module("WMS");

test("testWMS_constructor", function () {
    expect(6);
    var url = "http://localhost:8090/iserver/services/map-china400/wms130/China";
    var wms = new SuperMap.Layer.WMS("中国", url, {
        layers: "China",
        version: 1.3,
        TRANSPARENT: true,
        FORMAT: "image/jpeg"
    });
    equals(wms.params.LAYERS, "China", "this layers is China");
    equals(wms.params.VERSION, 1.3, "this version is 1.3");
    equals(wms.params.TRANSPARENT, true, "this TRANSPARENT is true");
    equals(wms.params.FORMAT, "image/png", "this FORMAT is image/jpeg");
    equals(wms.noMagic, false, "this noMagic is false");
    equals(wms.isBaseLayer, false, "this isBaseLayer is false");
});

test("testWMS_destroy", function () {
    expect(8);
    var url = "http://localhost:8090/iserver/services/map-china400/wms130/China";
    var wms = new SuperMap.Layer.WMS("中国", url, {
        layers: "China",
        version: 1.3,
        TRANSPARENT: true,
        FORMAT: "image/jpeg"
    });
    wms.destroy();
    equals(wms.grid, null, "this grid is null");
    equals(wms.map, null, "this map is null");
    equals(wms.name, null, "this name is null");
    equals(wms.div, null, "this div is null");
    equals(wms.gridResolution, null, "this gridResolution is null");
    equals(wms.params, null, "this params is null");
    equals(wms.url, null, "this url is null");
    equals(wms.tileSize, null, "this tileSize is null");
});

test("testWMS_clone", function () {
    expect(10);
    var url = "http://localhost:8090/iserver/services/map-china400/wms130/China";
    var wms = new SuperMap.Layer.WMS("中国", url, {
        layers: "China",
        version: 1.3,
        TRANSPARENT: true,
        FORMAT: "image/jpeg"
    });
    var wms2 = new SuperMap.Layer.WMS("中国", url, {
        layers: "China"
    });
    var wms3 = wms.clone();
    equals(wms3.params.LAYERS, wms.params.LAYERS, "this clone is true");
    equals(wms3.params.VERSION, wms.params.VERSION, "this clone is true");
    equals(wms3.params.TRANSPARENT, wms.params.TRANSPARENT, "this clone is true");
    equals(wms3.params.FORMAT, wms.params.FORMAT, "this clone is true");
    equals(wms3.noMagic, wms.noMagic, "this clone is true");

    var wms4 = wms2.clone(wms);
    equals(wms4.params.LAYERS, wms.params.LAYERS, "this clone is true");
    equals(wms4.params.VERSION, wms.params.VERSION, "this clone is true");
    equals(wms4.params.TRANSPARENT, wms.params.TRANSPARENT, "this clone is true");
    equals(wms4.params.FORMAT, wms.params.FORMAT, "this clone is true");
    equals(wms4.noMagic, wms.noMagic, "this clone is true");
});

test("testWMS_getUrl", function () {
    expect(1);
    var url = "http://localhost:8090/iserver/services/map-china400/wms130/China";
    var map = new SuperMap.Map('map', {
        controls: [new SuperMap.Control.Zoom(),
            new SuperMap.Control.Navigation(),
            new SuperMap.Control.ScaleLine(),
            new SuperMap.Control.LayerSwitcher()
        ]
    });
    var wms = new SuperMap.Layer.WMS("中国", url, {
        layers: "China",
        version: 1.3,
        TRANSPARENT: true,
        FORMAT: "image/jpeg"
    }, {
        map: map,
        projection: "EPSG:4326",
        imageSize: new SuperMap.Size(50, 50),
        maxExtent: new SuperMap.Bounds(-180, -90, 180, 90)
    });
    map.baseLayer = wms;
    var extent = new SuperMap.Bounds(-180, 180, 180, -180);
    var string = wms.getURL(extent);
    ok(string, "this getURL is true");
});

test("testWMS_mergeNewParams", function () {
    expect(3);
    var url = "http://localhost:8090/iserver/services/map-china400/wms130/China";
    var wms = new SuperMap.Layer.WMS("中国", url, {
        layers: "China",
        version: 1.3,
        TRANSPARENT: true,
        FORMAT: "image/jpeg"
    });
    var newParams = {
        VERSION: 1.1,
        FORMAT: "image/png",
        TRANSPARENT: false
    };
    wms.mergeNewParams(newParams);
    equals(wms.params.VERSION, newParams.VERSION, "this version is 1.3");
    equals(wms.params.TRANSPARENT, newParams.TRANSPARENT, "this TRANSPARENT is true");
    equals(wms.params.FORMAT, newParams.FORMAT, "this FORMAT is image/jpeg");
});
