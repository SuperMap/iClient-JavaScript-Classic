module("HeatGridLayer");

test("HeatGridLayer_constructor", function () {
    expect(16);
    var heatGridLayer = new SuperMap.Layer.HeatGridLayer("test");
    equals(heatGridLayer.name, "test", "heatGridLayer Name");
    equals(heatGridLayer.CLASS_NAME, "SuperMap.Layer.HeatGridLayer", "CLASS_NAME");
    equals(heatGridLayer.gridWidth, 50, "default_gridWidth =50");
    equals(heatGridLayer.gridHeight, 50, "default_gridHeight =50");
    equals(heatGridLayer.spreadZoom, 3, "spreadZoom =3");
    equals(heatGridLayer.zoomInNumber, 1, "spreadZoom =1");
    equals(heatGridLayer.labelMode, 0, "spreadZoom =0");
    equals(heatGridLayer.definition, 2, "spreadZoom =2");
    equals(heatGridLayer.pointFeatures, null, "default_pointFeatures =null");
    equals(heatGridLayer.items, null, "items =null");
    equals(heatGridLayer.selectGrid, null, "selectGrid =null");
    equals(heatGridLayer.gridMaxCounts, null, "gridMaxCounts =null");
    equals(heatGridLayer.gridMinCounts, null, "gridMinCounts =null");
    equals(heatGridLayer.dataField, null, "dataField =null");
    equals(heatGridLayer.isShowLabel, true, "isShowLabel =true");
    equals(heatGridLayer.isZoomIn, true, "isZoomIn =true");
    heatGridLayer.destroy();
});

test("HeatGridLayer_clickGrid", function () {
    expect(3);
    var map, layer, heatGridLayer;
    var host = document.location.toString().match(/file:\/\//)?"http://localhost:8090":'http://' + document.location.host;
    var url=host+"/iserver/services/map-world/rest/maps/World";

    heatGridLayer = new SuperMap.Layer.HeatGridLayer("heatGrid");
    layer = new SuperMap.Layer.TiledDynamicRESTLayer("World",url, {transparent: true, cacheEnabled: true}, {maxResolution:"auto"});
    map = new SuperMap.Map({
        div:"map",
        layers:[layer],
        center:new SuperMap.LonLat(0,0),
        zoom:0
    });
    var heatFeatures = [];
    var x, y, feapoint, fea;
    heatGridLayer.dataField = "age";
    heatGridLayer.labelMode = 2;
    for (var i = 0; i < 10; i++) {
        x = Math.random() * 3000 * 2;
        y = Math.random() * (-3000) * 2;
        feapoint = new SuperMap.Geometry.Point(x, y);
        fea = new SuperMap.Feature.Vector(feapoint);
        fea.attributes.age = parseInt(Math.random() * 45 * 10) / 10;
        heatFeatures.push(fea);
    }
    heatGridLayer.map = map;
    equals(heatGridLayer.map.getZoom(),0,"this clickGrid is true");
    heatGridLayer.clickGrid(heatFeatures[0]);
    ok(heatGridLayer.isZoomIn,"this clickGrid is true");
    equals(heatGridLayer.map.getZoom(),1,"this clickGrid is true");
});

test("heatGridLayer_controlPoints", function () {
    expect(5);
    var heatGridLayer = new SuperMap.Layer.HeatGridLayer("test", {
        gridWidth: 150,
        gridHeight: 100

    });
    var heatFeatures = [];
    var x, y, feapoint, fea;
    heatGridLayer.dataField = "age";
    heatGridLayer.labelMode = 3;
    for (var i = 0; i < 10; i++) {
        x = Math.random() * 3000 * 2;
        y = Math.random() * (-3000) * 2;
        feapoint = new SuperMap.Geometry.Point(x, y);
        fea = new SuperMap.Feature.Vector(feapoint);
        fea.attributes.age = parseInt(Math.random() * 45 * 10) / 10;
        heatFeatures.push(fea);
    }
    heatGridLayer.addFeatures(heatFeatures);
    equals(heatGridLayer.pointFeatures.length, 10, "addFeatures_complete");

    heatGridLayer.removeFeatures(heatFeatures.slice(0, 5));
    equals(heatGridLayer.pointFeatures.length, 5, "removefeatures_complete");

    heatGridLayer.removeAllFeatures();
    equals(heatGridLayer.pointFeatures, null, "removeAllFeatures_complete");

    equals(heatGridLayer.gridWidth, 150, "heatGridLayer.gridWidth");
    equals(heatGridLayer.gridHeight, 100, "heatGridLayer.gridHeight");
});

test("heatGridLayer_destroy", function () {
    expect(11);
    var heatGridLayer = new SuperMap.Layer.HeatGridLayer("test");
    var heatFeatures = [];
    var x, y, feapoint, fea;
    heatGridLayer.dataField = "age";
    heatGridLayer.labelMode = 2;
    for (var i = 0; i < 10; i++) {
        x = Math.random() * 3000 * 2;
        y = Math.random() * (-3000) * 2;
        feapoint = new SuperMap.Geometry.Point(x, y);
        fea = new SuperMap.Feature.Vector(feapoint);
        fea.attributes.age = parseInt(Math.random() * 45 * 10) / 10;
        heatFeatures.push(fea);
    }
    heatGridLayer.addFeatures(heatFeatures);

    heatGridLayer.destroy();
    ok(heatGridLayer.name == null, "heatGridLayer Name");
    ok(heatGridLayer.gridHeight == null, "heatGridLayer.gridHeight");
    ok(heatGridLayer.gridWidth == null, "heatGridLayer.gridHeight");
    ok(heatGridLayer.pointFeatures == null, "heatGridLayer.pointFeatures");
    ok(heatGridLayer.items == null, "heatGridLayer.items");
    ok(heatGridLayer.isShowLabel == null, "heatGridLayer.isShowLabel");
    ok(heatGridLayer.labelMode == null, "heatGridLayer.labelMode");
    ok(heatGridLayer.dataField == null, "heatGridLayer.dataField");
    ok(heatGridLayer.isZoomIn == null, "heatGridLayer..isZoomIn");
    ok(heatGridLayer.zoomInNumber == null, "heatGridLayer.zoomInNumber");
    ok(heatGridLayer.selectGrid == null, "heatGridLayer.selectGrid");
});

test("HeatGridLayer_calculateFeatures", function () {
    expect(5);
    var map, layer, heatGridLayer;
    var host = document.location.toString().match(/file:\/\//)?"http://localhost:8090":'http://' + document.location.host;
    var url=host+"/iserver/services/map-world/rest/maps/World";

    heatGridLayer = new SuperMap.Layer.HeatGridLayer("heatGrid");
    layer = new SuperMap.Layer.TiledDynamicRESTLayer("World",url, {transparent: true, cacheEnabled: true}, {maxResolution:"auto"});
    map = new SuperMap.Map({
        div:"map",
        layers:[layer],
        center:new SuperMap.LonLat(0,0),
        zoom:0
    });
    var heatFeatures = [];
    var x, y, feapoint, fea;
    heatGridLayer.dataField = "age";
    heatGridLayer.labelMode = 2;
    for (var i = 0; i < 10; i++) {
        x = Math.random() * 3000 * 2;
        y = Math.random() * (-3000) * 2;
        feapoint = new SuperMap.Geometry.Point(x, y);
        fea = new SuperMap.Feature.Vector(feapoint);
        fea.attributes.age = parseInt(Math.random() * 45 * 10) / 10;
        heatFeatures.push(fea);
    }
    heatGridLayer.map = map;
    heatGridLayer.labelMode = 0;
    var feas = heatGridLayer.calculateFeatures(heatFeatures);
    equals(feas[0].style.label,feas[0].childArray.length,"this calculateCounts is true");

    heatGridLayer.labelMode = 1;
    var feas1 = heatGridLayer.calculateFeatures(heatFeatures);
    equals(feas1[0].style.label,feas1[0].mean.toString(),"this calculateSumOrMean is true");

    heatGridLayer.labelMode = 2;
    var feas2 = heatGridLayer.calculateFeatures(heatFeatures);
    equals(feas2[0].style.label,feas2[0].max.toString(),"this calculateMaxOrMin is true");

    heatGridLayer.labelMode = 3;
    var feas3 = heatGridLayer.calculateFeatures(heatFeatures);
    equals(feas3[0].style.label,feas3[0].min.toString(),"this calculateMaxOrMin is true");

    map.zoom = 5;
    var feature = heatGridLayer.calculateFeatures(heatFeatures);
    equals(feature,heatFeatures,"map zoom >= this spreadZoom");

});

