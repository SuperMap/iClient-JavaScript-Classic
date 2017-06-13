module('PlottingLayer');

var libID = 421;
var code = 10100;
var inputPoints =[new SuperMap.Geometry.Point(20, 30), new SuperMap.Geometry.Point(20, 35)];
var locationPoints = [new SuperMap.Geometry.Point(100, 200), new SuperMap.Geometry.Point(100, 230)];
var map,layer,plottingLayer;

test("testPlottingLayer_Constructor", function () {
    expect(4);
    var name = "PlottingLayer";
    map = new SuperMap.Map('map');
    plottinglayer = new SuperMap.Layer.PlottingLayer(name, GlobeParameter.plotUrl);
    map.addLayer(plottinglayer);
    ok(plottinglayer instanceof SuperMap.Layer.PlottingLayer, "layer instanceof SuperMap.Layer.PlottingLayer");
    equal(plottinglayer.name, name, "name");
    equal(plottinglayer.CLASS_NAME, "SuperMap.Layer.PlottingLayer", "CLASS_NAME");
    equal(plottinglayer.description, null, "description");
});

asyncTest("testPlottingLayer_drawFeature", function () {
    var map, layer, plottingLayer,plottingEdit;
    map = new SuperMap.Map("map");
    layer = new SuperMap.Layer.TiledDynamicRESTLayer("World", GlobeParameter.WorldURL, null, {maxResolution: "auto"});
    layer.events.on({"layerInitialized": addLayer});
    plottingLayer = new SuperMap.Layer.PlottingLayer("PlottingLayer", GlobeParameter.plotUrl);

    plottingEdit = new SuperMap.Control.PlottingEdit(plottingLayer);
    function addLayer() {
        map.addLayers([layer, plottingLayer]);
        map.setCenter(new SuperMap.LonLat(0, 0), 0);
        map.addControls([plottingEdit]);
    }
    setTimeout(function () {
        try {
            var geometry = new SuperMap.Geometry.Point(-115, 10);
            var style1 = {
                strokeColor: "#ffffff"
            };
            var pointFeature = new SuperMap.Feature.Vector(geometry, null, style1);
            plottinglayer.drawFeature(pointFeature);
            equal(pointFeature.style, style1, "function:drawFeature,测试与矢量要素的样式一致");            start();
        } catch (excepion) {
            ok(false, "exception occcurs,message is:" + excepion.message);
            start();
            map.destroy();
            layer.destroy();
            plottingLayer.destroy();
            plottingEdit.destroy();
        }
    }, 1000);
});

asyncTest("testPlottingLayer_createSymbol", function () {
    expect(1);
    var  feature;
    map = new SuperMap.Map("map");
    layer = new SuperMap.Layer.TiledDynamicRESTLayer("World", GlobeParameter.WorldURL, null, {maxResolution: "auto"});
    layer.events.on({"layerInitialized": addLayer});
    plottingLayer = new SuperMap.Layer.PlottingLayer("PlottingLayer", GlobeParameter.plotUrl);
    plottingLayer.events.on({"symbolcreated": createSymbolSuccess});

    function addLayer() {
        map.addLayers([layer, plottingLayer]);
        map.setCenter(new SuperMap.LonLat(0, 0), 0);
        plottingLayer.createSymbol(libID, code,locationPoints);
    }

    function createSymbolSuccess(evt) {
        feature = evt.feature;
    }

    setTimeout(function () {
        try {
            equal(feature.CLASS_NAME, "SuperMap.Feature.Vector", "创建标号的CLASS_NAME等于SuperMap.Feature.Vector");
            start();
        } catch (excepion) {
            ok(false, "exception occcurs,message is:" + excepion.message);
            start();
            map.destroy();
            layer.destroy();
            plottingLayer.destroy();
        }
    }, 1000);
});

asyncTest("testPlottingLayer_createSymbolWC", function () {
    expect(1);
    var  feature;
    map = new SuperMap.Map("map");
    layer = new SuperMap.Layer.TiledDynamicRESTLayer("World", GlobeParameter.WorldURL, null, {maxResolution: "auto"});
    layer.events.on({"layerInitialized": addLayer});
    plottingLayer = new SuperMap.Layer.PlottingLayer("PlottingLayer", GlobeParameter.plotUrl);
    plottingLayer.events.on({"symbolcreated": createSymbolWCSuccess});

    function addLayer() {
        map.addLayers([layer, plottingLayer]);
        map.setCenter(new SuperMap.LonLat(0, 0), 0);
        plottingLayer.createSymbolWC(libID, code,inputPoints);
    }

    function createSymbolWCSuccess(evt) {
        feature = evt.feature;
    }

    setTimeout(function () {
        try {
            equal(feature.CLASS_NAME, "SuperMap.Feature.Vector", "创建标号的CLASS_NAME等于SuperMap.Feature.Vector");
            start();
        } catch (excepion) {
            ok(false, "exception occcurs,message is:" + excepion.message);
            start();
            map.destroy();
            layer.destroy();
            plottingLayer.destroy();
        }
    }, 1500);
});


asyncTest("testPlottingLayer_createText", function () {
    expect(1);
    var feature;
    map = new SuperMap.Map("map");
    layer = new SuperMap.Layer.TiledDynamicRESTLayer("World", GlobeParameter.WorldURL, null, {maxResolution: "auto"});
    layer.events.on({"layerInitialized": addLayer});
    plottingLayer = new SuperMap.Layer.PlottingLayer("PlottingLayer", GlobeParameter.plotUrl);
    plottingLayer.events.on({"symbolcreated": createTextSuccess});

    function addLayer() {
        map.addLayers([layer, plottingLayer]);
        map.setCenter(new SuperMap.LonLat(0, 0), 0);
        var locationPoints = new SuperMap.Geometry.Point(20, 30);
        plottingLayer.createText("createText", locationPoints, {});
    }

    function createTextSuccess(evt) {
        feature = evt.feature;
    }

    setTimeout(function () {
        try {
            equal(feature.CLASS_NAME, "SuperMap.Feature.Vector", "equal className");
            start();
        } catch (excepion) {
            ok(false, "exception occcurs,message is:" + excepion.message)
            start();
            map.destroy();
            layer.destroy();
            plottingLayer.destroy();
        }
    }, 2000);
});

asyncTest("testPlottingLayer_createTextWC", function () {
    expect(2);
    var  feature;
    map = new SuperMap.Map("map");
    layer = new SuperMap.Layer.TiledDynamicRESTLayer("World", GlobeParameter.WorldURL, null, {maxResolution: "auto"});
    layer.events.on({"layerInitialized": addLayer});
    plottingLayer = new SuperMap.Layer.PlottingLayer("PlottingLayer", GlobeParameter.plotUrl);
    plottingLayer.events.on({"symbolcreated": createTextWCSuccess});

    function addLayer() {
        map.addLayers([layer, plottingLayer]);
        map.setCenter(new SuperMap.LonLat(0, 0), 0);
        var locationPoints = new SuperMap.Geometry.Point(20, 30);
        plottingLayer.createTextWC("createTextWC", locationPoints, {});
    }

    function createTextWCSuccess(evt) {
        feature = evt.feature;
    }

    setTimeout(function () {
        try {
            equal(feature.CLASS_NAME, "SuperMap.Feature.Vector", "equal className");
            equal(feature.geometry.textContent, "createTextWC", "equal textContent");
            start();
        } catch (excepion) {
            ok(false, "exception occcurs,message is:" + excepion.message);
            start();
            map.destroy();
            layer.destroy();
            plottingLayer.destroy();
        }
    }, 3000);
});


test("testPlottingLayer_removeFeatureByID", function () {
    expect(1);
    var features;
    var name = "PlottingLayer";
    map = new SuperMap.Map("map");
    layer = new SuperMap.Layer.TiledDynamicRESTLayer("World", GlobeParameter.WorldURL, null, {maxResolution: "auto"});
    plottingLayer = new SuperMap.Layer.PlottingLayer(name,  GlobeParameter.plotUrl);
    map.addLayers([layer, plottingLayer]);
    var point1 = new SuperMap.Geometry.Point(-111.04, 45.68);
    var pointFeature1 = new SuperMap.Feature.Vector(point1);
    plottingLayer.addFeatures(pointFeature1);
    id = pointFeature1.id;
    features = plottingLayer.removeFeatureByID(id);
    equal(features, undefined, "根据ID删除指定的feature。");
});


test("testPlottingLayer_getFeatureAt", function () {
    expect(1);
    var map, layer;
    var name = "PlottingLayer";
    var serverUrl = GlobeParameter.plotUrl;
    var url = GlobeParameter.WorldURL;
    map = new SuperMap.Map("map");
    layer = new SuperMap.Layer.TiledDynamicRESTLayer("World", url, null, {maxResolution: "auto"});
    var plottingLayer = new SuperMap.Layer.PlottingLayer(name, GlobeParameter.plotUrl);
    map.addLayers([layer, plottingLayer]);
    var point1 = new SuperMap.Geometry.Point(11, 22);
    var pointFeature1 = new SuperMap.Feature.Vector(point1);
    plottingLayer.addFeatures(pointFeature1);
    featureTest = plottingLayer.getFeatureAt(0);
    ok(featureTest, pointFeature1[0], "获取图层上指定索引的feature。");
    plottingLayer.destroy();
});


test("testPlottingLayer_removeFeatureAt", function () {
    expect(1);
    var map, layer;
    var name = "PlottingLayer";
    var serverUrl = GlobeParameter.plotUrl;
    var url = GlobeParameter.WorldURL;
    map = new SuperMap.Map("map");
    layer = new SuperMap.Layer.TiledDynamicRESTLayer("World", url, null, {maxResolution: "auto"});
    var plottingLayer = new SuperMap.Layer.PlottingLayer(name, GlobeParameter.plotUrl);
    map.addLayers([layer, plottingLayer]);
    var pointFeatures = [];
    var points = [[11, 22], [22, 11]];
    for (i = 0; i < points.length; i++) {
        var point = new SuperMap.Geometry.Point(points[i][0], points[i][1]);
        var pointFeature = new SuperMap.Feature.Vector(point, {
            FEATUREID: points[i][0],
            TIME: points[i][1]
        });
        pointFeatures.push(pointFeature);
    }
    plottingLayer.addFeatures(pointFeatures);
    featureTest = plottingLayer.removeFeatureAt(0);
    equal(featureTest, undefined, "删除图层上指定索引的feature。");
});

asyncTest("testPlottingLayer_getFeatureByUuid", function () {
    expect(1);
    map = new SuperMap.Map("map");
    layer = new SuperMap.Layer.TiledDynamicRESTLayer("world", GlobeParameter.WorldURL, null, {maxResolution : "auto"});
    layer.events.on({"layerInitialized" : addLayer});
    plottingLayer = new SuperMap.Layer.PlottingLayer("PlottingLayer", GlobeParameter.plotUrl);
    plottingLayer.events.on({"symbolcreated": createSymbolSuccess});

    var feature;
    var uuid = "uuid-1-2-3-4-a-b";

    function addLayer() {
        map.addLayers([layer,plottingLayer]);
        map.setCenter(new SuperMap.LonLat(0,0),0);
        plottingLayer.createSymbol(libID, code,locationPoints,uuid);
    }
    function createSymbolSuccess(evt) {
        feature = evt.feature;
    }

    setTimeout(function(){
        try{
            feature = plottingLayer.getFeatureByUuid(uuid);
            equal(feature.geometry.uuid,uuid ,"getFeatureByUuid");
            start();
            map.destroy();
            layer.destroy();
            plottingLayer.destroy();
        }catch(excepion){
            ok(false,"excepion occcur,message is" + excepion.message);
            start();

        }
    },300)
});

asyncTest("testPlottingLayer_createLineRelation", function () {
    expect(4);
    map = new SuperMap.Map('map');
    layer = new SuperMap.Layer.TiledDynamicRESTLayer('world', GlobeParameter.WorldURL, {maxResolution : "auto"});
    layer.events.on({"layerInitialized" : addLayer});
    plottingLayer = new SuperMap.Layer.PlottingLayer("PlottingLayer", GlobeParameter.plotUrl);
    plottingLayer.events.on({"symbolcreated" : createSymbolSuccess});
    var features = [];
    var uuid1="uuid-LINERELATION-1001-1";
    var uuid2="uuid-LINERELATION-1001-2";

    function addLayer(){
        map.addLayers([layer,plottingLayer]);
        map.setCenter(new SuperMap.LonLat(0,0),0);
        layer.events.un({"layerInitialized" : addLayer});
        //创建点标号
        var locationPointWCs1 = [new SuperMap.Geometry.Point(-10, 0)];
        plottingLayer.createSymbolWC(421,20100,locationPointWCs1,"uuid-421-20100", {}, {}, {text:"用户自定义信息"});
        //创建点标号
        var locationPointWCs2 = [new SuperMap.Geometry.Point(20, 30)];
        plottingLayer.createSymbolWC(421,20200,locationPointWCs2, "uuid-421-20200", {}, {}, {text:"用户自定义信息"});
        //创建点标号
        var locationPointWCs3 = [new SuperMap.Geometry.Point(-30, 30)];
        plottingLayer.createSymbolWC(421,20300,locationPointWCs3,"uuid-421-20300", {}, {}, {text:"用户自定义信息"});
    }

    function createSymbolSuccess(evt){
        features.push(evt.feature);
        if(features.length === 3 ){
            plottingLayer.createLineRelation(features[0].geometry.uuid, features[1].geometry.uuid, SuperMap.Plot.LineRelation.SOLID, uuid1, {}, {text:"用户自定义信息"});
            plottingLayer.createLineRelation(features[0].geometry.uuid, features[2].geometry.uuid, SuperMap.Plot.LineRelation.DASH, uuid2, {}, {text:"用户自定义信息1"});
            plottingLayer.events.un({"symbolcreated": createSymbolSuccess});
        }
    }
    setTimeout(function(){
        try{
            var featureLineRelation1 = plottingLayer.getFeatureByUuid(uuid1);
            var featureLineRelation2 = plottingLayer.getFeatureByUuid(uuid2);
            equal(featureLineRelation1.geometry.uuid,"uuid-LINERELATION-1001-1","createLineRelation");
            equal(featureLineRelation2.geometry.uuid,"uuid-LINERELATION-1001-2","createLineRelation");
            equal(featureLineRelation1.geometry.symbolType,SuperMap.Plot.SymbolType.LINERELATION,"createLineRelation");
            equal(featureLineRelation2.geometry.symbolType,SuperMap.Plot.SymbolType.LINERELATION,"createLineRelation");
            start();
        }catch(excepion){
            ok(false,"excepion occcur,message is" + excepion.message);
            start();
            map.destroy();
            layer.destroy();
            plottingLayer.destroy();
        }
    },1000);
});



asyncTest("testPlottingLayer_createInterferenceBeam", function() {
    expect(3);
    map = new SuperMap.Map('map');
    layer = new SuperMap.Layer.TiledDynamicRESTLayer('world', GlobeParameter.WorldURL, null, {maxResolution:'auto'});
    layer.events.on({"layerInitialized" : addLayer});
    plottingLayer = new SuperMap.Layer.PlottingLayer('PlottingLayer', GlobeParameter.plotUrl);
    plottingLayer.events.on({"symbolcreated": symbolCreated});
    var uuid = "iInterferenceBeam";
    function addLayer(){
        map.addLayers([layer,plottingLayer]);
        map.setCenter(new SuperMap.LonLat(0,0),0);
        layer.events.un({"layerInitialized" : addLayer});
        var locationPointWCs1 = [new SuperMap.Geometry.Point(65, 26)];
        plottingLayer.createSymbolWC(100, 2800, locationPointWCs1,"subInterferenceBeam", {}, {}, {text:"用户自定义属性"});
    }
    function symbolCreated(evt){
        plottingLayer.events.un({"symbolcreated": symbolCreated});
            var locationPointWCs = [];
            locationPointWCs.push(new SuperMap.Geometry.Point(41,12));
            locationPointWCs.push(new SuperMap.Geometry.Point(96,5));
            locationPointWCs.push(new SuperMap.Geometry.Point(90,40));
            locationPointWCs.push(new SuperMap.Geometry.Point(66,48));
            var associatedUuid = evt.feature.geometry.uuid;
            plottingLayer.createInterferenceBeam(associatedUuid, locationPointWCs, uuid, {}, null, {text:"干扰波束"});
    }

    setTimeout(function(){
        try{
            var featureInterferenceBeam = plottingLayer.getFeatureByUuid(uuid);
            equal(featureInterferenceBeam.geometry.uuid,"iInterferenceBeam","createInterferenceBeam");
            equal(featureInterferenceBeam.geometry.symbolType,SuperMap.Plot.SymbolType.INTERFERENCEBEAM,"createInterferenceBeam");
            equal(featureInterferenceBeam.geometry.code,1002,"createInterferenceBeam");
            start()
        } catch(excepion){
            ok(false,"excepion occcur,message is" + excepion.message);
            start();
            map.destroy();
            layer.destroy();
            plottingLayer.destroy();
        }
    },500)
});


asyncTest("testPlottingLayer_createPolygonRegion", function(){
    expect(3);
    map = new SuperMap.Map('map');
    layer = new SuperMap.Layer.TiledDynamicRESTLayer('world', GlobeParameter.WorldURL, null, {maxResolution:'auto'});
    layer.events.on({"layerInitialized" : addLayer});
    plottingLayer = new SuperMap.Layer.PlottingLayer('PlottingLayer', GlobeParameter.plotUrl);
    var uuid="iPolygonRegion";

    function addLayer(){
        map.addLayers([layer,plottingLayer]);
        map.setCenter(new SuperMap.LonLat(0,0),0);
        layer.events.un({"layerInitialized" : addLayer});

        var locationPointWCs = [];
        locationPointWCs.push(new SuperMap.Geometry.Point(41,12));
        locationPointWCs.push(new SuperMap.Geometry.Point(96,5));
        locationPointWCs.push(new SuperMap.Geometry.Point(90,40));
        locationPointWCs.push(new SuperMap.Geometry.Point(66,48));
        plottingLayer.createPolygonRegion(locationPointWCs, "多边形区域", 1, uuid, {}, null, {text:"多边形区域"});
    }

    setTimeout(function(){
        try{
            equal(plottingLayer.features[0].geometry.uuid,"iPolygonRegion","createPolygonRegion");
            equal(plottingLayer.features[0].geometry.symbolType,SuperMap.Plot.SymbolType.POLYGONREGION,"createPolygonRegion");
            equal(plottingLayer.features[0].geometry.code,1003,"createPolygonRegion");
            start();
        }catch(excepion){
            ok(false,"excepion occcur,message is" + excepion.message);
            start();
            map.destroy();
            layer.destroy();
            plottingLayer.destroy();
        }
    },500)
});



asyncTest("testPlottingLayer_createArcRegion", function(){
    expect(5);
    map = new SuperMap.Map('map');
    layer = new SuperMap.Layer.TiledDynamicRESTLayer('world', GlobeParameter.WorldURL, null, {maxResolution:'auto'});
    layer.events.on({"layerInitialized" : addLayer});
    plottingLayer = new SuperMap.Layer.PlottingLayer('PlottingLayer', GlobeParameter.plotUrl);
    plottingLayer.spatialAnalystUrl=GlobeParameter.spatialAnalystURL;

    function addLayer(){
        map.addLayers([layer,plottingLayer]);
        map.setCenter(new SuperMap.LonLat(0,0),0);
        layer.events.un({"layerInitialized" : addLayer});
        var uuid="iArcRegion";
        locationPointWCs = new SuperMap.Geometry.Point(103,31);
        var options = {radiusText: ["text1", "text2"], radiusPosAngle: 60, radiusLineType: SuperMap.Plot.RadiusLineType.ARROW};
        plottingLayer.createArcRegion(locationPointWCs, 1500, 0, 100, "扇形区域", 50, uuid, {}, options, {text:"扇形区域"});
    }

    setTimeout(function(){
        try{
            equal(plottingLayer.features[0].geometry.uuid,"iArcRegion","createArcRegion");
            equal(plottingLayer.features[0].geometry.symbolType,SuperMap.Plot.SymbolType.ARCREGION,"createArcRegion");
            equal(plottingLayer.features[0].geometry.code,1004,"createArcRegion");
            equal(plottingLayer.features[0].geometry.radius,1500,"createArcRegion");
            equal(plottingLayer.features[0].geometry.startAngle,0,"createArcRegion");
            start();
        }catch(excepion){
            ok(false,"excepion occcur,message is" + excepion.message);
            start();
            map.destroy();
            layer.destroy();
            plottingLayer.destroy();
        }
    },500)
});


asyncTest("testPlottingLayer_createAirRoute", function(){
    expect(8);
    map = new SuperMap.Map('map');
    layer = new SuperMap.Layer.TiledDynamicRESTLayer('world', GlobeParameter.WorldURL, null, {maxResolution:'auto'});
    layer.events.on({"layerInitialized" : addLayer});
    plottingLayer = new SuperMap.Layer.PlottingLayer('PlottingLayer', GlobeParameter.plotUrl);

    var uuid="iKJRoute";//实体的唯一标识
    function addLayer(){
        map.addLayers([layer,plottingLayer]);
        map.setCenter(new SuperMap.LonLat(0,0),0);
        layer.events.un({"layerInitialized" : addLayer});

        var arrRoutePts = [];
        var routePoints = [];
        routePoints.push(new SuperMap.Geometry.Point(0, 0));
        routePoints.push(new SuperMap.Geometry.Point(50, 0));
        routePoints.push(new SuperMap.Geometry.Point(50, 50));
        routePoints.push(new SuperMap.Geometry.Point(0, 50));
        routePoints.push(new SuperMap.Geometry.Point(0, 0));
        arrRoutePts.push(routePoints);

        //待机点
        var routeNode1 = new SuperMap.Plot.RouteNode();
        routeNode1.positionPoint = new SuperMap.Geometry.Point(0, 0);
        routeNode1.type = SuperMap.Plot.RouteNodeType.STANDBY;
        routeNode1.index = 1;

        //起飞点
        var routeNode2 = new SuperMap.Plot.RouteNode();
        routeNode2.positionPoint = new SuperMap.Geometry.Point(50, 0);
        routeNode2.type = SuperMap.Plot.RouteNodeType.TAKEOFF;
        routeNode2.index = 2;

        //展开点
        var routeNode3 = new SuperMap.Plot.RouteNode();
        routeNode3.positionPoint = new SuperMap.Geometry.Point(50, 50);
        routeNode3.type = SuperMap.Plot.RouteNodeType.EXPANDING;
        routeNode3.index = 3;

        //可视化初始点
        var routeNode4 = new SuperMap.Plot.RouteNode();
        routeNode4.positionPoint = new SuperMap.Geometry.Point(0, 50);
        routeNode4.type = SuperMap.Plot.RouteNodeType.VISUALINITAL;
        routeNode4.index = 4;

        //创建指向节点
        var textContents = [];
        textContents.push("方向");
        textContents.push("速度");
        textContents.push("高度");
        textContents.push("时间");
        var towardNode1 = new SuperMap.Plot.TowardNode({routeNodeId:routeNode2.id,textContent:textContents});
        routeNode1.towardNodes.push(towardNode1);

        var towardNode2 = new SuperMap.Plot.TowardNode({routeNodeId:routeNode3.id,textContent:textContents});
        routeNode2.towardNodes.push(towardNode2);

        var towardNode3 = new SuperMap.Plot.TowardNode({routeNodeId:routeNode4.id,textContent:textContents});
        routeNode3.towardNodes.push(towardNode3);

        var towardNode4 = new SuperMap.Plot.TowardNode({routeNodeId:routeNode1.id,textContent:textContents});
        routeNode4.towardNodes.push(towardNode4);

        var routeNodes = [];
        routeNodes.push(routeNode1);
        routeNodes.push(routeNode2);
        routeNodes.push(routeNode3);
        routeNodes.push(routeNode4);

        plottingLayer.createAirRoute(arrRoutePts, routeNodes,uuid, null, null, {text:"用户自定义属性"});
    }

    setTimeout(function(){
        try{
            var featureAirRoute =  plottingLayer.getFeatureByUuid(uuid);
            equal(featureAirRoute.geometry.uuid,"iKJRoute","createAirRoute");
            equal(featureAirRoute.geometry.code,1005,"createAirRoute");
            equal(featureAirRoute.geometry.routeNodes[0].positionPoint.x,0,"createAirRoute");
            equal(featureAirRoute.geometry.routeNodes[0].positionPoint.y,0,"createAirRoute");
            equal(featureAirRoute.geometry.routeNodes[0].type,"STANDBY","createAirRoute");

            equal(featureAirRoute.geometry.routeNodes[3].positionPoint.x,0,"createAirRoute");
            equal(featureAirRoute.geometry.routeNodes[3].positionPoint.y,50,"createAirRoute");
            equal(featureAirRoute.geometry.routeNodes[3].type,"VISUALINITAL","createAirRoute");
            start();
        }catch(excepion){
            ok(false,"excepion occcur,message is" + excepion.message);
            start();
            map.destroy();
            layer.destroy();
            plottingLayer.destroy();
        }
    },500)
});


asyncTest("testPlottingLayer_createNavyRoute", function () {
    expect(11);
    map = new SuperMap.Map('map');
    layer = new SuperMap.Layer.TiledDynamicRESTLayer("world", GlobeParameter.WorldURL, {maxResolution :"auto"});
    layer.events.on({"layerInitialized" : addLayer});
    plottingLayer = new SuperMap.Layer.PlottingLayer("PlottingLayer", GlobeParameter.plotUrl);
    var uuid="iNavyRoute";//实体的唯一标识
    function addLayer(){
        map.addLayers([layer,plottingLayer]);
        map.setCenter(new SuperMap.LonLat(0,0),0);
        layer.events.un({"layerInitialized" : addLayer});
        //待机点
        //待机点
        var routeNode1 = new SuperMap.Plot.RouteNode();
        routeNode1.positionPoint = new SuperMap.Geometry.Point(-30, -10);
        routeNode1.type = SuperMap.Plot.RouteNodeType.STANDBY;
        routeNode1.index = 1;

        //起飞点
        var routeNode2 = new SuperMap.Plot.RouteNode();
        routeNode2.positionPoint = new SuperMap.Geometry.Point(-20, -10);
        routeNode2.type = SuperMap.Plot.RouteNodeType.TAKEOFF;
        routeNode2.index = 2;

        //展开点
        var routeNode3 = new SuperMap.Plot.RouteNode();
        routeNode3.positionPoint = new SuperMap.Geometry.Point(-10, -10);
        routeNode3.type = SuperMap.Plot.RouteNodeType.EXPANDING;
        routeNode3.index = 3;

        //可视化初始点
        var routeNode4 = new SuperMap.Plot.RouteNode();
        routeNode4.positionPoint = new SuperMap.Geometry.Point(0, -15);
        routeNode4.type = SuperMap.Plot.RouteNodeType.VISUALINITAL;
        routeNode4.index = 4;

        //补给点
        var routeNode5 = new SuperMap.Plot.RouteNode();
        routeNode5.positionPoint = new SuperMap.Geometry.Point(0, -5);
        routeNode5.type = SuperMap.Plot.RouteNodeType.SUPPLY;
        routeNode5.index = 5;

        //普通航路点
        var routeNode6 = new SuperMap.Plot.RouteNode();
        routeNode6.positionPoint = new SuperMap.Geometry.Point(10, -5);
        routeNode6.type = SuperMap.Plot.RouteNodeType.COMMONROUTE;
        routeNode6.index = 6;

        //齐射点
        var routeNode7 = new SuperMap.Plot.RouteNode();
        routeNode7.positionPoint = new SuperMap.Geometry.Point(10, -15);
        routeNode7.type = SuperMap.Plot.RouteNodeType.VOLLEY;
        routeNode7.index = 7;

        //初始点
        var routeNode8 = new SuperMap.Plot.RouteNode();
        routeNode8.positionPoint = new SuperMap.Geometry.Point(20, -15);
        routeNode8.type = SuperMap.Plot.RouteNodeType.INITIAL;
        routeNode8.index = 8;

        //武器发射点
        var routeNode9 = new SuperMap.Plot.RouteNode();
        routeNode9.positionPoint = new SuperMap.Geometry.Point(20, -5);
        routeNode9.type = SuperMap.Plot.RouteNodeType.WEAPONLAUNCH;
        routeNode9.index = 9;

        //会合点
        var routeNode10 = new SuperMap.Plot.RouteNode();
        routeNode10.positionPoint = new SuperMap.Geometry.Point(30, -10);
        routeNode10.type = SuperMap.Plot.RouteNodeType.RENDEZVOUS;
        routeNode10.index = 10;

        //转弯点
        var routeNode11 = new SuperMap.Plot.RouteNode();
        routeNode11.positionPoint = new SuperMap.Geometry.Point(40, -10);
        routeNode11.type = SuperMap.Plot.RouteNodeType.TURNING;
        routeNode11.index = 11;

        //发射点
        var routeNode12 = new SuperMap.Plot.RouteNode();
        routeNode12.positionPoint = new SuperMap.Geometry.Point(50, -10);
        routeNode12.type = SuperMap.Plot.RouteNodeType.LANCH;
        routeNode12.index = 12;

        //目标瞄准点
        var routeNode13 = new SuperMap.Plot.RouteNode();
        routeNode13.positionPoint = new SuperMap.Geometry.Point(60, -10);
        routeNode13.type = SuperMap.Plot.RouteNodeType.AIMING;
        routeNode13.index = 13;

        //创建指向节点
        var arrRoutPts = [];
        var pts = [];
        //创建指向节点
        var towardNode1 = new SuperMap.Plot.TowardNode({routeNodeId:routeNode2.id,textContent:"1XXXXX",relLineText:SuperMap.Plot.RelLineText.ONLEFTLINE});
        routeNode1.towardNodes.push(towardNode1);
        pts.push(routeNode1.positionPoint.clone());
        pts.push(routeNode2.positionPoint.clone());
        arrRoutPts.push(pts);

        var towardNode2 = new SuperMap.Plot.TowardNode({routeNodeId:routeNode3.id,textContent:"1XXXXX",relLineText:SuperMap.Plot.RelLineText.ONLEFTLINE});
        routeNode2.towardNodes.push(towardNode2);
        pts = [];
        pts.push(routeNode2.positionPoint.clone());
        pts.push(routeNode3.positionPoint.clone());
        arrRoutPts.push(pts);

        var towardNode3 = new SuperMap.Plot.TowardNode({routeNodeId:routeNode4.id,textContent:"1XXXXX",relLineText:SuperMap.Plot.RelLineText.ONLEFTLINE});
        routeNode3.towardNodes.push(towardNode3);
        pts = [];
        pts.push(routeNode3.positionPoint.clone());
        pts.push(routeNode4.positionPoint.clone());
        arrRoutPts.push(pts);

        var towardNode4 = new SuperMap.Plot.TowardNode({routeNodeId:routeNode5.id,textContent:"1XXXXX",relLineText:SuperMap.Plot.RelLineText.ONLEFTLINE});
        routeNode3.towardNodes.push(towardNode4);
        pts = [];
        pts.push(routeNode3.positionPoint.clone());
        pts.push(routeNode5.positionPoint.clone());
        arrRoutPts.push(pts);

        var towardNode5 = new SuperMap.Plot.TowardNode({routeNodeId:routeNode6.id,textContent:"1XXXXX",relLineText:SuperMap.Plot.RelLineText.ONLEFTLINE});
        routeNode5.towardNodes.push(towardNode5);
        pts = [];
        pts.push(routeNode5.positionPoint.clone());
        pts.push(routeNode6.positionPoint.clone());
        arrRoutPts.push(pts);

        var towardNode6 = new SuperMap.Plot.TowardNode({routeNodeId:routeNode7.id,textContent:"1XXXXX",relLineText:SuperMap.Plot.RelLineText.ONLEFTLINE});
        routeNode4.towardNodes.push(towardNode6);
        pts = [];
        pts.push(routeNode4.positionPoint.clone());
        pts.push(routeNode7.positionPoint.clone());
        arrRoutPts.push(pts);

        var towardNode13 = new SuperMap.Plot.TowardNode({routeNodeId:routeNode9.id,textContent:"1XXXXX",relLineText:SuperMap.Plot.RelLineText.ONLEFTLINE});
        routeNode6.towardNodes.push(towardNode13);
        pts = [];
        pts.push(routeNode6.positionPoint.clone());
        pts.push(routeNode9.positionPoint.clone());
        arrRoutPts.push(pts);

        var towardNode7 = new SuperMap.Plot.TowardNode({routeNodeId:routeNode8.id,textContent:"1XXXXX",relLineText:SuperMap.Plot.RelLineText.ONLEFTLINE});
        routeNode7.towardNodes.push(towardNode7);
        pts = [];
        pts.push(routeNode7.positionPoint.clone());
        pts.push(routeNode8.positionPoint.clone());
        arrRoutPts.push(pts);

        var towardNode8 = new SuperMap.Plot.TowardNode({routeNodeId:routeNode10.id,textContent:"1XXXXX",relLineText:SuperMap.Plot.RelLineText.ONLEFTLINE});
        routeNode8.towardNodes.push(towardNode8);
        pts = [];
        pts.push(routeNode8.positionPoint.clone());
        pts.push(routeNode10.positionPoint.clone());
        arrRoutPts.push(pts);

        var towardNode9 = new SuperMap.Plot.TowardNode({routeNodeId:routeNode10.id,textContent:"1XXXXX",relLineText:SuperMap.Plot.RelLineText.ONLEFTLINE});
        routeNode9.towardNodes.push(towardNode9);
        pts = [];
        pts.push(routeNode9.positionPoint.clone());
        pts.push(routeNode10.positionPoint.clone());
        arrRoutPts.push(pts);

        var towardNode10 = new SuperMap.Plot.TowardNode({routeNodeId:routeNode11.id,textContent:"1XXXXX",relLineText:SuperMap.Plot.RelLineText.ONLEFTLINE});
        routeNode10.towardNodes.push(towardNode10);
        pts = [];
        pts.push(routeNode10.positionPoint.clone());
        pts.push(routeNode11.positionPoint.clone());
        arrRoutPts.push(pts);

        var towardNode11 = new SuperMap.Plot.TowardNode({routeNodeId:routeNode12.id,textContent:"1XXXXX",relLineText:SuperMap.Plot.RelLineText.ONLEFTLINE});
        routeNode11.towardNodes.push(towardNode11);
        pts = [];
        pts.push(routeNode11.positionPoint.clone());
        pts.push(routeNode12.positionPoint.clone());
        arrRoutPts.push(pts);

        var towardNode12 = new SuperMap.Plot.TowardNode({routeNodeId:routeNode13.id,textContent:"1XXXXX",relLineText:SuperMap.Plot.RelLineText.ONLEFTLINE});
        routeNode12.towardNodes.push(towardNode12);
        pts = [];
        pts.push(routeNode12.positionPoint.clone());
        pts.push(routeNode13.positionPoint.clone());
        arrRoutPts.push(pts);


        var routeNodes = [];
        routeNodes.push(routeNode1);
        routeNodes.push(routeNode2);
        routeNodes.push(routeNode3);
        routeNodes.push(routeNode4);
        routeNodes.push(routeNode5);
        routeNodes.push(routeNode6);
        routeNodes.push(routeNode7);
        routeNodes.push(routeNode8);
        routeNodes.push(routeNode9);
        routeNodes.push(routeNode10);
        routeNodes.push(routeNode11);
        routeNodes.push(routeNode12);
        routeNodes.push(routeNode13);

        plottingLayer.createNavyRoute(arrRoutPts,routeNodes, uuid, null, null, {text:"用户自定义属性"});    }

    setTimeout(function(){
        try{
            var featureNavyRoute =  plottingLayer.getFeatureByUuid(uuid);
            equal(featureNavyRoute.geometry.uuid,"iNavyRoute","createNavyRoute");
            equal(featureNavyRoute.geometry.code,1006,"createNavyRoute");
            equal(featureNavyRoute.geometry.routeNodes[0].positionPoint.x,-30,"createNavyRoute");
            equal(featureNavyRoute.geometry.routeNodes[0].positionPoint.y,-10,"createNavyRoute");
            equal(featureNavyRoute.geometry.routeNodes[0].type,"STANDBY","createNavyRoute");

            equal(featureNavyRoute.geometry.routeNodes[5].positionPoint.x,10,"createNavyRoute");
            equal(featureNavyRoute.geometry.routeNodes[5].positionPoint.y,-5,"createNavyRoute");
            equal(featureNavyRoute.geometry.routeNodes[5].type,"COMMONROUTE","createNavyRoute");

            equal(featureNavyRoute.geometry.routeNodes[12].positionPoint.x,60,"createNavyRoute");
            equal(featureNavyRoute.geometry.routeNodes[12].positionPoint.y,-10,"createNavyRoute");
            equal(featureNavyRoute.geometry.routeNodes[12].type,"AIMING","createNavyRoute");
            start();
        }catch(excepion){
            ok(false,"excepion occcur,message is" + excepion.message);
            start();
            map.destroy();
            layer.destroy();
            plottingLayer.destroy();
        }
    },500)
});


asyncTest("testPlottingLayer_createMissileRoute", function () {
    expect(11);
    map = new SuperMap.Map('map');
    layer = new SuperMap.Layer.TiledDynamicRESTLayer("world", GlobeParameter.WorldURL, {maxResolution :"auto"});
    layer.events.on({"layerInitialized" : addLayer});
    plottingLayer = new SuperMap.Layer.PlottingLayer("PlottingLayer", GlobeParameter.plotUrl);
    var uuid="iMissileRoute";//实体的唯一标识

    function addLayer(){
        map.addLayers([layer,plottingLayer]);
        map.setCenter(new SuperMap.LonLat(0,0),0);
        layer.events.un({"layerInitialized" : addLayer});

        //待机点
        var routeNode1 = new SuperMap.Plot.RouteNode();
        routeNode1.positionPoint = new SuperMap.Geometry.Point(-30, 0);
        routeNode1.type = SuperMap.Plot.RouteNodeType.STANDBY;
        routeNode1.index = 1;

        //起飞点
        var routeNode2 = new SuperMap.Plot.RouteNode();
        routeNode2.positionPoint = new SuperMap.Geometry.Point(-20, 0);
        routeNode2.type = SuperMap.Plot.RouteNodeType.TAKEOFF;
        routeNode2.index = 2;

        //展开点
        var routeNode3 = new SuperMap.Plot.RouteNode();
        routeNode3.positionPoint = new SuperMap.Geometry.Point(-10, 0);
        routeNode3.type = SuperMap.Plot.RouteNodeType.EXPANDING;
        routeNode3.index = 3;

        //可视化初始点
        var routeNode4 = new SuperMap.Plot.RouteNode();
        routeNode4.positionPoint = new SuperMap.Geometry.Point(0, -5);
        routeNode4.type = SuperMap.Plot.RouteNodeType.VISUALINITAL;
        routeNode4.index = 4;

        //补给点
        var routeNode5 = new SuperMap.Plot.RouteNode();
        routeNode5.positionPoint = new SuperMap.Geometry.Point(0, 5);
        routeNode5.type = SuperMap.Plot.RouteNodeType.SUPPLY;
        routeNode5.index = 5;

        //普通航路点
        var routeNode6 = new SuperMap.Plot.RouteNode();
        routeNode6.positionPoint = new SuperMap.Geometry.Point(10, 5);
        routeNode6.type = SuperMap.Plot.RouteNodeType.COMMONROUTE;
        routeNode6.index = 6;

        //齐射点
        var routeNode7 = new SuperMap.Plot.RouteNode();
        routeNode7.positionPoint = new SuperMap.Geometry.Point(10, -5);
        routeNode7.type = SuperMap.Plot.RouteNodeType.VOLLEY;
        routeNode7.index = 7;

        //初始点
        var routeNode8 = new SuperMap.Plot.RouteNode();
        routeNode8.positionPoint = new SuperMap.Geometry.Point(20, -5);
        routeNode8.type = SuperMap.Plot.RouteNodeType.INITIAL;
        routeNode8.index = 8;

        //武器发射点
        var routeNode9 = new SuperMap.Plot.RouteNode();
        routeNode9.positionPoint = new SuperMap.Geometry.Point(20, 5);
        routeNode9.type = SuperMap.Plot.RouteNodeType.WEAPONLAUNCH;
        routeNode9.index = 9;

        //会合点
        var routeNode10 = new SuperMap.Plot.RouteNode();
        routeNode10.positionPoint = new SuperMap.Geometry.Point(30, 0);
        routeNode10.type = SuperMap.Plot.RouteNodeType.RENDEZVOUS;
        routeNode10.index = 10;

        //转弯点
        var routeNode11 = new SuperMap.Plot.RouteNode();
        routeNode11.positionPoint = new SuperMap.Geometry.Point(40, 0);
        routeNode11.type = SuperMap.Plot.RouteNodeType.TURNING;
        routeNode11.index = 11;

        //发射点
        var routeNode12 = new SuperMap.Plot.RouteNode();
        routeNode12.positionPoint = new SuperMap.Geometry.Point(50, 0);
        routeNode12.type = SuperMap.Plot.RouteNodeType.LANCH;
        routeNode12.index = 12;

        //目标瞄准点
        var routeNode13 = new SuperMap.Plot.RouteNode();
        routeNode13.positionPoint = new SuperMap.Geometry.Point(60, 0);
        routeNode13.type = SuperMap.Plot.RouteNodeType.AIMING;
        routeNode13.index = 13;

        var arrRoutPts = [];
        var pts = [];
        //创建指向节点
        var towardNode1 = new SuperMap.Plot.TowardNode({routeNodeId:routeNode2.id,textContent:"1XXXXX",relLineText:SuperMap.Plot.RelLineText.ONLEFTLINE});
        routeNode1.towardNodes.push(towardNode1);
        pts.push(routeNode1.positionPoint.clone());
        pts.push(routeNode2.positionPoint.clone());
        arrRoutPts.push(pts);

        var towardNode2 = new SuperMap.Plot.TowardNode({routeNodeId:routeNode3.id,textContent:"1XXXXX",relLineText:SuperMap.Plot.RelLineText.ONLEFTLINE});
        routeNode2.towardNodes.push(towardNode2);
        pts = [];
        pts.push(routeNode2.positionPoint.clone());
        pts.push(routeNode3.positionPoint.clone());
        arrRoutPts.push(pts);

        var towardNode3 = new SuperMap.Plot.TowardNode({routeNodeId:routeNode4.id,textContent:"1XXXXX",relLineText:SuperMap.Plot.RelLineText.ONLEFTLINE});
        routeNode3.towardNodes.push(towardNode3);
        pts = [];
        pts.push(routeNode3.positionPoint.clone());
        pts.push(routeNode4.positionPoint.clone());
        arrRoutPts.push(pts);

        var towardNode4 = new SuperMap.Plot.TowardNode({routeNodeId:routeNode5.id,textContent:"1XXXXX",relLineText:SuperMap.Plot.RelLineText.ONLEFTLINE});
        routeNode3.towardNodes.push(towardNode4);
        pts = [];
        pts.push(routeNode3.positionPoint.clone());
        pts.push(routeNode5.positionPoint.clone());
        arrRoutPts.push(pts);

        var towardNode5 = new SuperMap.Plot.TowardNode({routeNodeId:routeNode6.id,textContent:"1XXXXX",relLineText:SuperMap.Plot.RelLineText.ONLEFTLINE});
        routeNode5.towardNodes.push(towardNode5);
        pts = [];
        pts.push(routeNode5.positionPoint.clone());
        pts.push(routeNode6.positionPoint.clone());
        arrRoutPts.push(pts);

        var towardNode6 = new SuperMap.Plot.TowardNode({routeNodeId:routeNode7.id,textContent:"1XXXXX",relLineText:SuperMap.Plot.RelLineText.ONLEFTLINE});
        routeNode4.towardNodes.push(towardNode6);
        pts = [];
        pts.push(routeNode4.positionPoint.clone());
        pts.push(routeNode7.positionPoint.clone());
        arrRoutPts.push(pts);

        var towardNode13 = new SuperMap.Plot.TowardNode({routeNodeId:routeNode9.id,textContent:"1XXXXX",relLineText:SuperMap.Plot.RelLineText.ONLEFTLINE});
        routeNode6.towardNodes.push(towardNode13);
        pts = [];
        pts.push(routeNode6.positionPoint.clone());
        pts.push(routeNode9.positionPoint.clone());
        arrRoutPts.push(pts);

        var towardNode7 = new SuperMap.Plot.TowardNode({routeNodeId:routeNode8.id,textContent:"1XXXXX",relLineText:SuperMap.Plot.RelLineText.ONLEFTLINE});
        routeNode7.towardNodes.push(towardNode7);
        pts = [];
        pts.push(routeNode7.positionPoint.clone());
        pts.push(routeNode8.positionPoint.clone());
        arrRoutPts.push(pts);

        var towardNode8 = new SuperMap.Plot.TowardNode({routeNodeId:routeNode10.id,textContent:"1XXXXX",relLineText:SuperMap.Plot.RelLineText.ONLEFTLINE});
        routeNode8.towardNodes.push(towardNode8);
        pts = [];
        pts.push(routeNode8.positionPoint.clone());
        pts.push(routeNode10.positionPoint.clone());
        arrRoutPts.push(pts);

        var towardNode9 = new SuperMap.Plot.TowardNode({routeNodeId:routeNode10.id,textContent:"1XXXXX",relLineText:SuperMap.Plot.RelLineText.ONLEFTLINE});
        routeNode9.towardNodes.push(towardNode9);
        pts = [];
        pts.push(routeNode9.positionPoint.clone());
        pts.push(routeNode10.positionPoint.clone());
        arrRoutPts.push(pts);

        var towardNode10 = new SuperMap.Plot.TowardNode({routeNodeId:routeNode11.id,textContent:"1XXXXX",relLineText:SuperMap.Plot.RelLineText.ONLEFTLINE});
        routeNode10.towardNodes.push(towardNode10);
        pts = [];
        pts.push(routeNode10.positionPoint.clone());
        pts.push(routeNode11.positionPoint.clone());
        arrRoutPts.push(pts);

        var towardNode11 = new SuperMap.Plot.TowardNode({routeNodeId:routeNode12.id,textContent:"1XXXXX",relLineText:SuperMap.Plot.RelLineText.ONLEFTLINE});
        routeNode11.towardNodes.push(towardNode11);
        pts = [];
        pts.push(routeNode11.positionPoint.clone());
        pts.push(routeNode12.positionPoint.clone());
        arrRoutPts.push(pts);

        var towardNode12 = new SuperMap.Plot.TowardNode({routeNodeId:routeNode13.id,textContent:"1XXXXX",relLineText:SuperMap.Plot.RelLineText.ONLEFTLINE});
        routeNode12.towardNodes.push(towardNode12);
        pts = [];
        pts.push(routeNode12.positionPoint.clone());
        pts.push(routeNode13.positionPoint.clone());
        arrRoutPts.push(pts);


        var routeNodes = [];
        routeNodes.push(routeNode1);
        routeNodes.push(routeNode2);
        routeNodes.push(routeNode3);
        routeNodes.push(routeNode4);
        routeNodes.push(routeNode5);
        routeNodes.push(routeNode6);
        routeNodes.push(routeNode7);
        routeNodes.push(routeNode8);
        routeNodes.push(routeNode9);
        routeNodes.push(routeNode10);
        routeNodes.push(routeNode11);
        routeNodes.push(routeNode12);
        routeNodes.push(routeNode13);

        plottingLayer.createMissileRoute(arrRoutPts,routeNodes,uuid, {}, {}, {text:"用户自定义属性"});
    }

    setTimeout(function(){
        try{

            var featureMissileRoute =  plottingLayer.getFeatureByUuid(uuid);
            equal(featureMissileRoute.geometry.uuid,"iMissileRoute","createMissileRoute");
            equal(featureMissileRoute.geometry.code,1007,"createMissileRoute");
            equal(featureMissileRoute.geometry.routeNodes[0].positionPoint.x,-30,"createMissileRoute");
            equal(featureMissileRoute.geometry.routeNodes[0].positionPoint.y,0,"createMissileRoute");
            equal(featureMissileRoute.geometry.routeNodes[0].type,"STANDBY","createMissileRoute");

            equal(featureMissileRoute.geometry.routeNodes[5].positionPoint.x,10,"createMissileRoute");
            equal(featureMissileRoute.geometry.routeNodes[5].positionPoint.y,5,"createMissileRoute");
            equal(featureMissileRoute.geometry.routeNodes[5].type,"COMMONROUTE","createMissileRoute");

            equal(featureMissileRoute.geometry.routeNodes[12].positionPoint.x,60,"createMissileRoute");
            equal(featureMissileRoute.geometry.routeNodes[12].positionPoint.y,0,"createMissileRoute");
            equal(featureMissileRoute.geometry.routeNodes[12].type,"AIMING","createMissileRoute");
            start();
        }catch(excepion){
            ok(false,"excepion occcur,message is" + excepion.message);
            start();
            map.destroy();
            layer.destroy();
            plottingLayer.destroy();
        }
    },500)
});




asyncTest("testPlottingLayer_createNavyDeployment", function () {
    expect(4);
    map = new SuperMap.Map('map');
    layer = new SuperMap.Layer.TiledDynamicRESTLayer("world", GlobeParameter.WorldURL, {maxResolution :"auto"});
    layer.events.on({"layerInitialized" : addLayer});
    plottingLayer = new SuperMap.Layer.PlottingLayer("PlottingLayer", GlobeParameter.plotUrl);
    plottingLayer.events.on({"symbolcreated":createNavyDeployment});
    var uuid = "iNavyDeployment";
    function addLayer(){
        map.addLayers([layer,plottingLayer]);
        map.setCenter(new SuperMap.LonLat(0,0),0);
        layer.events.un({"layerInitialized" : addLayer});

        var locationPointWCs = [new SuperMap.Geometry.Point(0, 0)];
        var uuid="subHJBLdeploy";
        plottingLayer.createSymbolWC(421, 9, locationPointWCs,uuid, {}, {}, {text:"用户自定义属性"});
    }
    function createNavyDeployment(evt){

        var subSymbol = new SuperMap.Plot.SubSymbol();
        subSymbol.libID = 421;
        subSymbol.code = 10100;
        //子标号个数
        subSymbol.totalNum = 3;
        subSymbol.textContent = "Text";

        var subSymbol1 = new SuperMap.Plot.SubSymbol();
        subSymbol1.libID = 421;
        subSymbol1.code = 9;
        subSymbol1.totalNum = 3;
        subSymbol1.textContent = "刑警";

        var subSymbol2 = new SuperMap.Plot.SubSymbol();
        subSymbol2.libID = 421;
        subSymbol2.code = 80701;
        subSymbol2.totalNum = 3;
        subSymbol2.textContent = "枪支";

        var subObjects = [subSymbol,subSymbol1,subSymbol2];
        var associatedUuid=evt.feature.geometry.uuid;

        var options = {colNum: 3, space: 5, textContent: "BLState"};
        plottingLayer.createNavyDeployment(associatedUuid,subObjects, uuid, {}, options, {text:"海军兵力部署"});
        plottingLayer.events.un({"symbolcreated": createNavyDeployment});
    }
    setTimeout(function(){
        try{
            var featureNavyDeployment =  plottingLayer.getFeatureByUuid(uuid);
            equal(featureNavyDeployment.geometry.uuid, "iNavyDeployment","createNavyDeployment");
            equal(featureNavyDeployment.geometry.code, 1008,"createNavyDeployment");
            equal(featureNavyDeployment.geometry.textContent, "BLState","createNavyDeployment");
            equal(featureNavyDeployment.geometry.subSymbols.length, 3,"createNavyDeployment");
            start();
        }catch(excepion){
            ok(false,"excepion occcur,message is" + excepion.message);
            start();
            map.destroy();
            layer.destroy();
            plottingLayer.destroy();
        }
    },500)
});



asyncTest("testPlottingLayer_createAirDeployment", function () {
    expect(3);
    map = new SuperMap.Map('map');
    layer = new SuperMap.Layer.TiledDynamicRESTLayer("world", GlobeParameter.WorldURL, {maxResolution :"auto"});
    layer.events.on({"layerInitialized" : addLayer});
    plottingLayer = new SuperMap.Layer.PlottingLayer("PlottingLayer", GlobeParameter.plotUrl);
    plottingLayer.events.on({"symbolcreated":createAirDeployment});
    var uuid = "uuid-AirDeployment";
    function addLayer(){
        map.addLayers([layer,plottingLayer]);
        map.setCenter(new SuperMap.LonLat(0,0),0);
        layer.events.un({"layerInitialized" : addLayer});

        var locationPointWCs = [new SuperMap.Geometry.Point(0, 0)];
        plottingLayer.createSymbolWC(100, 35300, locationPointWCs,"uuid-sub-KJBLdeploy", {}, {}, {text:"用户自定义属性"});
    }
    function createAirDeployment(evt){

        plottingLayer.events.un({"symbolcreated": createAirDeployment});

        var subSymbol = new SuperMap.Plot.SubSymbol();
        subSymbol.libID = 100;
        subSymbol.code = 7200;
        subSymbol.totalNum = 5;
        subSymbol.textContent = "飞机";

        var subSymbol1 = new SuperMap.Plot.SubSymbol();
        subSymbol1.libID = 100;
        subSymbol1.code = 7200;
        subSymbol1.totalNum = 5;
        subSymbol1.textContent = "陆军";

        var subSymbol2 = new SuperMap.Plot.SubSymbol();
        subSymbol2.libID = 100;
        subSymbol2.code = 2800;
        subSymbol2.totalNum = 5;
        subSymbol2.textContent = "指挥所";

        var subObjects = [subSymbol,subSymbol1,subSymbol2];
        var associatedUuid=evt.feature.geometry.uuid;
        var options = {colNum: 5, space: 5, isShowTooltip: true};
        plottingLayer.createAirDeployment(associatedUuid,subObjects,"uuid-AirDeployment", {}, options, {text:"机场兵力部署"});

    }
    setTimeout(function(){
        try{
            var featureAirDeployment =  plottingLayer.getFeatureByUuid(uuid);
            equal(featureAirDeployment.geometry.uuid, "uuid-AirDeployment","createAirDeployment");
            equal(featureAirDeployment.geometry.code, 1009,"createAirDeployment");
            equal(featureAirDeployment.geometry.subSymbols.length, 3,"createAirDeployment");
            start();
        }catch(excepion){
            ok(false,"excepion occcur,message is" + excepion.message);
            start();
            map.destroy();
            layer.destroy();
            plottingLayer.destroy();
        }
    },500)
});


// 创建卫星
asyncTest("testPlottingLayer_createSatellite", function () {
    expect(3);
    map = new SuperMap.Map('map');
    layer = new SuperMap.Layer.TiledDynamicRESTLayer("world", GlobeParameter.WorldURL, {resolution : 'auto'});
    layer.events.on({"layerInitialized" : addLayer});
    plottingLayer = new SuperMap.Layer.PlottingLayer("PlottingLayer", GlobeParameter.plotUrl);
    var uuid="iSatellite";
    function addLayer(){
        map.addLayers([layer,plottingLayer]);
        map.setCenter(new SuperMap.LonLat(0,0),0);
        layer.events.un({"layerInitialized" : addLayer});
        var orbitPointWCs = [];
        var time = new Date().getTime();
        for(var i = 0; i < 72; i++){
            var x = 50 * Math.cos(i * Math.PI / 180);
            var y = 50 * Math.sin(i * Math.PI / 180);
            orbitPointWCs.push(new SuperMap.Plot.OrbitPoint(x, y, 0, i, time + i));
        }

        plottingLayer.createSatellite(100, 8901, orbitPointWCs, "卫星", uuid, {}, {visible: true}, {text:"卫星自定义属性"});

    }

    setTimeout(function(){
        try{
            equal(plottingLayer.features[0].geometry.uuid,"iSatellite","createSatellite");
            equal(plottingLayer.features[0].geometry.code,1010,"createSatellite");
            equal(plottingLayer.features[0].geometry.visible,true,"createSatellite");
            start()
        }catch(excepion){
            ok(false,"escepion occcur,message is" + excepion.message);
            start();
            map.destroy();
            layer.destroy();
            plottingLayer.destroy();
        }
    },500)
});


asyncTest("testPlottingLayer_createSatelliteTimeWindows1", function () {
    expect(4);
    map = new SuperMap.Map('map');
    layer = new SuperMap.Layer.TiledDynamicRESTLayer("world", GlobeParameter.WorldURL, {resolution : 'auto'});
    layer.events.on({"layerInitialized" : addLayer});
    plottingLayer = new SuperMap.Layer.PlottingLayer("PlottingLayer", GlobeParameter.plotUrl);
    plottingLayer.events.on({"symbolcreated":symbolCreated});
    var uuid="iSatelliteTimeWindows1";
    function addLayer(){
        map.addLayers([layer,plottingLayer]);
        map.setCenter(new SuperMap.LonLat(0,0),0);
        layer.events.un({"layerInitialized" : addLayer});

        var orbitPointWCs = [];
        var time = new Date().getTime();
        for(var i = 0; i < 72; i++){
            var x = 50 * Math.cos(i * Math.PI / 180);
            var y = 50 * Math.sin(i * Math.PI / 180);
            orbitPointWCs.push(new SuperMap.Plot.OrbitPoint(x, y, 0, i, time + i));
        }

        plottingLayer.createSatellite(100, 8901, orbitPointWCs, "卫星", "iSatellite", {}, {visible: true}, {text:"卫星自定义属性"});
    }

    function symbolCreated(evt){
        plottingLayer.events.un({"symbolcreated":symbolCreated});
        var associatedUuid=evt.feature.geometry.uuid;
        var timeWindows1 = new SuperMap.Plot.TimeWindowParameter(5, 15);
        var timeWindows2 = new SuperMap.Plot.TimeWindowParameter(30, 50);
        var timeWindows = [timeWindows1, timeWindows2];

        plottingLayer.createSatelliteTimeWindows1(associatedUuid, timeWindows, uuid, {}, {text:"用户自定义属性"});
    }

    setTimeout(function(){
        try{
            var featureSatelliteTimeWindows1 =  plottingLayer.getFeatureByUuid(uuid);
            equal(featureSatelliteTimeWindows1.geometry.uuid,"iSatelliteTimeWindows1","createSatelliteTimeWindows1");
            equal(featureSatelliteTimeWindows1.geometry.code,1011,"createSatelliteTimeWindows1");
            equal(featureSatelliteTimeWindows1.geometry.timeWindows[0].startOrbitPoint,5,"createSatelliteTimeWindows1");
            equal(featureSatelliteTimeWindows1.geometry.timeWindows[0].endOrbitPoint,15,"createSatelliteTimeWindows1");

            start()
        }catch(excepion){
            ok(false,"escepion occcur,message is" + excepion.message);
            start();
            map.destroy();
            layer.destroy();
            plottingLayer.destroy();
        }
    },500)
});


asyncTest("testPlottingLayer_createSatelliteTimeWindows2", function () {
    expect(4);
    map = new SuperMap.Map('map');
    layer = new SuperMap.Layer.TiledDynamicRESTLayer("world", GlobeParameter.WorldURL, {resolution : 'auto'});
    layer.events.on({"layerInitialized" : addLayer});
    plottingLayer = new SuperMap.Layer.PlottingLayer("PlottingLayer", GlobeParameter.plotUrl);
    plottingLayer.events.on({"symbolcreated":symbolCreated});
    var uuid="iSatelliteTimeWindows2";
    function addLayer(){
        map.addLayers([layer,plottingLayer]);
        map.setCenter(new SuperMap.LonLat(0,0),0);
        layer.events.un({"layerInitialized" : addLayer});

        var orbitPointWCs = [];
        var time = new Date().getTime();
        for(var i = 0; i < 72; i++){
            var x = 50 * Math.cos(i * Math.PI / 180);
            var y = 50 * Math.sin(i * Math.PI / 180);
            orbitPointWCs.push(new SuperMap.Plot.OrbitPoint(x, y, 0, i, 1000 + i));
        }
        plottingLayer.createSatellite(100, 8901, orbitPointWCs, "卫星", "uSatellite1", {}, {visible: true}, {text:"卫星"});
    }

    function symbolCreated(evt){
        plottingLayer.events.un({"symbolcreated":symbolCreated});
        var associatedUuid=evt.feature.geometry.uuid;
        var timeWindows1 = new SuperMap.Plot.TimeWindowParameter(1010, 1025);
        var timeWindows2 = new SuperMap.Plot.TimeWindowParameter(1030, 1050);
        var timeWindows = [timeWindows1, timeWindows2];

        plottingLayer.createSatelliteTimeWindows2(associatedUuid, timeWindows, uuid, {}, {text:"用户自定义属性"});
    }

    setTimeout(function(){
        try{
            var featureSatelliteTimeWindows2 =  plottingLayer.getFeatureByUuid(uuid);
            equal(featureSatelliteTimeWindows2.geometry.uuid,"iSatelliteTimeWindows2","createSatelliteTimeWindows2");
            equal(featureSatelliteTimeWindows2.geometry.code,1011,"createSatelliteTimeWindows2");
            equal(featureSatelliteTimeWindows2.geometry.timeWindows[0].startOrbitPoint,1010,"createSatelliteTimeWindows2");
            equal(featureSatelliteTimeWindows2.geometry.timeWindows[0].endOrbitPoint,1025,"createSatelliteTimeWindows2");

            start()
        }catch(excepion){
            ok(false,"escepion occcur,message is" + excepion.message);
            start();
            map.destroy();
            layer.destroy();
            plottingLayer.destroy();
        }
    },500)
});


asyncTest("testPlottingLayer_createSymbolText",function () {
    expect(4);
    map = new SuperMap.Map('map');
    layer = new SuperMap.Layer.TiledDynamicRESTLayer('world', GlobeParameter.WorldURL, {maxResolution : 'auto'});
    layer.events.on({"layerInitialized" : addLayer});
    plottingLayer = new SuperMap.Layer.PlottingLayer('PlottingLayer', GlobeParameter.plotUrl);
    plottingLayer.events.on({"symbolcreated": symbolCreated});
    var uuid="uuid-SymbolText";
    function addLayer() {
        map.addLayers([layer,plottingLayer]);
        map.setCenter(new SuperMap.LonLat(0,0),0);
        layer.events.un({"layerInitialized" : addLayer});

        var locationPointWCs1 = [new SuperMap.Geometry.Point(-10, 0)];
        plottingLayer.createSymbolWC(100,2800,locationPointWCs1,"uuid-sub-Symbol-1", {}, {}, {textContent:"指挥所"});
    }

    function symbolCreated(evt){
        plottingLayer.events.un({"symbolcreated": symbolCreated});
        //创建对象标注
        var symbolTexts = [];
        symbolTexts.push(new SuperMap.Plot.SymbolText("对象标注", 0));
        symbolTexts.push(new SuperMap.Plot.SymbolText("对象标注测试", 1));
        var associatedUuid=evt.feature.geometry.uuid;
        plottingLayer.createSymbolText(associatedUuid, symbolTexts, uuid, {}, {text:"对象标注"});
    }

    setTimeout(function(){
        try{
            var featureSymbolText =  plottingLayer.getFeatureByUuid(uuid);
            equal(featureSymbolText.geometry.uuid,"uuid-SymbolText","createSymbolText");
            equal(featureSymbolText.geometry.code,1012,"createSymbolText");
            equal(featureSymbolText.geometry.symbolTexts[0].textContent,"对象标注","createSymbolText");
            equal(featureSymbolText.geometry.symbolTexts[0].textPosition,0,"createSymbolText");

            start();
        }catch(excepion){
            ok(false,"excepion occcur,message is" + excepion.message);
            start();
            map.destroy();
            layer.destroy();
            plottingLayer.destroy();
        }
    },500)
});


asyncTest("testPlottingLayer_createSymbolText1",function () {
    expect(3);
    map = new SuperMap.Map('map');
    layer = new SuperMap.Layer.TiledDynamicRESTLayer('world', GlobeParameter.WorldURL, {maxResolution : 'auto'});
    layer.events.on({"layerInitialized" : addLayer});
    plottingLayer = new SuperMap.Layer.PlottingLayer('PlottingLayer', GlobeParameter.plotUrl);
    plottingLayer.events.on({"symbolcreated": symbolCreated});
    var uuid="uuid-SymbolText";
    function addLayer() {
        map.addLayers([layer,plottingLayer]);
        map.setCenter(new SuperMap.LonLat(0,0),0);
        layer.events.un({"layerInitialized" : addLayer});

        var locationPointWCs1 = [new SuperMap.Geometry.Point(-10, 0)];
        plottingLayer.createSymbolWC(100,2800,locationPointWCs1,"uuid-sub-Symbol-1", {}, {}, {textContent:"指挥所"});
    }

    function symbolCreated(evt){
        plottingLayer.events.un({"symbolcreated": symbolCreated});
        //创建对象标注
        var associatedUuid=evt.feature.geometry.uuid;
        plottingLayer.createSymbolText1(associatedUuid, ["方向：78°", "速度：123海里/小时", "排水量：2000吨"], uuid, {}, {}, {text:"对象标注"});
    }

    setTimeout(function(){
        try{
            var featureSymbolText1 =  plottingLayer.getFeatureByUuid(uuid);
            equal(featureSymbolText1.geometry.uuid,"uuid-SymbolText","createSymbolText1");
            equal(featureSymbolText1.geometry.code,1021,"createSymbolText1");
            equal(featureSymbolText1.geometry.textContent[0],"方向：78°","createSymbolText1");

            start();
        }catch(excepion){
            ok(false,"excepion occcur,message is" + excepion.message);
            start();
            map.destroy();
            layer.destroy();
            plottingLayer.destroy();
        }
    },500)
});


asyncTest("testPlottingLayer_createPathText",function () {
    expect(3);
    map = new SuperMap.Map('map');
    layer = new SuperMap.Layer.TiledDynamicRESTLayer('world', GlobeParameter.WorldURL, {maxResolution : 'auto'});
    layer.events.on({"layerInitialized" : addLayer});
    plottingLayer = new SuperMap.Layer.PlottingLayer('PlottingLayer', GlobeParameter.plotUrl);

    function addLayer() {
        map.addLayers([layer,plottingLayer]);
        map.setCenter(new SuperMap.LonLat(0,0),0);
        layer.events.un({"layerInitialized" : addLayer});

        var locationPoints1 = [];
        locationPoints1.push(new SuperMap.Geometry.Point(100, 0));
        locationPoints1.push(new SuperMap.Geometry.Point(0, 0));
        locationPoints1.push(new SuperMap.Geometry.Point(-50, 70));

        var uuid="iPathText";//实体的唯一标识
        plottingLayer.createPathText("abcdefg hijklmn opqrst uvwxyz 超图软件测试", locationPoints1,SuperMap.Plot.RelLineText.ONRIGHTLINE,true,true,false,uuid, {}, {text:"用户自定义属性"});
    }

    setTimeout(function(){
        try{
            equal(plottingLayer.features[0].geometry.uuid,"iPathText","createPathText");
            equal(plottingLayer.features[0].geometry.code,1017,"createPathText");
            equal(plottingLayer.features[0].geometry.textContent[0],"abcdefg hijklmn opqrst uvwxyz 超图软件测试","createPathText");
            start();
        }catch(excepion){
            ok(false,"excepion occcur,message is" + excepion.message);
            start();
            map.destroy();
            layer.destroy();
            plottingLayer.destroy();
        }
    },500)
});

asyncTest("testPlottingLayer_createArrowLine",function () {
    expect(4);
    map = new SuperMap.Map('map');
    layer = new SuperMap.Layer.TiledDynamicRESTLayer('world', GlobeParameter.WorldURL, {maxResolution : 'auto'});
    layer.events.on({"layerInitialized" : addLayer});
    plottingLayer = new SuperMap.Layer.PlottingLayer('PlottingLayer', GlobeParameter.plotUrl);

    function addLayer() {
        map.addLayers([layer,plottingLayer]);
        map.setCenter(new SuperMap.LonLat(0,0),0);
        layer.events.un({"layerInitialized" : addLayer});

        var locationPointWCs = [];
        locationPointWCs.push(new SuperMap.Geometry.Point(0, 0));
        locationPointWCs.push(new SuperMap.Geometry.Point(100, 0));
        var uuid="iArrowLine";//实体的唯一标识
        plottingLayer.createArrowLine(locationPointWCs,SuperMap.Plot.ArrowLineType.TRIANGLESOLID, SuperMap.Plot.ArrowLineType.DOUBLELINE,uuid, {}, null, {text:"用户自定义属性"});
    }

    setTimeout(function(){
        try{
            equal(plottingLayer.features[0].geometry.uuid,"iArrowLine","createArrowLine");
            equal(plottingLayer.features[0].geometry.code,1016,"createArrowLine");
            equal(plottingLayer.features[0].geometry.arrowTypeStart,1,"createArrowLine");
            equal(plottingLayer.features[0].geometry.arrowTypeEnd,0,"createArrowLine");
            start();
        }catch(excepion){
            ok(false,"excepion occcur,message is" + excepion.message);
            start();
            map.destroy();
            layer.destroy();
            plottingLayer.destroy();
        }
    },500)
});


asyncTest("testPlottingLayer_createConcentricCircle",function () {
    expect(3);
    map = new SuperMap.Map('map');
    layer = new SuperMap.Layer.TiledDynamicRESTLayer('world', GlobeParameter.WorldURL, {maxResolution : 'auto'});
    layer.events.on({"layerInitialized" : addLayer});
    plottingLayer = new SuperMap.Layer.PlottingLayer('PlottingLayer', GlobeParameter.plotUrl);

    function addLayer() {
        map.addLayers([layer,plottingLayer]);
        map.setCenter(new SuperMap.LonLat(0,0),0);
        layer.events.un({"layerInitialized" : addLayer});

        var locationPointWCs = [];
        locationPointWCs.push(new SuperMap.Geometry.Point(-56, -3));
        locationPointWCs.push(new SuperMap.Geometry.Point(-25, -18));
        locationPointWCs.push(new SuperMap.Geometry.Point(-10, -19));
        plottingLayer.createConcentricCircle(locationPointWCs, 10, 180, {}, {});

    }

    setTimeout(function(){
        try{

            equal(plottingLayer.features[0].geometry.code,1019,"createConcentricCircle");
            equal(plottingLayer.features[0].geometry.startAngle,10,"createConcentricCircle");
            equal(plottingLayer.features[0].geometry.endAngle,180,"createConcentricCircle");
            start();
        }catch(excepion){
            ok(false,"excepion occcur,message is" + excepion.message);
            start();
            map.destroy();
            layer.destroy();
            plottingLayer.destroy();
        }
    },500)
});


asyncTest("testPlottingLayer_createCombinationalCircle",function () {
    expect(3);
    map = new SuperMap.Map('map');
    layer = new SuperMap.Layer.TiledDynamicRESTLayer('world', GlobeParameter.WorldURL, {maxResolution : 'auto'});
    layer.events.on({"layerInitialized" : addLayer});
    plottingLayer = new SuperMap.Layer.PlottingLayer('PlottingLayer', GlobeParameter.plotUrl);

    function addLayer() {
        map.addLayers([layer,plottingLayer]);
        map.setCenter(new SuperMap.LonLat(0,0),0);
        layer.events.un({"layerInitialized" : addLayer});

        var locationPointWCs = [];
        locationPointWCs.push(new SuperMap.Geometry.Point(-72, 0));
        locationPointWCs.push(new SuperMap.Geometry.Point(-42, -17));
        locationPointWCs.push(new SuperMap.Geometry.Point(-19, -34));
        var radius =[30,40];
        plottingLayer.createCombinationalCircle(locationPointWCs, radius, {},{}, {});

    }

    setTimeout(function(){
        try{

            equal(plottingLayer.features[0].geometry.code,1022,"createCombinationalCircle");
            equal(plottingLayer.features[0].geometry.radius[0],30,"createCombinationalCircle");
            equal(plottingLayer.features[0].geometry.radius[1],40,"createCombinationalCircle");
            start();
        }catch(excepion){
            ok(false,"excepion occcur,message is" + excepion.message);
            start();
            map.destroy();
            layer.destroy();
            plottingLayer.destroy();
        }
    },500)
});


asyncTest("testPlottingLayer_createGroupObject", function () {
    expect(1);
    map = new SuperMap.Map('map');
    layer = new SuperMap.Layer.TiledDynamicRESTLayer("world", GlobeParameter.WorldURL, {resolution : 'auto'});
    layer.events.on({"layerInitialized" : addLayer});
    plottingLayer = new SuperMap.Layer.PlottingLayer("PlottingLayer", GlobeParameter.plotUrl);
    plottingLayer.events.on({"symbolcreated": symbolCreated});
    var features = [];
    var uuid = "groupObjectUuid";
    function addLayer(){
        map.addLayers([layer,plottingLayer]);
        map.setCenter(new SuperMap.LonLat(0,0),0);
        layer.events.un({"layerInitialized" : addLayer});

        var locationPointWCs1 = [];
        locationPointWCs1.push(new SuperMap.Geometry.Point(20, 10));
        locationPointWCs1.push(new SuperMap.Geometry.Point(40, 10));
        plottingLayer.createSymbolWC(22, 1003, locationPointWCs1, 1);

        var locationPointWCs2 = [];
        locationPointWCs2.push(new SuperMap.Geometry.Point(20, 10));
        plottingLayer.createSymbolWC(421, 10100, locationPointWCs2, 2);

        var locationPointWCs3 = [];
        locationPointWCs3.push(new SuperMap.Geometry.Point(40, 10));
        plottingLayer.createSymbolWC(421, 9, locationPointWCs3, 3);
    }

    function symbolCreated(evt) {
        features.push(evt.feature);
        if(features.length === 3 ){
            plottingLayer.events.un({"symbolcreated": symbolCreated});
            plottingLayer.createGroupObject(features,uuid,{});

        }
    }

    setTimeout(function(){
        try{
            var featureGroupObject=plottingLayer.getFeatureByUuid(uuid);

            equal(featureGroupObject.geometry.code,1000,"createGroupObject");
            start();
        }catch(excepion){
            ok(false,"escepion occcur,message is" + excepion.message);
            start();
            map.destroy();
            layer.destroy();
            plottingLayer.destroy();
        }
    },500)
});


asyncTest("testPlottingLayer_unGroupObject", function () {
    expect(1);
    map = new SuperMap.Map('map');
    layer = new SuperMap.Layer.TiledDynamicRESTLayer("world", GlobeParameter.WorldURL, {resolution : 'auto'});
    layer.events.on({"layerInitialized" : addLayer});
    plottingLayer = new SuperMap.Layer.PlottingLayer("PlottingLayer", GlobeParameter.plotUrl);
    plottingLayer.events.on({"symbolcreated": symbolCreated});
    var features = [];
    var uuid = "groupObjectUuid1";
    function addLayer(){
        map.addLayers([layer,plottingLayer]);
        map.setCenter(new SuperMap.LonLat(0,0),0);
        layer.events.un({"layerInitialized" : addLayer});

        var locationPointWCs1 = [];
        locationPointWCs1.push(new SuperMap.Geometry.Point(20, 10));
        locationPointWCs1.push(new SuperMap.Geometry.Point(40, 10));
        plottingLayer.createSymbolWC(22, 1003, locationPointWCs1, 1);

        var locationPointWCs2 = [];
        locationPointWCs2.push(new SuperMap.Geometry.Point(20, 10));
        plottingLayer.createSymbolWC(421, 10100, locationPointWCs2, 2);

        var locationPointWCs3 = [];
        locationPointWCs3.push(new SuperMap.Geometry.Point(40, 10));
        plottingLayer.createSymbolWC(421, 9, locationPointWCs3, 3);
    }

    function symbolCreated(evt) {
        features.push(evt.feature);
        if(features.length === 3 ){
            plottingLayer.createGroupObject(features,uuid,{});
            plottingLayer.events.un({"symbolcreated": symbolCreated});
        }
    }

    setTimeout(function(){
        try{
            var featureGroupObject=plottingLayer.getFeatureByUuid(uuid);

            plottingLayer.unGroupObject(uuid);
            equal(plottingLayer.features.length,3,"unGroupObject");
            start();
        }catch(excepion){
            ok(false,"escepion occcur,message is" + excepion.message);
            start();
            map.destroy();
            layer.destroy();
            plottingLayer.destroy();
        }
    },500)
});

asyncTest("testPlottingLayer_createFlags",function () {
    expect(1);
    var features = [];
    map = new SuperMap.Map('map');
    layer = new SuperMap.Layer.TiledDynamicRESTLayer('world', GlobeParameter.WorldURL, {maxResolution : 'auto'});
    layer.events.on({"layerInitialized" : addLayer});
    plottingLayer = new SuperMap.Layer.PlottingLayer('PlottingLayer', GlobeParameter.plotUrl);
    plottingLayer.events.on({"symbolcreated": symbolCreated});
    var uuid = "createFlags";
    function addLayer() {
        map.addLayers([layer,plottingLayer]);
        map.setCenter(new SuperMap.LonLat(0,0),0);
        layer.events.un({"layerInitialized" : addLayer});

        var locationPointWCs1 = [new SuperMap.Geometry.Point(-10, 0)];
        plottingLayer.createSymbolWC(100,2800,locationPointWCs1,"uuid-100-2800", {}, {}, {text:"用户自定义信息"});

        var locationPointWCs2 = [new SuperMap.Geometry.Point(-10, 15)];
        plottingLayer.createSymbolWC(100,2801,locationPointWCs2,"uuid-100-2801", {}, {}, {text:"用户自定义信息"});

        var locationPointWCs3 = [new SuperMap.Geometry.Point(-10, 30)];
        plottingLayer.createSymbolWC(100,2802,locationPointWCs3,"uuid-100-2802", {}, {}, {text:"用户自定义信息"});
    }

    function symbolCreated(evt) {
        var feature = plottingLayer.getFeatureByUuid(evt.feature.geometry.uuid);
        feature.geometry.setTextContent("FlagFlagFlag");
        feature.geometry.setTextPosition(8);
        features.push(feature);
        if (features.length === 3) {
            plottingLayer.events.un({"symbolcreated": symbolCreated});

            plottingLayer.createFlags(features, 0.9,uuid);
        }
    }
    setTimeout(function(){
        try{
            var featureFlags=plottingLayer.getFeatureByUuid(uuid);
            equal(featureFlags.geometry.code, 1020,"createFlags");
            start();
        }catch(excepion){
            ok(false,"excepion occcur,message is" + excepion.message);
            start();
            map.destroy();
            layer.destroy();
            plottingLayer.destroy();
        }
    },500)
});



//jira缺陷编号PLOT-290
asyncTest("testPlottingLayer_createSymbolWC1", function () {
    expect(12);
    var  feature;
    map = new SuperMap.Map("map");
    layer = new SuperMap.Layer.TiledDynamicRESTLayer("World", GlobeParameter.WorldURL, null, {maxResolution: "auto"});
    layer.events.on({"layerInitialized": addLayer});
    plottingLayer = new SuperMap.Layer.PlottingLayer("PlottingLayer", GlobeParameter.plotUrl);
    plottingLayer.events.on({"symbolcreated": createSymbolWCSuccess});
    var code=80800;
    var uuid="uuid-SymbolParameter";
    var style={};
    var symbolSize = new SuperMap.Size(100,100);
    var options={symbolSize:symbolSize,textContent:"注记",textPosition:5,positionOffset:true,space:20,positionOffsetType:1,dRotate:30,negativeImage:true,scaleByMap:true,surroundLineType:1};
    var custom={text:"用户自定义信息"};

    function addLayer() {
        map.addLayers([layer, plottingLayer]);
        map.setCenter(new SuperMap.LonLat(0, 0), 0);
        plottingLayer.createSymbolWC(libID, code,inputPoints,uuid,style,options,custom);
    }

    function createSymbolWCSuccess(evt) {
        feature = evt.feature;
    }

    setTimeout(function () {
        try {
            equal(feature.geometry.uuid, uuid, "uuid");
            equal(feature.geometry.getRotate(), 30, "dRotate");
            equal(feature.geometry.getNegativeImage(), true, "negativeImage");
            equal(feature.geometry.getScaleByMap(), true, "scaleByMap");
            equal(feature.geometry.getSurroundLineType(), true, "surroundLineType");
            equal(feature.geometry.getSymbolSize(), symbolSize, "symbolSize");
            equal(feature.geometry.getPositionOffset(), true, "positionOffset");
            equal(feature.geometry.positionOffsetType, 1, "positionOffsetType");
            equal(feature.geometry.getTextContent(), "注记", "textContent");
            equal(feature.geometry.getTextPosition(), 5, "textPosition");
            equal(feature.geometry.space, 20, "space");
            equal(feature.geometry.custom.text, custom.text, "custom.text");


            start();
        } catch (excepion) {
            ok(false, "exception occcurs,message is:" + excepion.message);
            start();
            map.destroy();
            layer.destroy();
            plottingLayer.destroy();
        }
    }, 500);
});



asyncTest("testPlottingLayer_拷贝黏贴到指定位置点",function () {
    expect(3);
    map = new SuperMap.Map('map');
    layer = new SuperMap.Layer.TiledDynamicRESTLayer('world', GlobeParameter.WorldURL, {maxResolution : 'auto'});
    layer.events.on({"layerInitialized" : addLayer});
    plottingLayer = new SuperMap.Layer.PlottingLayer('PlottingLayer', GlobeParameter.plotUrl);
    var plottingEdit= new SuperMap.Control.PlottingEdit();
    var plotting;

    function addLayer() {
        map.addControls([plottingEdit]);
        map.addLayers([layer,plottingLayer]);
        map.setCenter(new SuperMap.LonLat(0,0),0);
        layer.events.un({"layerInitialized" : addLayer});
        plotting = SuperMap.Plotting.getInstance(map, GlobeParameter.plotUrl);
        var locationPointWCs = [new SuperMap.Geometry.Point(0, 0)];
        var libID=421;
        var code1=2;
        plottingLayer.createSymbolWC(libID,code1,locationPointWCs);

    }




    setTimeout(function(){
        try{
            var position=new SuperMap.Geometry.Point(50, 50) ;
            plotting.getEditor().copyFeatures(plottingLayer.features[0]);
            plotting.getEditor().pasteToPosition(position);
            equal(plottingLayer.features.length,2,"拷贝黏贴到指定位置点");
            equal(plottingLayer.features[1].geometry.getBounds().getCenterLonLat().lat.toFixed(1),50,"拷贝黏贴到指定位置点");
            equal(plottingLayer.features[1].geometry.getBounds().getCenterLonLat().lon.toFixed(1),50,"拷贝黏贴到指定位置点");
            start();
        }catch(excepion){
            ok(false,"excepion occcur,message is" + excepion.message);
            start();
            map.destroy();
            layer.destroy();
            plottingLayer.destroy();
        }
    },600)
});


//jira缺陷编号PLOT-504
asyncTest("testPlottingLayer_多图层拷贝黏贴",function () {
    expect(3);
    map = new SuperMap.Map('map');
    layer = new SuperMap.Layer.TiledDynamicRESTLayer('world', GlobeParameter.WorldURL, {maxResolution : 'auto'});
    layer.events.on({"layerInitialized" : addLayer});
    var  plottingLayer1 = new SuperMap.Layer.PlottingLayer('PlottingLayer1', GlobeParameter.plotUrl);
    var  plottingLayer2 = new SuperMap.Layer.PlottingLayer('PlottingLayer2', GlobeParameter.plotUrl);
    var  plottingLayer3 = new SuperMap.Layer.PlottingLayer('PlottingLayer3', GlobeParameter.plotUrl);

    var plottingEdit= new SuperMap.Control.PlottingEdit();
    var plotting;
    plottingLayer1.events.on({"symbolcreated": symbolCreated});
    plottingLayer2.events.on({"symbolcreated": symbolCreated});
    plottingLayer3.events.on({"symbolcreated": symbolCreated});
    var features=[];
    function addLayer() {
        map.addControl(plottingEdit);
        map.addLayers([layer,plottingLayer1,plottingLayer2,plottingLayer3]);
        map.setCenter(new SuperMap.LonLat(0,0),0);
        layer.events.un({"layerInitialized" : addLayer});
        plotting = SuperMap.Plotting.getInstance(map, GlobeParameter.plotUrl);
        var locationPointWCs1 = [new SuperMap.Geometry.Point(0, 0)];
        var locationPointWCs2 = [new SuperMap.Geometry.Point(100, 100)];
        var locationPointWCs3 = [new SuperMap.Geometry.Point(50, 50)];

        var libID=421;
        var code1=2;
        var code2=10100;
        var code3=30403;
        plottingLayer1.createSymbolWC(libID,code1,locationPointWCs1);
        plottingLayer2.createSymbolWC(libID,code2,locationPointWCs2);
        plottingLayer3.createSymbolWC(libID,code3,locationPointWCs3);

    }

    function symbolCreated(evt){
        features.push(evt.feature);
        if(features.length===3){
            plottingLayer1.events.un({"symbolcreated": symbolCreated});
            plottingLayer2.events.un({"symbolcreated": symbolCreated});
            plottingLayer3.events.un({"symbolcreated": symbolCreated});

            plotting.getEditor().copyFeatures(plottingLayer1.features[0]);
            plotting.getEditor().paste();

            plotting.getEditor().copyFeatures(plottingLayer2.features[0]);
            plotting.getEditor().paste();

            plotting.getEditor().copyFeatures(plottingLayer3.features[0]);
            plotting.getEditor().paste();

        }


    }


    setTimeout(function(){
        try{
            equal(plottingLayer1.features.length,2,"多图层拷贝黏贴");
            equal(plottingLayer2.features.length,2,"多图层拷贝黏贴");
            equal(plottingLayer3.features.length,2,"多图层拷贝黏贴");
            start();
        }catch(excepion){
            ok(false,"excepion occcur,message is" + excepion.message);
            start();
            map.destroy();
            layer.destroy();
            plottingLayer.destroy();
        }
    },600)
});

//jira缺陷编号PLOT-384
asyncTest("testPlottingLayer_copyArrowLine",function () {
    expect(2);
    map = new SuperMap.Map('map');
    layer = new SuperMap.Layer.TiledDynamicRESTLayer('world', GlobeParameter.WorldURL, {maxResolution : 'auto'});
    layer.events.on({"layerInitialized" : addLayer});
    var plotting;
    plottingLayer = new SuperMap.Layer.PlottingLayer('PlottingLayer', GlobeParameter.plotUrl);
    var plottingEdit = new SuperMap.Control.PlottingEdit();
    map.addControls([plottingEdit]);
    plottingLayer.events.on({"symbolcreated": symbolCreated});
    var uuid="iArrowLine";//实体的唯一标识
    function addLayer() {
        map.addLayers([layer,plottingLayer]);
        map.setCenter(new SuperMap.LonLat(0,0),0);
        layer.events.un({"layerInitialized" : addLayer});
        plotting = SuperMap.Plotting.getInstance(map, GlobeParameter.plotUrl);
        var locationPointWCs = [];
        locationPointWCs.push(new SuperMap.Geometry.Point(0, 0));
        locationPointWCs.push(new SuperMap.Geometry.Point(100, 0));

        plottingLayer.createArrowLine(locationPointWCs,SuperMap.Plot.ArrowLineType.TRIANGLESOLID, SuperMap.Plot.ArrowLineType.DOUBLELINE,uuid, {}, null, {text:"用户自定义属性"});
    }

    function symbolCreated(evt){
        plottingLayer.events.un({"symbolcreated": symbolCreated});
        plotting.getEditor().copyFeatures(evt.feature);
        plotting.getEditor().paste();
    }


    setTimeout(function(){
        try{
            var arrowLineFeature=plottingLayer.getFeatureByUuid(uuid);
            var copyFeature=plottingLayer.features[1];

            equal(arrowLineFeature.geometry.arrowTypeStart,copyFeature.geometry.arrowTypeStart,"copyArrowLine");
            equal(arrowLineFeature.geometry.arrowTypeEnd,copyFeature.geometry.arrowTypeEnd,"createArrowLine");

            start();
        }catch(excepion){
            ok(false,"excepion occcur,message is" + excepion.message);
            start();
            map.destroy();
            layer.destroy();
            plottingLayer.destroy();
        }
    },600)
});



