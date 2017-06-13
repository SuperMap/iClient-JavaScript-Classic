module("SelectCluster");

test("testSelectCluster_constructor",function() {
    expect(5);
    var map = new SuperMap.Map("map");
    var clusterLayer = new SuperMap.Layer.ClusterLayer("cluster");
    var select = new SuperMap.Control.SelectCluster(clusterLayer,{box:true});
    map.addControl(select);
    select.activate();
    ok(select._callbacks,"this _callbacks is true");
    ok(select.scope,"this scope is this");
    ok(select.layer instanceof SuperMap.Layer.ClusterLayer,"this layer is true");
    equals(select.box,true,"this box is true");
    equals(select.CLASS_NAME,"SuperMap.Control.SelectCluster","this CLASS_NAME is SuperMap.Control.SelectCluster");
});