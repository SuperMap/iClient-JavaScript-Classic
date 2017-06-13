module("HTTP");

test("testHTTP_constructor", function () {
    expect(13);
    var url = "http://localhost:6080/iserver/services/data-world/rest/data/datasources/World/datasets/Countries/features.kml",
        format = new SuperMap.Format.KML({
            extractStyles: true,
            extractAttributes: true,
            internalProjection: new SuperMap.Projection("EPSG:3857"),       //所在地图的坐标系
            maxDepth: 2      //要解析外部链接文件时此值必须大于1
        }),
        params = {'bbox': '5,5,5,5'},
        headers = {'ContentType': 'plain/text'};
    var http = new SuperMap.Protocol.HTTP({
        url: url,
        format: format,
        params: params,
        headers: headers
    });
    equals(http.url, url, "http://localhost:6080/iserver/services/data-world/rest/data/datasources/World/datasets/Countries/features.kml");
    equals(http.headers.ContentType, headers.ContentType, "plain/text");
    equals(http.params.bbox, params.bbox, "5,5,5,5");
    equals(http.callback, null, null);
    equals(http.scope, null, null);
    equals(http.readWithPOST, false, "this readWithPOST is false");
    equals(http.updateWithPOST, false, "this updateWithPOST is false");
    equals(http.deleteWithPOST, false, "this deleteWithPOST is false");
    equals(http.format.extractStyles, true, "this extractStyles is true");
    equals(http.format.extractAttributes, true, "this extractAttributes is true");
    equals(http.format.maxDepth, 2, "this maxDepth is 2");
    equals(http.wildcarded, false, "this wildcarded is false");
    equals(http.srsInBBOX, false, "this srsInBBOX is false");
});

test("testHTTP_destroy", function () {
    expect(3);
    var url = "http://localhost:6080/iserver/services/data-world/rest/data/datasources/World/datasets/Countries/features.kml",
        format = new SuperMap.Format.KML({
            extractStyles: true,
            extractAttributes: true,
            internalProjection: new SuperMap.Projection("EPSG:3857"),       //所在地图的坐标系
            maxDepth: 2      //要解析外部链接文件时此值必须大于1
        }),
        params = {'bbox': '5,5,5,5'},
        headers = {'ContentType': 'plain/text'};
    var http = new SuperMap.Protocol.HTTP({
        url: url,
        format: format,
        params: params,
        headers: headers
    });
    http.destroy();
    equals(http.headers, null, "this destroy is true");
    equals(http.params, null, "this destroy is true");
    equals(http.format, null, "this destroy is true");
});

asyncTest("testHTTP_read", function () {
    expect(5);
    var host = document.location.toString().match(/file:\/\//) ? "http://localhost:8090" : 'http://' + document.location.host,
        url = host + "/iserver/services/data-world/rest/data/datasources/World/datasets/Countries/features.kml",
        format = new SuperMap.Format.KML({
            extractStyles: true,
            extractAttributes: true,
            internalProjection: new SuperMap.Projection("EPSG:3857"),       //所在地图的坐标系
            maxDepth: 2      //要解析外部链接文件时此值必须大于1
        }),
        comparison = new SuperMap.Filter.Comparison({
            type: SuperMap.Filter.Comparison.LIKE,
            property: "NAME",
            value: "China Bank"
        });
    var http = new SuperMap.Protocol.HTTP({
        url: url,
        format: format,
        readWithPOST: false
    });
    var resp = http.read({
        url: url,
        filter: comparison
    });
    setTimeout(function () {
        equals(resp.priv.status, 200, "this read is true");
        equals(resp.priv.readyState, 4, "this read is true");
        equals(http.readWithPOST, false, "this readWithPOST is true");
        equals(resp.requestType, "read", "this read is true");
        ok(resp.priv, "this read is true");
        start();
    }, 1000);
});

asyncTest("testHTTP_handleResponse", function () {
    expect(2);
    var host = document.location.toString().match(/file:\/\//) ? "http://localhost:8090" : 'http://' + document.location.host,
        url = host + "/iserver/services/data-world/rest/data/datasources/World/datasets/Countries/features.kml",
        format = new SuperMap.Format.KML({
            extractStyles: true,
            extractAttributes: true,
            internalProjection: new SuperMap.Projection("EPSG:3857"),       //所在地图的坐标系
            maxDepth: 2      //要解析外部链接文件时此值必须大于1
        }),
        comparison = new SuperMap.Filter.Comparison({
            type: SuperMap.Filter.Comparison.LIKE,
            property: "NAME",
            value: "China Bank"
        });
    var options = {
        url: url,
        filter: comparison,
        callback: function () {
            return true;
        }
    };

    var http = new SuperMap.Protocol.HTTP({
        url: url,
        format: format,
        readWithPOST: false
    });

    var resp = http.read(options);
    setTimeout(function () {
        http.handleResponse(resp, options);
        ok(resp.features, "this handleResponse is true");
        equals(resp.code, 1, "this handleResponse is true");
        start();
    }, 1000);

});

asyncTest("testHTTP_parseFeatures", function () {
    expect(2);
    var host = document.location.toString().match(/file:\/\//) ? "http://localhost:8090" : 'http://' + document.location.host,
        url = host + "/iserver/services/data-world/rest/data/datasources/World/datasets/Countries/features.kml",
        format = new SuperMap.Format.KML({
            extractStyles: true,
            extractAttributes: true,
            internalProjection: new SuperMap.Projection("EPSG:3857"),       //所在地图的坐标系
            maxDepth: 2      //要解析外部链接文件时此值必须大于1
        }),
        comparison = new SuperMap.Filter.Comparison({
            type: SuperMap.Filter.Comparison.LIKE,
            property: "NAME",
            value: "China Bank"
        });
    var options = {
        url: url,
        filter: comparison,
        callback: function () {
            return true;
        }
    };

    var http = new SuperMap.Protocol.HTTP({
        url: url,
        format: format,
        readWithPOST: false
    });

    var resp = http.read(options);
    setTimeout(function () {
        http.parseFeatures(resp.priv);
        ok(resp.features, "this handleResponse is true");
        ok(resp.features.length, "this handleResponse is true");
        start();
    }, 1000);

});

asyncTest("testHTTP_handleRead", function () {
    expect(2);
    var host = document.location.toString().match(/file:\/\//) ? "http://localhost:8090" : 'http://' + document.location.host,
        url = host + "/iserver/services/data-world/rest/data/datasources/World/datasets/Countries/features.kml",
        format = new SuperMap.Format.KML({
            extractStyles: true,
            extractAttributes: true,
            internalProjection: new SuperMap.Projection("EPSG:3857"),       //所在地图的坐标系
            maxDepth: 2      //要解析外部链接文件时此值必须大于1
        }),
        comparison = new SuperMap.Filter.Comparison({
            type: SuperMap.Filter.Comparison.LIKE,
            property: "NAME",
            value: "China Bank"
        });
    var options = {
        url: url,
        filter: comparison,
        callback: function () {
            return true;
        }
    };

    var http = new SuperMap.Protocol.HTTP({
        url: url,
        format: format,
        readWithPOST: false
    });

    var resp = http.read(options);
    setTimeout(function () {
        http.handleRead(resp, options);
        ok(resp.features, "this handleResponse is true");
        equals(resp.code, 1, "this handleResponse is true");
        start();
    }, 1000);

});

asyncTest("testHTTP_handleCreate", function () {
    expect(2);
    var host = document.location.toString().match(/file:\/\//) ? "http://localhost:8090" : 'http://' + document.location.host,
        url = host + "/iserver/services/data-world/rest/data/datasources/World/datasets/Countries/features.kml",
        format = new SuperMap.Format.KML({
            extractStyles: true,
            extractAttributes: true,
            internalProjection: new SuperMap.Projection("EPSG:3857"),       //所在地图的坐标系
            maxDepth: 2      //要解析外部链接文件时此值必须大于1
        }),
        comparison = new SuperMap.Filter.Comparison({
            type: SuperMap.Filter.Comparison.LIKE,
            property: "NAME",
            value: "China Bank"
        });
    var options = {
        url: url,
        filter: comparison,
        callback: function () {
            return true;
        }
    };

    var http = new SuperMap.Protocol.HTTP({
        url: url,
        format: format,
        readWithPOST: false
    });

    var resp = http.read(options);
    setTimeout(function () {
        http.handleCreate(resp, options);
        ok(resp.features, "this handleResponse is true");
        equals(resp.code, 1, "this handleResponse is true");
        start();
    }, 1000);

});

asyncTest("testHTTP_handleUpdate", function () {
    expect(2);
    var host = document.location.toString().match(/file:\/\//) ? "http://localhost:8090" : 'http://' + document.location.host,
        url = host + "/iserver/services/data-world/rest/data/datasources/World/datasets/Countries/features.kml",
        format = new SuperMap.Format.KML({
            extractStyles: true,
            extractAttributes: true,
            internalProjection: new SuperMap.Projection("EPSG:3857"),       //所在地图的坐标系
            maxDepth: 2      //要解析外部链接文件时此值必须大于1
        }),
        comparison = new SuperMap.Filter.Comparison({
            type: SuperMap.Filter.Comparison.LIKE,
            property: "NAME",
            value: "China Bank"
        });
    var options = {
        url: url,
        filter: comparison,
        callback: function () {
            return true;
        }
    };

    var http = new SuperMap.Protocol.HTTP({
        url: url,
        format: format,
        readWithPOST: false
    });

    var resp = http.read(options);
    setTimeout(function () {
        http.handleUpdate(resp, options);
        ok(resp.features, "this handleResponse is true");
        equals(resp.code, 1, "this handleResponse is true");
        start();
    }, 1000);

});

asyncTest("testHTTP_handleDelete", function () {
    expect(2);
    var host = document.location.toString().match(/file:\/\//) ? "http://localhost:8090" : 'http://' + document.location.host,
        url = host + "/iserver/services/data-world/rest/data/datasources/World/datasets/Countries/features.kml",
        format = new SuperMap.Format.KML({
            extractStyles: true,
            extractAttributes: true,
            internalProjection: new SuperMap.Projection("EPSG:3857"),       //所在地图的坐标系
            maxDepth: 2      //要解析外部链接文件时此值必须大于1
        }),
        comparison = new SuperMap.Filter.Comparison({
            type: SuperMap.Filter.Comparison.LIKE,
            property: "NAME",
            value: "China Bank"
        });
    var options = {
        url: url,
        filter: comparison,
        callback: function () {
            return true;
        }
    };

    var http = new SuperMap.Protocol.HTTP({
        url: url,
        format: format,
        readWithPOST: false
    });

    var resp = http.read(options);
    setTimeout(function () {
        http.handleDelete(resp, options);
        ok(resp.features, "this handleResponse is true");
        equals(resp.code, 1, "this handleResponse is true");
        start();
    }, 1000);

});

asyncTest("testHTTP_create", function () {
    expect(1);
    var host = document.location.toString().match(/file:\/\//) ? "http://localhost:8090" : 'http://' + document.location.host,
        url = host + "/iserver/services/data-world/rest/data/datasources/World/datasets/Lakes/features.kml",
        format = new SuperMap.Format.KML({
            extractStyles: true,
            extractAttributes: true,
            internalProjection: new SuperMap.Projection("EPSG:3857"),       //所在地图的坐标系
            maxDepth: 2      //要解析外部链接文件时此值必须大于1
        }),
        comparison = new SuperMap.Filter.Comparison({
            type: SuperMap.Filter.Comparison.LIKE,
            property: "NAME",
            value: "China Bank"
        });
    var options = {
        url: url,
        filter: comparison,
        callback: function () {
            return true;
        }
    };

    var http = new SuperMap.Protocol.HTTP({
        url: url,
        format: format,
        readWithPOST: false
    });

    var resp = http.read(options);
    http.handleResponse(resp, options);


    setTimeout(function () {
        options = SuperMap.Util.applyDefaults(options, this.options);
        var resp2 = [], nResponses = 0;

        var types = {};
        types[SuperMap.State.INSERT] = [];
        types[SuperMap.State.UPDATE] = [];
        types[SuperMap.State.DELETE] = [];
        var feature, list, requestFeatures = [];

        for (var i = 0, len = resp.features.length; i < len; ++i) {
            feature = resp.features[i];
            list = types[feature.state];
            if (list) {
                list.push(feature);
                requestFeatures.push(feature);
            }
        }
        // tally up number of requests
        var nRequests = (types[SuperMap.State.INSERT].length > 0 ? 1 : 0) +
            types[SuperMap.State.UPDATE].length +
            types[SuperMap.State.DELETE].length;

        var success = true;
        var finalResponse = new SuperMap.Protocol.Response({
            reqFeatures: requestFeatures
        });

        function insertCallback(response) {
            var len = response.features ? response.features.length : 0;
            var fids = new Array(len);
            for (var i = 0; i < len; ++i) {
                fids[i] = response.features[i].fid;
            }
            finalResponse.insertIds = fids;
            callback.apply(this, [response]);
        }

        function callback(response) {
            this.callUserCallback(response, options);
            success = success && response.success();
            nResponses++;
            if (nResponses >= nRequests) {
                if (options.callback) {
                    finalResponse.code = success ?
                        SuperMap.Protocol.Response.SUCCESS :
                        SuperMap.Protocol.Response.FAILURE;
                    options.callback.apply(options.scope, [finalResponse]);
                }
            }
        }

        var queue = types[SuperMap.State.INSERT];
        if (queue.length > 0) {
            resp2.push(http.create(
                queue, SuperMap.Util.applyDefaults(
                    {callback: insertCallback, scope: http}, options.create
                )
            ));
        }
        ok(resp2, "this create is true");
        start();
    }, 1000);
});

asyncTest("testHTTP_update", function () {
    expect(1);
    var host = document.location.toString().match(/file:\/\//) ? "http://localhost:8090" : 'http://' + document.location.host,
        url = host + "/iserver/services/data-world/rest/data/datasources/World/datasets/Lakes/features.kml",
        format = new SuperMap.Format.KML({
            extractStyles: true,
            extractAttributes: true,
            internalProjection: new SuperMap.Projection("EPSG:3857"),       //所在地图的坐标系
            maxDepth: 2      //要解析外部链接文件时此值必须大于1
        }),
        comparison = new SuperMap.Filter.Comparison({
            type: SuperMap.Filter.Comparison.LIKE,
            property: "NAME",
            value: "China Bank"
        });
    var options = {
        url: url,
        filter: comparison,
        callback: function () {
            return true;
        }
    };

    var http = new SuperMap.Protocol.HTTP({
        url: url,
        format: format,
        readWithPOST: false
    });

    var resp = http.read(options);
    http.handleResponse(resp, options);


    setTimeout(function () {
        options = SuperMap.Util.applyDefaults(options, this.options);
        var resp2 = [], nResponses = 0;

        var types = {};
        types[SuperMap.State.INSERT] = [];
        types[SuperMap.State.UPDATE] = [];
        types[SuperMap.State.DELETE] = [];
        var feature, list, requestFeatures = [];
        for (var i = 0, len = resp.features.length; i < len; ++i) {
            feature = resp.features[i];
            list = types[feature.state];
            if (list) {
                list.push(feature);
                requestFeatures.push(feature);
            }
        }
        var nRequests = (types[SuperMap.State.INSERT].length > 0 ? 1 : 0) +
            types[SuperMap.State.UPDATE].length +
            types[SuperMap.State.DELETE].length;

        var success = true;
        var finalResponse = new SuperMap.Protocol.Response({
            reqFeatures: requestFeatures
        });

        function insertCallback(response) {
            var len = response.features ? response.features.length : 0;
            var fids = new Array(len);
            for (var i = 0; i < len; ++i) {
                fids[i] = response.features[i].fid;
            }
            finalResponse.insertIds = fids;
            callback.apply(this, [response]);
        }

        function callback(response) {
            this.callUserCallback(response, options);
            success = success && response.success();
            nResponses++;
            if (nResponses >= nRequests) {
                if (options.callback) {
                    finalResponse.code = success ?
                        SuperMap.Protocol.Response.SUCCESS :
                        SuperMap.Protocol.Response.FAILURE;
                    options.callback.apply(options.scope, [finalResponse]);
                }
            }
        }

        var queue = types[SuperMap.State.INSERT];
        if (queue.length > 0) {
            resp2.push(http.update(
                queue, SuperMap.Util.applyDefaults(
                    {callback: insertCallback, scope: http}, options.create
                )
            ));
        }
        ok(resp2, "this update is true");
        start();
    }, 1000);
});

asyncTest("testHTTP_delete", function () {
    expect(1);
    var host = document.location.toString().match(/file:\/\//) ? "http://localhost:8090" : 'http://' + document.location.host,
        url = host + "/iserver/services/data-world/rest/data/datasources/World/datasets/Lakes/features.kml",
        format = new SuperMap.Format.KML({
            extractStyles: true,
            extractAttributes: true,
            internalProjection: new SuperMap.Projection("EPSG:3857"),       //所在地图的坐标系
            maxDepth: 2      //要解析外部链接文件时此值必须大于1
        }),
        comparison = new SuperMap.Filter.Comparison({
            type: SuperMap.Filter.Comparison.LIKE,
            property: "NAME",
            value: "China Bank"
        });
    var options = {
        url: url,
        filter: comparison,
        callback: function () {
            return true;
        }
    };

    var http = new SuperMap.Protocol.HTTP({
        url: url,
        format: format,
        readWithPOST: false
    });

    var resp = http.read(options);
    http.handleResponse(resp, options);


    setTimeout(function () {
        options = SuperMap.Util.applyDefaults(options, this.options);
        var resp2 = [], nResponses = 0;

        var types = {};
        types[SuperMap.State.INSERT] = [];
        types[SuperMap.State.UPDATE] = [];
        types[SuperMap.State.DELETE] = [];
        var feature, list, requestFeatures = [];
        for (var i = 0, len = resp.features.length; i < len; ++i) {
            feature = resp.features[i];
            list = types[feature.state];
            if (list) {
                list.push(feature);
                requestFeatures.push(feature);
            }
        }
        var nRequests = (types[SuperMap.State.INSERT].length > 0 ? 1 : 0) +
            types[SuperMap.State.UPDATE].length +
            types[SuperMap.State.DELETE].length;

        var success = true;
        var finalResponse = new SuperMap.Protocol.Response({
            reqFeatures: requestFeatures
        });

        function callback(response) {
            this.callUserCallback(response, options);
            success = success && response.success();
            nResponses++;
            if (nResponses >= nRequests) {
                if (options.callback) {
                    finalResponse.code = success ?
                        SuperMap.Protocol.Response.SUCCESS :
                        SuperMap.Protocol.Response.FAILURE;
                    options.callback.apply(options.scope, [finalResponse]);
                }
            }
        }

        queue = types[SuperMap.State.DELETE];
        for (var i = queue.length - 1; i >= 0; --i) {
            resp2.push(http["delete"](
                queue[i], SuperMap.Util.applyDefaults(
                    {callback: callback, scope: http}, options["delete"]
                ))
            );
        }
        ok(resp2, "this delete is true");
        start();
    }, 1000);
});

asyncTest("testHTTP_commit", function () {
    expect(1);
    var host = document.location.toString().match(/file:\/\//) ? "http://localhost:8090" : 'http://' + document.location.host,
        url = host + "/iserver/services/data-world/rest/data/datasources/World/datasets/Lakes/features.kml",
        format = new SuperMap.Format.KML({
            extractStyles: true,
            extractAttributes: true,
            internalProjection: new SuperMap.Projection("EPSG:3857"),       //所在地图的坐标系
            maxDepth: 2      //要解析外部链接文件时此值必须大于1
        }),
        comparison = new SuperMap.Filter.Comparison({
            type: SuperMap.Filter.Comparison.LIKE,
            property: "NAME",
            value: "China Bank"
        });
    var options = {
        url: url,
        filter: comparison,
        callback: function () {
            return true;
        }
    };

    var http = new SuperMap.Protocol.HTTP({
        url: url,
        format: format,
        readWithPOST: false
    });

    var resp = http.read(options);
    http.handleResponse(resp, options);

    setTimeout(function () {
        ok(http.commit(resp.features, options), "this commit is true");
        start();
    }, 1000);
});
