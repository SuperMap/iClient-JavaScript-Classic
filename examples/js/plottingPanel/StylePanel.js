
/**
 *
 * Class: SuperMap.Plotting.StylePanel
 * 属性面板类。
 *
 */
SuperMap.Plotting.StylePanel = new SuperMap.Class({

    displayName: ["旋转角度", "随图缩放", "镜像", "标号级别", "Width", "Height",
         "位置点偏移","偏移线类型","锁定","对象可见性"
    ],

    displayTextContentName:["注记内容", "注记位置", "注记大小", "注记颜色", "注记字体","注记距离"],

    displayLineStyleName:[ "线宽", "线颜色","透明度", "线型"],

    displaySurroundLineName:["衬线类型", "衬线宽", "衬线颜色", "衬线透明度"],

    displayFillStyleName:["填充", "填充色", "填充透明度","渐变填充方式","填充背景色","填充背景透明度"],

    fontName:[
        "字体描边", "描边色", "描边宽度", "文字背景", "背景色",
        "文字阴影", "阴影色", "偏移量X", "偏移量Y",
        "字间距","字宽百分比"
    ],

    displayNameNew: [
        "起始","终止",
        "避让","路径线","贝塞尔曲线",
        "半径类型","注记一","注记二",
        "卫星轨道",
        "节点类型","旋转角度",
        "注记边框","圆角边框",
        "显示箭头",
        "标注边框",
        "半径角度",
        "连接线类型"
    ],


    group: ["基本", "军标大小", "线形", "填充", "注记", "子标号", "衬线", "箭头类型", "半径", "文字","解除锁定","对象间连线"],

    /**
     * Property: editLayers
     * {<SuperMap.Layer.PlottingLayer>} 标绘图层数组
     */
    editLayers: [],

    /**
     * Property: selectFeatures
     * {<SuperMap.Feature.Vector>} 要修改的要素
     */
    selectFeatures:[],


    /**
     * Constructor: SuperMap.Plotting.StylePanel
     * 标号库管理类。
     *
     * Parameters:
     * div - {String} 属性面板div
     *
     * Returns:
     * {<SuperMap.Plotting.StylePanel>}  结果类型对象。
     */
    initialize : function(div){
        function afterModifySelectFeature(rowIndex, rowData, changes){
            var updated = $('#pg').propertygrid('getChanges', "updated");
            if(updated.length !== 0){
                me.updateSelectFeature(updated[0], me.selectFeatures);
                var SF = me.selectFeatures;
                if(me.selectFeatures ===null){
                    return;
                }

                for(var i=0;i<me.selectFeatures.length;i++){
                    if(me.selectFeatures[i].layer.renderer.CLASS_NAME === "SuperMap.Renderer.PlotCanvas2"){
                        me.selectFeatures[i].layer.redraw();
                    } else {
                        me.selectFeatures[i].layer.drawFeature(me.selectFeatures[i]);
                    }

                    //if(me.selectFeatures[i] !==null && me.selectFeatures[i].graphicsLayer !== undefined){
                    //    me.selectFeatures[i].graphicsLayer.updateGraphics(me.selectFeatures[i]);
                    //}
                    if(me.selectFeatures[i] !==undefined ){
                        if(me.selectFeatures[i].graphicsLayer !== undefined){
                            me.selectFeatures[i].graphicsLayer.updateGraphics(me.selectFeatures[i]);
                        }

                    }

                }

                var  rows = me.collectionPropertyGridRows(SF);
                $('#pg').propertygrid('loadData', rows);

            }
        }

        var stylePanel = document.getElementById(div);
        var pg = document.createElement("table");
        pg.id = "pg";
        pg.className = "easyui-propertygrid";
        stylePanel.appendChild(pg);

        $('#pg').propertygrid({
            showGroup:true,
            columns: [[
                { field: 'name', title: 'Name', width: 100, resizable: true },
                { field: 'value', title: 'Value', width: 100, resizable: false
                }
            ]],
            onAfterEdit: afterModifySelectFeature
        });

        var me = this;
    },

    /**
     * APIMethod: addEditLayer
     * 添加标绘图层
     *
     * Parameters:
     * editLayer - {<SuperMap.Layer.PlottingLayer>}标绘图层
     *
     * Returns:
     */
    addEditLayer: function(editLayer){
        for(var i = 0 ; i < this.editLayers.length; i++)
        {
            if(editLayer === this.editLayers[i]){
                return;
            }
        }

        if(editLayer instanceof SuperMap.Layer.PlottingGraphics){
            if(editLayer.plottingGraphicsEdit !== null){
                editLayer = editLayer.plottingGraphicsEdit.plottingLayer;
            } else {
                return;
            }
        }

        editLayer.events.register("featureselected", this, this.showFeatureProperty);
        editLayer.events.register("featuremodified", this, this.showFeatureProperty);
        editLayer.events.register("featureunselected", this, this.hideFeatureProperty);
    },

    /**
     * APIMethod: removeEditLayer
     * 移除标绘图层
     *
     * Parameters:
     * editLayer - {<SuperMap.Layer.PlottingLayer>}标绘图层
     *
     * Returns:
     */
    removeEditLayer : function(editLayer)
    {
        for(var i = 0; i < this.editLayers.length; i++)
        {
            if(editLayer === this.editLayers[i])
            {
                this.editLayers[i].events.unregister("featureselected", this, this.showFeatureProperty);
                this.editLayers[i].events.unregister("featuremodified", this, this.showFeatureProperty);
                this.editLayers[i].events.unregister("featureunselected", this, this.hideFeatureProperty);
                this.editLayers.slice(i,1);
                break;
            }
        }
    },

    showFeatureProperty: function(selectFeatueEvt)
    {
        if(selectFeatueEvt.type === "featureselected"){
            this.selectFeatures=this.selectFeatures.concat(selectFeatueEvt.features);
        }
        if(this.selectFeatures.length !==0){
            var rows = this.collectionPropertyGridRows(this.selectFeatures);
            $('#pg').propertygrid('loadData', rows);
        }
        SuperMap.Event.stop(selectFeatueEvt);
    },

    hideFeatureProperty: function(selectFeatueEvt)
    {
        for(var i = 0; i < selectFeatueEvt.features.length; i++){
            var index = SuperMap.Util.indexOf(this.selectFeatures, selectFeatueEvt.features[i]);
            if(index !== -1){
                this.selectFeatures.splice(index, 1);
            }
        }
        if(this.selectFeatures.length !==0){
            var rows = this.collectionPropertyGridRows(this.selectFeatures);
            $('#pg').propertygrid('loadData', rows);
        } else {
            var rows = [];
            $('#pg').propertygrid('loadData', rows);
        }

        SuperMap.Event.stop(selectFeatueEvt);
    },

    collectionPropertyGridRows: function(features)
    {
        var rows=[];
        if(features.length ===0){
            return rows=[];
        }

        var dotSelectFeatures=[];
        var algoSelectFeatures=[];
        var  sameFeatures=[];
        var otherFeatures=[];
        var selectfeatures=null;


        for(var i=0;i<features.length;i++){
            if(features[i].geometry.libID === features[0].geometry.libID &&
                features[i].geometry.code === features[0].geometry.code) {
                sameFeatures.push(features[i]);//是否是同一个标号
            }
        }
        if(sameFeatures.length !== features.length){
            for(var i=0;i<features.length;i++){
                if(features[i].geometry instanceof SuperMap.Geometry.DotSymbol){
                    dotSelectFeatures.push(features[i]);//是否全是不同点标号
                }else if(features[i].geometry instanceof SuperMap.Geometry.AlgoSymbol){
                    algoSelectFeatures.push(features[i]); //是否全是不同线面标号
                }else{
                    otherFeatures.push(features[i]);
                }
            }
        }


        if(sameFeatures.length===features.length){
            selectfeatures=features;
        }else if(dotSelectFeatures.length===features.length){
            selectfeatures=dotSelectFeatures;
        }else if(algoSelectFeatures.length===features.length){
            selectfeatures=algoSelectFeatures;
        }else if(dotSelectFeatures.length >0 && algoSelectFeatures.length>0 && otherFeatures.length===0 ){
            selectfeatures=features;
        }else if(otherFeatures.length>0){
            selectfeatures=features;
        }
        var selectfeature=selectfeatures[0];

        if(selectfeatures.length===sameFeatures.length){
            rows = [
                { "name": "标号几何ID", "value":selectfeature.geometry.symbolType, "group": "标号" },
                { "name": "标号库ID", "value": selectfeature.geometry.libID, "group": "标号" },
                { "name": "标号Code", "value": selectfeature.geometry.code, "group": "标号" },
                { "name": "标号名字", "value": selectfeature.geometry.symbolName, "group": "标号" }
            ];
        }



        var lockedObj  = new Object();
        lockedObj.name = this.displayName[8];
        lockedObj.value = this.checkboxValueToString(selectfeature.geometry.getLocked());
        lockedObj.group =  this.group[10];
        lockedObj.editor = { "type": 'checkbox', "options":{ "on":true, "off":false }};

        rows.push(lockedObj);


        if(selectfeature.geometry.getLocked() !== true){
            var annotationRows = this.getAnnotationRows(selectfeature.geometry);
            var relLineTextRows = this.getRelLineTextRows(selectfeature.geometry.relLineText);
            var symbolRankRows = this.getSymbolRankRows(selectfeature.geometry);
            var surroundLineTypeRows = this.getSurroundLineTypeRows(selectfeature.geometry.symbolType);
            var displayRows = this.getDisplayRows();
            var showRows = this.getShowRows();
            var fillGradinetRows = this.getFillGradientModeRows();
            var arrowTypeStart = this.getArrowTypeRows(selectfeature.geometry);
            var arrowTypeEnd = this.getArrowTypeRows(selectfeature.geometry);
            var radiusTypeRows = this.getRadiusTypeRows(selectfeature.geometry);
            var lineStyleRows = this.getLineStyleRows();
            var routeNodeTypeRows = this.getRouteNodeTypeRows();
            var positionOffsetTypeRows = this.getPositionOffsetTypeRows(); //偏移线类型
            var textBoxTypeRows = this.getTextBoxTypeRows();
            var lineMarkingTypeRows = this.getLineMarkingTypeRows();
            var arrowHeadTypeRows=this.getArrowHeadTypeRows();
            var arrowBodyTypeRows=this.getArrowBodyTypeRows();
            var arrowTailTypeRows=this.getArrowTailTypeRows();
            var lineRelationTypeRows = this.getLineRelationTypeRows();
            var subSymbolsTypeRows =this.subSymbolsTypeRows(selectfeature.geometry);


            //基本0：
            //可见性
            var visibilityObj  = new Object();
            visibilityObj.name =  this.displayName[9];
            visibilityObj.value = this.displayToString(selectfeature.style.display);
            visibilityObj.group = this.group[0];
            visibilityObj.editor = { "type": 'combobox', "options": { "valueField": 'value', "textField": 'text', "data": displayRows }};

            //旋转角度
            var dotSymbolRotateObj  = new Object();
            dotSymbolRotateObj.name = this.displayName[0];
            dotSymbolRotateObj.value = selectfeature.geometry.getRotate();
            dotSymbolRotateObj.group = this.group[0];
            dotSymbolRotateObj.editor = "text";

            //随图缩放
            var dotScaleByMap  = new Object();
            dotScaleByMap.name = this.displayName[1];
            if(selectfeature.geometry.symbolType === SuperMap.Plot.SymbolType.DOTSYMBOL){
                dotScaleByMap.value = this.checkboxValueToString(selectfeature.geometry.getScaleByMap());
            }
            dotScaleByMap.group = this.group[0];
            dotScaleByMap.editor = { "type": 'checkbox', "options":{ "on":true, "off":false }};

            //镜像
            var dotSymbolNegativeImageObj  = new Object();
            dotSymbolNegativeImageObj.name = this.displayName[2];
            if(this.checkType(selectfeature)===true){
                dotSymbolNegativeImageObj.value = this.checkboxValueToString(selectfeature.geometry.getNegativeImage());
            }
            dotSymbolNegativeImageObj.group = this.group[0];
            dotSymbolNegativeImageObj.editor = { "type": 'checkbox', "options":{ "on":true, "off":false }};

            //标号级别
            var dotSymbolRankObj  = new Object();
            dotSymbolRankObj.name = this.displayName[3];
            if(this.checkType(selectfeature)===true){
                dotSymbolRankObj.value = this.symbolRankToString(selectfeature.geometry.getSymbolRank());
            }
            dotSymbolRankObj.group = this.group[0];
            dotSymbolRankObj.editor = { "type": 'combobox', "options": { "valueField": 'value', "textField": 'text', "data": symbolRankRows }};


            //位置点偏移
            var dotPositionOffset  = new Object();
            dotPositionOffset.name = this.displayName[6];
            if(selectfeature.geometry.symbolType === SuperMap.Plot.SymbolType.DOTSYMBOL){
                dotPositionOffset.value = this.checkboxValueToString(selectfeature.geometry.getPositionOffset());
            }
            dotPositionOffset.group = this.group[0];
            dotPositionOffset.editor = { "type": 'checkbox', "options":{ "on":true, "off":false }};

            //偏移线类型
            var dotPositionOffsetType  = new Object();
            dotPositionOffsetType.name = this.displayName[7];
            dotPositionOffsetType.value = this.positionOffsetTypeToString(selectfeature.geometry.positionOffsetType);
            dotPositionOffsetType.group = this.group[0];
            dotPositionOffsetType.editor = { "type": 'combobox', "options": { "valueField": 'value', "textField": 'text', "data": positionOffsetTypeRows }};


            //线形2：
            //线宽
            var lineWidthObj  = new Object();
            lineWidthObj.name = this.displayLineStyleName[0];
            if(selectfeature.geometry instanceof SuperMap.Geometry.GroupObject){
                lineWidthObj.value = selectfeature.geometry.getStrokeWidth();
            }
            else{
                lineWidthObj.value = selectfeature.style.strokeWidth;
            }
            lineWidthObj.group = this.group[2];
            lineWidthObj.editor = "text";


            //线色
            var lineColorObj  = new Object();
            lineColorObj.name = this.displayLineStyleName[1];
            if(selectfeature.geometry instanceof SuperMap.Geometry.GroupObject){
                lineColorObj.value = selectfeature.geometry.getStrokeColor();
            }
            else{
                lineColorObj.value = selectfeature.style.strokeColor;
            }
            lineColorObj.group = this.group[2];
            lineColorObj.editor = "colorpicker";


            //线透明度
            var lineOpaqueRateObj  = new Object();
            lineOpaqueRateObj.name = this.displayLineStyleName[2];
            lineOpaqueRateObj.value = selectfeature.style.strokeOpacity;
            lineOpaqueRateObj.group = this.group[2];
            lineOpaqueRateObj.editor = "text";


            //线型
            var lineStyleObj  = new Object();
            lineStyleObj.name = this.displayLineStyleName[3];
            lineStyleObj.value = selectfeature.style.strokeDashstyle;
            lineStyleObj.group = this.group[2];
            lineStyleObj.editor = { "type": 'combobox', "options": { "valueField": 'value', "textField": 'text', "data": lineStyleRows }};





            //填充3：
            //填充
            var fillObj  = new Object();
            fillObj.name = this.displayFillStyleName[0];
            fillObj.value = this.checkboxValueToString(selectfeature.style.fill);
            fillObj.group = this.group[3];
            fillObj.editor = { "type": 'checkbox', "options":{ "on":true, "off":false }};

            //填充色
            var fillforeColorObj  = new Object();
            fillforeColorObj.name = this.displayFillStyleName[1];
            fillforeColorObj.value = selectfeature.style.fillColor;
            fillforeColorObj.group = this.group[3];
            fillforeColorObj.editor = "colorpicker";

            //填充透明度
            var fillOpaqueRateObj  = new Object();
            fillOpaqueRateObj.name = this.displayFillStyleName[2];
            fillOpaqueRateObj.value = selectfeature.style.fillOpacity;
            fillOpaqueRateObj.group = this.group[3];
            fillOpaqueRateObj.editor = "text";

            //渐变填充
            var fillGradientModeObj  = new Object();
            fillGradientModeObj.name = this.displayFillStyleName[3];
            fillGradientModeObj.value = this.fillGradientModeToString(selectfeature.style.fillGradientMode);
            fillGradientModeObj.group = this.group[3];
            fillGradientModeObj.editor = { "type": 'combobox', "options": { "valueField": 'value', "textField": 'text', "data": fillGradinetRows }};

            var fillBackColorObj  = new Object();
            fillBackColorObj.name = this.displayFillStyleName[4];
            fillBackColorObj.value = selectfeature.style.fillBackColor;
            fillBackColorObj.group = this.group[3];
            fillBackColorObj.editor = "colorpicker";

            var fillBackOpacityObj  = new Object();
            fillBackOpacityObj.name = this.displayFillStyleName[5];
            fillBackOpacityObj.value = selectfeature.style.fillBackOpacity;
            fillBackOpacityObj.group =this.group[3];
            fillBackOpacityObj.editor = "text";


            //注记4：
            //注记
            var textContentObj  = new Object();
            textContentObj.name = this.displayTextContentName[0];
            if(selectfeature.geometry.symbolType === SuperMap.Plot.SymbolType.SYMBOLTEXT){
                textContentObj.value = selectfeature.geometry.symbolTexts[0].textContent;
            } else{
                textContentObj.value = selectfeature.geometry.getTextContent();
            }
            textContentObj.group = this.group[4];
            textContentObj.editor = "text";


            //注记位置
            var markPosObj  = new Object();
            markPosObj.name = this.displayTextContentName[1];
            if(selectfeature.geometry.symbolType === SuperMap.Plot.SymbolType.PATHTEXT){
                markPosObj.value = this.relLineTextToString(selectfeature.geometry.relLineText);
                markPosObj.group = this.group[4];
                markPosObj.editor = { "type": 'combobox', "options": { "valueField": 'value', "textField": 'text', "data": relLineTextRows }};
            } else if(this.checkType(selectfeature)===true ){
                markPosObj.value = this.annotationToString(selectfeature.geometry.getTextPosition());
                markPosObj.group = this.group[4];
                markPosObj.editor = { "type": 'combobox', "options": { "valueField": 'value', "textField": 'text', "data": annotationRows }};
            }


            //注记字体大小
            var fontSizeObj  = new Object();
            fontSizeObj.name = this.displayTextContentName[2];
            fontSizeObj.value = selectfeature.style.fontSize;
            fontSizeObj.group = this.group[4];
            fontSizeObj.editor = "text";

            //注记字体颜色
            var fontColorObj  = new Object();
            fontColorObj.name = this.displayTextContentName[3];
            fontColorObj.value = selectfeature.style.fontColor;
            fontColorObj.group = this.group[4];
            fontColorObj.editor = "colorpicker";

            //注记字体名称
            var fontFamilyObj  = new Object();
            fontFamilyObj.name = this.displayTextContentName[4];
            fontFamilyObj.value = selectfeature.style.fontFamily;
            fontFamilyObj.group = this.group[4];
            fontFamilyObj.editor = "text";

            //注记与标号的间距
            var fontSpaceObj  = new Object();
            fontSpaceObj.name = this.displayTextContentName[5];
            fontSpaceObj.value =  selectfeature.geometry.space;
            fontSpaceObj.group = this.group[4];
            fontSpaceObj.editor = "text";

            //标注框边框
            var textBoxTypeObj  = new Object();
            textBoxTypeObj.name = this.displayNameNew[11];
            textBoxTypeObj.group = this.group[4];
            if(selectfeature.geometry.symbolType === SuperMap.Plot.SymbolType.SYMBOLTEXTBOX){
                textBoxTypeObj.value = this.textBoxTypeToString(selectfeature.geometry.textBoxType);
                textBoxTypeObj.editor = { "type": 'combobox', "options": { "valueField": 'value', "textField": 'text', "data": textBoxTypeRows }};
            }
            else if(selectfeature.geometry.symbolType === SuperMap.Plot.SymbolType.LINEMARKING){
                textBoxTypeObj.value = this.lineMarkingTypeToString(selectfeature.geometry.textBoxType);
                textBoxTypeObj.editor = { "type": 'combobox', "options": { "valueField": 'value', "textField": 'text', "data": lineMarkingTypeRows }};
            }

            //圆角边框
            var roundBoxObj  = new Object();
            roundBoxObj.name = this.displayNameNew[12];
            roundBoxObj.group = this.group[4];
            if(selectfeature.geometry.symbolType === SuperMap.Plot.SymbolType.SYMBOLTEXTBOX){
                roundBoxObj.value = this.checkboxValueToString(selectfeature.geometry.getRoundBox());
                roundBoxObj.editor = { "type": 'checkbox', "options":{ "on":true, "off":false }};
            }

            //对象标注框
            var symbolTextFrameObj  = new Object();
            symbolTextFrameObj.name = this.displayNameNew[14];
            symbolTextFrameObj.value = this.checkboxValueToString(selectfeature.geometry.addFrame);
            symbolTextFrameObj.group = this.group[4];
            symbolTextFrameObj.editor = { "type": 'checkbox', "options":{ "on":true, "off":false }};



            //衬线6：
            //衬线
            var surroundLineTypeObj  = new Object();
            surroundLineTypeObj.name = this.displaySurroundLineName[0];
            if(this.checkType(selectfeature)===true){
                surroundLineTypeObj.value = this.surroundLineTypeToString(selectfeature.geometry.symbolType, selectfeature.geometry.getSurroundLineType());
            }
            surroundLineTypeObj.group = this.group[6];
            surroundLineTypeObj.editor = { "type": 'combobox', "options": { "valueField": 'value', "textField": 'text', "data": surroundLineTypeRows }};


            //衬线宽
            var surroundLineWidthObj  = new Object();
            surroundLineWidthObj.name = this.displaySurroundLineName[1];
            surroundLineWidthObj.value = selectfeature.style.surroundLineWidth;
            surroundLineWidthObj.group = this.group[6];
            surroundLineWidthObj.editor = "text";


            //衬线色
            var surroundLineColorObj  = new Object();
            surroundLineColorObj.name =this.displaySurroundLineName[2];
            surroundLineColorObj.value = selectfeature.style.surroundLineColor;
            surroundLineColorObj.group = this.group[6];
            surroundLineColorObj.editor = "colorpicker";


            //衬线透明度
            var surroundLineColorOpaObj  = new Object();
            surroundLineColorOpaObj.name = this.displaySurroundLineName[3];
            surroundLineColorOpaObj.value = selectfeature.style.surroundLineColorOpacity;
            surroundLineColorOpaObj.group = this.group[6];
            surroundLineColorOpaObj.editor = "text";


            //文字9：
            //字体描边
            var fontStrokeObj  = new Object();
            fontStrokeObj.name = this.fontName[0];
            fontStrokeObj.value = this.checkboxValueToString(selectfeature.style.fontStroke);
            fontStrokeObj.group = this.group[9];
            fontStrokeObj.editor = { "type": 'checkbox', "options":{ "on":true, "off":false }};

            var fontStrokeColorObj  = new Object();
            fontStrokeColorObj.name = this.fontName[1];
            fontStrokeColorObj.value = selectfeature.style.fontStrokeColor;
            fontStrokeColorObj.group = this.group[9];
            fontStrokeColorObj.editor = "colorpicker";

            var fontStrokeWidthObj  = new Object();
            fontStrokeWidthObj.name = this.fontName[2];
            fontStrokeWidthObj.value = selectfeature.style.fontStrokeWidth;
            fontStrokeWidthObj.group = this.group[9];
            fontStrokeWidthObj.editor = "text";

            var fontBackObj  = new Object();
            fontBackObj.name = this.fontName[3];
            fontBackObj.value = this.checkboxValueToString(selectfeature.style.fontBackground);
            fontBackObj.group = this.group[9];
            fontBackObj.editor = { "type": 'checkbox', "options":{ "on":true, "off":false }};


            var fontBackColorObj  = new Object();
            fontBackColorObj.name = this.fontName[4];
            fontBackColorObj.value = selectfeature.style.fontBackgroundColor;
            fontBackColorObj.group = this.group[9];
            fontBackColorObj.editor = "colorpicker";


            var fontShadowObj  = new Object();
            fontShadowObj.name = this.fontName[5];
            fontShadowObj.value = this.checkboxValueToString(selectfeature.style.fontShadow);
            fontShadowObj.group = this.group[9];
            fontShadowObj.editor = { "type": 'checkbox', "options":{ "on":true, "off":false }};


            var fontShadowColorObj  = new Object();
            fontShadowColorObj.name = this.fontName[6];
            fontShadowColorObj.value = selectfeature.style.fontShadowColor;
            fontShadowColorObj.group = this.group[9];
            fontShadowColorObj.editor = "colorpicker";


            var fontShadowOffsetXObj  = new Object();
            fontShadowOffsetXObj.name = this.fontName[7];
            fontShadowOffsetXObj.value = selectfeature.style.fontShadowOffsetX;
            fontShadowOffsetXObj.group = this.group[9];
            fontShadowOffsetXObj.editor = "text";


            var fontShadowOffsetYObj  = new Object();
            fontShadowOffsetYObj.name = this.fontName[8];
            fontShadowOffsetYObj.value = selectfeature.style.fontShadowOffsetY;
            fontShadowOffsetYObj.group = this.group[9];
            fontShadowOffsetYObj.editor = "text";

            var fontSpaceObj1  = new Object();
            fontSpaceObj1.name = this.fontName[9];
            fontSpaceObj1.value = selectfeature.style.fontSpace;
            fontSpaceObj1.group = this.group[9];
            fontSpaceObj1.editor = "text";

            var fontPercentObj  = new Object();
            fontPercentObj.name = this.fontName[10];
            fontPercentObj.value = selectfeature.style.fontPercent;
            fontPercentObj.group = this.group[9];
            fontPercentObj.editor = "text";




            //if(this.checkType(selectfeature)===true){
            //    rows.push(visibilityObj);
            //}

            if(!(selectfeature.geometry instanceof SuperMap.Geometry.GeoRouteNode || selectfeature.geometry instanceof SuperMap.Geometry.GeoLiterateSign)){

                    rows.push(visibilityObj);
            }



            if(selectfeature.geometry.symbolType !== SuperMap.Plot.SymbolType.TEXTSYMBOL &&
                selectfeature.geometry.symbolType !== SuperMap.Plot.SymbolType.SYMBOLTEXT){
                rows.push(lineWidthObj);
                rows.push(lineColorObj);
                if(selectfeature.geometry.symbolType !== SuperMap.Plot.SymbolType.GROUPOBJECT &&
                    selectfeature.geometry.symbolType !== SuperMap.Plot.SymbolType.AIRROUTE &&
                    selectfeature.geometry.symbolType !== SuperMap.Plot.SymbolType.NAVYROUTE &&
                    selectfeature.geometry.symbolType !== SuperMap.Plot.SymbolType.MISSILEROUTE &&
                    selectfeature.geometry.symbolType !== SuperMap.Plot.SymbolType.NAVYDEPLOYMENT &&
                    selectfeature.geometry.symbolType !== SuperMap.Plot.SymbolType.AIRDEPLOYMENT){
                    rows.push(lineStyleObj);
                    rows.push(lineOpaqueRateObj);
                }
            }

            if(this.checkType(selectfeature)===true && selectfeature.geometry.symbolType !== SuperMap.Plot.SymbolType.TEXTSYMBOL){

                rows.push(fillObj);
                rows.push(fillGradientModeObj);
                if(selectfeature.style.fillGradientMode !== "NONE"){
                    rows.push(fillforeColorObj);
                    rows.push(fillOpaqueRateObj);
                    rows.push(fillBackColorObj);
                    rows.push(fillBackOpacityObj);
                }else if(selectfeature.style.fillGradientMode === "NONE" && selectfeature.style.fill){
                    rows.push(fillforeColorObj);
                    rows.push(fillOpaqueRateObj);
                }
            }
            if(this.checkType(selectfeature)===true && selectfeature.geometry.symbolType !== SuperMap.Plot.SymbolType.TEXTSYMBOL){
                rows.push(surroundLineTypeObj);
                rows.push(surroundLineColorObj);
                rows.push(surroundLineColorOpaObj);
                rows.push(surroundLineWidthObj);
            }


            if(selectfeatures.length===sameFeatures.length || selectfeatures.length===dotSelectFeatures.length ||selectfeatures.length===algoSelectFeatures.length) {


                if (selectfeature.geometry.symbolType === SuperMap.Plot.SymbolType.SYMBOLTEXTBOX ||
                    selectfeature.geometry.symbolType === SuperMap.Plot.SymbolType.LINEMARKING
                ) {
                    rows.push(textBoxTypeObj);
                    rows.push(roundBoxObj);
                }

                if (selectfeature.geometry.symbolType === SuperMap.Plot.SymbolType.DOTSYMBOL ||
                    selectfeature.geometry.symbolType === SuperMap.Plot.SymbolType.TEXTSYMBOL ||
                    selectfeature.geometry.symbolType === SuperMap.Plot.SymbolType.ANNOFRAMESYMBOL ||
                    selectfeature.geometry.symbolType === SuperMap.Plot.SymbolType.ANNOFRAMESYMBOLM ||
                    selectfeature.geometry.symbolType === SuperMap.Plot.SymbolType.PATHTEXT ||
                    selectfeature.geometry.symbolType === SuperMap.Plot.SymbolType.SYMBOLTEXTBOX ||
                    selectfeature.geometry.symbolType === SuperMap.Plot.SymbolType.POLYGONREGION ||
                    selectfeature.geometry.symbolType === SuperMap.Plot.SymbolType.ARCREGION ||
                    selectfeature.geometry.symbolType === SuperMap.Plot.SymbolType.SATELLITE ||
                    selectfeature.geometry.symbolType === SuperMap.Plot.SymbolType.SYMBOLTEXT ||
                    selectfeature.geometry.symbolType === SuperMap.Plot.SymbolType.SYMBOLTEXT1 ||
                    selectfeature.geometry.symbolType === SuperMap.Plot.SymbolType.LINEMARKING) {

                    rows.push(textContentObj);
                    rows.push(fontSizeObj);
                    rows.push(fontColorObj);
                    rows.push(fontPercentObj);
                    rows.push(fontFamilyObj);


                    if (selectfeature.geometry.symbolType !== SuperMap.Plot.SymbolType.PATHTEXT) {
                        rows.push(fontSpaceObj1);
                        rows.push(fontStrokeObj);
                        if (selectfeature.style.fontStroke === true) {
                            rows.push(fontStrokeColorObj);
                            rows.push(fontStrokeWidthObj);
                        }
                        rows.push(fontBackObj);
                        rows.push(fontBackColorObj);
                        rows.push(fontShadowObj);
                        if (selectfeature.style.fontShadow === true) {
                            rows.push(fontShadowColorObj);
                            rows.push(fontShadowOffsetXObj);
                            rows.push(fontShadowOffsetYObj);
                        }
                    }
                }



                if (selectfeature.geometry.symbolType === SuperMap.Plot.SymbolType.DOTSYMBOL) {

                    //军标大小1：
                    var dotSymbolWidthObj = new Object();
                    dotSymbolWidthObj.name = this.displayName[4];
                    dotSymbolWidthObj.value = selectfeature.geometry.getSymbolSize().w;
                    dotSymbolWidthObj.group = this.group[1];
                    dotSymbolWidthObj.editor = "text";

                    var dotSymbolHeightObj = new Object();
                    dotSymbolHeightObj.name = this.displayName[5];
                    dotSymbolHeightObj.value = selectfeature.geometry.getSymbolSize().h;
                    dotSymbolHeightObj.group = this.group[1];
                    dotSymbolHeightObj.editor = "text";

                    rows.push(dotSymbolRotateObj);
                    rows.push(dotSymbolNegativeImageObj);
                    rows.push(dotSymbolRankObj);
                    rows.push(dotSymbolWidthObj);
                    rows.push(dotSymbolHeightObj);
                    rows.push(markPosObj);


                    if (selectfeature.geometry.textPosition !== 8) {
                        rows.push(fontSpaceObj);
                    }
                    rows.push(dotScaleByMap);
                    rows.push(dotPositionOffset);
                    rows.push(dotPositionOffsetType);

                } else if (this.checkType(selectfeature) === true) {
                    for (var i = 0; i < selectfeature.geometry.getSubSymbols().length; i++) {
                        var objectSubCode = new Object();
                        objectSubCode.name = "Code";
                        objectSubCode.value = selectfeature.geometry.getSubSymbols()[i].code;
                        objectSubCode.group = this.group[5];
                        objectSubCode.editor = { "type": 'combobox', "options": { "valueField": 'value', "textField": 'text', "data": subSymbolsTypeRows }};
                        objectSubCode.index = i;
                        rows.push(objectSubCode);
                    }
                    if((0 === selectfeature.geometry.getSubSymbols().length && selectfeature.geometry.libID === 0 && selectfeature.geometry.code === 1025)||
                        (0 === selectfeature.geometry.getSubSymbols().length && selectfeature.geometry.libID === 100 && selectfeature.geometry.code === 25200)||
                        (0 === selectfeature.geometry.getSubSymbols().length && selectfeature.geometry.libID === 100 && selectfeature.geometry.code === 3020901)
                    ){
                            var objectSubCode1 = new Object();
                            objectSubCode1.name = "Code";
                            objectSubCode1.value = this.subSymbolsTypeString(selectfeature.geometry.getSubSymbols().length,selectfeature.geometry);
                            objectSubCode1.group = this.group[5];
                            objectSubCode1.editor = { "type": 'combobox', "options": { "valueField": 'value', "textField": 'text', "data": subSymbolsTypeRows }};
                            objectSubCode1.index = i;
                            rows.push(objectSubCode1);
                    }
                    if(selectfeature.geometry.code === 1025 && selectfeature.geometry.getSubSymbols().length > 0){
                        var objectLibID = new Object();
                        objectLibID.name = "LibID";
                        // if(selectfeature.geometry.getSubSymbols().length > 0){
                            // objectLibID.value = selectfeature.geometry.getSubSymbols()[0].libID;
                            objectLibID.value = this.libIDToString(selectfeature.geometry.getSubSymbols()[0].libID);
                        // }
                        // else{
                        //     objectLibID.value = null;
                        // }

                        objectLibID.group = this.group[5];
                        objectLibID.editor = "text";
                        // objectLibID.editor = { "type": 'combobox', "options": { "valueField": 'value', "textField": 'text', "data": libIDRows }};
                        rows.push(objectLibID);
                    }

                }

                //复合箭头
                if (selectfeature.geometry.libID === 22 && selectfeature.geometry.code === 1016) {

                    var arrowHeadTypeObj = new Object();
                    arrowHeadTypeObj.name = "箭头";
                    arrowHeadTypeObj.value = this.arrowHeadTypeToString(selectfeature.geometry.arrowHeadType);
                    arrowHeadTypeObj.group = "组合类型";
                    arrowHeadTypeObj.editor = {
                        "type": 'combobox',
                        "options": {"valueField": 'value', "textField": 'text', "data": arrowHeadTypeRows}
                    };

                    var arrowBodyTypeObj = new Object();
                    arrowBodyTypeObj.name = "箭身";
                    arrowBodyTypeObj.value = this.arrowBodyTypeToString(selectfeature.geometry.arrowBodyType);
                    arrowBodyTypeObj.group = "组合类型";
                    arrowBodyTypeObj.editor = {
                        "type": 'combobox',
                        "options": {"valueField": 'value', "textField": 'text', "data": arrowBodyTypeRows}
                    };

                    var arrowTailTypepeObj = new Object();
                    arrowTailTypepeObj.name = "箭尾";
                    arrowTailTypepeObj.value = this.arrowTailTypeToString(selectfeature.geometry.arrowTailType);
                    arrowTailTypepeObj.group = "组合类型";
                    arrowTailTypepeObj.editor = {
                        "type": 'combobox',
                        "options": {"valueField": 'value', "textField": 'text', "data": arrowTailTypeRows}
                    };

                    rows.push(arrowHeadTypeObj);
                    rows.push(arrowBodyTypeObj);
                    rows.push(arrowTailTypepeObj);

                }


                //箭头线
                if (selectfeature.geometry.symbolType === SuperMap.Plot.SymbolType.ARROWLINE) {
                    var arrowTypeStartObj = new Object();
                    arrowTypeStartObj.name = this.displayNameNew[0];
                    arrowTypeStartObj.value = this.arrowTypeToString(selectfeature.geometry.arrowTypeStart);
                    arrowTypeStartObj.group = this.group[7];
                    arrowTypeStartObj.editor = {
                        "type": 'combobox',
                        "options": {"valueField": 'value', "textField": 'text', "data": arrowTypeStart}
                    };

                    var arrowTypeEndObj = new Object();
                    arrowTypeEndObj.name = this.displayNameNew[1];
                    arrowTypeEndObj.value = this.arrowTypeToString(selectfeature.geometry.arrowTypeEnd);
                    arrowTypeEndObj.group = this.group[7];
                    arrowTypeEndObj.editor = {
                        "type": 'combobox',
                        "options": {"valueField": 'value', "textField": 'text', "data": arrowTypeEnd}
                    };

                    rows.push(arrowTypeStartObj);
                    rows.push(arrowTypeEndObj);
                }

                //沿线注记
                if (selectfeature.geometry.symbolType === SuperMap.Plot.SymbolType.PATHTEXT) {
                    var isAvoidObj = new Object();
                    isAvoidObj.name = this.displayNameNew[2];
                    isAvoidObj.value = this.checkboxValueToString(selectfeature.geometry.isAvoid);
                    isAvoidObj.group = this.group[4];
                    isAvoidObj.editor = {"type": 'checkbox', "options": {"on": true, "off": false}};

                    var showPathLineObj = new Object();
                    showPathLineObj.name = this.displayNameNew[3];
                    showPathLineObj.value = this.showToString(selectfeature.geometry.showPathLine);
                    showPathLineObj.group = this.group[4];
                    showPathLineObj.editor = {
                        "type": 'combobox',
                        "options": {"valueField": 'value', "textField": 'text', "data": showRows}
                    };


                    var showPathLineArrowObj = new Object();
                    showPathLineArrowObj.name = this.displayNameNew[13];
                    showPathLineArrowObj.value = this.showToString(selectfeature.geometry.showPathLineArrow);
                    showPathLineArrowObj.group = this.group[4];
                    showPathLineArrowObj.editor = {
                        "type": 'combobox',
                        "options": {"valueField": 'value', "textField": 'text', "data": showRows}
                    };

                    var isCurveObj = new Object();
                    isCurveObj.name = this.displayNameNew[4];
                    isCurveObj.value = this.checkboxValueToString(selectfeature.geometry.isCurve);
                    isCurveObj.group = this.group[4];
                    isCurveObj.editor = {"type": 'checkbox', "options": {"on": true, "off": false}};


                    var textToLineDistanceObj = new Object();
                    textToLineDistanceObj.name = this.displayTextContentName[5];
                    textToLineDistanceObj.value = selectfeature.geometry.textToLineDistance;
                    textToLineDistanceObj.group = this.group[4];
                    textToLineDistanceObj.editor = "text";

                    rows.push(textToLineDistanceObj);
                    rows.push(markPosObj);
                    rows.push(showPathLineObj);
                    rows.push(showPathLineArrowObj);
                    rows.push(isCurveObj);

                    if (selectfeature.geometry.relLineText === SuperMap.Plot.RelLineText.ONLINE)
                        rows.push(isAvoidObj);
                }

                //对象标注框
                if (selectfeature.geometry.symbolType === SuperMap.Plot.SymbolType.SYMBOLTEXT) {
                    rows.push(symbolTextFrameObj);
                    if (selectfeature.geometry.addFrame === true) {
                        //线设置
                        rows.push(lineWidthObj);
                        rows.push(lineColorObj);
                        rows.push(lineStyleObj);
                        rows.push(lineOpaqueRateObj);

                        //填充设置
                        rows.push(fillObj);
                        rows.push(fillforeColorObj);
                        rows.push(fillOpaqueRateObj);
                        rows.push(fillGradientModeObj);
                        rows.push(fillBackColorObj);
                        rows.push(fillBackOpacityObj);

                    }

                }


                //扇形区域
                if (selectfeature.geometry.symbolType === SuperMap.Plot.SymbolType.ARCREGION) {

                    if (selectfeature.geometry.radiusLineType != null) {
                        var radiusLineTypeObj = new Object();
                        radiusLineTypeObj.name = this.displayNameNew[5];
                        radiusLineTypeObj.value = this.radiusTypeToString(selectfeature.geometry.radiusLineType);
                        radiusLineTypeObj.group = this.group[8];
                        radiusLineTypeObj.editor = {
                            "type": 'combobox',
                            "options": {"valueField": 'value', "textField": 'text', "data": radiusTypeRows}
                        };

                        rows.push(radiusLineTypeObj);
                    }


                    if (selectfeature.geometry.radiusText != null && selectfeature.geometry.radiusLineType != 0) {
                        var upTextObj = new Object();
                        upTextObj.name = this.displayNameNew[6];
                        upTextObj.value = selectfeature.geometry.radiusText[0];
                        upTextObj.group = this.group[8];
                        upTextObj.editor = "text";

                        var downTextObj = new Object();
                        downTextObj.name = this.displayNameNew[7];
                        downTextObj.value = selectfeature.geometry.radiusText[1];
                        downTextObj.group = this.group[8];
                        downTextObj.editor = "text";

                        var radiusPosAngleObj = new Object();
                        radiusPosAngleObj.name = this.displayNameNew[15];
                        radiusPosAngleObj.value = selectfeature.geometry.radiusPosAngle;
                        radiusPosAngleObj.group = this.group[8];
                        radiusPosAngleObj.editor = "text";


                        rows.push(upTextObj);
                        rows.push(downTextObj);
                        rows.push(radiusPosAngleObj);
                    }

                }

                //卫星
                if (selectfeature.geometry.symbolType === SuperMap.Plot.SymbolType.SATELLITE) {
                    var visibleObj = new Object();
                    visibleObj.name = this.displayNameNew[8];
                    visibleObj.value = this.showToString(selectfeature.geometry.visible);
                    visibleObj.group = this.group[0];
                    visibleObj.editor = {
                        "type": 'combobox',
                        "options": {"valueField": 'value', "textField": 'text', "data": showRows}
                    };

                    rows.push(visibleObj);
                }

                //航线
                if (selectfeature.geometry instanceof SuperMap.Geometry.GeoRouteNode) {
                    var routeNodeTypeObj = new Object();
                    routeNodeTypeObj.name = this.displayNameNew[9];
                    routeNodeTypeObj.value = this.routeNodeTypeToString(selectfeature.geometry.routeNode.type);
                    routeNodeTypeObj.group = this.group[2];
                    routeNodeTypeObj.editor = {
                        "type": 'combobox',
                        "options": {"valueField": 'value', "textField": 'text', "data": routeNodeTypeRows}
                    };

                    var routeNodeRotate = new Object();
                    routeNodeRotate.name = this.displayNameNew[10];
                    routeNodeRotate.value = selectfeature.geometry.routeNode.rotate;
                    routeNodeRotate.group = this.group[2];
                    routeNodeRotate.editor = "text";


                    rows.push(routeNodeTypeObj);
                    if (selectfeature.geometry.routeNode.type === SuperMap.Plot.RouteNodeType.STANDBY) {
                        rows.push(routeNodeRotate);
                    }
                }


                //对象间连线
                if (selectfeature.geometry instanceof SuperMap.Geometry.LineRelation) {
                    var lineRelationTypeObj = new Object();
                    lineRelationTypeObj.name = this.displayNameNew[16];
                    lineRelationTypeObj.value = this.lineRelationTypeToString(selectfeature.geometry.lineRelationType);
                    lineRelationTypeObj.group = this.group[11];
                    lineRelationTypeObj.editor = {
                        "type": 'combobox',
                        "options": {"valueField": 'value', "textField": 'text', "data": lineRelationTypeRows}
                    };

                    rows.push(lineRelationTypeObj);
                }

            }
            this.addExtendProperty(rows,selectfeature.geometry);
        }
        return rows;
    },


    addExtendProperty: function(rows,geometry)
    {

        var extendProperty = geometry.getExtendProperty();
        var nIndex = 0;
        var property = extendProperty.getPropertyByIndex(nIndex);

        while(null != property)
        {
            var propertyName  = property.getKey();
            var propertyValue = property.getValue();

            var extendePropertyObj  = new Object();
            extendePropertyObj.name = propertyName;
            extendePropertyObj.value = propertyValue;
            extendePropertyObj.group = "自定义属性";
            extendePropertyObj.editor = "text";
            rows.push(extendePropertyObj);

            nIndex++;
            property = extendProperty.getPropertyByIndex(nIndex);
        }

    },

    //判断类型是否为新增对象
    checkType:function(selectfeature){
        if(selectfeature.geometry.symbolType === SuperMap.Plot.SymbolType.GROUPOBJECT ||
            selectfeature.geometry.symbolType === SuperMap.Plot.SymbolType.AIRROUTE ||
            selectfeature.geometry.symbolType === SuperMap.Plot.SymbolType.NAVYROUTE ||
            selectfeature.geometry.symbolType === SuperMap.Plot.SymbolType.MISSILEROUTE ||
            selectfeature.geometry.symbolType === SuperMap.Plot.SymbolType.NAVYDEPLOYMENT ||
            selectfeature.geometry.symbolType === SuperMap.Plot.SymbolType.AIRDEPLOYMENT ||
            selectfeature.geometry.symbolType === SuperMap.Plot.SymbolType.SYMBOLTEXT ||
            selectfeature.geometry.symbolType === SuperMap.Plot.SymbolType.SYMBOLTEXT1 ||
            selectfeature.geometry.symbolType === SuperMap.Plot.SymbolType.FLAGGROUP ||
            selectfeature.geometry.symbolType === SuperMap.Plot.SymbolType.SATELLITE
        )
            return false;//新增对象
        else
            return true;//原有标号

    },


    updateSelectFeature: function(updated, selectfeatures)
    {
        for(var i=0;i<selectfeatures.length;i++){
        if (updated != null) {
            switch(updated.name) {
                case this.displayName[0]:
                    selectfeatures[i].geometry.setRotate(parseFloat(updated.value));
                    break;
                case this.displayName[1]:
                    selectfeatures[i].geometry.setScaleByMap(this.fromCheckboxValue(updated.value));
                    break;
                case this.displayName[2]:
                    selectfeatures[i].geometry.setNegativeImage(this.fromCheckboxValue(updated.value));
                    break;
                case this.displayName[3]:
                    selectfeatures[i].geometry.setSymbolRank(updated.value);
                    break;
                case this.displayName[4]:
                    selectfeatures[i].geometry.setSymbolSize(updated.value, selectfeatures[i].geometry.getSymbolSize().h);
                    break;
                case this.displayName[5]:
                    selectfeatures[i].geometry.setSymbolSize(selectfeatures[i].geometry.getSymbolSize().w, updated.value);
                    break;
                case this.displayName[6]:
                    selectfeatures[i].geometry.setPositionOffset(this.fromCheckboxValue(updated.value));
                    break;
                case this.displayName[7]:
                    //selectfeature.geometry.positionOffsetType = parseInt(updated.value);
                    //selectfeature.geometry.calculateParts();
                    selectfeatures[i].geometry.setPositionOffsetType(parseInt(updated.value));
                    break;
                case this.displayName[8]:
                    selectfeatures[i].geometry.setLocked(this.fromCheckboxValue(updated.value));
                    break;
                case  this.displayName[9]:
                    selectfeatures[i].style.display = updated.value;
                    break;
                case this.displayTextContentName[0]:
                    if (selectfeatures[i].geometry.symbolType === SuperMap.Plot.SymbolType.SYMBOLTEXT) {
                        selectfeatures[i].geometry.symbolTexts[0].textContent = updated.value;
                        selectfeatures[i].geometry.calculateParts();
                    } else if(selectfeatures[i].geometry.symbolType === SuperMap.Plot.SymbolType.SYMBOLTEXT1 ||
                        selectfeatures[i].geometry.symbolType ===SuperMap.Plot.SymbolType.PATHTEXT) {
                        var updatedValueStr=updated.value;
                        var textContent=updatedValueStr.split(",");
                        selectfeatures[i].geometry.setTextContent(textContent);
                    }else{
                        selectfeatures[i].geometry.setTextContent(updated.value);
                    }
                    break;
                case this.displayTextContentName[1]:
                    if (selectfeatures[i].geometry.symbolType === SuperMap.Plot.SymbolType.PATHTEXT) {
                        //selectfeature.geometry.relLineText = parseInt(updated.value);
                        //selectfeature.geometry.calculateParts();
                        selectfeatures[i].geometry.setRelLineText(parseInt(updated.value));
                    } else {
                        selectfeatures[i].geometry.setTextPosition(parseInt(updated.value));
                    }
                    break;
                case this.displayTextContentName[2]:
                    selectfeatures[i].style.fontSize = parseFloat(updated.value);
                    if(selectfeatures[i].geometry.symbolType === SuperMap.Plot.SymbolType.SYMBOLTEXT){
                        selectfeatures[i].geometry.applyStyle("fontSize");
                    } else {
                        selectfeatures[i].geometry.calculateParts();
                    }
                    break;
                case this.displayTextContentName[3]:
                    selectfeatures[i].style.fontColor = updated.value;
                    if(selectfeatures[i].geometry.symbolType === SuperMap.Plot.SymbolType.SYMBOLTEXT){
                        selectfeatures[i].geometry.applyStyle("fontColor");
                    }
                    //selectfeature.geometry.calculateParts();
                    break;
                case this.displayTextContentName[4]:
                    selectfeatures[i].style.fontFamily = updated.value;
                    if(selectfeatures[i].geometry.symbolType === SuperMap.Plot.SymbolType.SYMBOLTEXT){
                        selectfeatures[i].geometry.applyStyle("fontFamily");
                    }
                    //selectfeature.geometry.calculateParts();
                    break;
                case this.displayTextContentName[5]:
                    selectfeatures[i].geometry.setSpace(parseInt(updated.value));
                    //if (selectfeature.geometry.code !== 1017) {
                    //    selectfeature.geometry.space = parseInt(updated.value);
                    //} else {
                    //    selectfeature.geometry.textToLineDistance = parseInt(updated.value);
                    //}
                    //selectfeature.geometry.calculateParts();
                    break;
                case this.displayLineStyleName[0]:
                    if (selectfeatures[i].geometry instanceof SuperMap.Geometry.GroupObject) {
                        selectfeatures[i].geometry.setStrokeWidth(parseInt(updated.value));
                    }
                    else {
                        selectfeatures[i].style.strokeWidth = parseInt(updated.value);
                        if(selectfeatures[i].geometry.symbolType === SuperMap.Plot.SymbolType.SYMBOLTEXT){
                            selectfeatures[i].geometry.applyStyle("strokeWidth");
                            //selectfeature.geometry.calculateParts();
                        }
                    }
                    break;
                case this.displayLineStyleName[1]:
                    if (selectfeatures[i].geometry instanceof SuperMap.Geometry.GroupObject) {
                        selectfeatures[i].geometry.setStrokeColor(updated.value);
                    }
                    else {
                        selectfeatures[i].style.strokeColor = updated.value;
                        if(selectfeatures[i].geometry.symbolType === SuperMap.Plot.SymbolType.SYMBOLTEXT){
                            selectfeatures[i].geometry.applyStyle("strokeColor");
                            //selectfeature.geometry.calculateParts();
                        }
                        if(selectfeatures[i].geometry.symbolType === SuperMap.Plot.SymbolType.LITERATESIGN){
                            selectfeatures[i].geometry.route.applyTextStyle(selectfeatures[i].style);

                        }
                    }
                    break;
                case this.displayLineStyleName[2]:
                {
                    var opacity = parseFloat(updated.value) < 0 ? 0 : parseFloat(updated.value);
                    opacity = parseFloat(updated.value) > 1 ? 1 : parseFloat(updated.value);
                    selectfeatures[i].style.strokeOpacity = opacity;
                    if(selectfeatures[i].geometry.symbolType === SuperMap.Plot.SymbolType.SYMBOLTEXT){
                        selectfeatures[i].geometry.applyStyle("strokeOpacity");
                        //selectfeature.geometry.calculateParts();
                    }
                }
                    break;
                case this.displayLineStyleName[3]:
                    selectfeatures[i].style.strokeDashstyle = updated.value;
                    if(selectfeatures[i].geometry.symbolType === SuperMap.Plot.SymbolType.SYMBOLTEXT){
                        selectfeatures[i].geometry.applyStyle("strokeDashstyle");
                        //selectfeature.geometry.calculateParts();
                    }
                    break;
                case this.displaySurroundLineName[0]:
                    selectfeatures[i].geometry.setSurroundLineType(parseInt(updated.value));
                    break;
                case this.displaySurroundLineName[1]:
                    selectfeatures[i].style.surroundLineWidth = parseInt(updated.value);
                    break;
                case this.displaySurroundLineName[2]:
                    selectfeatures[i].style.surroundLineColor = updated.value;
                    break;
                case this.displaySurroundLineName[3]:
                {
                    var opacity = parseFloat(updated.value) < 0 ? 0 : parseFloat(updated.value);
                    opacity = parseFloat(updated.value) > 1 ? 1 : parseFloat(updated.value);
                    selectfeatures[i].style.surroundLineColorOpacity = opacity;
                }
                    break;
                case this.displayFillStyleName[0]:
                    selectfeatures[i].style.fill = this.fromCheckboxValue(updated.value);
                    if(selectfeatures[i].geometry.symbolType === SuperMap.Plot.SymbolType.SYMBOLTEXT){
                        selectfeatures[i].geometry.applyStyle("fill");
                        //selectfeature.geometry.calculateParts();
                    }
                    break;
                case this.displayFillStyleName[1]:
                    selectfeatures[i].style.fillColor = updated.value;
                    if(selectfeatures[i].geometry.symbolType === SuperMap.Plot.SymbolType.SYMBOLTEXT){
                        selectfeatures[i].geometry.applyStyle("fillColor");
                        //selectfeature.geometry.calculateParts();
                    }
                    break;
                case this.displayFillStyleName[2]:
                {
                    var opacity = parseFloat(updated.value) < 0 ? 0 : parseFloat(updated.value);
                    opacity = parseFloat(updated.value) > 1 ? 1 : parseFloat(updated.value);
                    selectfeatures[i].style.fillOpacity = opacity;
                    if(selectfeatures[i].geometry.symbolType === SuperMap.Plot.SymbolType.SYMBOLTEXT){
                        selectfeatures[i].geometry.applyStyle("fillOpacity");
                        //selectfeature.geometry.calculateParts();
                    }
                }
                    break;
                case this.displayFillStyleName[3]:
                    selectfeatures[i].style.fillGradientMode = updated.value;
                    if(selectfeatures[i].geometry.symbolType === SuperMap.Plot.SymbolType.SYMBOLTEXT){
                        selectfeatures[i].geometry.applyStyle("fillGradientMode");
                        //selectfeature.geometry.calculateParts();
                    }
                    break;
                case this.displayFillStyleName[4]:
                    selectfeatures[i].style.fillBackColor = updated.value;
                    if(selectfeatures[i].geometry.symbolType === SuperMap.Plot.SymbolType.SYMBOLTEXT){
                        selectfeatures[i].geometry.applyStyle("fillBackColor");
                        //selectfeature.geometry.calculateParts();
                    }
                    break;
                case this.displayFillStyleName[5]:
                {
                    var opacity = parseFloat(updated.value) < 0 ? 0 : parseFloat(updated.value);
                    opacity = parseFloat(updated.value) > 1 ? 1 : parseFloat(updated.value);
                    selectfeatures[i].style.fillBackOpacity = opacity;
                    if(selectfeatures[i].geometry.symbolType === SuperMap.Plot.SymbolType.SYMBOLTEXT){
                        selectfeatures[i].geometry.applyStyle("fillBackOpacity");
                        //selectfeature.geometry.calculateParts();
                    }
                }
                    break;
                case this.fontName[0]:
                    selectfeatures[i].style.fontStroke = this.fromCheckboxValue(updated.value);
                    break;
                case this.fontName[1]:
                    selectfeatures[i].style.fontStrokeColor = updated.value;
                    break;
                case this.fontName[2]:
                    selectfeatures[i].style.fontStrokeWidth = parseInt(updated.value);
                    break;
                case this.fontName[3]:
                    selectfeatures[i].style.fontBackground = this.fromCheckboxValue(updated.value);
                    break;
                case this.fontName[4]:
                    selectfeatures[i].style.fontBackgroundColor = updated.value;
                    break;
                case this.fontName[5]:
                    selectfeatures[i].style.fontShadow = this.fromCheckboxValue(updated.value);
                    break;
                case this.fontName[6]:
                    selectfeatures[i].style.fontShadowColor = updated.value;
                    break;
                case this.fontName[7]:
                    selectfeatures[i].style.fontShadowOffsetX = parseInt(updated.value);
                    break;
                case this.fontName[8]:
                    selectfeatures[i].style.fontShadowOffsetY = parseInt(updated.value);
                    break;
                case this.fontName[9]:
                    selectfeatures[i].style.fontSpace = parseInt(updated.value);
                    break;
                case this.fontName[10]:
                    selectfeatures[i].style.fontPercent = parseInt(updated.value);
                    break;
                case this.displayNameNew[0]:
                    //selectfeature.geometry.arrowHeadType = parseInt(updated.value);
                    //selectfeature.geometry.calculateParts();
                    selectfeatures[i].geometry.setStartArrowType(parseInt(updated.value));
                    break;
                case this.displayNameNew[1]:
                    selectfeatures[i].geometry.setEndArrowType(parseInt(updated.value));
                    //selectfeature.geometry.arrowTailType = parseInt(updated.value);
                    //selectfeature.geometry.calculateParts();
                    break;
                case this.displayNameNew[2]:
                    //selectfeature.geometry.isAvoid = this.fromCheckboxValue(updated.value);
                    //selectfeature.geometry.calculateParts();
                    selectfeatures[i].geometry.setAvoidLine(this.fromCheckboxValue(updated.value));
                    break;
                case this.displayNameNew[3]:
                    //selectfeature.geometry.showPathLine = this.fromCheckboxValue(updated.value);
                    //selectfeature.geometry.calculateParts();
                    selectfeatures[i].geometry.setShowPathLine(this.fromCheckboxValue(updated.value));
                    break;
                case this.displayNameNew[4]:
                    //selectfeature.geometry.isCurve = this.fromCheckboxValue(updated.value);
                    //selectfeature.geometry.calculateParts();
                    selectfeatures[i].geometry.setCurveLine(this.fromCheckboxValue(updated.value));
                    break;
                case this.displayNameNew[5]:
                    //selectfeature.geometry.radiusLineType = parseInt(updated.value);
                    //selectfeature.geometry.calculateParts();
                    selectfeatures[i].geometry.setRadiusLineType(parseInt(updated.value));
                    break;
                case this.displayNameNew[6]:
                    //selectfeature.geometry.radiusText[0] = updated.value;
                    //selectfeature.geometry.calculateParts();
                    selectfeatures[i].geometry.setRadiusText(updated.value, 0);
                    break;
                case this.displayNameNew[7]:
                    //selectfeature.geometry.radiusText[1] = updated.value;
                    //selectfeature.geometry.calculateParts();
                    selectfeatures[i].geometry.setRadiusText(updated.value, 1);
                    break;
                case this.displayNameNew[15]:
                    //selectfeature.geometry.radiusPosAngle = updated.value;
                    //selectfeature.geometry.calculateParts();
                    selectfeatures[i].geometry.setRadiusTextPos(updated.value);
                    break;
                case this.displayNameNew[8]:
                    //selectfeature.geometry.visible = this.fromCheckboxValue(updated.value);
                    //selectfeature.geometry.calculateParts();
                    selectfeatures[i].geometry.setVisible(this.fromCheckboxValue(updated.value));
                    break;
                case this.displayNameNew[9]:
                    selectfeatures[i].geometry.setType(updated.value);
                    break;
                case this.displayNameNew[10]:
                    //selectfeature.geometry.routeNode.rotate = parseFloat(updated.value);
                    //selectfeature.geometry.calculateParts();
                    selectfeatures[i].geometry.setRotate(parseFloat(updated.value));
                    break;
                case this.displayNameNew[11]:
                    //selectfeature.geometry.textBoxType = parseInt(updated.value);
                    //selectfeature.geometry.calculateParts();
                    selectfeatures[i].geometry.setTextBoxType(parseInt(updated.value));
                    break;
                case this.displayNameNew[12]:
                    //selectfeature.geometry.addFrame=this.fromCheckboxValue(updated.value);
                    //selectfeature.geometry.calculateParts();
                    selectfeatures[i].geometry.setRoundBox(this.fromCheckboxValue(updated.value));
                    break;
                case this.displayNameNew[13]:
                    //selectfeature.geometry.showPathLineArrow = this.fromCheckboxValue(updated.value);
                    //selectfeature.geometry.calculateParts();
                    selectfeatures[i].geometry.setShowPathLineArrow(this.fromCheckboxValue(updated.value));
                    break;
                case this.displayNameNew[14]:
                    //selectfeature.geometry.addFrame=this.fromCheckboxValue(updated.value);
                    //selectfeature.geometry.calculateParts();
                    selectfeatures[i].geometry.setFrame(this.fromCheckboxValue(updated.value));
                    break;
                case "箭头":
                    //selectfeature.geometry.arrowHeadType=parseInt(updated.value);
                    //selectfeature.geometry.calculateParts();
                    selectfeatures[i].geometry.setArrowHeadType(parseInt(updated.value));
                    break;
                case "箭身":
                    //selectfeature.geometry.arrowBodyType=parseInt(updated.value);
                    //selectfeature.geometry.calculateParts();
                    selectfeatures[i].geometry.setArrowBodyType(parseInt(updated.value));
                    break;
                case "箭尾":
                    //selectfeature.geometry.arrowTailType=parseInt(updated.value);
                    //selectfeature.geometry.calculateParts();
                    selectfeatures[i].geometry.setArrowTailType(parseInt(updated.value));
                    break;
                case this.displayNameNew[16]:
                    //selectfeature.geometry.lineRelationType = parseInt(updated.value);
                    //selectfeature.geometry.calculateParts();
                    selectfeatures[i].geometry.setLineRelationType(parseInt(updated.value));
                    break;

            }

            if (updated.group == this.group[5]) {
                if (updated.name == "LibID") {
                    if(updated.value !== null){
                        selectfeatures[i].geometry.subSymbols[0].libID = parseInt(updated.value);
                    }
                }
                if (updated.name == "Code") {
                    var code = parseInt(updated.value);
                    if(selectfeatures[i].geometry.symbolType === SuperMap.Plot.SymbolType.NODECHAIN && code != null) {
                        var subCode = symbolLibManager.findSymbolByCode(code);
                        if(subCode.length !== 0 && subCode[0].symbolType === "SYMBOL_DOT"){
                            selectfeatures[i].geometry.setSubSymbol(code, updated.index, subCode[0].libID);
                        }
                    }
                    else if (code !== null) {
                        selectfeatures[i].geometry.setSubSymbol(code, updated.index);
                    }
                }
            }
        }

        SuperMap.Plot.AnalysisSymbol.setStyle(selectfeatures[i].style, selectfeatures[i].geometry.symbolData);
        }
    },

    getAnnotationRows: function(geometry){
        var annotations = [];
        annotations.push({"value": "0", "text": "左上"});
        annotations.push({"value": "1", "text": "左下"});
        annotations.push({"value": "2", "text": "右上"});
        annotations.push({"value": "3", "text": "右下"});
        annotations.push({"value": "4", "text": "上"});
        annotations.push({"value": "5", "text": "下"});
        annotations.push({"value": "6", "text": "左"});
        annotations.push({"value": "7", "text": "右"});
        if(geometry.symbolData && geometry.symbolData.middleMarkExist)
            annotations.push({"value": "8", "text": "中间"});
        return annotations;
    },

    getRelLineTextRows: function(){
        var annotations = [];

        annotations.push({"value": "0", "text": "线上"});
        annotations.push({"value": "1", "text": "线左"});
        annotations.push({"value": "2", "text": "线右"});
        annotations.push({"value": "3", "text": "双侧"});

        return annotations;
    },

    relLineTextToString: function(relLineText)
    {
        if(relLineText === SuperMap.Plot.RelLineText.ONLINE)
            return "线上";
        else if(relLineText === SuperMap.Plot.RelLineText.ONLEFTLINE)
            return "线左";
        else if(relLineText === SuperMap.Plot.RelLineText.ONRIGHTLINE)
            return "线右";
        else if(relLineText === SuperMap.Plot.RelLineText.ONBOTHLINE)
            return "双侧";
    },


    getSymbolRankRows: function(geometry)
    {
        var symbolRanks = [];
        if(geometry.symbolData && geometry.symbolData.symbolRanks){
            symbolRanks = geometry.symbolData.symbolRanks;
        }

        var rows = [];
        rows.push({"value": "0", "text": "无级别"});
        for(var i = 0; i < symbolRanks.length; i++)
        {
            if(symbolRanks[i] == 1)
                rows.push({"value": "1", "text": "军区级"});
            else if(symbolRanks[i] == 2)
                rows.push({"value": "2", "text": "副大军区级"});
            else if(symbolRanks[i] == 3)
                rows.push({"value": "3", "text": "集团军级"});
            else if(symbolRanks[i] == 4)
                rows.push({"value": "4", "text": "师级"});
            else if(symbolRanks[i] == 5)
                rows.push({"value": "5", "text": "旅级"});
            else if(symbolRanks[i] == 6)
                rows.push({"value": "6", "text": "团级"});
            else if(symbolRanks[i] == 7)
                rows.push({"value": "7", "text": "营级"});
            else if(symbolRanks[i] == 8)
                rows.push({"value": "8", "text": "连级"});
            else if(symbolRanks[i] == 9)
                rows.push({"value": "9", "text": "排级"});
        }

        return rows;
    },

    getSurroundLineTypeRows: function(symbolType)
    {
        var rows = [];

        if(symbolType === SuperMap.Plot.SymbolType.DOTSYMBOL){
            rows.push({"value": "0", "text": "无衬线"});
            rows.push({"value": "1", "text": "有衬线"});
        } else {
            rows.push({"value": "0", "text": "无衬线"});
            rows.push({"value": "1", "text": "内侧衬线"});
            rows.push({"value": "2", "text": "外侧衬线"});
            rows.push({"value": "3", "text": "双侧衬线"});
        }

        return rows;
    },

    getDisplayRows: function()
    {
        var rows = [];

        rows.push({"value": "display", "text": "显示"});
        rows.push({"value": "none", "text": "不显示"});

        return rows;
    },

    getShowRows: function()
    {
        var rows = [];

        rows.push({"value": "true", "text": "显示"});
        rows.push({"value": "false", "text": "不显示"});

        return rows;
    },


    getFillGradientModeRows: function()
    {
        var rows = [];

        rows.push({"value": "NONE", "text": "无渐变"});
        rows.push({"value": "LINEAR", "text": "线性渐变"});
        rows.push({"value": "RADIAL", "text": "辐射渐变"});

        return rows;
    },

    getLineStyleRows: function()
    {
        var rows = [];

        rows.push({"value": "solid", "text": "solid"});
        rows.push({"value": "dot", "text": "dot"});
        rows.push({"value": "dash", "text": "dash"});
        rows.push({"value": "dashdot", "text": "dashdot"});
        rows.push({"value": "longdash", "text": "longdash"});
        rows.push({"value": "longdashdot", "text": "longdashdot"});

        return rows;
    },

    getLineRelationTypeRows: function()
    {
        var rows = [];


        rows.push({"value": "0", "text": "实直线"});
        rows.push({"value": "1", "text": "虚直线"});
        rows.push({"value": "2", "text": "箭头线"});

        return rows;
    },

    lineRelationTypeToString: function(lineRelationType) {

        if (lineRelationType == 0)
            return "实直线";
        else if (lineRelationType == 1)
            return "虚直线";
        else if (lineRelationType == 2)
            return "箭头线";
    },

    getRouteNodeTypeRows: function()
    {
        var rows = [];

        rows.push({"value": "AIMING", "text": "瞄准点"});
        rows.push({"value": "COMMONROUTE", "text": "普通航路点"});
        rows.push({"value": "EXPANDING", "text": "展开点"});
        rows.push({"value": "INITIAL", "text": "初始点"});
        rows.push({"value": "LANCH", "text": "发射点"});
        rows.push({"value": "RENDEZVOUS", "text": "会合点"});
        rows.push({"value": "STANDBY", "text": "待机点"});
        rows.push({"value": "SUPPLY", "text": "补给点"});
        rows.push({"value": "TAKEOFF", "text": "起飞点"});
        rows.push({"value": "TURNING", "text": "转弯点"});
        rows.push({"value": "VISUALINITAL", "text": "可视初始点"});
        rows.push({"value": "VOLLEY", "text": "齐射点"});
        rows.push({"value": "WEAPONLAUNCH", "text": "武器发射点"});
        rows.push({"value": "TARGET", "text": "目标点"});
        rows.push({"value": "ATTACK", "text": "攻击点"});
        rows.push({"value": "SUPPRESS", "text": "压制点"});
        rows.push({"value": "EIGHTSPIRAL", "text": "八字盘旋点"});
        rows.push({"value": "HAPPYVALLEY", "text": "跑马圈点"});

        return rows;
    },

    routeNodeTypeToString: function(routeNodeType) {
        if (routeNodeType === SuperMap.Plot.RouteNodeType.AIMING)
            return "瞄准点";
        else if (routeNodeType == SuperMap.Plot.RouteNodeType.COMMONROUTE)
            return "普通航路点";
        else if (routeNodeType == SuperMap.Plot.RouteNodeType.EXPANDING)
            return "展开点";
        else if (routeNodeType == SuperMap.Plot.RouteNodeType.INITIAL)
            return "初始点";
        else if (routeNodeType == SuperMap.Plot.RouteNodeType.LANCH)
            return "发射点";
        else if (routeNodeType == SuperMap.Plot.RouteNodeType.RENDEZVOUS)
            return "会合点";
        else if (routeNodeType == SuperMap.Plot.RouteNodeType.STANDBY)
            return "待机点";
        else if (routeNodeType == SuperMap.Plot.RouteNodeType.SUPPLY)
            return "补给点";
        else if (routeNodeType == SuperMap.Plot.RouteNodeType.TAKEOFF)
            return "起飞点";
        else if (routeNodeType == SuperMap.Plot.RouteNodeType.TURNING)
            return "转弯点";
        else if (routeNodeType == SuperMap.Plot.RouteNodeType.VISUALINITAL)
            return "可视初始点";
        else if (routeNodeType == SuperMap.Plot.RouteNodeType.VOLLEY)
            return "齐射点";
        else if (routeNodeType == SuperMap.Plot.RouteNodeType.WEAPONLAUNCH)
            return "武器发射点";
        else if (routeNodeType == SuperMap.Plot.RouteNodeType.TARGET)
            return "目标点";
        else if (routeNodeType == SuperMap.Plot.RouteNodeType.ATTACK)
            return "攻击点";
        else if (routeNodeType == SuperMap.Plot.RouteNodeType.SUPPRESS)
            return "压制点";
        else if (routeNodeType == SuperMap.Plot.RouteNodeType.EIGHTSPIRAL)
            return "八字盘旋点";
        else if (routeNodeType == SuperMap.Plot.RouteNodeType.HAPPYVALLEY)
            return "跑马圈点";
    },

    getArrowTypeRows: function()
    {
        var rows = [];

        rows.push({"value": "0", "text": "双线箭头"});
        rows.push({"value": "1", "text": "实心三角形"});
        rows.push({"value": "2", "text": "无箭头"});

        return rows;
    },


    arrowTypeToString: function(arrowType) {
        if (arrowType == 0)
            return "双线箭头";
        else if (arrowType == 1)
            return "实心三角形";
        else if (arrowType == 2)
            return "无箭头";
    },

    getRadiusTypeRows: function()
    {
        var rows = [];

        rows.push({"value": "0", "text": "不显示"});
        rows.push({"value": "1", "text": "直线"});
        rows.push({"value": "2", "text": "箭头线"});

        return rows;
    },

    radiusTypeToString: function(radiusType) {
        if (radiusType == 0)
            return "不显示";
        else if (radiusType == 1)
            return "直线";
        else if (radiusType == 2)
            return "箭头线";
    },
    annotationToString: function(annotation)
    {
        if(annotation === 0)
            return "左上";
        else if(annotation === 1)
            return "左下";
        else if(annotation === 2)
            return "右上";
        else if(annotation === 3)
            return "右下";
        else if(annotation === 4)
            return "上";
        else if(annotation === 5)
            return "下";
        else if(annotation === 6)
            return "左";
        else if(annotation === 7)
            return "右";
        else if(annotation === 8)
            return "中间";
    },

    symbolRankToString: function(symbolRank)
    {
        if(symbolRank == 0)
            return "无级别";
        else if(symbolRank == 1)
            return "军区级";
        else if(symbolRank == 2)
            return "副大军区级";
        else if(symbolRank == 3)
            return "集团军级";
        else if(symbolRank == 4)
            return "师级";
        else if(symbolRank == 5)
            return "旅级";
        else if(symbolRank == 6)
            return "团级";
        else if(symbolRank == 7)
            return "营级";
        else if(symbolRank == 8)
            return "连级";
        else if(symbolRank == 9)
            return "排级";
    },

    surroundLineTypeToString: function(symbolType, surroundLineType)
    {
        if(symbolType === SuperMap.Plot.SymbolType.DOTSYMBOL){
            if(surroundLineType === 0)
                return "无衬线";
            else if(surroundLineType === 1)
                return "有衬线";
        } else {
            if(surroundLineType === 0)
                return "无衬线";
            else if(surroundLineType === 1)
                return "内侧衬线";
            else if(surroundLineType === 2)
                return "外侧衬线";
            else if(surroundLineType === 3)
                return "双侧衬线";
        }
    },

    displayToString: function(display)
    {
        if(display &&display === "none"){
            return "不显示";
        }
        return "显示";
    },

    fillGradientModeToString: function(fillGradientMode)
    {
        if(fillGradientMode === "NONE"){
            return "无渐变";
        } else if(fillGradientMode === "LINEAR"){
            return "线性渐变";
        } else if(fillGradientMode === "RADIAL"){
            return "辐射渐变";
        } else {
            return "无渐变";
        }
    },

    showToString:function(show){
        if(show === true){
            return "显示";
        } else if(show === false){
            return "不显示";
        }
    },


    checkboxValueToString:function(checkboxValue){
        if(checkboxValue === true){
            return "true";
        } else if(checkboxValue === false){
            return "false";
        }
    },

    fromCheckboxValue: function(checkboxStr){
        if(checkboxStr === "true"){
            return true;
        } else if(checkboxStr === "false"){
            return false;
        }

    },

    //偏移线类型
    getPositionOffsetTypeRows: function()
    {
        var rows = [];

        rows.push({"value": "0", "text": "直线"});
        rows.push({"value": "1", "text": "线粗渐变"});

        return rows;
    },
    //偏移线类型
    positionOffsetTypeToString: function(positionOffsetType)
    {
        if(positionOffsetType === 0){
            return "直线";
        } else if(positionOffsetType === 1){
            return "线粗渐变";
        }
    },

    //注记框类型
    getTextBoxTypeRows: function()
    {
        var rows = [];

        rows.push({"value": "0", "text": "带角矩形边框"});
        rows.push({"value": "1", "text": "矩形边框"});
        rows.push({"value": "3", "text": "无边框"});

        return rows;
    },
    textBoxTypeToString: function(textBoxType) {
        if (textBoxType == 0)
            return "带角矩形边框";
        else if (textBoxType == 1)
            return "矩形边框";
        else if (textBoxType == 3)
            return "无边框";
    },

    //线型标注框类型
    getLineMarkingTypeRows: function()
    {
        var rows = [];

        rows.push({"value": "1", "text": "矩形边框"});
        rows.push({"value": "2", "text": "线型底边"});

        return rows;
    },
    lineMarkingTypeToString: function(lineMarkingType)
    {
        if(lineMarkingType === 1){
            return "矩形边框";
        } else if(lineMarkingType === 2){
            return "线型底边";
        }
    },

    //复合箭头--箭头
    getArrowHeadTypeRows:function()
    {
        var rows = [];

        rows.push({"value": "0", "text": "双线箭头"});
        rows.push({"value": "1", "text": "无箭头"});
        rows.push({"value": "2", "text": "燕尾箭头"});
        rows.push({"value": "3", "text": "实心三角形"});


        return rows;
    },

    arrowHeadTypeToString: function(arrowHeadType) {
        if (arrowHeadType == 0)
            return "双线箭头";
        else if (arrowHeadType == 1)
            return "无箭头";
        else if (arrowHeadType == 2)
            return "燕尾箭头";
        else if (arrowHeadType == 3)
            return "实心三角形";

    },

    //复合箭头--箭身：arrowBodyType
    //0--折线，1--贝塞尔曲线
    getArrowBodyTypeRows:function()
    {
        var rows = [];

        rows.push({"value": "0", "text": "折线"});
        rows.push({"value": "1", "text": "贝塞尔曲线"});
        return rows;
    },

    arrowBodyTypeToString: function(arrowBodyType) {
        if (arrowBodyType == 0)
            return "折线";
        else if (arrowBodyType == 1)
            return "贝塞尔曲线";

    },

    //复合箭头--箭尾：arrowTailType
    //0--无箭尾，1--直线,3--燕尾
    getArrowTailTypeRows:function()
    {
        var rows = [];

        rows.push({"value": "0", "text": "无箭尾"});
        rows.push({"value": "1", "text": "直线箭尾"});
        rows.push({"value": "3", "text": "燕尾箭尾"});
        return rows;
    },

    arrowTailTypeToString: function(arrowTailType) {
        if (arrowTailType == 0)
            return "无箭尾";
        else if (arrowTailType == 1)
            return "直线箭尾";
        else if (arrowTailType == 3)
            return "燕尾箭尾";

    },

    libIDToString:function(libID) {
        if (libID == 421)
            return "421(警用库)";
        else if (libID == 100)
            return "100(军队库)";
        else if (libID == 123)
            return "123(武警库)";
        else if (libID == 900)
            return "900(人防库)";
    },

    subSymbolsTypeString:function(subSymbolsLength,geometry){
        if(subSymbolsLength===0){
            return "";
        }else {
            if(geometry.libID===100){
                if(geometry.getSubSymbols()[0].code === 100){
                    return "陆军";
                }else if(geometry.getSubSymbols()[0].code === 200){
                    return "海军";
                }else if(geometry.getSubSymbols()[0].code === 300) {
                    return "空军";
                }
            }else if(geometry.libID===123){
                if(geometry.getSubSymbols()[0].code === 10101){
                    return "武装警察部队";
                }else if(geometry.getSubSymbols()[0].code === 10102){
                    return "防爆装甲";
                }else if(geometry.getSubSymbols()[0].code === 10103) {
                    return "火炮";
                }

            }else if(geometry.libID===900){
                if(geometry.getSubSymbols()[0].code === 910200){
                    return "人民防空重点城市";
                }else if(geometry.getSubSymbols()[0].code === 910300){
                    return "人民防空基本指挥所";
                }else if(geometry.getSubSymbols()[0].code === 910402) {
                    return "水路抢修专业队";
                }

            }else if(geometry.libID===0){
                if(geometry.getSubSymbols()[0].code === 9){
                    return "刑警";
                }else if(geometry.getSubSymbols()[0].code === 80103){
                    return "交警";
                }else if(geometry.getSubSymbols()[0].code === 80109){
                    return "专业警";
                }

            }


        }

    },
    subSymbolsTypeRows:function(geometry){
        var rows = [];
        rows.push({"value": "0", "text": ""});
       if(geometry.libID===100){
           rows.push({"value": "100", "text": "陆军"});
           rows.push({"value": "200", "text": "海军"});
           rows.push({"value": "300", "text": "空军"});
       }else if(geometry.libID===123){
           rows.push({"value": "10101", "text": "武装警察部队"});
           rows.push({"value": "10102", "text": "防爆装甲"});
           rows.push({"value": "10103", "text": "火炮"});
       }else if(geometry.libID===900){
           rows.push({"value": "910200", "text": "人民防空重点城市"});
           rows.push({"value": "910300", "text": "人民防空基本指挥所"});
           rows.push({"value": "910402", "text": "水路抢修专业队"});
       }else if(geometry.libID===0){
           rows.push({"value": "9", "text": "刑警"});
           rows.push({"value": "80103", "text": "交警"});
           rows.push({"value": "80109", "text": "专业警"});
        }

        return rows;
    },


    CLASS_NAME: "SuperMap.Plotting.StylePanel"
});