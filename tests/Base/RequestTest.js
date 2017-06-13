module('Request');
/*post方式代替put方式*/
test("testRequest_PUT", 2, function(){
    var config = {
        method: "PUT",
        url: "http://localhost:8090/iServer",
        async: true,
        user: undefined,
        password: undefined,
        params: null,
        proxy: SuperMap.ProxyHost,
        headers: {"Content-Type": "application/xml"},
        data: null,
        callback: function() {},
        success: null,
        failure: null,
        scope: null
    };
    equal(config.method, "PUT", "test PUT method");
    SuperMap.Request.PUT(config);
    equal(config.method, "POST", "POST instead of PUT");
});

test("testRequest_DELETE", 1, function(){
    var config = {
        method: "DELETE",
        url: "http://localhost:8090/iServer",
        async: true,
        user: undefined,
        password: undefined,
        params: null,
        proxy: SuperMap.ProxyHost,
        headers: {"Content-Type": "application/xml"},
        data: null,
        callback: function() {},
        success: null,
        failure: null,
        scope: null
    };
    SuperMap.Request.DELETE(config);
    equal(config.method, "POST", "POST instead of PUT");
})
