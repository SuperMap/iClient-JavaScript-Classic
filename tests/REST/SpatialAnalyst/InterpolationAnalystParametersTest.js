module("InterpolationAnalystParameters");

//测试使用默认参数值的有效性
test("TestDefaultConstructor", function () {
    expect(4);

    var dsOverlayAnalystParameters = new SuperMap.REST.InterpolationDensityAnalystParameters({
        dataset: "SamplesP@China400",
        searchRadius: "100000",
        pixelFormat: SuperMap.REST.PixelFormat.BIT16,
        zValueFieldName: "AVG_TMP",
        resolution: 3000,
        filterQueryParameter: {
            attributeFilter: ""
        },
        outputDatasetName: "myDensity"
    });

    ok(dsOverlayAnalystParameters != null, "not null");
    ok(dsOverlayAnalystParameters.dataset != null, "not null");
    ok(dsOverlayAnalystParameters.searchRadius != null, "not null");
    ok(dsOverlayAnalystParameters.outputDatasetName != null, "not null");

    dsOverlayAnalystParameters.destroy();
   // equal(dsOverlayAnalystParameters.dataset, null, "dsOverlayAnalystParameters.dataset");
});