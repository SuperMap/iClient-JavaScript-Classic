module("SelectGrid");

test("testSelectGrid_constructor", function () {
    expect();
    var map = new SuperMap.Map("map");
    var heatGridLayer = new SuperMap.Layer.HeatGridLayer("heatGrid");
    var select = new SuperMap.Control.SelectGrid(heatGridLayer,{box:true});
    map.addControl(select);
    select.activate();
    console.log(select);
    ok(select._callbacks,"this _callbacks is true");
    ok(select.scope,"this scope is this");
    ok(select.layer instanceof SuperMap.Layer.HeatGridLayer,"this layer is HeatGridLayer");
    equals(select.box,true,"this box is true");
    equals(select.CLASS_NAME,"SuperMap.Control.SelectGrid","this CLASS_NAME is SuperMap.Control.SelectCluster");
});