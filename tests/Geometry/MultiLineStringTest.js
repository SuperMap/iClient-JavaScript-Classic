module("MultiLineString");

test("testMultiLineString_constructor", function () {
    expect(5);
    var multi = new SuperMap.Geometry.MultiLineString([
        new SuperMap.Geometry.LineString([
            new SuperMap.Geometry.Point(10,20),
            new SuperMap.Geometry.Point(30,40)
        ])
    ]);
    equals(multi.componentTypes[0],"SuperMap.Geometry.LineString","this componentTypes is SuperMap.Geometry.LineString");
    equals(multi.components[0].components[0].x,10,"this first x is 10");
    equals(multi.components[0].components[0].y,20,"this first y is 20");
    equals(multi.components[0].components[1].x,30,"this second x is 30");
    equals(multi.components[0].components[1].y,40,"this second y is 40");
});

test("testMultiLineString_split",function() {
    expect(6);
    var multi = new SuperMap.Geometry.MultiLineString([
        new SuperMap.Geometry.LineString([
            new SuperMap.Geometry.Point(0,0),
            new SuperMap.Geometry.Point(20,20)
        ])
    ]);
    var geometry = new SuperMap.Geometry.LineString([
        new SuperMap.Geometry.Point(0,10),
        new SuperMap.Geometry.Point(10,0)
    ]);
    var options = {
        mutual:false,       //only split target geometry
        edge:true,
        tolerance:5
    };
    var results =  multi.split(geometry,options);
    equals(results[0].components[0].x,0,"this split is true");
    equals(results[0].components[0].y,10,"this split is true");
    equals(results[1].components[1].x,10,"this split is true");
    equals(results[1].components[1].y,0,"this split is true");
    equals(results[0].components[1].x,results[1].components[0].x,"this split is true");
    equals(results[0].components[1].y,results[1].components[0].y,"this split is true");
});

test("testMultiLineString_splitWith",function() {
    expect(6);
    var multi = new SuperMap.Geometry.MultiLineString([



        new SuperMap.Geometry.LineString([
            new SuperMap.Geometry.Point(0,10),
            new SuperMap.Geometry.Point(10,0)
        ])
    ]);
    var geometry = new SuperMap.Geometry.LineString([
        new SuperMap.Geometry.Point(0,0),
        new SuperMap.Geometry.Point(20,20)
    ]);
    var options = {
        mutual:false,       //only split target geometry
        edge:true,
        tolerance:5
    };
    var results =  multi.splitWith(geometry,options);
    equals(results[0].components[0].components[0].x,0,"this split is true");
    equals(results[0].components[0].components[0].y,10,"this split is true");
    equals(results[1].components[0].components[1].x,10,"this split is true");
    equals(results[1].components[0].components[1].y,0,"this split is true");
    equals(results[0].components[0].components[1].x,results[1].components[0].components[0].x,"this split is true");
    equals(results[0].components[0].components[1].y,results[1].components[0].components[0].y,"this split is true");
});