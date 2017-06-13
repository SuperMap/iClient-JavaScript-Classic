module("XML");

test("testXML_constructor", function () {
    expect(8);
    var xml = new SuperMap.Format.XML({
        namespaces: {
            name: "yang",
            age: "seven"
        }
    });
    ok(xml.namespaces, "this namespaces is {}");
    ok(xml.namespaceAlias, "this namespacesAlias is {}");
    equals(xml.namespaces["name"], "yang", "this constructor is true");
    equals(xml.namespaceAlias["yang"], "name", "this constructor is true");
    equals(xml.defaultPrefix, null, "this defaultPrefix is null");
    ok(xml.xmldom, "this xmldom");
    same(xml.readers, {}, "this readers is array");
    same(xml.writers, {}, "this writers is array");
});

test("testXML_destroy", function () {
    expect(2);
    var xml = new SuperMap.Format.XML({
        namespaces: {
            name: "yang",
            age: "seven"
        }
    });
    xml.xmldom = new SuperMap.Request.XMLHttpRequest();
    ok(xml.xmldom instanceof SuperMap.Request.XMLHttpRequest, "this xmldom is ActiveXObject");
    xml.destroy();
    equals(xml.xmldom, null, "this destroy is true");
});

test("testXML_setNamespace", function () {
    expect();
    var xml = new SuperMap.Format.XML();
    xml.setNamespace("name", "yang");
    equals(xml.namespaces["name"], "yang", "this setNamespace is true");
    equals(xml.namespaceAlias["yang"], "name", "this setNamespace is true");
});

test("testXML_read", function () {
    expect(2);
    var testData = '<?xml version="1.0" encoding="UTF-8"?><wfs:FeatureCollection xmlns:wfs="http://www.opengis.net/wfs" xmlns:gml="http://www.opengis.net/gml" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:World="http://www.supermap.com/World" xsi:schemaLocation="http://www.opengis.net/wfs http://localhost:8090/iserver/services/data-world/wfs100?request=getschema&amp;file=wfs,1.0.0,WFS-basic.xsd http://www.supermap.com/World http://localhost:8090/iserver/services/data-world/wfs100?SERVICE=WFS&amp;REQUEST=DESCRIBEFEATURETYPE&amp;VERSION=1.0.0&amp;TYPENAME=World:Capitals" xmlns="http://www.opengis.net/gml"><gml:boundedBy><gml:null>unknown</gml:null></gml:boundedBy><gml:featureMember><World:Capitals fid="World.Capitals.1"><World:the_geom><gml:Point srsName="EPSG:4326"><gml:coordinates>25.27596664428711,54.688568115234375</gml:coordinates></gml:Point></World:the_geom><World:SMY>54.688568115234375</World:SMY><World:SMX>25.27596664428711</World:SMX><World:SMUSERID>14</World:SMUSERID><World:SMLIBTILEID>1</World:SMLIBTILEID><World:SMID>1</World:SMID><World:SMGEOMETRYSIZE>16</World:SMGEOMETRYSIZE><World:COUNTRY>立陶宛</World:COUNTRY><World:CAP_POP>582000.0</World:CAP_POP><World:CAPITAL>维尔纽斯</World:CAPITAL></World:Capitals></gml:featureMember></wfs:FeatureCollection>';
    var xml = new SuperMap.Format.XML();
    xml.xmldom = new SuperMap.Request.XMLHttpRequest();
    xml.keepData = true;
    var node = xml.read(testData);
    ok(node, "this read is true");
    ok(xml.data, "this read is true");
});

test("testXML_write", function () {
    expect();
    var testData = '<?xml version="1.0" encoding="UTF-8"?><wfs:FeatureCollection xmlns:wfs="http://www.opengis.net/wfs" xmlns:gml="http://www.opengis.net/gml" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:World="http://www.supermap.com/World" xsi:schemaLocation="http://www.opengis.net/wfs http://localhost:8090/iserver/services/data-world/wfs100?request=getschema&amp;file=wfs,1.0.0,WFS-basic.xsd http://www.supermap.com/World http://localhost:8090/iserver/services/data-world/wfs100?SERVICE=WFS&amp;REQUEST=DESCRIBEFEATURETYPE&amp;VERSION=1.0.0&amp;TYPENAME=World:Capitals" xmlns="http://www.opengis.net/gml"><gml:boundedBy><gml:null>unknown</gml:null></gml:boundedBy><gml:featureMember><World:Capitals fid="World.Capitals.1"><World:the_geom><gml:Point srsName="EPSG:4326"><gml:coordinates>25.27596664428711,54.688568115234375</gml:coordinates></gml:Point></World:the_geom><World:SMY>54.688568115234375</World:SMY><World:SMX>25.27596664428711</World:SMX><World:SMUSERID>14</World:SMUSERID><World:SMLIBTILEID>1</World:SMLIBTILEID><World:SMID>1</World:SMID><World:SMGEOMETRYSIZE>16</World:SMGEOMETRYSIZE><World:COUNTRY>立陶宛</World:COUNTRY><World:CAP_POP>582000.0</World:CAP_POP><World:CAPITAL>维尔纽斯</World:CAPITAL></World:Capitals></gml:featureMember></wfs:FeatureCollection>';
    var xml = new SuperMap.Format.XML();
    xml.keepData = true;
    var node = xml.read(testData);
    var data = xml.write(node);
    ok(data, "this write is true");
    //equals(data, testData, "this write is true");
});

test("testXML_createElementNS", function () {
    expect(1);
    var uri = "http://www.opengis.net/wfs",
        name = "wfs:FeatureCollection";
    var xml = new SuperMap.Format.XML();
    var doc = xml.createElementNS(uri, name);
    ok(doc, "this createElementNS is true");
});

test("testXML_createTextNode", function () {
    expect(1);
    var testData = '<?xml version="1.0" encoding="UTF-8"?><wfs:FeatureCollection xmlns:wfs="http://www.opengis.net/wfs" xmlns:gml="http://www.opengis.net/gml" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:World="http://www.supermap.com/World" xsi:schemaLocation="http://www.opengis.net/wfs http://localhost:8090/iserver/services/data-world/wfs100?request=getschema&amp;file=wfs,1.0.0,WFS-basic.xsd http://www.supermap.com/World http://localhost:8090/iserver/services/data-world/wfs100?SERVICE=WFS&amp;REQUEST=DESCRIBEFEATURETYPE&amp;VERSION=1.0.0&amp;TYPENAME=World:Capitals" xmlns="http://www.opengis.net/gml"><gml:boundedBy><gml:null>unknown</gml:null></gml:boundedBy><gml:featureMember><World:Capitals fid="World.Capitals.1"><World:the_geom><gml:Point srsName="EPSG:4326"><gml:coordinates>25.27596664428711,54.688568115234375</gml:coordinates></gml:Point></World:the_geom><World:SMY>54.688568115234375</World:SMY><World:SMX>25.27596664428711</World:SMX><World:SMUSERID>14</World:SMUSERID><World:SMLIBTILEID>1</World:SMLIBTILEID><World:SMID>1</World:SMID><World:SMGEOMETRYSIZE>16</World:SMGEOMETRYSIZE><World:COUNTRY>立陶宛</World:COUNTRY><World:CAP_POP>582000.0</World:CAP_POP><World:CAPITAL>维尔纽斯</World:CAPITAL></World:Capitals></gml:featureMember></wfs:FeatureCollection>';
    var xml = new SuperMap.Format.XML();
    var node = xml.createTextNode(testData);
    ok(node, "this read is true");
});

test("testXML_getOption", function () {
    expect(2);
    var uri = "http://www.opengis.net/wfs",
        name = "wfs:FeatureCollection";
    var testData = '<?xml version="1.0" encoding="UTF-8"?><wfs:FeatureCollection xmlns:wfs="http://www.opengis.net/wfs" xmlns:gml="http://www.opengis.net/gml" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:World="http://www.supermap.com/World" xsi:schemaLocation="http://www.opengis.net/wfs http://localhost:8090/iserver/services/data-world/wfs100?request=getschema&amp;file=wfs,1.0.0,WFS-basic.xsd http://www.supermap.com/World http://localhost:8090/iserver/services/data-world/wfs100?SERVICE=WFS&amp;REQUEST=DESCRIBEFEATURETYPE&amp;VERSION=1.0.0&amp;TYPENAME=World:Capitals" xmlns="http://www.opengis.net/gml"><gml:boundedBy><gml:null>unknown</gml:null></gml:boundedBy><gml:featureMember><World:Capitals fid="World.Capitals.1"><World:the_geom><gml:Point srsName="EPSG:4326"><gml:coordinates>25.27596664428711,54.688568115234375</gml:coordinates></gml:Point></World:the_geom><World:SMY>54.688568115234375</World:SMY><World:SMX>25.27596664428711</World:SMX><World:SMUSERID>14</World:SMUSERID><World:SMLIBTILEID>1</World:SMLIBTILEID><World:SMID>1</World:SMID><World:SMGEOMETRYSIZE>16</World:SMGEOMETRYSIZE><World:COUNTRY>立陶宛</World:COUNTRY><World:CAP_POP>582000.0</World:CAP_POP><World:CAPITAL>维尔纽斯</World:CAPITAL></World:Capitals></gml:featureMember></wfs:FeatureCollection>';
    var xml = new SuperMap.Format.XML();
    var node = xml.read(testData);

    var elements = xml.getElementsByTagNameNS(node, uri, name);
    ok(elements, "this getElementByTagNameNS is true");

    var value = xml.getChildValue(node, uri, name);
    ok(value, "this getChildValue is true");
});

test("testXML_isSimpleContent", function () {
    expect(2);
    var uri = "http://www.opengis.net/wfs",
        name = "wfs:FeatureCollection";
    var testData = '<?xml version="1.0" encoding="UTF-8"?><wfs:FeatureCollection xmlns:wfs="http://www.opengis.net/wfs" xmlns:gml="http://www.opengis.net/gml" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:World="http://www.supermap.com/World" xsi:schemaLocation="http://www.opengis.net/wfs http://localhost:8090/iserver/services/data-world/wfs100?request=getschema&amp;file=wfs,1.0.0,WFS-basic.xsd http://www.supermap.com/World http://localhost:8090/iserver/services/data-world/wfs100?SERVICE=WFS&amp;REQUEST=DESCRIBEFEATURETYPE&amp;VERSION=1.0.0&amp;TYPENAME=World:Capitals" xmlns="http://www.opengis.net/gml"><gml:boundedBy><gml:null>unknown</gml:null></gml:boundedBy><gml:featureMember><World:Capitals fid="World.Capitals.1"><World:the_geom><gml:Point srsName="EPSG:4326"><gml:coordinates>25.27596664428711,54.688568115234375</gml:coordinates></gml:Point></World:the_geom><World:SMY>54.688568115234375</World:SMY><World:SMX>25.27596664428711</World:SMX><World:SMUSERID>14</World:SMUSERID><World:SMLIBTILEID>1</World:SMLIBTILEID><World:SMID>1</World:SMID><World:SMGEOMETRYSIZE>16</World:SMGEOMETRYSIZE><World:COUNTRY>立陶宛</World:COUNTRY><World:CAP_POP>582000.0</World:CAP_POP><World:CAPITAL>维尔纽斯</World:CAPITAL></World:Capitals></gml:featureMember></wfs:FeatureCollection>';
    var xml = new SuperMap.Format.XML();
    var node = xml.read(testData);
    var value = xml.isSimpleContent(node, uri, name);
    equals(node.firstChild.nodeType, 7, "this isSimpleContent is true");
    equals(value, false, "this isSimpleContent is true");
});

test("testXML_contentType", function () {
    expect(2);
    var uri = "http://www.opengis.net/wfs",
        name = "wfs:FeatureCollection";
    var testData = '<?xml version="1.0" encoding="UTF-8"?><wfs:FeatureCollection xmlns:wfs="http://www.opengis.net/wfs" xmlns:gml="http://www.opengis.net/gml" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:World="http://www.supermap.com/World" xsi:schemaLocation="http://www.opengis.net/wfs http://localhost:8090/iserver/services/data-world/wfs100?request=getschema&amp;file=wfs,1.0.0,WFS-basic.xsd http://www.supermap.com/World http://localhost:8090/iserver/services/data-world/wfs100?SERVICE=WFS&amp;REQUEST=DESCRIBEFEATURETYPE&amp;VERSION=1.0.0&amp;TYPENAME=World:Capitals" xmlns="http://www.opengis.net/gml"><gml:boundedBy><gml:null>unknown</gml:null></gml:boundedBy><gml:featureMember><World:Capitals fid="World.Capitals.1"><World:the_geom><gml:Point srsName="EPSG:4326"><gml:coordinates>25.27596664428711,54.688568115234375</gml:coordinates></gml:Point></World:the_geom><World:SMY>54.688568115234375</World:SMY><World:SMX>25.27596664428711</World:SMX><World:SMUSERID>14</World:SMUSERID><World:SMLIBTILEID>1</World:SMLIBTILEID><World:SMID>1</World:SMID><World:SMGEOMETRYSIZE>16</World:SMGEOMETRYSIZE><World:COUNTRY>立陶宛</World:COUNTRY><World:CAP_POP>582000.0</World:CAP_POP><World:CAPITAL>维尔纽斯</World:CAPITAL></World:Capitals></gml:featureMember></wfs:FeatureCollection>';
    var xml = new SuperMap.Format.XML();
    var node = xml.read(testData);
    var value = xml.contentType(node, uri, name);
    equals(node.firstChild.nodeType, 7, "this contentType is true");
    equals(value, SuperMap.Format.XML.CONTENT_TYPE.MIXED, "this contentType is true");
});

test("testXML_readChildNode", function () {
    expect();
    var uri = "http://www.opengis.net/wfs",
        name = "wfs:FeatureCollection";
    var testData = '<?xml version="1.0" encoding="UTF-8"?><wfs:FeatureCollection xmlns:wfs="http://www.opengis.net/wfs" xmlns:gml="http://www.opengis.net/gml" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:World="http://www.supermap.com/World" xsi:schemaLocation="http://www.opengis.net/wfs http://localhost:8090/iserver/services/data-world/wfs100?request=getschema&amp;file=wfs,1.0.0,WFS-basic.xsd http://www.supermap.com/World http://localhost:8090/iserver/services/data-world/wfs100?SERVICE=WFS&amp;REQUEST=DESCRIBEFEATURETYPE&amp;VERSION=1.0.0&amp;TYPENAME=World:Capitals" xmlns="http://www.opengis.net/gml"><gml:boundedBy><gml:null>unknown</gml:null></gml:boundedBy><gml:featureMember><World:Capitals fid="World.Capitals.1"><World:the_geom><gml:Point srsName="EPSG:4326"><gml:coordinates>25.27596664428711,54.688568115234375</gml:coordinates></gml:Point></World:the_geom><World:SMY>54.688568115234375</World:SMY><World:SMX>25.27596664428711</World:SMX><World:SMUSERID>14</World:SMUSERID><World:SMLIBTILEID>1</World:SMLIBTILEID><World:SMID>1</World:SMID><World:SMGEOMETRYSIZE>16</World:SMGEOMETRYSIZE><World:COUNTRY>立陶宛</World:COUNTRY><World:CAP_POP>582000.0</World:CAP_POP><World:CAPITAL>维尔纽斯</World:CAPITAL></World:Capitals></gml:featureMember></wfs:FeatureCollection>';
    var xml = new SuperMap.Format.XML();
    var node = xml.read(testData);
    var attributes = [{
        "nodeName": name,
        "namespaceURI": uri
    }];
    var obj = xml.readChildNodes(node, attributes);
    ok(obj, "this readChildNode is true");
    equals(node.firstChild.nodeType, 7, "this readChildNode is true");

});
