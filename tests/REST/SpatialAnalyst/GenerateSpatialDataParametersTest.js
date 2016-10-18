module("GenerateSpatialDataParameters");

test("TestDefaultConstructor", function() {
	expect(11); 
	
	var params = new SuperMap.REST.GenerateSpatialDataParameters();
	
	ok(params !== null, "params not null");
	equal(params.routeTable, null, "params.routeTable");
	equal(params.routeIDField, null, "params.routeIDField");
	equal(params.eventTable, null, "params.eventTable");
	equal(params.eventRouteIDField, null, "params.eventRouteIDField");
	equal(params.measureField, null, "params.measureField");
	equal(params.measureStartField, null, "params.measureStartField");
	equal(params.measureEndField, null, "params.measureEndField");
	equal(params.measureOffsetField, null, "params.measureOffsetField");
	equal(params.errorInfoField, null, "params.errorInfoField");
	equal(params.dataReturnOption, null, "params.dataReturnOption");
});
test("TestConstructor_destroy", function() {
	expect(12); 
	
	//配置数据返回Option
	var option = new SuperMap.REST.DataReturnOption({
		expectCount: 1000,
		dataset: "generateSpatialData",
		deleteExistResultDataset: true,
		dataReturnMode: SuperMap.REST.DataReturnMode.DATASET_ONLY
	}),
	//配置动态分段Parameters
	params = new SuperMap.REST.GenerateSpatialDataParameters({
		routeTable: "RouteDT_road@Changchun",
		routeIDField: "RouteID",
		eventTable: "LinearEventTabDT@Changchun",
		eventRouteIDField: "RouteID",
		measureField: "",
		measureStartField: "LineMeasureFrom",
		measureEndField: "LineMeasureTo",
		measureOffsetField: "",
		errorInfoField: "",
		dataReturnOption: option
	});
	
	ok(option !== null, "option not null");
	ok(params !== null, "params not null");
	equal(params.routeTable, "RouteDT_road@Changchun", "params.routeTable");
	equal(params.routeIDField, "RouteID", "params.routeIDField");
	equal(params.eventTable, "LinearEventTabDT@Changchun", "params.eventTable");
	equal(params.eventRouteIDField, "RouteID", "params.eventRouteIDField");
	equal(params.measureField, "", "params.measureField");
	equal(params.measureStartField, "LineMeasureFrom", "params.measureStartField");
	equal(params.measureEndField, "LineMeasureTo", "params.measureEndField");
	equal(params.measureOffsetField, "", "params.measureOffsetField");
	equal(params.errorInfoField, "", "params.errorInfoField");
	equal(params.dataReturnOption, option, "params.dataReturnOption");
});
