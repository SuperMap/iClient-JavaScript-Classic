/* COPYRIGHT 2012 SUPERMAP
 * 本程序只能在有效的授权许可下使用。
 * 未经许可，不得以任何手段擅自使用或传播。*/

/**
 * @requires SuperMap/Util.js
 * @requires SuperMap/REST.js
 * @requires SuperMap/REST/SpatialAnalyst/OverlayAnalystParameters.js
 */

/**
 * Class: SuperMap.REST.GeometryBatchOverlayAnalystParameters
 * 批量几何对象叠加分析参数类
 * 对指定的某两个数组几何对象做叠加分析。通过该类可以指定要做叠加分析的几何对象、叠加操作类型。
 *
 * Inherits from:
 *  - <SuperMap.REST.OverlayAnalystParameters> 
 */
SuperMap.REST.GeometryBatchOverlayAnalystParameters = SuperMap.Class(SuperMap.REST.OverlayAnalystParameters, {

    /** 
     * Property: operateGeometry
     * {Array} 叠加分析的操作几何对象数组。必设字段。
     */
    operateGeometries: [],

    /** 
     * Property: sourceGeometry
     * {Array} 叠加分析的源几何对象数组。必设字段。 
     */
    sourceGeometries: [],

    /**
     * Constructor: SuperMap.REST.GeometryBatchOverlayAnalystParameters 
     * 几何对象叠加分析参数类构造函数。
     *
     * Parameters:
     * options - {Object} 参数。
     *
     * Allowed options properties:
     * operateGeometry - {Array} 叠加分析的操作几何对象。必设字段。
     * sourceGeometry - {Array} 叠加分析的源几何对象。必设字段。
     * operation - {<SuperMap.REST.OverlayOperationType>} 叠加操作枚举值。
     */
    initialize: function(options) {
        SuperMap.REST.OverlayAnalystParameters.prototype.initialize.apply(this, arguments);
        if (options) {
            SuperMap.Util.extend(this, options);
        }
    },

    /**
     * APIMethod: destroy
     * 释放资源，将引用资源的属性置空。 
     */
    destroy: function() {
        SuperMap.REST.OverlayAnalystParameters.prototype.destroy.apply(this, arguments);

        var me = this;
        if (me.sourceGeometries) {
            me.sourceGeometries.destroy();
            me.sourceGeometries = [];
        }

        if (me.operateGeometries) {
            me.operateGeometries.destroy();
            me.operateGeometries = [];
        }
    },

    CLASS_NAME: "SuperMap.REST.GeometryBatchOverlayAnalystParameters"
});

SuperMap.REST.GeometryBatchOverlayAnalystParameters.toObject = function(geometryOverlayAnalystParameters) {
    var tempObj = {};

    for (var name in geometryOverlayAnalystParameters) {
        if (name === "sourceGeometries") {
            var geometries = [],
                sourceGeometries = geometryOverlayAnalystParameters.sourceGeometries;
            for (var i = 0, len = sourceGeometries.length; i < len; i++) {
                geometries.push(SuperMap.REST.ServerGeometry.fromGeometry(sourceGeometries[i]));
            }
            tempObj.sourceGeometries = geometries;
        } else if (name === "operateGeometries") {
            var geometries = [],
                operateGeometries = geometryOverlayAnalystParameters.operateGeometries;
            for (var i = 0, len = operateGeometries.length; i < len; i++) {
                geometries.push(SuperMap.REST.ServerGeometry.fromGeometry(operateGeometries[i]));
            }
            tempObj.operateGeometries = geometries;
        } else {
            tempObj[name] = geometryOverlayAnalystParameters[name];
        }
    }

    return tempObj;
};