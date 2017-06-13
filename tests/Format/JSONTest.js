module("JSON");

var dataJson = '{"type": "Feature","geometry": {"type": "Point", "coordinates": [102.0, 0.5]},"properties": {"prop0": "arr0"}}';

test("testJSON_constructor", function () {
    expect(5);
    var json = new SuperMap.Format.JSON();
    ok(json instanceof SuperMap.Format.JSON, "json instanceof SuperMap.Format.JSON");
    equals(json.level, 0, "this level is 0");
    ok(!json.pretty, "this pretty is false");
    ok(json.nativeJSON, "this nativeJSON is true");
    equals(json.CLASS_NAME, "SuperMap.Format.JSON", "this CLASS_NAME is Surper.Format.JSON");
});

test("testJSON_read", function () {
    expect(5);
    var json = new SuperMap.Format.JSON();
    var dataJsons = json.read(dataJson);
    equals(dataJsons.type, "Feature", "this read is true");
    equals(dataJsons.geometry.type, "Point", "this read is true");
    equals(dataJsons.geometry.coordinates[0], 102, "this read is true");
    equals(dataJsons.geometry.coordinates[1], 0.5, "this read is true");
    equals(dataJsons.properties.prop0, "arr0", "this read is true");
});

test("testJSON_write", function () {
    expect(6);
    var json = new SuperMap.Format.JSON();
    var arr = ['type', 'geometry', 'width', 'height'];
    var obj = {
        "width": "5px",
        "height": "5px"
    };
    var date = new Date();
    var boolean = true;
    var number = 12345;
    var string = "hello world";
    equals(typeof json.write(arr, true), "string", "this write is true");
    equals(typeof json.write(obj, true), "string", "this write is true");
    equals(typeof json.write(date, true), "string", "this write is true");
    equals(typeof json.write(boolean, true), "string", "this write is true");
    equals(typeof json.write(number, true), "string", "this write is true");
    equals(typeof json.write(string, true), "string", "this write is true");
});

test("testJSON_writeIndent",function() {
    expect();
    var json = new SuperMap.Format.JSON();
    json.pretty = true;
    json.level = 5;
    ok(json.writeIndent(),"this writeIndent is true");
});

test("testJSON_writeNewline",function() {
    expect();
    var json = new SuperMap.Format.JSON();
    json.pretty = true;
    json.level = 5;
    ok(json.writeNewline(),"this writeNewline is true");
});

test("testJSON_writeSpace",function() {
    expect();
    var json = new SuperMap.Format.JSON();
    json.pretty = true;
    json.level = 5;
    ok(json.writeSpace(),"this writeSpace is true");
});