module("DefualtStyle");

test("testDefualtStyle_Constructor", function () {
    var defaultStyle = new SuperMap.Plot.DefualtStyle();

    equal(defaultStyle.CLASS_NAME, "SuperMap.Plot.DefualtStyle", "Property.CLASS_NAME");
    equal(defaultStyle.lineColor, "#0000FF", "Property.lineColor");
    equal(defaultStyle.lineWidth, 2, "Property.lineWidth");
    equal(defaultStyle.symbolWidth, -1, "Property.symbolWidth");
    equal(defaultStyle.symbolHeight, -1, "Property.symbolHeight");
    equal(defaultStyle.lineType, "solid", "Property.lineType");
    equal(defaultStyle.tableWidth, 10, "Property.tableWidth");
    equal(defaultStyle.tableHeight, 10, "Property.tableHeight");
    equal(defaultStyle.defaultFlag, false, "Property.defaultFlag");

    defaultStyle.destroy();
});

test("testDefualtStyle_Destroy", function () {
    var defaultStyle = new SuperMap.Plot.DefualtStyle();

    equal(defaultStyle.CLASS_NAME, "SuperMap.Plot.DefualtStyle", "Property.CLASS_NAME");

    defaultStyle.destroy();
    ok(defaultStyle !== null, "not null");
    ok(defaultStyle.lineColor === null,"defaultStyle.lineColor");
    ok(defaultStyle.lineWidth === null,"defaultStyle.lineWidth");
    ok(defaultStyle.symbolWidth === null,"defaultStyle.symbolWidth");
    ok(defaultStyle.symbolHeight === null,"defaultStyle.symbolHeight");
    ok(defaultStyle.lineType === null,"defaultStyle.lineType");
    ok(defaultStyle.tableWidth === null,"defaultStyle.tableWidth");
    ok(defaultStyle.tableHeight === null,"defaultStyle.tableHeight");
    ok(defaultStyle.defaultFlag === null,"defaultStyle.defaultFlag");
});

test("testDefualtStyle_set_get", function () {
    var defaultStyle = new SuperMap.Plot.DefualtStyle();

    defaultStyle.setLineType("solid");
    equal(defaultStyle.getLineType(), "solid", "Function:getLineType");

    defaultStyle.setLineWidth(50);
    equal(defaultStyle.getLineWidth(), 50, "Function:getLineWidth");

    defaultStyle.setLineColor("#0000FF");
    equal(defaultStyle.getLineColor(), "#0000FF", "Function:getLineColor");

    defaultStyle.setSymbolWidth(40);
    equal(defaultStyle.getSymbolWidth(), 40, "Function:getWidth");

    defaultStyle.setSymbolHeight(70);
    equal(defaultStyle.getSymbolHeight(), 70, "Function:getHeight");

    defaultStyle.setTableWidth(100);
    equal(defaultStyle.getTableWidth(), 100, "Function:getTableWidth");

    defaultStyle.setTableHeight(200);
    equal(defaultStyle.getTableHeight(), 200, "Function:getTableHeight");

    defaultStyle.setDefaultFlag(true);
    equal(defaultStyle.getDefaultFlag(), true, "Function:getDefaultFlag");

    defaultStyle.destroy();
});