module('Rectangle');
test("testRectangle_constructorDefault",function(){
    var x = 1;
    var y = 2;
    var w = 10;
    var h = 20;
    var recttangle = new SuperMap.Geometry.Rectangle(x, y, w, h);
    equals(recttangle.x,x,"property:x");
    equals(recttangle.y,y,"property:y");
    equals(recttangle.width,w,"Property:width");
    equals(recttangle.height,h,"Property:height");
    recttangle.destroy();

});
test("testRectangle_calculateBounds",function(){
    expect(4);
    var x = 1;
    var y = 2;
    var w = 10;
    var h = 20;
    var recttangle = new SuperMap.Geometry.Rectangle(x, y, w, h);
    recttangle.calculateBounds();
    equals(recttangle.bounds.left,x,"Function:calculateBounds");
    equals(recttangle.bounds.right,x+w,"Function:calculateBounds");
    equals(recttangle.bounds.top,y+h,"Function:calculateBounds");
    equals(recttangle.bounds.bottom,y,"Function:calculateBounds");
    recttangle.destroy();
});
test("testRectangle_getLength",function(){
    expect(1);
    var x = 1;
    var y = 2;
    var w = 10;
    var h = 20;
    var recttangle = new SuperMap.Geometry.Rectangle(x, y, w, h);
    var len = recttangle.getLength();
    equals(len,2*(w+h),"Function:getLength");
    recttangle.destroy();
});
test("testRectangle_getArea",function(){
    expect(1);
    var x = 1;
    var y = 2;
    var w = 10;
    var h = 20;
    var recttangle = new SuperMap.Geometry.Rectangle(x, y, w, h);
    var area = recttangle.getArea();
    equals(area,w*h,"Function:getArea");
    recttangle.destroy();
});



