/* COPYRIGHT 2012 SUPERMAP
 * 本程序只能在有效的授权许可下使用。
 * 未经许可，不得以任何手段擅自使用或传播。*/

/**
 * @requires SuperMap/Service/ServiceEventArgs.js
 * @requires SuperMap/REST/CoordTransfer/CoordTransferResult.js
 */

/**
 * Class: SuperMap.REST.CoordTransferEventArgs
 * 坐标转换服务事件数据类。
 * 该类包含了从服务端传回的坐标转换结果数据。
 *
 * Inherits from:
 *  - <SuperMap.ServiceEventArgs>
 */
SuperMap.REST.CoordTransferEventArgs = SuperMap.Class(SuperMap.ServiceEventArgs, {
    /**
     * APIProperty: result
     * {<SuperMap.REST.CoordTransferResult>} 服务端返回的坐标转换结果数据。
     */
    result: null,

    /**
     * Constructor: SuperMap.REST.CoordTransferEventArgs
     * 坐标转换服务事件类构造函数。
     *
     * Parameters:
     * result - {<SuperMap.REST.EditFeaturesResult>} 服务端返回的坐标转换结果数据。
     * originResult - {Object} 服务端返回的用 JSON 对象表示的坐标转换结果数据。
     */
    initialize: function(result, originResult) {
        SuperMap.ServiceEventArgs.prototype.initialize.apply(this, [originResult]);
        this.result = result;
    },

    /**
     * APIMethod: destroy
     * 释放资源，将引用资源的属性置空。
     */
    destroy: function() {
        SuperMap.ServiceEventArgs.prototype.destroy.apply(this);
        if (this.result) {
            this.result.destroy();
            this.result = undefined;
        }
    },

    CLASS_NAME: "SuperMap.REST.CoordTransferEventArgs"
});