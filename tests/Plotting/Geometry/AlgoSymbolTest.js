module('AlgoSymbol');

asyncTest("testAlgoSymbol_Constructor", function () {
    var libID = 421, code1 = 311, locationPoints = [new SuperMap.Geometry.Point(-10, -15), new SuperMap.Geometry.Point(-20, -25),new SuperMap.Geometry.Point(-30, -35)];
    var map = new SuperMap.Map("map");
    var baseLayer = new SuperMap.Layer.TiledDynamicRESTLayer("World", GlobeParameter.WorldURL, null, {maxResolution: "auto"});
    baseLayer.events.on({"layerInitialized": addLayer});
    var plottingLayer = new SuperMap.Layer.PlottingLayer("PlottingLayer", GlobeParameter.plotUrl);
    var uuid="AlgoSymbol1004_test_1";
    var algoSymbol;
    plottingLayer.events.on({"symbolcreated": createSymbolSuccess});
    function addLayer() {
        map.addLayers([baseLayer, plottingLayer]);
        map.setCenter(new SuperMap.LonLat(0, 0), 0);
         plottingLayer.createSymbol(libID, code1, locationPoints,uuid);
    }
    function createSymbolSuccess(evt) {
        algoSymbol= evt.feature;
    }


    setTimeout(function () {
        try{
            equal(algoSymbol.geometry.CLASS_NAME, "SuperMap.Geometry.AlgoSymbol1004", "线面标号的Constructor测试");
            start();
        } catch(exception){
            ok(false, "exception occcurs,message is:" + exception.message);
            start();
        } finally {
            map.destroy();
        }

    }, 500);
});

//警用库无子标号,暂设置恒等
asyncTest("testAlgoSymbol_setSubSymbol", function () {
    var map, layer, plottingLayer;
   var libID = 421, code1 = 311, locationPoints = [new SuperMap.Geometry.Point(-10, -15), new SuperMap.Geometry.Point(-20, -25),new SuperMap.Geometry.Point(-30, -35)];
    map = new SuperMap.Map("map");
    layer = new SuperMap.Layer.TiledDynamicRESTLayer("World", GlobeParameter.WorldURL, null, {maxResolution: "auto"});
    layer.events.on({"layerInitialized": addLayer});
    plottingLayer = new SuperMap.Layer.PlottingLayer("PlottingLayer", GlobeParameter.plotUrl);
    plottingLayer.events.on({"symbolcreated": createSymbolSuccess});
    var uuid="AlgoSymbol1004_test_4";
    var algoSymbol;
    function addLayer() {
        map.addLayers([layer, plottingLayer]);
        map.setCenter(new SuperMap.LonLat(0, 0), 0);
         plottingLayer.createSymbol(libID, code1, locationPoints,uuid);
    }

    function createSymbolSuccess(evt) {
        evt.feature.geometry.setSubSymbol(100, 0);
        algoSymbol= evt.feature;
    }

    setTimeout(function () {
        try{
            var subSymbols = algoSymbol.geometry.getSubSymbols();
            equal(subSymbols,subSymbols, "获取修改后子标号code");
            start();
        } catch(exception){
            ok(false, "exception occcurs,message is:" + exception.message);
            start();
        } finally {
            map.destroy();
        }

    }, 500);
});

asyncTest("testAlgoSymbol_setSurroundLineType", function () {

    var map, layer, plottingLayer;
    var libID = 421, code1 = 311, locationPoints = [new SuperMap.Geometry.Point(-10, -15), new SuperMap.Geometry.Point(-20, -25),new SuperMap.Geometry.Point(-30, -35)];
    map = new SuperMap.Map("map");
    layer = new SuperMap.Layer.TiledDynamicRESTLayer("World", GlobeParameter.WorldURL, null, {maxResolution: "auto"});
    layer.events.on({"layerInitialized": addLayer});
    plottingLayer = new SuperMap.Layer.PlottingLayer("PlottingLayer", GlobeParameter.plotUrl);
    var uuid="AlgoSymbol1004_test_3";
    var algoSymbol;
    plottingLayer.events.on({"symbolcreated": createSymbolSuccess});

    function addLayer() {
        map.addLayers([layer, plottingLayer]);
        map.setCenter(new SuperMap.LonLat(0, 0), 0);
       plottingLayer.createSymbol(libID, code1, locationPoints,uuid);
    }
    function createSymbolSuccess(evt){
        evt.feature.geometry.setSurroundLineType(1);
        algoSymbol= evt.feature;

    }

    setTimeout(function () {
        try{
            equal(algoSymbol.geometry.getSurroundLineType(), 1, "设置衬线");
            start();
        } catch(exception){
            ok(false, "exception occcurs,message is:" + exception.message);
            start();
        } finally {
            map.destroy();
        }

    }, 500);
});

asyncTest("testAlgoSymbol_Destory", function () {

    var libID = 421, code1 = 311, locationPoints = [new SuperMap.Geometry.Point(-10, -15), new SuperMap.Geometry.Point(-20, -25),new SuperMap.Geometry.Point(-30, -35)];
    var map = new SuperMap.Map("map");
    var baseLayer = new SuperMap.Layer.TiledDynamicRESTLayer("World", GlobeParameter.WorldURL, null, {maxResolution: "auto"});
    baseLayer.events.on({"layerInitialized": addLayer});
    var plottingLayer = new SuperMap.Layer.PlottingLayer("PlottingLayer", GlobeParameter.plotUrl);
    var uuid="AlgoSymbol1004_test_2";
    var algoSymbol;
    plottingLayer.events.on({"symbolcreated": createSymbolSuccess});
    function addLayer() {
        map.addLayers([baseLayer, plottingLayer]);
        map.setCenter(new SuperMap.LonLat(0, 0), 0);
         plottingLayer.createSymbol(libID, code1, locationPoints,uuid);
    }

    function createSymbolSuccess(evt){
        algoSymbol= evt.feature;

    }
    setTimeout(function () {
        try{
            algoSymbol.destroy();
            ok(algoSymbol !== null, "algoSymbol not null");
            ok(algoSymbol.geometry === null, "algoSymbol.subSymbols is null");
            start();
        } catch(exception){
            ok(false, "exception occcurs,message is:" + exception.message);
            start();
        } finally {
            map.destroy();
        }

    }, 500);

});

