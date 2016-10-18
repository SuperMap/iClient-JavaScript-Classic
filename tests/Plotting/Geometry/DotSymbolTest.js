module('DotSymbol');

asyncTest("testDotSymbol_Constructor", 1, function () {
    var libID = 421, code2 = 10200, locationPoints = [new SuperMap.Geometry.Point(20, 30)];
    var map, layer, plottingLayer, dotSymbol;
    map = new SuperMap.Map("map");
    layer = new SuperMap.Layer.TiledDynamicRESTLayer("World", GlobeParameter.WorldURL, null, {maxResolution: "auto"});
    layer.events.on({"layerInitialized": addLayer});
    plottingLayer = new SuperMap.Layer.PlottingLayer("PlottingLayer", GlobeParameter.plotUrl);
    function addLayer() {
        map.addLayers([layer, plottingLayer]);
        map.setCenter(new SuperMap.LonLat(0, 0), 0);

        dotSymbol = plottingLayer.createSymbol(libID, code2, locationPoints, createSymbolSuccess, createSymbolFail);
    }

    function createSymbolSuccess(evt) {
        dotSymbol = evt.feature.geometry;
    }

    function createSymbolFail() {

    }

    setTimeout(function () {
        try{
            equal(dotSymbol.CLASS_NAME, "SuperMap.Geometry.DotSymbol", "DotSymbol.CLASS_NAME");
            start();
        } catch(exception){
            ok(false, "exception occcurs,message is:" + excepion.message)
            start();
        } finally {
            map.destroy();
        }

    }, 400);
});

asyncTest("testDotSymbol_setRotate", function () {
    var libID = 421, code2 = 10200, locationPoints = [new SuperMap.Geometry.Point(20, 30)];
    var map, layer, dotSymbol, plottingLayer;
    map = new SuperMap.Map("map");
    layer = new SuperMap.Layer.TiledDynamicRESTLayer("World", GlobeParameter.WorldURL, null, {maxResolution: "auto"});
    layer.events.on({"layerInitialized": addLayer});
    plottingLayer = new SuperMap.Layer.PlottingLayer("PlottingLayer", GlobeParameter.plotUrl);
    function addLayer() {
        map.addLayers([layer, plottingLayer]);
        map.setCenter(new SuperMap.LonLat(0, 0), 0);
        dotSymbol = plottingLayer.createSymbol(libID, code2, locationPoints, createSymbolSuccess, createSymbolFail);
    }

    function createSymbolSuccess(evt) {
        dotSymbol = evt.feature.geometry;
        dotSymbol.setRotate(100);
    }

    function createSymbolFail() {

    }

    setTimeout(function () {
        try{
            var setRotateTest = dotSymbol.getRotate();
            equal(setRotateTest, 100, "Function.getRotate");
            start();
        } catch(exception){
            ok(false, "exception occcurs,message is:" + excepion.message)
            start();
        } finally {
            map.destroy();
        }

    }, 400);
});

asyncTest("testDotSymbol_setScale", 1, function () {
    var libID = 421, code2 = 10200, locationPoints = [new SuperMap.Geometry.Point(20, 30)];
    var map, layer, dotSymbol, plottingLayer;
    map = new SuperMap.Map("map");
    layer = new SuperMap.Layer.TiledDynamicRESTLayer("World", GlobeParameter.WorldURL, null, {maxResolution: "auto"});
    layer.events.on({"layerInitialized": addLayer});
    plottingLayer = new SuperMap.Layer.PlottingLayer("PlottingLayer", GlobeParameter.plotUrl);
    function addLayer() {
        map.addLayers([layer, plottingLayer]);
        map.setCenter(new SuperMap.LonLat(0, 0), 0);

        dotSymbol = plottingLayer.createSymbol(libID, code2, locationPoints, createSymbolSuccess, createSymbolFail);
    }

    function createSymbolSuccess(evt) {
        dotSymbol = evt.feature.geometry;
        dotSymbol.setScale(0.5);
    }

    function createSymbolFail() {

    }

    setTimeout(function () {
        try{
            var setScaleTest = dotSymbol.getScale();
            equal(setScaleTest, 0.5, "Function.getScale");
            start();
        } catch(exception){
            ok(false, "exception occcurs,message is:" + excepion.message)
            start();
        } finally {
            map.destroy();
        }

    }, 400);
});

asyncTest("testDotSymbol_setTextContent", 1, function () {
    var libID = 421, code2 = 10200, locationPoints = [new SuperMap.Geometry.Point(20, 30)];
    var map, layer, dotSymbol, plottingLayer;
    map = new SuperMap.Map("map");
    layer = new SuperMap.Layer.TiledDynamicRESTLayer("World", GlobeParameter.WorldURL, null, {maxResolution: "auto"});
    layer.events.on({"layerInitialized": addLayer});
    plottingLayer = new SuperMap.Layer.PlottingLayer("PlottingLayer", GlobeParameter.plotUrl);
    function addLayer() {
        map.addLayers([layer, plottingLayer]);
        map.setCenter(new SuperMap.LonLat(0, 0), 0);
        dotSymbol = plottingLayer.createSymbol(libID, code2, locationPoints, createSymbolSuccess, createSymbolFail);
    }

    function createSymbolSuccess(evt) {
        dotSymbol = evt.feature.geometry;
        dotSymbol.setTextContent("setTextContentTest");
    }

    function createSymbolFail() {

    }

    setTimeout(function () {
        try{
            var setTextContentTest = dotSymbol.getTextContent();
            equal(setTextContentTest, "setTextContentTest", "Function.setTextContent");
            start();
        } catch(exception){
            ok(false, "exception occcurs,message is:" + excepion.message)
            start();
        } finally {
            map.destroy();
        }

    }, 400);
});

asyncTest("testDotSymbol_setSymbolRank", 1, function () {
    var libID = 421, code2 = 10200, locationPoints = [new SuperMap.Geometry.Point(20, 30)];
    var map, layer, dotSymbol, plottingLayer;
    map = new SuperMap.Map("map");
    layer = new SuperMap.Layer.TiledDynamicRESTLayer("World", GlobeParameter.WorldURL, null, {maxResolution: "auto"});
    layer.events.on({"layerInitialized": addLayer});
    plottingLayer = new SuperMap.Layer.PlottingLayer("PlottingLayer", GlobeParameter.plotUrl);
    function addLayer() {
        map.addLayers([layer, plottingLayer]);
        map.setCenter(new SuperMap.LonLat(0, 0), 0);
        dotSymbol = plottingLayer.createSymbol(libID, code2, locationPoints, createSymbolSuccess, createSymbolFail);
    }

    function createSymbolSuccess(evt) {
        dotSymbol = evt.feature.geometry;
        dotSymbol.setSymbolRank(0);
    }

    function createSymbolFail() {

    }

    setTimeout(function () {
        try{
            var setSymbolRankTest = dotSymbol.getSymbolRank();
            equal(setSymbolRankTest, 0, "Function.setSymbolRank");
            start();
        } catch(exception){
            ok(false, "exception occcurs,message is:" + excepion.message)
            start();
        } finally {
            map.destroy();
        }

    }, 400);
});

asyncTest("testDotSymbol_setNegativeImage", 1, function () {
    var libID = 421, code2 = 10200, locationPoints = [new SuperMap.Geometry.Point(20, 30)];
    var map, layer, dotSymbol, plottingLayer;
    map = new SuperMap.Map("map");
    layer = new SuperMap.Layer.TiledDynamicRESTLayer("World", GlobeParameter.WorldURL, null, {maxResolution: "auto"});
    layer.events.on({"layerInitialized": addLayer});
    plottingLayer = new SuperMap.Layer.PlottingLayer("PlottingLayer", GlobeParameter.plotUrl);
    function addLayer() {
        map.addLayers([layer, plottingLayer]);
        map.setCenter(new SuperMap.LonLat(0, 0), 0);
        dotSymbol = plottingLayer.createSymbol(libID, code2, locationPoints, createSymbolSuccess, createSymbolFail);
    }

    function createSymbolSuccess(evt) {
        dotSymbol = evt.feature.geometry;
        dotSymbol.setNegativeImage(false);
    }

    function createSymbolFail() {

    }

    setTimeout(function () {
        try{
            var setNegativeImageTest = dotSymbol.getNegativeImage();
            equal(setNegativeImageTest, false, "Function.setNegativeImage");
            start();
        } catch(exception){
            ok(false, "exception occcurs,message is:" + excepion.message)
            start();
        } finally {
            map.destroy();
        }

    }, 400);
});

asyncTest("testDotSymbol_setTextPosition", function () {
    var libID = 421, code2 = 10200, locationPoints = [new SuperMap.Geometry.Point(20, 30)];
    var map, layer, dotSymbol, plottingLayer;
    map = new SuperMap.Map("map");
    layer = new SuperMap.Layer.TiledDynamicRESTLayer("World", GlobeParameter.WorldURL, null, {maxResolution: "auto"});
    layer.events.on({"layerInitialized": addLayer});
    plottingLayer = new SuperMap.Layer.PlottingLayer("PlottingLayer", GlobeParameter.plotUrl);
    function addLayer() {
        map.addLayers([layer, plottingLayer]);
        map.setCenter(new SuperMap.LonLat(0, 0), 0);
        dotSymbol = plottingLayer.createSymbol(libID, code2, locationPoints, createSymbolSuccess, createSymbolFail);
    }

    function createSymbolSuccess(evt) {
        dotSymbol = evt.feature.geometry;
        dotSymbol.setTextPosition(10);
    }

    function createSymbolFail() {
    }

    setTimeout(function () {
        try{
            var setTextPosition = dotSymbol.getTextPosition();
            equal(setTextPosition, 10, "Function.setTextPosition");
            start();
        } catch(exception){
            ok(false, "exception occcurs,message is:" + excepion.message)
            start();
        } finally {
            map.destroy();
        }

    }, 400);
});
