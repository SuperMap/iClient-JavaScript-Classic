module("HeatMapFastLayer");

test("testHeatMapHeatLayer_constructor", function () {
    expect(5);
    var heatMapFastLayer = new SuperMap.Layer.HeatMapFastLayer("heatMapFastLayer");
    equals(heatMapFastLayer.colors[0], "blue", "this colors is array");
    equals(heatMapFastLayer.radius, 50, "this radius is 50");
    equals(heatMapFastLayer.useGeoUnit, false, "this useGeoUnit is dalse");
    equals(heatMapFastLayer.maxWeight, null, "this maxWeight is null");
    equals(heatMapFastLayer.CLASS_NAME, "SuperMap.Layer.HeatMapFastLayer", "this CLASS_NAME is SuperMap.Layer.HeatMapFastLayer ")
});

test("testHeatMapFastLayer_destroy", function () {
    expect(4);
    var heatMapFastLayer = new SuperMap.Layer.HeatMapFastLayer("heatMapFastLayer", {maxWeight: 50});
    heatMapFastLayer.destroy();
    equals(heatMapFastLayer.useGeoUnit, null, "this useGeoUnit is null");
    equals(heatMapFastLayer.radius, null, "this radius is null");
    equals(heatMapFastLayer.colors, null, "this colors is null");
    equals(heatMapFastLayer.maxWeight, null, "this maxWeight is null");
});


test("testHeatMapFastLayer_convertToPixelPoints", function () {
    expect(4);
    var map, heatMapFastLayer, layer;
    var host = document.location.toString().match(/file:\/\//) ? "http://localhost:8090" : 'http://' + document.location.host;
    var url = host + "/iserver/services/map-world/rest/maps/World";

    layer = new SuperMap.Layer.TiledDynamicRESTLayer("World", url, {
        transparent: true,
        cacheEnabled: true
    }, {maxResolution: "auto"});

    map = new SuperMap.Map({
        div: "map",
        layers: [layer],
        center: new SuperMap.LonLat(0, 0),
        zoom: 0
    });
    heatMapFastLayer = new SuperMap.Layer.HeatMapFastLayer("heatMapFastLayer", {
        featureRadius: 20,
        features: [new SuperMap.Feature.Vector()]
    });
    var heatFeatures = [];
    var x, y, feapoint, fea;
    for (var i = 0; i < 10; i++) {
        x = Math.random() * 3000 * 2;
        y = Math.random() * (-3000) * 2;
        feapoint = new SuperMap.Geometry.Point(x, y);
        fea = new SuperMap.Feature.Vector(feapoint);
        fea.attributes.age = parseInt(Math.random() * 45 * 10) / 10;
        heatFeatures.push(fea);
    }
    heatMapFastLayer.removeAllFeatures();
    heatMapFastLayer.addFeatures(heatFeatures);
    heatMapFastLayer.map = map;
    var extent = heatMapFastLayer.map.getExtent();

    heatMapFastLayer.maxWidth = 5;
    heatMapFastLayer.maxHeight = 5;
    heatMapFastLayer.convertToPixelPoints(extent);
    equals(heatMapFastLayer.useRadius, 50, "this useRadius is 50");
    equals(heatMapFastLayer.maxWidth, 5, "this maxWidth is 5");
    equals(heatMapFastLayer.maxHeight, 5, "this maxHeight is 5");
    ok(heatMapFastLayer.grad, "this convertToPixelPoints is true ");
});