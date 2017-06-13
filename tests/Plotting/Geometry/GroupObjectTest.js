module('GroupObject');

asyncTest("testGroupObject_Constructor", function () {
    var map = new SuperMap.Map("map");
    var layer = new SuperMap.Layer.TiledDynamicRESTLayer("World", GlobeParameter.WorldURL, null, {maxResolution: "auto"});
    layer.events.on({"layerInitialized": addLayer});
    var plottingLayer = new SuperMap.Layer.PlottingLayer("PlottingLayer", GlobeParameter.plotUrl);
    plottingLayer.events.on({"symbolcreated": createSymbolSuccess});
    var plottingEdit = new SuperMap.Control.PlottingEdit();
    var symbol1,symbol2,symbol3,subObjects = [];
    var libID1 = 22, code1 = 1003, locationPoints1 = [new SuperMap.Geometry.Point(20, 10),new SuperMap.Geometry.Point(40, 10)];
    var libID2 = 421, code2 = 10100, locationPoints2 = [new SuperMap.Geometry.Point(20, 10)];
    var libID3 = 421, code3 = 9, locationPoints3 = [new SuperMap.Geometry.Point(40, 10)];
    var uuid="groupObject_001";
    function addLayer() {
        map.addLayers([layer, plottingLayer]);
        map.setCenter(new SuperMap.LonLat(0, 0), 0);
        map.addControls([plottingEdit]);
        plottingLayer.removeAllFeatures();
        symbol1 = plottingLayer.createSymbol(libID1, code1, locationPoints1);
        symbol2 = plottingLayer.createSymbol(libID2, code2, locationPoints2);
        symbol3 = plottingLayer.createSymbol(libID3, code3, locationPoints3);

    }

    function createSymbolSuccess(evt) {
            subObjects.push(evt.feature);
            if(subObjects.length === 3){
                plottingLayer.events.un({"symbolcreated": createSymbolSuccess});
                plottingLayer.createGroupObject(subObjects,uuid);
                plottingEdit.activate();
            }

    }

    setTimeout(function () {
        try{
            var groupObject=plottingLayer.getFeatureByUuid(uuid);
            equal(groupObject.geometry.CLASS_NAME, "SuperMap.Geometry.GroupObject", "function:CLASS_NAME");
            equal(groupObject.geometry.libID, 0, "function:libID");
            equal(groupObject.geometry.code, 1000, "function:code");
            equal(groupObject.geometry.symbolType, SuperMap.Plot.SymbolType.GROUPOBJECT, "function:symbolType");
            equal(groupObject.geometry.symbolName, "组合对象", "function:symbolName");
            start();
        } catch(exception){
            ok(false, "exception occcurs,message is:" + exception.message);
            start();
        } finally {
            map.destroy();
        }

    }, 1000);
});

asyncTest("testGroupObject_Destroy", function () {
    var map = new SuperMap.Map("map");
    var layer = new SuperMap.Layer.TiledDynamicRESTLayer("World", GlobeParameter.WorldURL, null, {maxResolution: "auto"});
    layer.events.on({"layerInitialized": addLayer});
    var plottingLayer = new SuperMap.Layer.PlottingLayer("PlottingLayer", GlobeParameter.plotUrl);
    plottingLayer.events.on({"symbolcreated": createSymbolSuccess});
    var plottingEdit = new SuperMap.Control.PlottingEdit();
    var symbol1,symbol2,symbol3, subObjects = [];
    var libID1 = 22, code1 = 1003, locationPoints1 = [new SuperMap.Geometry.Point(20, 10),new SuperMap.Geometry.Point(40, 10)];
    var libID2 = 421, code2 = 10100, locationPoints2 = [new SuperMap.Geometry.Point(20, 10)];
    var libID3 = 421, code3 = 9, locationPoints3 = [new SuperMap.Geometry.Point(40, 10)];
    var uuid="groupObject_001";
    function addLayer() {
        map.addLayers([layer, plottingLayer]);
        map.setCenter(new SuperMap.LonLat(0, 0), 0);
        map.addControls([plottingEdit]);
        plottingLayer.removeAllFeatures();
        symbol1 = plottingLayer.createSymbol(libID1, code1, locationPoints1);
        symbol2 = plottingLayer.createSymbol(libID2, code2, locationPoints2);
        symbol3 = plottingLayer.createSymbol(libID3, code3, locationPoints3);

    }

    function createSymbolSuccess(evt) {
            subObjects.push(evt.feature);
            if(subObjects.length === 3){
                plottingLayer.events.un({"symbolcreated": createSymbolSuccess});
                plottingLayer.createGroupObject(subObjects,uuid);
                plottingEdit.activate();
            }

    }

    setTimeout(function () {
        try{
            var groupObject=plottingLayer.getFeatureByUuid(uuid);
            groupObject.geometry.destroy();
            ok(groupObject !== null, "groupObject not null");
            equal(groupObject.geometry.feature, null, "function:Destroy");
            start();
        } catch(exception){
            ok(false, "exception occcurs,message is:" + exception.message);
            start();
        } finally {
            map.destroy();
        }

    }, 1000);


});

asyncTest("testGroupObject_setRotate", function () {
    var map = new SuperMap.Map("map");
    var layer = new SuperMap.Layer.TiledDynamicRESTLayer("World", GlobeParameter.WorldURL, null, {maxResolution: "auto"});
    layer.events.on({"layerInitialized": addLayer});
    var plottingLayer = new SuperMap.Layer.PlottingLayer("PlottingLayer", GlobeParameter.plotUrl);
    plottingLayer.events.on({"symbolcreated": createSymbolSuccess});
    var plottingEdit = new SuperMap.Control.PlottingEdit();
    var  symbol1,symbol2,symbol3,subObjects = [];
    var libID1 = 22, code1 = 1003, locationPoints1 = [new SuperMap.Geometry.Point(20, 10),new SuperMap.Geometry.Point(40, 10)];
    var libID2 = 421, code2 = 10100, locationPoints2 = [new SuperMap.Geometry.Point(20, 10)];
    var libID3 = 421, code3 = 9, locationPoints3 = [new SuperMap.Geometry.Point(40, 10)];
    var uuid="groupObject_001";

    function addLayer() {
        map.addLayers([layer, plottingLayer]);
        map.setCenter(new SuperMap.LonLat(0, 0), 0);
        map.addControls([plottingEdit]);
        plottingLayer.removeAllFeatures();
        symbol1 = plottingLayer.createSymbol(libID1, code1, locationPoints1);
        symbol2 = plottingLayer.createSymbol(libID2, code2, locationPoints2);
        symbol3 = plottingLayer.createSymbol(libID3, code3, locationPoints3);
    }

    function createSymbolSuccess(evt) {
        subObjects.push(evt.feature);
        if(subObjects.length === 3){
            plottingLayer.events.un({"symbolcreated": createSymbolSuccess});
            plottingLayer.createGroupObject(subObjects,uuid);
            plottingEdit.activate();
        }

    }

    setTimeout(function () {
        try{
            var groupObject=plottingLayer.getFeatureByUuid(uuid);
            var centerLonLat=groupObject.geometry.getBounds().getCenterLonLat();
            groupObject.geometry.anchorPoint=new SuperMap.Geometry.Point(centerLonLat.lon, centerLonLat.lat);
            var rotateValue=30;
            groupObject.geometry.setRotate(rotateValue);
            equal(rotateValue, groupObject.geometry.getRotate(), "function:setRotate");
            start();
        } catch(exception){
            ok(false, "exception occcurs,message is:" + exception.message);
            start();
        } finally {
            map.destroy();
        }

    }, 1000);

});

asyncTest("testGroupObject_setScale", function () {
    var map = new SuperMap.Map("map");
    var layer = new SuperMap.Layer.TiledDynamicRESTLayer("World", GlobeParameter.WorldURL, null, {maxResolution: "auto"});
    layer.events.on({"layerInitialized": addLayer});
    var plottingLayer = new SuperMap.Layer.PlottingLayer("PlottingLayer", GlobeParameter.plotUrl);
    plottingLayer.events.on({"symbolcreated": createSymbolSuccess});
    var plottingEdit = new SuperMap.Control.PlottingEdit();
    var symbol1,symbol2,symbol3, subObjects = [];
    var libID1 = 22, code1 = 1003, locationPoints1 = [new SuperMap.Geometry.Point(20, 10),new SuperMap.Geometry.Point(40, 10)];
    var libID2 = 421, code2 = 10100, locationPoints2 = [new SuperMap.Geometry.Point(20, 10)];
    var libID3 = 421, code3 = 9, locationPoints3 = [new SuperMap.Geometry.Point(40, 10)];
    var uuid="groupObject_001";
    function addLayer() {
        map.addLayers([layer, plottingLayer]);
        map.setCenter(new SuperMap.LonLat(0, 0), 0);
        map.addControls([plottingEdit]);
        plottingLayer.removeAllFeatures();
        symbol1 = plottingLayer.createSymbol(libID1, code1, locationPoints1);
        symbol2 = plottingLayer.createSymbol(libID2, code2, locationPoints2);
        symbol3 = plottingLayer.createSymbol(libID3, code3, locationPoints3);

    }

    function createSymbolSuccess(evt) {
        subObjects.push(evt.feature);
        if(subObjects.length === 3){
            plottingLayer.events.un({"symbolcreated": createSymbolSuccess});
            plottingLayer.createGroupObject(subObjects,uuid);
            plottingEdit.activate();
        }
    }

    setTimeout(function () {
        try{
            var groupObject=plottingLayer.getFeatureByUuid(uuid);
            var centerLonLat=groupObject.geometry.getBounds().getCenterLonLat();
            groupObject.geometry.anchorPoint=new SuperMap.Geometry.Point(centerLonLat.lon, centerLonLat.lat);
            var scaleValue=0.5;
            groupObject.geometry.setScale(scaleValue);
            equal(scaleValue, groupObject.geometry.getScale(), "function:setScale");
            start();
        } catch(exception){
            ok(false, "exception occcurs,message is:" + exception.message);
            start();
        } finally {
            map.destroy();
        }

    }, 1000);

});

asyncTest("testGroupObject_applyStyle", function () {
    var map = new SuperMap.Map("map");
    var layer = new SuperMap.Layer.TiledDynamicRESTLayer("World", GlobeParameter.WorldURL, null, {maxResolution: "auto"});
    layer.events.on({"layerInitialized": addLayer});
    var plottingLayer = new SuperMap.Layer.PlottingLayer("PlottingLayer", GlobeParameter.plotUrl);
    plottingLayer.events.on({"symbolcreated": createSymbolSuccess});
    var plottingEdit = new SuperMap.Control.PlottingEdit();
    var symbol1,symbol2,symbol3, subObjects = [];
    var libID1 = 22, code1 = 1003, locationPoints1 = [new SuperMap.Geometry.Point(20, 10),new SuperMap.Geometry.Point(40, 10)];
    var libID2 = 421, code2 = 10100, locationPoints2 = [new SuperMap.Geometry.Point(20, 10)];
    var libID3 = 421, code3 = 9, locationPoints3 = [new SuperMap.Geometry.Point(40, 10)];
    var uuid="groupObject_001";
    function addLayer() {
        map.addLayers([layer, plottingLayer]);
        map.setCenter(new SuperMap.LonLat(0, 0), 0);
        map.addControls([plottingEdit]);
        plottingLayer.removeAllFeatures();
        symbol1 = plottingLayer.createSymbol(libID1, code1, locationPoints1);
        symbol2 = plottingLayer.createSymbol(libID2, code2, locationPoints2);
        symbol3 = plottingLayer.createSymbol(libID3, code3, locationPoints3);

    }

    function createSymbolSuccess(evt) {
        subObjects.push(evt.feature);
        if(subObjects.length === 3){
            plottingLayer.events.un({"symbolcreated": createSymbolSuccess});
            plottingLayer.createGroupObject(subObjects,uuid);
            plottingEdit.activate();
        }
    }

    setTimeout(function () {
        try{
            var groupObject=plottingLayer.getFeatureByUuid(uuid);
            groupObject.style.strokeColor="#db900f";
            groupObject.geometry.applyStyle();
            equal(groupObject.style.strokeColor, "#db900f", "function:applyStyle");
            start();
        } catch(exception){
            ok(false, "exception occcurs,message is:" + exception.message);
            start();
        } finally {
            map.destroy();
        }

    }, 1000);


});
