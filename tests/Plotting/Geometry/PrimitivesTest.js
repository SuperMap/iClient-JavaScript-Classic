module('Primitives');

var pri = new SuperMap.Geometry.Primitives();
var cp = [new SuperMap.Geometry.Point(0, 0), new SuperMap.Geometry.Point(4, 3)];
var p1 = new SuperMap.Geometry.Point(10, 10);
var p2 = new SuperMap.Geometry.Point(100, 100);
var ec = new SuperMap.Geometry.Point(0,0);
var pts = [new SuperMap.Geometry.Point(0, 0), new SuperMap.Geometry.Point(50, 50), new SuperMap.Geometry.Point(80, 0)];
test("testPrimitives_Constructor", function () {
    var pri = new SuperMap.Geometry.Primitives();
    equal(pri.CLASS_NAME, "SuperMap.Geometry.Primitives", "function:CLASS_NAME")
});

test("testPrimitives_kidney", function () {
    var kidney = pri.kidney(pts);
    equal(kidney.components[0].components[1].x, 50, "Functyion:kidney");
});

test("testPrimitives_circle", function () {
    var circle = pri.circle(cp);
    equal(Math.round(circle.components[0].components[1].x), 5, "Function:circle");
    equal(Math.round(circle.components[0].components[1].y), 1, "Function:circle");

});

test("testPrimitives_rectangle", function () {
    var circle = pri.rectangle(cp);
    equal(circle.components[0].components[1].x, 4, "Function:rectangle");
    equal(circle.components[0].components[1].y, 0, "Function:rectangle");
});

test("testPrimitives_geotext", function () {
    var txt = "SuperMap";
    var geotext = pri.geotext(pts, txt);
    equal(geotext.text, "SuperMap", "Function:geotext");
});

test("testPrimitives_ellipse", function () {
    var majorAxis = 9;
    var minorAxis = 3;
    var dRotation = 30;
    var getArcPoints = pri.ellipse(pts, dRotation, majorAxis, minorAxis);
    equal(Math.round(getArcPoints.components[0].x), 8, "Function:ellipse");
    equal(Math.round(getArcPoints.components[0].y), 4, "Function:ellipse");

});

test("testPrimitives_getArcSpatialData", function () {
    var majorAxis = 9;
    var minorAxis = 3;
    var dRotation = 0;
    var dStep = Math.PI*2 / 72;
    var getArcPoints = pri.getArcSpatialData(ec, majorAxis, minorAxis, dRotation, 0, Math.PI*2, dStep);
    equal(getArcPoints[0].x, 9, "Function:getEllipseSpatialData");
    equal(getArcPoints[0].y, 0, "Function:getEllipseSpatialData");
});

test("testPrimitives_calcEllipseRadian", function () {
    var a = Math.PI / 4;
    var majorAxis = 9;
    var minorAxis = 3;
    var calcEllipseRadian = pri.calcEllipseRadian(a, majorAxis, minorAxis);
    equal(Math.round(calcEllipseRadian), 1, "Function:getEllipseSpatialData");
});

test("testPrimitives_getArcInfo", function () {
    var p1 = new SuperMap.Geometry.Point(-2, 0);
    var p2 = new SuperMap.Geometry.Point(2, 0);
    var p3 = new SuperMap.Geometry.Point(0, 2);
    var arcInfo = pri.getArcInfo(p1, p3, p2);
    equal(arcInfo.dRadius, 2, "Function:getArcInfo.dRadius");
    equal(arcInfo.dStartAngle, 0, "Function:getArcInfo.startAngle");
    equal(arcInfo.dEndAngle, 180, "Function:getArcInfo.endAngle");
});

//test("testPrimitives_getArcPoints",2, function () {
//    var controlPoints = [
//        new SuperMap.Geometry.Point(0, 10),
//        new SuperMap.Geometry.Point(11, 20),
//        new SuperMap.Geometry.Point(21, 30),
//        new SuperMap.Geometry.Point(31, 40)
//    ];
//    var getArcPoints = pri.getArcPoints(controlPoints);
//    equal(getArcPoints.allpoints[0].x, 0, "Function:getArcPoints");
//    equal(getArcPoints.allpoints[0].y, 10, "Function:getArcPoints");
//    getArcPoints = null;
//});
//test("testPrimitives_calculateMidpoint", 2, function () {
//    var calculateMidpoint = pri.calculateMidpoint(p1, p2);
//    equal(calculateMidpoint.x, 55, "Function:calculateMidpoint");
//    equal(calculateMidpoint.y, 55, "Function:calculateMidpoint");
//    calculateMidpoint = null;
//});
//test("testPrimitives_calculateIntersection", 2, function () {
//    var v_1 = new SuperMap.Geometry.Point(-3, -4);
//    var v_2 = new SuperMap.Geometry.Point(-5, -6);
//    var point1 = new SuperMap.Geometry.Point(-1, 0);
//    var point2 = new SuperMap.Geometry.Point(0, -0.2);
//    var calculateIntersection = pri.calculateIntersection(v_1, v_2, point1, point2);
//    equal(calculateIntersection.x, -11.5, "Function:calculateIntersection");
//    equal(calculateIntersection.y, -14, "Function:calculateIntersection");
//    v_1 = v_2 = point1 = point2 = null;
////});
//test("testPrimitives_calculateDistance", 1, function () {
//    var ps = new SuperMap.Geometry.Point(1, 3);
//    var pe = new SuperMap.Geometry.Point(4, 7);
//    var calculateDistance = pri.calculateDistance(ps, pe);
//    equal(calculateDistance, 5, "Function:calculateDistance");
//    ps = null;
//    pe = null;
//});
//test("testPrimitives_calculateAngle", 1, function () {
//    var cp = new SuperMap.Geometry.Point(0, 0);
//    var cp1 = new SuperMap.Geometry.Point(1, 0);
//    var calculateAngle = pri.calculateAngle(cp1, cp);
//    equal(calculateAngle, 0, "Function:calculateAngle");
//    cp = null;
//    cp1 = null;
//    calculateAngle = null;
//});