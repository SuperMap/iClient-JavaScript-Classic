/* COPYRIGHT 2012 SUPERMAP
 * 本程序只能在有效的授权许可下使用。
 * 未经许可，不得以任何手段擅自使用或传播。*/

/**
 * @requires SuperMap/Util.js
 * @requires SuperMap/REST.js
 * @requires SuperMap/REST/ServerGeometry.js
 * @requires SuperMap/REST/SpatialAnalyst/SpatialAnalystResult.js
 */

/**
 * Class: SuperMap.REST.GeometryBatchOverlayAnalystResult
 * 批量几何对象叠加分析服务结果数据类
 * 该类中包含了叠加分析的结果几何对象。
 *
 * Inherits from:
 *  - <SuperMap.REST.SpatialAnalystResult> 
 */
SuperMap.REST.GeometryBatchOverlayAnalystResult = SuperMap.Class(SuperMap.REST.SpatialAnalystResult, {

    /** 
     * Property: resultGeometry
     * {<SuperMap.Geometry>} 叠加分析的结果几何对象
     */
    resultGeometry: null,

    /** 
     * Property: operateGeometry
     * {SuperMap.Geometry} 叠加分析的操作几何对象
     */
    operateGeometry: null,

    /** 
     * Property: sourceGeometry
     * {SuperMap.Geometry} 叠加分析的源几何对象 
     */
    sourceGeometry: null,

    /**
     * Constructor: SuperMap.REST.GeometryBatchOverlayAnalystResult 
     * 几何对象叠加分析结果构造函数构造函数。
     *
     * Parameters:
     * options - {Object} 可选参数。
     *
     * Allowed options properties:
     * resultGeometry - {<SuperMap.Geometry>} 叠加分析的结果几何对象
     * succeed - {Boolean} 是否成功返回结果。true 表示成功返回结果。 
     */
    initialize: function(options) {
        SuperMap.REST.SpatialAnalystResult.prototype.initialize.apply(this, arguments);
        if (options) {
            SuperMap.Util.extend(this, options);
        }
    },

    /**
     * APIMethod: destroy
     * 释放资源，将引用资源的属性置空。  
     */
    destroy: function() {
        SuperMap.REST.SpatialAnalystResult.prototype.destroy.apply(this, arguments);
        var me = this;
        if (me.resultGeometry) {
            me.resultGeometry.destroy();
            me.resultGeometry = null;
        }
    },

    CLASS_NAME: "SuperMap.REST.GeometryBatchOverlayAnalystResult"
});

/**
 * Function: SuperMap.REST.GeometryBatchOverlayAnalystResult.fromJson
 * 将 JSON 对象表示的查询结果转化为几何对象叠加分析结果对象。
 *
 * Parameters:
 * jsonObject - {Object} JSON 对象表示的查询结果记录集。 
 *
 * Returns:
 * {<SuperMap.REST.GeometryBatchOverlayAnalystResult>} 几何对象叠加分析结果。
 */
SuperMap.REST.GeometryBatchOverlayAnalystResult.fromJson = function(jsonObjects) {
    if (!jsonObjects) {
        return;
    }
    var results = [];
    for (var i = 0, len = jsonObjects.length; i < len; i++) {
        var jsonObject = jsonObjects[i];
        var result = new SuperMap.REST.GeometryBatchOverlayAnalystResult();
        if (jsonObject.result.succeed) {
            result.succeed = jsonObject.result.succeed;
        }

        if (jsonObject.result.resultGeometry) {
            result.resultGeometry = SuperMap.REST.ServerGeometry.fromJson(jsonObject.result.resultGeometry).toGeometry();
        }

        if (jsonObject.sourceGeometry) {
            result.sourceGeometry = SuperMap.REST.ServerGeometry.fromJson(jsonObject.sourceGeometry).toGeometry();
        }

        if (jsonObject.operateGeometry) {
            result.operateGeometry = SuperMap.REST.ServerGeometry.fromJson(jsonObject.operateGeometry).toGeometry();
        }

        results.push(result);
    }


    return results;
};