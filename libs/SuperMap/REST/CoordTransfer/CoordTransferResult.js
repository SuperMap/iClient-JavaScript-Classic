/* COPYRIGHT 2012 SUPERMAP
 * 本程序只能在有效的授权许可下使用。
 * 未经许可，不得以任何手段擅自使用或传播。*/

/**
 * @requires SuperMap/Util.js
 */

/**
 * Class: SuperMap.REST.CoordTransferParameters
 * 坐标转换结果类。
 */
SuperMap.REST.CoordTransferResult = SuperMap.Class({
    /**
     * APIProperty: features
     * {Array(<SuperMap.Feature>)} - 坐标转换结果要素
     */
    features:null,
    /**
     * Constructor: SuperMap.REST.CoordTransferResult
     * 坐标转换结果类构造函数。
     *
     * Parameters:
     * options - {Object} 参数。
     *
     * Allowed options properties:
     * features - {Array(<SuperMap.Feature>)}  坐标转换结果要素
     */
    initialize: function(options) {
        if (options) {
            SuperMap.Util.extend(this, options);
        }
    },

    /**
     * APIMethod: destroy
     * 释放资源，将引用资源的属性置空。
     */
    destroy: function() {
        this.features = undefined;
    },

    CLASS_NAME: "SuperMap.REST.CoordTransferResult"
});
SuperMap.REST.CoordTransferResult.fromJson = function(result,features){
    var vertices = [];
    if(!result || !features){
        return new SuperMap.REST.CoordTransferResult();
    }
    for(var i = 0, len =features.length; i < len ; i++){
        var feature = features[i];
        var geometry = feature && feature.geometry;
        var nodes = geometry && geometry.getVertices();
        vertices = vertices.concat(nodes);
    }
    if(vertices.length !== result.length){
        return new SuperMap.REST.CoordTransferResult();
    }
    for(i = 0,len = result.length; i < len ;i++){
        var point = result[i];
        var node = vertices[i];
        if(node && point){
            point = point.points[0];
            node.x = point.x;
            node.y = point.y;
        }
    }
    return new SuperMap.REST.CoordTransferResult({
        features:features
    });
};