module("Editor");

test("testEditor_Constructor",function () {
    var map = new SuperMap.Map("map");
    var baseLayer = new SuperMap.Layer.TiledDynamicRESTLayer("World", GlobeParameter.WorldURL, null, {maxResolution: "auto"});
    baseLayer.events.on({"layerInitialized": addLayer});
    var plottingLayer = new SuperMap.Layer.PlottingLayer("PlottingLayer", GlobeParameter.plotUrl);
    var plottingEdit = new SuperMap.Control.PlottingEdit(plottingLayer);
    function addLayer() {
        map.addLayers([baseLayer, plottingLayer]);
        map.setCenter(new SuperMap.LonLat(0, 0), 0);
    }
    var editor = new SuperMap.Plot.Editor(map, {activeLayer:plottingLayer, plottingEdit:plottingEdit});
    equal(editor.CLASS_NAME, "SuperMap.Plot.Editor", "Property.CLASS_NAME");
    ok(editor !== null, "not null");
    ok(editor.map !== null, "editor.map not null");
    ok(editor.activeLayer !== null, "editor.activeLayer not null");
});


test("testEditor_Destroy",function () {
    var map = new SuperMap.Map("map");
    var baseLayer = new SuperMap.Layer.TiledDynamicRESTLayer("World", GlobeParameter.WorldURL, null, {maxResolution: "auto"});
    baseLayer.events.on({"layerInitialized": addLayer});
    var plottingLayer = new SuperMap.Layer.PlottingLayer("PlottingLayer", GlobeParameter.plotUrl);
    var plottingEdit = new SuperMap.Control.PlottingEdit(plottingLayer);
    function addLayer() {
        map.addLayers([baseLayer, plottingLayer]);
        map.setCenter(new SuperMap.LonLat(0, 0), 0);
    }
    var editor = new SuperMap.Plot.Editor(map, {activeLayer:plottingLayer, plottingEdit:plottingEdit});

    editor.destroy();
    ok(editor !== null, "not null");
    ok(editor.map === null, "editor.map is null");
    ok(editor.activeLayer === null, "editor.activeLayer is null");
});


asyncTest("testEditor_copyFeatures",function(){
    var map = new SuperMap.Map("map");
    var baseLayer = new SuperMap.Layer.TiledDynamicRESTLayer("World", GlobeParameter.WorldURL, null, {maxResolution: "auto"});
    baseLayer.events.on({"layerInitialized": addLayer});
    var plottingLayer = new SuperMap.Layer.PlottingLayer("PlottingLayer", GlobeParameter.plotUrl);
    var plottingEdit = new SuperMap.Control.PlottingEdit(plottingLayer);
    var editor,features=[];
    var libID=421;
    var code=2;
    var locationPointWCs = [new SuperMap.Geometry.Point(50, 50)];
    plottingLayer.events.on({"symbolcreated": symbolcreated});

    function addLayer() {
        map.addLayers([baseLayer, plottingLayer]);
        map.setCenter(new SuperMap.LonLat(0, 0), 0);
        editor = new SuperMap.Plot.Editor(map, {activeLayer:plottingLayer, plottingEdit:plottingEdit});
        plottingLayer.createSymbolWC(libID,code,locationPointWCs);

    }
    function symbolcreated(evt){
        features.push(evt.feature);

    }
    setTimeout(function () {
        try{
            editor.copyFeatures(features);
            equal(editor.pasteGeoAry.length, 1, "testEditor_copyFeatures");
            start();
        } catch(exception){
            ok(false, "exception occcurs,message is:" + exception.message);
            start();
        } finally {
            map.destroy();
        }

    }, 500);

});

asyncTest("testEditor_copy",function(){
    var map = new SuperMap.Map("map");
    var baseLayer = new SuperMap.Layer.TiledDynamicRESTLayer("World", GlobeParameter.WorldURL, null, {maxResolution: "auto"});
    baseLayer.events.on({"layerInitialized": addLayer});
    var plottingLayer = new SuperMap.Layer.PlottingLayer("PlottingLayer", GlobeParameter.plotUrl);
    var plottingEdit = new SuperMap.Control.PlottingEdit(plottingLayer);
    var editor,features=[];
    var libID=421;
    var code=2;
    var locationPointWCs = [new SuperMap.Geometry.Point(50, 50)];
    plottingLayer.events.on({"symbolcreated": symbolcreated});

    function addLayer() {
        map.addLayers([baseLayer, plottingLayer]);
        map.setCenter(new SuperMap.LonLat(0, 0), 0);
        editor = new SuperMap.Plot.Editor(map, {activeLayer:plottingLayer, plottingEdit:plottingEdit});
        plottingLayer.createSymbolWC(libID,code,locationPointWCs);

    }
    function symbolcreated(evt){
        features.push(evt.feature);

    }
    setTimeout(function () {
        try{
            editor.activeLayer.selectedFeatures.push(features[0]);
            editor.copy();
            equal(editor.pasteGeoAry.length, 1, "testEditor_copy");
            start();
        } catch(exception){
            ok(false, "exception occcurs,message is:" + exception.message);
            start();
        } finally {
            map.destroy();
        }

    }, 500);


});

asyncTest("testEditor_paste",function(){
    var map = new SuperMap.Map("map");
    var baseLayer = new SuperMap.Layer.TiledDynamicRESTLayer("World", GlobeParameter.WorldURL, null, {maxResolution: "auto"});
    baseLayer.events.on({"layerInitialized": addLayer});
    var plottingLayer = new SuperMap.Layer.PlottingLayer("PlottingLayer", GlobeParameter.plotUrl);
    var plottingEdit = new SuperMap.Control.PlottingEdit(plottingLayer);
    var editor,features=[];
    var libID=421;
    var code=2;
    var locationPointWCs = [new SuperMap.Geometry.Point(50, 50)];
    plottingLayer.events.on({"symbolcreated": symbolcreated});

    function addLayer() {
        map.addLayers([baseLayer, plottingLayer]);
        map.setCenter(new SuperMap.LonLat(0, 0), 0);
        editor = new SuperMap.Plot.Editor(map, {activeLayer:plottingLayer, plottingEdit:plottingEdit});
        plottingLayer.createSymbolWC(libID,code,locationPointWCs);

    }
    function symbolcreated(evt){
        features.push(evt.feature);

    }
    setTimeout(function () {
        try{
            editor.activeLayer.selectedFeatures.push(features[0]);
            editor.copy();
            editor.paste();
            equal( editor.activeLayer.features.length, 2, "testEditor_paste");
            start();
        } catch(exception){
            ok(false, "exception occcurs,message is:" + exception.message);
            start();
        } finally {
            map.destroy();
        }

    }, 500);
});

asyncTest("testEditor_cut",function(){
    var map = new SuperMap.Map("map");
    var baseLayer = new SuperMap.Layer.TiledDynamicRESTLayer("World", GlobeParameter.WorldURL, null, {maxResolution: "auto"});
    baseLayer.events.on({"layerInitialized": addLayer});
    var plottingLayer = new SuperMap.Layer.PlottingLayer("PlottingLayer", GlobeParameter.plotUrl);
    var plottingEdit = new SuperMap.Control.PlottingEdit(plottingLayer);
    var editor,features=[];
    var libID=421;
    var code=2;
    var locationPointWCs = [new SuperMap.Geometry.Point(50, 50)];
    plottingLayer.events.on({"symbolcreated": symbolcreated});

    function addLayer() {
        map.addLayers([baseLayer, plottingLayer]);
        map.setCenter(new SuperMap.LonLat(0, 0), 0);
        editor = new SuperMap.Plot.Editor(map, {activeLayer:plottingLayer, plottingEdit:plottingEdit});
        plottingLayer.createSymbolWC(libID,code,locationPointWCs);

    }
    function symbolcreated(evt){
        features.push(evt.feature);

    }
    setTimeout(function () {
        try{
            editor.activeLayer.selectedFeatures.push(features[0]);
            editor.cut();
            equal( editor.activeLayer.features.length, 0, "testEditor_cut");
            equal( editor.pasteGeoAry.length, 1, "testEditor_cut");
            start();
        } catch(exception){
            ok(false, "exception occcurs,message is:" + exception.message);
            start();
        } finally {
            map.destroy();
        }

    }, 500);
});

