/* COPYRIGHT 2012 SUPERMAP
 * 本程序只能在有效的授权许可下使用。
 * 未经许可，不得以任何手段擅自使用或传播。*/

/**
 * @requires SuperMap/Util.js
 */

/**
 * Class: SuperMap.REST.CoordTransferParameters
 * 坐标转换参数类。
 * 要进行坐标转换的要素是哪些，坐什么坐标系转换到什么坐标系
 */
SuperMap.REST.CoordTransferParameters = SuperMap.Class({
    /**
     * APIProperty: features
     * <Array(<SuperMap.Vector>)> 要素数组
     */
    features:null,

    /**
     * APIProperty: sourceEpsgCode
     * {Integer} 要进行坐标转换的要素的坐标系编号——EPSG Code。
     */
    sourceEpsgCode:null,

    /**
     * APIProperty: sourcePrj
     * {Object} 要进行坐标转换的要素的坐标系参数。
     */
    sourcePrj:null,

    /**
     * APIProperty: targetEpsgCode
     * {Integer} 坐标转换的结果的坐标系编号——EPSG Code。
     */
    targetEpsgCode:null,

    /**
     * APIProperty: targetPrj
     * {Object} 坐标转换的结果的坐标系参数。
     */
    targetPrj:null,

    /**
     * Constructor: SuperMap.REST.CoordTransferParameters
     * 坐标转换参数类构造函数。
     *
     * Parameters:
     * options - {Object} 参数。
     *
     * Allowed options properties:
     * features - {Array<SuperMap.Feature>} 要进行坐标转换的要素。
     * sourceEpsgCode - {Integer} 要进行坐标转换的要素的坐标系编号——EPSG Code。
     * sourcePrj - {Object} 要进行坐标转换的要素的坐标系参数，及sourceEpsgCode相比，会优先选用此参数
     * targetEpsgCode - {Integer} 坐标转换的结果的坐标系编号——EPSG Code。
     * targetPrj - {Object} 坐标转换的结果的坐标系参数，及targetEpsgCode相比，会优先选用此参数
     *
     * Exampels:
     *  var transferParams = new SuperMap.REST.CoordTransferParameters({
     *          features:vectorLayer.features,
     *          targetPrj:{"distanceUnit":"METER","projectionParam":null,"epsgCode":4326,"coordUnit":"DEGREE","name":"Longitude / Latitude Coordinate System---GCS_WGS_1984","projection":null,"type":"PCS_EARTH_LONGITUDE_LATITUDE","coordSystem":{"datum":{"name":"D_WGS_1984","type":"DATUM_WGS_1984","spheroid":{"flatten":0.00335281066474748,"name":"WGS_1984","axis":6378137,"type":"SPHEROID_WGS_1984"}},"unit":"DEGREE","spatialRefType":"SPATIALREF_EARTH_LONGITUDE_LATITUDE","name":"GCS_WGS_1984","type":"GCS_WGS_1984","primeMeridian":{"longitudeValue":0,"name":"Greenwich","type":"PRIMEMERIDIAN_GREENWICH"}}},
     *          sourcePrj:{"distanceUnit":"METER","projectionParam":{"centralParallel":0,"firstPointLongitude":0,"rectifiedAngle":0,"scaleFactor":1,"falseNorthing":0,"centralMeridian":0,"secondStandardParallel":0,"secondPointLongitude":0,"azimuth":0,"falseEasting":0,"firstStandardParallel":0},"epsgCode":3857,"coordUnit":"METER","name":"User Define","projection":{"name":"SPHERE_MERCATOR","type":"PRJ_SPHERE_MERCATOR"},"type":"PCS_USER_DEFINED","coordSystem":{"datum":{"name":"D_WGS_1984","type":"DATUM_WGS_1984","spheroid":{"flatten":0.00335281066474748,"name":"WGS_1984","axis":6378137,"type":"SPHEROID_WGS_1984"}},"unit":"DEGREE","spatialRefType":"SPATIALREF_EARTH_LONGITUDE_LATITUDE","name":"GCS_WGS_1984","type":"GCS_WGS_1984","primeMeridian":{"longitudeValue":0,"name":"Greenwich","type":"PRIMEMERIDIAN_GREENWICH"}}}
     *      });
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
        var me = this;
        me.features = null;
        me.sourceEpsgCode = null;
        me.targetEpsgCode = null;
    },

    /**
     * 返回参数对象
     * @returns {{sourcePoints: Array, sourceEpsgCode: *, targetEpsgCode: *}}
     */
    toJSON:function(){
        var points = [];
        if(this.features && this.features.length > 0){
            for(var i = 0,len = this.features.length;i < len;i++){
                var feature = this.features[i];
                var vertices = feature && feature.geometry && feature.geometry.getVertices();
                for(var j = 0,len0 = vertices.length; j < len0; j++){
                    var vertice = vertices[j];
                    var point = {
                        x:vertice.x,
                        y:vertice.y
                    };
                    points.push(point);
                }
            }
        }
        var params ={
            sourcePoints : points
        };
        if(this.sourcePrj){
            params.sourcePrj = this.sourcePrj;
        }else{
            params.sourceEpsgCode = this.sourceEpsgCode;
        }
        if(this.targetPrj){
            params.targetPrj = this.targetPrj;
        }else{
            params.targetEpsgCode = this.targetEpsgCode;
        }
        return SuperMap.Util.toJSON(params);
    },

    CLASS_NAME: "SuperMap.REST.CoordTransferParameters"
});