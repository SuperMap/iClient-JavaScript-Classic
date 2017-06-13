module("Canvas");

var containerID = "canvas";
function initContainer() {
    layer = new SuperMap.Layer.Vector("vector");
    var container = document.createElement("div");
    container.setAttribute("id", containerID);
    document.body.appendChild(container);
}

test("CanvasTest_Initialize", function() {
    expect(11);

    initContainer();
    var canvas = new SuperMap.Renderer.Canvas(containerID, {});

    equal(canvas.CLASS_NAME, "SuperMap.Renderer.Canvas", "CanvasTest_Constructor");
    equal(canvas.hitDetection, true, "CanvasTest_Constructor");
    equal(canvas.hitOverflow, 0, "CanvasTest_Constructor");
    equal(canvas.root.tagName, "CANVAS", "CanvasTest_Constructor");
    ok(canvas.canvas != null, "CanvasTest_Constructor");
    equal(typeof canvas.features, "object", "CanvasTest_Constructor");
    equal(canvas.pendingRedraw, false, "CanvasTest_Constructor");
    equal(typeof canvas.cachedSymbolBounds, "object", "CanvasTest_Constructor");
    equal(canvas.hitCanvas.tagName, "CANVAS", "CanvasTest_Constructor");
    ok(canvas.hitContext != null, "CanvasTest_Constructor");
    ok(canvas.container.childNodes.length != 0, "CanvasTest_Constructor");
});

test("CanvasTest_SetExtent", function() {
    expect(1);

    initContainer();
    var canvas = new SuperMap.Renderer.Canvas(containerID, {});

    canvas.size = new SuperMap.Size(1000, 700);
    canvas.map = new SuperMap.Map("map");

    var resolutionChanged = true,
        extent = new SuperMap.Bounds(0, 150, 100, 0);
    var result = canvas.setExtent(extent, resolutionChanged);

    equal(result, false, "CanvasTest_SetExtent");
});

test("CanvasTest_EraseGeometry", function() {
    expect(1);

    initContainer();
    var canvas = new SuperMap.Renderer.Canvas(containerID, {});

    var geo = new SuperMap.Geometry.Point(50, 50),
        feature = new SuperMap.Feature.Vector(geo),
        style = new SuperMap.Style();
    canvas.features[feature.id] = [feature, style];

    canvas.eraseGeometry(geo, feature.id);

    equal(canvas.features[feature.id], undefined, "CanvasTest_EraseGeometry");
});

test("CanvasTest_Supported", function() {
    expect(1);

    initContainer();
    var canvas = new SuperMap.Renderer.Canvas(containerID, {});

    var can = document.createElement("canvas");

    var isSupported = canvas.supported();

    equal(isSupported, !!can.getContext, "CanvasTest_Supported");
});

test("CanvasTest_SetSize", function() {
    expect(11);

    initContainer();
    var canvas = new SuperMap.Renderer.Canvas(containerID, {});
    var size = new SuperMap.Size(100, 500);

    canvas.setSize(size);

    equal(canvas.size.w, 100, "CanvasTest_SetSize");
    equal(canvas.size.h, 500, "CanvasTest_SetSize");
    equal(canvas.root.style.width, "100px", "CanvasTest_SetSize");
    equal(canvas.root.style.height, "500px", "CanvasTest_SetSize");
    equal(canvas.root.width, 100, "CanvasTest_SetSize");
    equal(canvas.root.height, 500, "CanvasTest_SetSize");
    equal(canvas.hitCanvas.width, 100, "CanvasTest_SetSize");
    equal(canvas.hitCanvas.height, 500, "CanvasTest_SetSize");
    equal(canvas.hitCanvas.style.width, "100px", "CanvasTest_SetSize");
    equal(canvas.hitCanvas.style.height, "500px", "CanvasTest_SetSize");
    equal(canvas.resolution, null, "CanvasTest_SetSize");
});

test("CanvasTest_DrawFeature", function() {
    expect(3);

    initContainer();
    var canvas = new SuperMap.Renderer.Canvas(containerID, {});

    var geo = new SuperMap.Geometry.Point(50, 50),
        feature = new SuperMap.Feature.Vector(geo),
        style = new SuperMap.Style();
    canvas.extent = new SuperMap.Bounds(0, 0, 500, 500);
    canvas.map = new SuperMap.Map("map");
    canvas.locked = false;
    canvas.pendingRedraw = true;

    var options = {
            scales: [1/500000000, 1/250000000, 1/125000000, 1/62500000
            , 1/31250000, 1/15625000],
            resolutions: [1.4966072995194117, 0.7483036497597059, 0.37415182487985293, 0.18707591243992647,
            0.09353795621996323, 0.04676897810998162], units: "Degree"
        },
        url = GlobeParameter.mapServiceURL + "World Map",
        name = "TiledDynamicRESTLayer",
        layer = new SuperMap.Layer.TiledDynamicRESTLayer(name, url, {overlapDisplayed:false}, options);
    canvas.map.addLayer(layer);

    var rendered = canvas.drawFeature(feature, style);

    equal(canvas.pendingRedraw, false, "CanvasTest_DrawFeature");
    equal(rendered, true, "CanvasTest_DrawFeature");
    ok(canvas.features.length != 0, "CanvasTest_DrawFeature");
});

test("CanvasTest_DrawGeometry", function() {
    expect(1);

    initContainer();
    var canvas = new SuperMap.Renderer.Canvas(containerID, {});
    canvas.map = new SuperMap.Map("map");
    canvas.extent = new SuperMap.Bounds(-180, -90, 180, 90);

    var options = {
            scales: [1/500000000, 1/250000000, 1/125000000, 1/62500000
            , 1/31250000, 1/15625000],
            resolutions: [1.4966072995194117, 0.7483036497597059, 0.37415182487985293, 0.18707591243992647,
            0.09353795621996323, 0.04676897810998162], units: "Degree"
        },
        url = GlobeParameter.mapServiceURL + "World Map",
        name = "TiledDynamicRESTLayer",
        layer = new SuperMap.Layer.TiledDynamicRESTLayer(name, url, {overlapDisplayed:false}, options);
    canvas.map.addLayer(layer);

    var geometry  = new SuperMap.Geometry.MultiPoint([
            new SuperMap.Geometry.Point(0, 0),
            new SuperMap.Geometry.Point(50, 50)
        ]),
        style = new SuperMap.Style(),
        feature = new SuperMap.Feature.Vector(geometry);
    style.fillOpacity = 0.5;
    canvas.features[feature.id] = [feature, style];

    canvas.drawGeometry(geometry, style, feature.id);

    var geometry1 = new SuperMap.Geometry.LinearRing([
        new SuperMap.Geometry.Point(0, 0),
        new SuperMap.Geometry.Point(50, 50),
        new SuperMap.Geometry.Point(100, 50)
    ]);
    var feature1 = new SuperMap.Feature.Vector(geometry1);
    canvas.features[feature1.id] = [feature1, style];
    canvas.drawGeometry(geometry1, style, feature1.id);

    var geometry2 = new SuperMap.Geometry.LineString([
        new SuperMap.Geometry.Point(0, 0),
        new SuperMap.Geometry.Point(50, 50),
        new SuperMap.Geometry.Point(100, 50)
    ]);
    var feature2 = new SuperMap.Feature.Vector(geometry2);
    canvas.features[feature2.id] = [feature2, style];
    canvas.drawGeometry(geometry2, style, feature2.id);
    
    var geometry3 = new SuperMap.Geometry.Polygon([
        new SuperMap.Geometry.LinearRing([
            new SuperMap.Geometry.Point(0, 0),
            new SuperMap.Geometry.Point(50, 50),
            new SuperMap.Geometry.Point(100, 50)
        ])
    ]); 
    style.fill = false;
    style.fillOpacity = 0.5;
    var feature3 = new SuperMap.Feature.Vector(geometry3);
    canvas.features[feature3.id] = [feature3, style];
    canvas.drawGeometry(geometry3, style, feature3.id);

    equal(style.fillOpacity, 0.5, "CanvasTest_DrawGeometry");

    var geometry4 = new SuperMap.Geometry.Rectangle([
            new SuperMap.Geometry.Point(0, 0),
            new SuperMap.Geometry.Point(50, 50),
            new SuperMap.Geometry.Point(100, 50),
            new SuperMap.Geometry.Point(500, 50)
    ]); 
    var feature4 = new SuperMap.Feature.Vector(geometry4);
    canvas.features[feature4.id] = [feature4, style];
    canvas.drawGeometry(geometry4, style, feature4.id);
});

test("CanvasTest_DrawExternalGraphic", function() {
    expect(2);

    initContainer();
    var canvas = new SuperMap.Renderer.Canvas(containerID, {});

    var geo = new SuperMap.Geometry.Point(50, 50),
        feature = new SuperMap.Feature.Vector(geo),
        style = new SuperMap.Style();

    canvas.map = new SuperMap.Map("map");
    var options = {
            scales: [1/500000000, 1/250000000, 1/125000000, 1/62500000
            , 1/31250000, 1/15625000],
            resolutions: [1.4966072995194117, 0.7483036497597059, 0.37415182487985293, 0.18707591243992647,
            0.09353795621996323, 0.04676897810998162], units: "Degree"
        },
        url = GlobeParameter.mapServiceURL + "World Map",
        name = "TiledDynamicRESTLayer",
        layer = new SuperMap.Layer.TiledDynamicRESTLayer(name, url, {overlapDisplayed:false}, options);
    canvas.map.addLayer(layer);
    canvas.extent = new SuperMap.Bounds(-180, -90, 180, 90);
    canvas.londingimgs[feature.id] = [feature, style];
    canvas.features[feature.id] = [feature, style];
    canvas.featureId = feature.id;
    canvas.geometry = geo;
    canvas.style = style;
    
    style.externalGraphic = "Images/Day.jpg";
    style.graphicTitle = "image";
    style.graphicWidth = 5;
    style.graphicHeight = 5;
    style.pointRadius = 2;
    style.fillOpacity = 0.5;
    style.rotation = 30;

    canvas.drawExternalGraphic(geo, style, feature.id);
    ok(canvas.features[feature.id][0].img != undefined, "CanvasTest_DrawExternalGraphic");
    equal(canvas.canvas.globalCompositeOperation, "source-over", "CanvasTest_DrawExternalGraphic");

    var img = new Image();
    canvas.features[feature.id][0].img = img;
    canvas.drawExternalGraphic(geo, style, feature.id);
});

test("CanvasTest_SetCanvasStyle", function() {
    expect(8);

    initContainer();
    var canvas = new SuperMap.Renderer.Canvas(containerID, {});

    var type = "fill",
        style = new SuperMap.Style();

    canvas.setCanvasStyle(type, style);
    equal(canvas.canvas.globalAlpha, 1, "CanvasTest_SetCanvasStyle");
    equal(canvas.canvas.fillStyle, "#000000", "CanvasTest_SetCanvasStyle");

    type = "stroke";
    canvas.setCanvasStyle(type, style);
    equal(canvas.canvas.globalAlpha, 1, "CanvasTest_SetCanvasStyle");
    equal(canvas.canvas.lineCap, "butt", "CanvasTest_SetCanvasStyle");
    equal(canvas.canvas.strokeStyle, "#000000", "CanvasTest_SetCanvasStyle");
    equal(canvas.canvas.lineWidth, 1, "CanvasTest_SetCanvasStyle");

    type = "";
    canvas.setCanvasStyle(type, style);
    equal(canvas.canvas.globalAlpha, 0, "CanvasTest_SetCanvasStyle");
    equal(canvas.canvas.lineWidth, 1, "CanvasTest_SetCanvasStyle");
});

test("CanvasTest_FeatureIdToHex", function() {
    expect(1);

    initContainer();
    var canvas = new SuperMap.Renderer.Canvas(containerID, {});
    var featureId = featureId = "SuperMap.Feature.Vector_17777216";

    var hex = canvas.featureIdToHex(featureId);

    equal(hex, "#0f4242", "CanvasTest_FeatureIdToHex");
});

test("CanvasTest_SetHitContextStyle", function() {
    expect(7);

    initContainer();
    var canvas = new SuperMap.Renderer.Canvas(containerID, {});

    var type = "fill",
        featureId = "SuperMap.Feature.Vector_20",
        symbolizer = new SuperMap.Symbolizer();

    canvas.setHitContextStyle(type, featureId, symbolizer);
    equal(canvas.hitContext.globalAlpha, 1.0, "CanvasTest_SetHitContextStyle");
    equal(canvas.hitContext.fillStyle, "#000015", "CanvasTest_SetHitContextStyle");

    type = "stroke";
    canvas.setHitContextStyle(type, featureId, symbolizer);
    equal(canvas.hitContext.globalAlpha, 1.0, "CanvasTest_SetHitContextStyle");
    equal(canvas.hitContext.fillStyle, "#000015", "CanvasTest_SetHitContextStyle");
    equal(canvas.hitContext.lineWidth, 1, "CanvasTest_SetHitContextStyle");

    type = "";
    canvas.setHitContextStyle(type, featureId, symbolizer);
    equal(canvas.hitContext.globalAlpha, 0, "CanvasTest_SetHitContextStyle");
    equal(canvas.hitContext.lineWidth, 1, "CanvasTest_SetHitContextStyle");
});

test("CanvasTest_DrawPoint", function() {
    expect(1);

    initContainer();
    var canvas = new SuperMap.Renderer.Canvas(containerID, {});

    var geometry = new SuperMap.Geometry.Point(50, 50),
        style = new SuperMap.Style();
    var feature = new SuperMap.Feature.Vector(geometry),
        featureId = feature.id;

    style.graphic = true;
    style.stroke = "butt";
    style.fill = "#FFFFFF";
    style.pointRadius = 5;

    canvas.map = new SuperMap.Map("map");
    var options = {
            scales: [1/500000000, 1/250000000, 1/125000000, 1/62500000
            , 1/31250000, 1/15625000],
            resolutions: [1.4966072995194117, 0.7483036497597059, 0.37415182487985293, 0.18707591243992647,
            0.09353795621996323, 0.04676897810998162], units: "Degree"
        },
        url = GlobeParameter.mapServiceURL + "World Map",
        name = "TiledDynamicRESTLayer",
        layer = new SuperMap.Layer.TiledDynamicRESTLayer(name, url, {overlapDisplayed:false}, options);
    canvas.map.addLayer(layer);
    canvas.extent = new SuperMap.Bounds(-180, -90, 180, 90);

    canvas.drawPoint(geometry, style, featureId);

    equal(canvas.canvas.lineCap, style.stroke, "CanvasTest_DrawPoint");
});

test("CanvasTest_DrawNamedSymbol", function() {
    expect(9);

    initContainer();
    var canvas = new SuperMap.Renderer.Canvas(containerID, {});

    var geometry = new SuperMap.Geometry.Point(50, 50),
        style = new SuperMap.Style();
    var feature = new SuperMap.Feature.Vector(geometry),
        featureId = feature.id;
    
    style.graphicName = "star";
    style.rotation = 30;
    style.pointRadius = 2;
    style.strokeWidth = 2;
    style.fill = "#FFFFFF";
    style.stroke = "butt";

    canvas.cachedSymbolBounds = {};
    canvas.map = new SuperMap.Map("map");
    var options = {
            scales: [1/500000000, 1/250000000, 1/125000000, 1/62500000
            , 1/31250000, 1/15625000],
            resolutions: [1.4966072995194117, 0.7483036497597059, 0.37415182487985293, 0.18707591243992647,
            0.09353795621996323, 0.04676897810998162], units: "Degree"
        },
        url = GlobeParameter.mapServiceURL + "World Map",
        name = "TiledDynamicRESTLayer",
        layer = new SuperMap.Layer.TiledDynamicRESTLayer(name, url, {overlapDisplayed:false}, options);
    canvas.map.addLayer(layer);
    canvas.extent = new SuperMap.Bounds(-180, -90, 180, 90);


    canvas.drawNamedSymbol(geometry, style, featureId);

    equal(canvas.canvas.lineCap, "round", "CanvasTest_DrawNamedSymbol");
    equal(canvas.canvas.lineJoin, "round", "CanvasTest_DrawNamedSymbol");
    equal(canvas.hitContext.lineCap, "round", "CanvasTest_DrawNamedSymbol");
    equal(canvas.hitContext.lineJoin, "round", "CanvasTest_DrawNamedSymbol");
    equal(canvas.cachedSymbolBounds[style.graphicName].left, 231, "CanvasTest_DrawNamedSymbol");
    equal(canvas.cachedSymbolBounds[style.graphicName].top, 301, "CanvasTest_DrawNamedSymbol");
    equal(canvas.cachedSymbolBounds[style.graphicName].right, 469, "CanvasTest_DrawNamedSymbol");
    equal(canvas.cachedSymbolBounds[style.graphicName].bottom, 75, "CanvasTest_DrawNamedSymbol");
    equal(style.strokeWidth, 2, "CanvasTest_DrawNamedSymbol");   
});

test("CanvasTest_DrawLineString", function() {
    expect(1);

    initContainer();
    var canvas = new SuperMap.Renderer.Canvas(containerID, {});

    var geo = new SuperMap.Geometry.LineString([
            new SuperMap.Geometry.Point(0, 0),
            new SuperMap.Geometry.Point(50, 50),
            new SuperMap.Geometry.Point(100, 50)
        ]),
        feature = new SuperMap.Feature.Vector(geo),
        style = new SuperMap.Style();

    style.fill = true;
    style.stroke = true;
    canvas.map = new SuperMap.Map("map");
    var options = {
            scales: [1/500000000, 1/250000000, 1/125000000, 1/62500000
            , 1/31250000, 1/15625000],
            resolutions: [1.4966072995194117, 0.7483036497597059, 0.37415182487985293, 0.18707591243992647,
            0.09353795621996323, 0.04676897810998162], units: "Degree"
        },
        url = GlobeParameter.mapServiceURL + "World Map",
        name = "TiledDynamicRESTLayer",
        layer = new SuperMap.Layer.TiledDynamicRESTLayer(name, url, {overlapDisplayed:false}, options);
    canvas.map.addLayer(layer);
    canvas.extent = new SuperMap.Bounds(-180, -90, 180, 90);

    canvas.drawLineString(geo, style, feature.id);

    equal(style.fill, true, "CanvasTest_DrawLineString");
});

test("CanvasTest_DrawLinearRing", function() {
    expect(1);

    initContainer();
    var canvas = new SuperMap.Renderer.Canvas(containerID, {});

    var geo = new SuperMap.Geometry.LinearRing([
            new SuperMap.Geometry.Point(0, 0),
            new SuperMap.Geometry.Point(50, 50),
            new SuperMap.Geometry.Point(100, 50)
        ]),
        feature = new SuperMap.Feature.Vector(geo),
        style = new SuperMap.Style();

    style.fill = true;
    style.stroke = true;
    canvas.map = new SuperMap.Map("map");
    var options = {
            scales: [1/500000000, 1/250000000, 1/125000000, 1/62500000
            , 1/31250000, 1/15625000],
            resolutions: [1.4966072995194117, 0.7483036497597059, 0.37415182487985293, 0.18707591243992647,
            0.09353795621996323, 0.04676897810998162], units: "Degree"
        },
        url = GlobeParameter.mapServiceURL + "World Map",
        name = "TiledDynamicRESTLayer",
        layer = new SuperMap.Layer.TiledDynamicRESTLayer(name, url, {overlapDisplayed:false}, options);
    canvas.map.addLayer(layer);
    canvas.extent = new SuperMap.Bounds(-180, -90, 180, 90);

    canvas.drawLinearRing(geo, style, feature.id);

    equal(style.fill, true, "CanvasTest_DrawLinearRing");
});

test("CanvasTest_RenderPath", function() {
    expect(1);

    initContainer();
    var canvas = new SuperMap.Renderer.Canvas(containerID, {});

    var geo = new SuperMap.Geometry.LinearRing([
            new SuperMap.Geometry.Point(0, 0),
            new SuperMap.Geometry.Point(50, 50),
            new SuperMap.Geometry.Point(100, 50)
        ]),
        feature = new SuperMap.Feature.Vector(geo),
        style = new SuperMap.Style();

    style.fill = true;
    style.stroke = true;
    canvas.map = new SuperMap.Map("map");
    var options = {
            scales: [1/500000000, 1/250000000, 1/125000000, 1/62500000
            , 1/31250000, 1/15625000],
            resolutions: [1.4966072995194117, 0.7483036497597059, 0.37415182487985293, 0.18707591243992647,
            0.09353795621996323, 0.04676897810998162], units: "Degree"
        },
        url = GlobeParameter.mapServiceURL + "World Map",
        name = "TiledDynamicRESTLayer",
        layer = new SuperMap.Layer.TiledDynamicRESTLayer(name, url, {overlapDisplayed:false}, options);
    canvas.map.addLayer(layer);
    canvas.extent = new SuperMap.Bounds(-180, -90, 180, 90);

    canvas.renderPath(canvas.hitContext, geo, style, feature.id, "stroke");

    equal(style.fill, true, "CanvasTest_RenderPath");
});
