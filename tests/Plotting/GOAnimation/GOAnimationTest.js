module('GOAnimation');

test("testGOAnimation_Constructor", function () {
    expect(4);
    var goAnimation=new SuperMap.Plot.GOAnimation();
    equal(goAnimation.CLASS_NAME, "SuperMap.Plot.GOAnimation", "function:CLASS_NAME");
    equal(goAnimation.startTime, 0.0, "function:startTime");
    equal(goAnimation.duration, 5.0, "function:duration");
    equal(goAnimation.repeat, false, "function:repeat");
});

test("testGOAnimation_Destroy", function () {
    expect(5);
    var goAnimation=new SuperMap.Plot.GOAnimation();
    goAnimation.destroy();
    equal(goAnimation.goFeature, null, "function:Destroy");
    equal(goAnimation.plottingLayer, null, "function:Destroy");
    equal(goAnimation.animationGOFeature, null, "function:Destroy");
    equal(goAnimation.name, null, "function:Destroy");
    equal(goAnimation.animationState, SuperMap.Plot.GOAnimationState.UNKNOWN, "function:Destroy");
});

asyncTest("testGOAnimation_setGOFeature", function () {
    var libID = 421, code2 = 10200, locationPoints = [new SuperMap.Geometry.Point(20, 30)];
    var map, layer, plottingLayer, dotSymbol;
    map = new SuperMap.Map("map");
    layer = new SuperMap.Layer.TiledDynamicRESTLayer("World", GlobeParameter.WorldURL, null, {maxResolution: "auto"});
    layer.events.on({"layerInitialized": addLayer});
    plottingLayer = new SuperMap.Layer.PlottingLayer("PlottingLayer", GlobeParameter.plotUrl);
    plottingLayer.events.on({"symbolcreated": createSymbolSuccess});

    function addLayer() {
        map.addLayers([layer, plottingLayer]);
        map.setCenter(new SuperMap.LonLat(0, 0), 0);
        dotSymbol = plottingLayer.createSymbol(libID, code2, locationPoints);
    }
    function createSymbolSuccess(evt) {
        dotSymbol = evt.feature;
    }
    setTimeout(function () {
        try{
            var goAnimation=new SuperMap.Plot.GOAnimation();
            var flag=goAnimation.setGOFeature(dotSymbol);
            equal(flag, true, "function:setGOFeature");
            start();
        } catch(exception){
            ok(false, "exception occcurs,message is:" + exception.message);
            start();
        } finally {
            map.destroy();
        }

    }, 400);
});

test("testGOAnimation_getGOAnimationType", function () {
    expect(1);
    var goAnimation=new SuperMap.Plot.GOAnimation();
    equal( goAnimation.getGOAnimationType(), SuperMap.Plot.GOAnimationType.ANIMATION_UNKNOWN, "function:getGOAnimationType");
});