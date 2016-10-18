module('GeoGraphicObject');

asyncTest("testGeoGraphicObject_Constructor", function () {
    var map, layer, geoGraphicObject;
    map = new SuperMap.Map("map");
    layer = new SuperMap.Layer.TiledDynamicRESTLayer("World", GlobeParameter.WorldURL, null, {maxResolution: "auto"});
    layer.events.on({"layerInitialized": addLayer});
    var plottingLayer = new SuperMap.Layer.PlottingLayer("PlottingLayer", GlobeParameter.plotUrl);

    function addLayer() {
        map.addLayers([layer, plottingLayer]);
        map.setCenter(new SuperMap.LonLat(0, 0), 0);
    }

    //对接iserver中的服务
    var getSymbolInfo = new SuperMap.REST.GetSymbolInfoService(GlobeParameter.plotUrl);
    getSymbolInfo.events.on({
        "processCompleted": getCompleted,
        "processFailed": getFailed,
        scope: this
    });
    var inputPoints = [new SuperMap.Geometry.Point(40, 35)];
    var getSymbolInfoParams = new SuperMap.REST.GetSymbolInfoParameters();
    getSymbolInfoParams.libID = 421;
    getSymbolInfoParams.code = 10100;
    getSymbolInfoParams.inputPoints = inputPoints;
    getSymbolInfo.processAsync(getSymbolInfoParams);


    function getCompleted(result) {
        geoGraphicObject = SuperMap.Geometry.PlottingGeometry.createGeometry(421, 10100, inputPoints, {symbolData: result.originResult, layer: plottingLayer});
    }

    function getFailed() {
        geoGraphicObject.events.triggerEvent("createfeaturefail");
        return null;
    }

    setTimeout(function () {
        try{
            equal(geoGraphicObject.CLASS_NAME, "SuperMap.Geometry.DotSymbol", "DotSymbol.CLASS_NAME");
            start();
        } catch(exception){
            ok(false, "exception occcurs,message is:" + excepion.message)
            start();
        } finally {
            map.destroy();
        }

    }, 500);
});

asyncTest("testGeoGraphicObject_getTextContent", function () {
    var map, layer, geoGraphicObject;
    map = new SuperMap.Map("map");
    layer = new SuperMap.Layer.TiledDynamicRESTLayer("World", GlobeParameter.WorldURL, null, {maxResolution: "auto"});
    layer.events.on({"layerInitialized": addLayer});
    var plottingLayer = new SuperMap.Layer.PlottingLayer("PlottingLayer", GlobeParameter.plotUrl);

    function addLayer() {
        map.addLayers([layer, plottingLayer]);
        map.setCenter(new SuperMap.LonLat(0, 0), 0);
    }

    //对接iserver中的服务
    var getSymbolInfo = new SuperMap.REST.GetSymbolInfoService(GlobeParameter.plotUrl);
    getSymbolInfo.events.on({
        "processCompleted": getCompleted,
        "processFailed": getFailed,
        scope: this
    });
    var inputPoints = [new SuperMap.Geometry.Point(40, 35)];
    var getSymbolInfoParams = new SuperMap.REST.GetSymbolInfoParameters();
    getSymbolInfoParams.libID = 421;
    getSymbolInfoParams.code = 10100;
    getSymbolInfoParams.inputPoints = inputPoints;
    getSymbolInfo.processAsync(getSymbolInfoParams);


    function getCompleted(result) {
        geoGraphicObject = SuperMap.Geometry.PlottingGeometry.createGeometry(421, 10100, inputPoints, {symbolData: result.originResult, layer: plottingLayer});
        geoGraphicObject.setTextContent("注记内容");
    }

    function getFailed() {
        geoGraphicObject.events.triggerEvent("createfeaturefail");
        return null;
    }

    setTimeout(function () {
        try{
            var textContent = geoGraphicObject.getTextContent();
            equal(textContent, "注记内容", "Function.getTextContent");
            start();
        } catch(exception){
            ok(false, "exception occcurs,message is:" + excepion.message)
            start();
        } finally {
            map.destroy();
        }

    }, 500);
});

asyncTest("testGeoGraphicObject_clone", function () {
    var map, layer, geoGraphicObject;
    map = new SuperMap.Map("map");
    layer = new SuperMap.Layer.TiledDynamicRESTLayer("World", GlobeParameter.WorldURL, null, {maxResolution: "auto"});
    layer.events.on({"layerInitialized": addLayer});
    var plottingLayer = new SuperMap.Layer.PlottingLayer("PlottingLayer", GlobeParameter.plotUrl);

    function addLayer() {
        map.addLayers([layer, plottingLayer]);
        map.setCenter(new SuperMap.LonLat(0, 0), 0);
    }

    //对接iserver中的服务
    var getSymbolInfo = new SuperMap.REST.GetSymbolInfoService(GlobeParameter.plotUrl);
    getSymbolInfo.events.on({
        "processCompleted": getCompleted,
        "processFailed": getFailed,
        scope: this
    });
    var inputPoints = [new SuperMap.Geometry.Point(40, 35)];
    var getSymbolInfoParams = new SuperMap.REST.GetSymbolInfoParameters();
    getSymbolInfoParams.libID = 421;
    getSymbolInfoParams.code = 10100;
    getSymbolInfoParams.inputPoints = inputPoints;
    getSymbolInfo.processAsync(getSymbolInfoParams);


    function getCompleted(result) {
        geoGraphicObject = SuperMap.Geometry.PlottingGeometry.createGeometry(421, 10100, inputPoints, {symbolData: result.originResult, layer: plottingLayer});
    }

    function getFailed() {
        geoGraphicObject.events.triggerEvent("createfeaturefail");
        return null;
    }

    setTimeout(function () {
        try{
            var geometry = geoGraphicObject.clone();
            geometryClassName = geometry.CLASS_NAME;
            geometryLibID = geometry.libID;
            geometryCode = geometry.code;
            equal(geometryClassName, "SuperMap.Geometry.DotSymbol", "Function.clone");
            equal(geometryLibID, 421, "Function.clone");
            start();
        } catch(exception){
            ok(false, "exception occcurs,message is:" + excepion.message)
            start();
        } finally {
            map.destroy();
        }

    }, 500);
});

//asyncTest("testGeoGraphicObject_getGeometry", function () {
//    var map, layer, geoGraphicObject;
//    map = new SuperMap.Map("map");
//    layer = new SuperMap.Layer.TiledDynamicRESTLayer("World", GlobeParameter.mapUrl, null, {maxResolution: "auto"});
//    layer.events.on({"layerInitialized": addLayer});
//    var plottingLayer = new SuperMap.Layer.PlottingLayer("PlottingLayer", GlobeParameter.plotUrl);
//
//    function addLayer() {
//        map.addLayers([layer, plottingLayer]);
//        map.setCenter(new SuperMap.LonLat(0, 0), 0);
//    }
//
//    //对接iserver中的服务
//    var getSymbolInfo = new SuperMap.REST.GetSymbolInfoService(GlobeParameter.plotUrl);
//    getSymbolInfo.events.on({
//        "processCompleted": getCompleted,
//        "processFailed": getFailed,
//        scope: this
//    });
//    var inputPoints = [new SuperMap.Geometry.Point(40, 35)];
//    var getSymbolInfoParams = new SuperMap.REST.GetSymbolInfoParameters();
//    getSymbolInfoParams.libID = 421;
//    getSymbolInfoParams.code = 10100;
//    getSymbolInfoParams.inputPoints = inputPoints;
//    getSymbolInfo.processAsync(getSymbolInfoParams);
//
//    function getCompleted(result) {
//        geoGraphicObject = SuperMap.Geometry.GeoGraphicObject.getGeometry(result.originResult, plottingLayer, GlobeParameter.plotUrl);
//    }
//
//    function getFailed() {
//        geoGraphicObject.events.triggerEvent("createfeaturefail");
//        return null;
//    }
//
//    setTimeout(function () {
//        try{
//            var className = geoGraphicObject.CLASS_NAME;
//            equal(className, "SuperMap.Geometry.DotSymbol", "Function.getGeometry");
//            start();
//        } catch(exception){
//            ok(false, "exception occcurs,message is:" + excepion.message)
//            start();
//        } finally {
//            map.destroy();
//        }
//
//    }, 500);
//});














