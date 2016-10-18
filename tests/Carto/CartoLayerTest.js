module("CartoLayer");

var feature0 = {
    "id":1,
    "searchValues":"",
    "attributes":{
        "SmUserID":"0",
        "SmID":"1",
        "SmArea":"1.6060069623493825E15",
        "SmPerimeter":"1.6030006674231339E8",
        "featureID":1},
    "geometry":{
        "cutEdges":null,
        "coordinateType":null,
        "parts":[5],
        "points":[0,258,258,258,258,0,0,0,0,258],
        "type":"REGION"
    },
    "style":{
        "strokeStyle":"rgba(0,0,0,0)",
        "lineWidth":1,
        "lineCap":"butt",
        "lineJoin":"round",
        "miterLimit":10,
        "lineDashOffset":0,
        "lineOpacity":1,
        "lineDasharray":[],
        "fillStyle":"rgba(145, 185, 234, 1)",
        "polygonOpacity":1,
        "offsetX":0,
        "offsetY":0,
        "globalAlpha":1,
        "globalCompositeOperation":"source-over",
        "imageSmoothingEnabled":true,
        "offset":{"x":0,"y":0}
    },
    "layerIndex":0
},feature1 = {
    "id":4,
    "searchValues":"",
    "attributes":{"SmUserID":"0","SmID":"4","SmArea":"7.168490366110804E11","SmPerimeter":"1.645230095809228E7","featureID":4},
    "geometry":{
        "cutEdges":null,
        "coordinateType":null,
        "parts":[9,3,3,3,3,4,3,3,3,4,5,3,59,3,4,4,3],
        "points":[246,162,244,163,245,164,246,164,246,163,247,164,248,164,247,161,246,162,250,164,249,164,250,164,250,166,250,166,250,166,246,156,246,157,246,156,249,160,249,161,249,160,247,158,248,158,247,159,247,158,254,172,254,172,254,172,247,160,247,161,247,160,248,159,247,160,248,159,254,147,254,149,254,148,254,147,247,155,248,156,247,157,246,156,247,155,246,156,245,155,246,156,252,152,250,155,253,155,253,156,252,158,251,159,252,159,251,159,252,159,254,160,254,163,256,164,256,165,255,165,256,166,256,167,258,167,258,169,257,170,258,171,256,172,251,172,251,173,249,173,249,174,248,173,250,171,252,171,253,170,251,171,249,170,250,168,250,167,249,167,250,166,252,166,252,165,252,164,251,164,251,163,252,162,249,163,249,160,250,160,249,159,248,160,249,159,248,161,249,157,248,158,247,158,248,158,247,158,248,157,248,155,249,155,248,154,249,153,252,152,255,147,254,147,255,147,247,153,246,155,246,154,247,153,252,151,252,152,251,152,252,151,255,146,255,147,255,146],
        "type":"REGION"
    },
    "style":{
        "strokeStyle":"rgba(0,0,0,0)",
        "lineWidth":1,
        "lineCap":"butt",
        "lineJoin":"round",
        "miterLimit":10,
        "lineDashOffset":0,
        "lineOpacity":1,
        "lineDasharray":[],
        "fillStyle":"rgba(245, 243, 240, 1)",
        "polygonOpacity":1,
        "offsetX":0,
        "offsetY":0,
        "globalAlpha":1,
        "globalCompositeOperation":"source-over",
        "imageSmoothingEnabled":true,
        "offset":{"x":0,"y":0}
    },
    "layerIndex":1
};

test("testCartoLayer_constructorDefault",function(){
    var cartoLayer=new SuperMap.CartoLayer();
    equals(cartoLayer.tile,null,"Property:tile");
    equals(cartoLayer.layerName,null,"Property:layerName");
    equals(cartoLayer.id,null,"Property:id");
    equals(cartoLayer.className,null,"Property:className");
    equals(cartoLayer.index,0,"Property:index");
    cartoLayer.destroy();
});

test("testCartoLayer_constructor",function(){
    var layerName="CartoLayer@Carto";
    var nLayerName=layerName.replace(/[@#]/gi,"___");
    var cartoLayer=new SuperMap.CartoLayer(layerName,null,{});
    equals(cartoLayer.tile,null,"Property:tile");
    equals(cartoLayer.layerName,layerName,"Property:layerName");
    equals(cartoLayer.id,nLayerName,"Property:id");
    equals(cartoLayer.className,nLayerName,"Property:className");
    equals(cartoLayer.index,0,"Property:index");
});

test("testCartoLayer_addFeature",function(){
    var layerName="CartoLayer@Carto";
    var cartoLayer=new SuperMap.CartoLayer(layerName,null,{});
    equals(cartoLayer.features[0],null,"before addFeature Proerty:features");
    cartoLayer.addFeature(feature0);
    equals(cartoLayer.features[0],feature0,"after addFeature Proerty:features");
    cartoLayer.addFeatures([feature1]);
    equals(cartoLayer.features[1],feature1,"after addFeatures Property:features");
});

test("testCartoLayer_getDefaultStyle",function(){
    var layerName="CartoLayer@Carto";
    var style;
    var cartoLayer=new SuperMap.CartoLayer(layerName,null,{});
    style = {strokeStyle:"#fff"};
    cartoLayer.getDefaultStyle(style,'TEXT');
    equals(style.textBaseline,'center',"getDefaultStyle_text");
    style = {strokeStyle:"#fff"};
    cartoLayer.getDefaultStyle(style,'POINT');
    equals(style.fillStyle,'#fc0',"getDefaultStyle_point");
    style = {strokeStyle:"#fff"};
    cartoLayer.getDefaultStyle(style,'LINE');
    equals(style.strokeStyle,'rgba(0,0,0,0)',"getDefaultStyle_line");
    style = {strokeStyle:"#fff"};
    cartoLayer.getDefaultStyle(style,'REGION');
    equals(style.fillStyle,'rgba(0,0,0,0)',"getDefaultStyle_region");
});

test("testCartoLayer_destructor",function(){
    var cartoLayer=new SuperMap.CartoLayer();
    cartoLayer.destroy();
    equals(cartoLayer.tile,null,"Property:tile");
    equals(cartoLayer.layerName,null,"Property:layerName");
    equals(cartoLayer.id,null,"Property:id");
    equals(cartoLayer.className,null,"Property:className");
    equals(cartoLayer.index,null,"Property:index");
});