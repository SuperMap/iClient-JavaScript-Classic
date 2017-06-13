module("HeatMapLayer");

test("testHeatMapLayer_constructor", function () {
    expect(20);

    var heatMapLayer = new SuperMap.Layer.HeatMapLayer("test");

    equals(heatMapLayer.radius, 50, "default_radius is 50");
    equals(heatMapLayer.colors, null, " default_color is null");
    equals(heatMapLayer.features, null, "default_features is null");
    equals(heatMapLayer.maxWeight, null, "default_maxWeight is null");
    equals(heatMapLayer.minWeight, null, "default_minWeight is null");
    equals(heatMapLayer.boundsminWeight, null, "default_boundsminWeight is null");
    equals(heatMapLayer.usefulValue, null, "default_usefulValue is null");
    equals(heatMapLayer.featureWeight, null, "default_featureWeight is null");
    equals(heatMapLayer.featureRadius, null, "default_featureRadius is null");
    equals(heatMapLayer.supported, true, "default_supported is false");
    ok(heatMapLayer.rootCanvas, "default_rootCanvas is null");
    ok(heatMapLayer.canvasContext, "default_canvasContext is null");
    equals(heatMapLayer.pixelHeatPoints, null, "default_pixelHeatPoints is null");
    equals(heatMapLayer.alphaValues, null, "default_alphaValues is null");
    equals(heatMapLayer.colorValues, null, "default_colorValues is null");
    equals(heatMapLayer.canvasData, null, "default_canvasData is null");
    equals(heatMapLayer.maxWidth, null, "default_maxWidth is null");
    equals(heatMapLayer.maxHeight, null, "default_maxHeight is null");
    heatMapLayer.destroy();
    heatMapLayer = new SuperMap.Layer.HeatMapLayer("test", {
        radius: 30,
        features: [new SuperMap.Feature.Vector()]
    });

    equals(heatMapLayer.radius, 30, "heatMapLayer.radius");
    equals(heatMapLayer.features.length, 1, "heatMapLayer.features");
});

test("testHeatMapLayer_controlPoints", function () {
    var heatMapLayer = new SuperMap.Layer.HeatMapLayer("test", {
        "featureWeight": "value"
    });
    var heatPoints = [];
    for (var i = 0; i < 10; i++) {
        //heatPoints.push(new SuperMap.Layer.HeatPoint({lon:0,lat:0,value:5}));
        heatPoints.push(new SuperMap.Feature.Vector(new SuperMap.Geometry.Point(0, 0), {
            "value": 5
        }));
    }
    heatMapLayer.addFeatures(heatPoints);
    equals(heatMapLayer.features.length, 10, "addFeatures_complete");

    heatMapLayer.removeFeatures(heatPoints.slice(0, 5));
    equals(heatMapLayer.features.length, 5, "removefeatures_complete");

    heatMapLayer.removeAllFeatures();
    equals(heatMapLayer.features.length, 0, "removeAllFeatures_complete");
});

test("testHeatMapLayer_featureRadius", function () {
    expect(4);
    var heatMapLayer = new SuperMap.Layer.HeatMapLayer("test", {
        featureRadius: 20,
        features: [new SuperMap.Feature.Vector()]
    });
    equals(heatMapLayer.featureRadius, 20, "heatMapLayer.featureRadius");
    equals(heatMapLayer.features.length, 1, "heatMapLayer.features");
    heatMapLayer.destroy();
    ok(heatMapLayer.featureRadius == null, "heatMapLayer.featureRadius");
    ok(heatMapLayer.features == null, "heatMapLayer.features");
});

test("testHeatMapLayer_colors", function () {
    expect(4);
    var heatMapLayer = new SuperMap.Layer.HeatMapLayer("test"),
        colors = [new SuperMap.REST.ServerColor(170, 240, 233)];
    heatMapLayer.colors = colors;
    equals(heatMapLayer.colors[0].red, 170, "heatMapLayer.colors");
    equals(heatMapLayer.colors[0].green, 240, "heatMapLayer.colors");
    equals(heatMapLayer.colors[0].blue, 233, "heatMapLayer.colors");
    heatMapLayer.destroy();
    ok(heatMapLayer.colors == null, "heatMapLayer.colors");
});

test("testHeatMapLayer_destroy", function () {
    expect(18);
    var heatMapLayer = new SuperMap.Layer.HeatMapLayer("test", {
        radius: 30,
        features: [new SuperMap.Feature.Vector()]
    });
    heatMapLayer.destroy();
    equals(heatMapLayer.radius, null, "default_radius is null");
    equals(heatMapLayer.colors, null, " default_color is null");
    equals(heatMapLayer.features, null, "default_features is null");
    equals(heatMapLayer.maxWeight, null, "default_maxWeight is null");
    equals(heatMapLayer.minWeight, null, "default_minWeight is null");
    equals(heatMapLayer.boundsminWeight, null, "default_boundsminWeight is null");
    equals(heatMapLayer.usefulValue, null, "default_usefulValue is null");
    equals(heatMapLayer.featureWeight, null, "default_featureWeight is null");
    equals(heatMapLayer.featureRadius, null, "default_featureRadius is null");
    equals(heatMapLayer.supported, null, "default_supported is false");
    equals(heatMapLayer.rootCanvas, null, "default_rootCanvas is null");
    equals(heatMapLayer.canvasContext, null, "default_canvasContext is null");
    equals(heatMapLayer.pixelHeatPoints, null, "default_pixelHeatPoints is null");
    equals(heatMapLayer.alphaValues, null, "default_alphaValues is null");
    equals(heatMapLayer.colorValues, null, "default_colorValues is null");
    equals(heatMapLayer.canvasData, null, "default_canvasData is null");
    equals(heatMapLayer.maxWidth, null, "default_maxWidth is null");
    equals(heatMapLayer.maxHeight, null, "default_maxHeight is null");
});

test("testHeatMapLayer_convertToPixelPoints", function () {
    expect(9);
    var map, heatMapLayer, layer;
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
    heatMapLayer = new SuperMap.Layer.HeatMapLayer("test", {
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
    heatMapLayer.removeAllFeatures();
    heatMapLayer.addFeatures(heatFeatures);
    heatMapLayer.map = map;
    var extent = heatMapLayer.map.getExtent();

    //default set
    heatMapLayer.convertToPixelPoints(extent);
    equals(heatMapLayer.minWeight, null, "this minWeight is null");
    equals(heatMapLayer.usefulValue, "boundsminWeight", "this usefulValue is boundsminWeight");

    //user sets minWeight
    heatMapLayer.minWeight = 1;
    heatMapLayer.convertToPixelPoints(extent);
    equals(heatMapLayer.minWeight, 1, "this minWeight is 1");
    equals(heatMapLayer.usefulValue, "minWeight", "this usefulValue is minWeight");

    //user sets maxWeight
    heatMapLayer.minWeight = null;
    heatMapLayer.maxWeight = 5;
    heatMapLayer.convertToPixelPoints(extent);
    equals(heatMapLayer.maxWeight, 5, "this maxWeight is 5");
    equals(heatMapLayer.usefulValue, "boundsminWeight", "this usefulValue is minWeight");

    //user sets maxWeight and minWeight
    heatMapLayer.minWeight = 1;
    heatMapLayer.maxWeight = 5;
    heatMapLayer.convertToPixelPoints(extent);
    equals(heatMapLayer.minWeight, 1, "this minWeight is 1");
    equals(heatMapLayer.maxWeight, 5, "this maxWeight is 5");
    equals(heatMapLayer.usefulValue, "minWeight", "this usefulValue is minWeight");

});

test("testHeatMapLayer_drawHeatPoints", function () {
    expect(3);
    var map, heatMapLayer, layer;
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
    heatMapLayer = new SuperMap.Layer.HeatMapLayer("test", {
        featureRadius: 20,
        features: [new SuperMap.Feature.Vector()]
    });
    var heatFeatures = [];
    var x, y, feapoint, fea;
    for (var i = 0; i < 10; i++) {
        x = Math.random() * 100 * 2;
        y = Math.random() * (-100) * 2;
        feapoint = new SuperMap.Geometry.Point(x, y);
        fea = new SuperMap.Feature.Vector(feapoint);
        fea.attributes.age = parseInt(Math.random() * 45 * 10) / 10;
        fea.attributes.height = parseInt(Math.random() * 10);
        heatFeatures.push(fea);
    }
    heatMapLayer.removeAllFeatures();
    heatMapLayer.addFeatures(heatFeatures);
    heatMapLayer.map = map;
    heatMapLayer.maxWidth = 1000;
    heatMapLayer.maxHeight = 900;
    var extent = heatMapLayer.map.getExtent();
    heatMapLayer.pixelHeatPoints = [];
    heatMapLayer.featureWeight = "height";
    heatMapLayer.featureRadius = "height";
    heatMapLayer.minWeight = 1;
    heatMapLayer.maxWeight = 5;
    if (heatMapLayer.features && heatMapLayer.features.length > 0) {
        heatMapLayer.convertToPixelPoints(extent);
        console.log(heatMapLayer.pixelHeatPoints);
        heatMapLayer.drawHeatPoints(extent);
    }
    ok(heatMapLayer.pixelHeatPoints, "this drawHeatPoints is true");
    ok(heatMapLayer.alphaValues, "this drawHeatPoints is true");
    ok(heatMapLayer.colorValues, "this drawHeatPoints is true");
});
