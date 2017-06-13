/* COPYRIGHT 2012 SUPERMAP
 * 本程序只能在有效的授权许可下使用。
 * 未经许可，不得以任何手段擅自使用或传播。*/

/**
 * @requires SuperMap/Util.js
 * @requires SuperMap/REST/SpatialAnalyst/BufferSetting.js
 * @requires SuperMap/REST/SpatialAnalyst/BufferAnalystParameters.js
 */

/**
 * Class: SuperMap.REST.GeometryBufferAnalystParameters
 * 几何对象缓冲区分析参数类
 * 对指定的某个几何对象做缓冲区分析。通过该类可以指定要做缓冲区分析的几何对象、缓冲区参数等。
 *
 * Inherits from:
 *  - <SuperMap.REST.BufferAnalystParameters> 
 */
SuperMap.REST.GeometryBufferAnalystParameters = SuperMap.Class(SuperMap.REST.BufferAnalystParameters, {
 
    /** 
     * Property: sourceGeometry
     * {<SuperMap.Geometry>} 要做缓冲区分析的几何对象(支持Point、LineString、LinearRing、Polygon)。必设字段。
     */
    sourceGeometry : null,

    /**
     * Constructor: SuperMap.REST.GeometryBufferAnalystParameters 
     * 几何对象缓冲区分析参数类构造函数。
     *
     * Parameters:
     * options - {Object} 参数。
     *
     * Allowed options properties:
     * sourceGeometry - {<SuperMap.Geometry>} 要做缓冲区分析的几何对象。必设字段。
     * bufferSetting - {<SuperMap.REST.BufferSetting>} 设置缓冲区通用参数。
     */
    initialize: function (options) {
        SuperMap.REST.BufferAnalystParameters.prototype.initialize.apply(this, arguments);
        if (options) {
            SuperMap.Util.extend(this, options);
        }
    },

    /**
     * APIMethod: destroy
     * 释放资源，将引用资源的属性置空。  
     */
    destroy: function () {
        SuperMap.REST.BufferAnalystParameters.prototype.destroy.apply(this,arguments);

        var me = this;
        if(me.sourceGeometry ){
            me.sourceGeometry.destroy();
            me.sourceGeometry = null;
        }
    },
    
     CLASS_NAME: "SuperMap.REST.GeometryBufferAnalystParameters"
});

SuperMap.REST.GeometryBufferAnalystParameters.toObject = function (geometryBufferAnalystParameters, geo) {
    var tempObj = {};
    for (var name in geometryBufferAnalystParameters) {
        if (name === "bufferSetting") {
            var tempBufferSetting = {};
            for(var key in geometryBufferAnalystParameters.bufferSetting){
                tempBufferSetting[key] = geometryBufferAnalystParameters.bufferSetting[key];
            }
            //delete tempBufferSetting.radiusUnit;
            tempObj.analystParameter = tempBufferSetting;
        }
        else if (name === "sourceGeometry") {
            if(geo) {
                tempObj.sourceGeometry = SuperMap.REST.ServerGeometry.fromGeometry(geo);
            } else {
                tempObj.sourceGeometry = SuperMap.REST.ServerGeometry.fromGeometry(geometryBufferAnalystParameters.sourceGeometry);
            }
        }
        else {
            tempObj[name] = geometryBufferAnalystParameters[name];
        }
    }

    return tempObj
};

SuperMap.REST.GeometryBufferAnalystParameters.toArray = function (geometryBufferAnalystParameters) {
    var geos = geometryBufferAnalystParameters.sourceGeometry;

    var tempObj = [];
    for(var i = 0, len = geos.length; i < len; i ++) {
        var paramObj = SuperMap.REST.GeometryBufferAnalystParameters.toObject(geometryBufferAnalystParameters, geos[i]);

        var analystParam = {};
        analystParam.analystName = "buffer";
        analystParam.param = paramObj;
        tempObj.push(analystParam);
    }

    return tempObj;
};