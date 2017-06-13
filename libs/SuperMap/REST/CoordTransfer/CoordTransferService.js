/* COPYRIGHT 2012 SUPERMAP
 * 本程序只能在有效的授权许可下使用。
 * 未经许可，不得以任何手段擅自使用或传播。*/

/**
 * @requires SuperMap/Events.js
 * @requires SuperMap/REST/Service/ServiceBase.js
 * @requires SuperMap/REST/Service/ServiceFailedEventArgs.js
 * @requires SuperMap/REST/Service/ServiceException.js
 * @requires SuperMap/Util.js
 * @requires SuperMap/REST/CoordTransfer/CoordTransferResult.js
 * @requires SuperMap/REST/CoordTransfer/CoordTransferParameters.js
 * @requires SuperMap/REST/CoordTransfer/CoordTransferEventArgs.js
 */

/**
 * Class: SuperMap.REST.CoordTransferService
 * 坐标转换服务类。
 * 该类负责将要素中的几何对象传到服务端，并获取服务端返回的转换结果，再把转换结果生成要素。
 *
 * Inherits from:
 *  - <SuperMap.ServiceBase>
 */
SuperMap.REST.CoordTransferService = SuperMap.Class(SuperMap.ServiceBase, {
    /**
     * Constant: EVENT_TYPES
     * {Array(String)}
     * 此类支持的事件类型。
     * - *processCompleted* 服务端返回坐标转换结果触发该事件。
     * - *processFailed* 服务端返回坐标转换结果失败触发该事件。
     */
    EVENT_TYPES: ["processCompleted", "processFailed"],

    /**
     * APIProperty: events
     * {<SuperMap.Events>} 在 CoordTransferService 类中处理所有事件的对象，支持两种事件 processCompleted 、processFailed ，服务端成功返回坐标转换结果时触发 processCompleted  事件，服务端返回坐标转换结果失败触发 processFailed 事件。
     * 例如：
     * (start code)
     * var myCoordTransferService = new SuperMap.REST.CoordTransferService(url);
     * myCoordTransferService.events.on({
     *     "processCompleted": coordTransferCompleted,
     *     "processFailed": coordTransferFailed
     * });
     * function coordTransferCompleted(coordTransferEventArgs){//todo};
     * function coordTransferFailed(coordTransferEventArgs){//todo};
     * (end)
     */
    events: null,

    /**
     * APIProperty: eventListeners
     * {Object} 监听器对象，在构造函数中设置此参数（可选），对 CoordTransferService 支持的两个事件 processCompleted 、processFailed 进行监听，
     * 相当于调用 SuperMap.Events.on(eventListeners)。
     */
    eventListeners: null,

    /**
     * Property: lastResult
     * {<SuperMap.REST.CoordTransferResult>} 服务端返回的坐标转换结果数据。
     */
    lastResult: null,

    /**
     * Constructor: SuperMap.REST.CoordTransferService
     * 坐标转换服务类构造函数。
     *
     * 例如：
     * (start code)
     * var myMeasuerService = new SuperMap.REST.CoordTransferService(url, {eventListeners:{"processCompleted": transferCompleted}});
     * (end)
     *
     * Parameters:
     * url - {String} 服务访问的地址。如：http://localhost:8090/iserver/services/data-World/rest/data/coordtransfer 。
     * options - {Object} 参数。
     *
     * Allowed options properties:
     * eventListeners - {Object} 需要被注册的监听器对象。
     */
    initialize: function(url, options) {
        SuperMap.ServiceBase.prototype.initialize.apply(this, [url]);
        if (options) {
            SuperMap.Util.extend(this, options);
        }
        var me = this;
        me.events = new SuperMap.Events(
            me, null, me.EVENT_TYPES, true
        );
        if(me.eventListeners instanceof Object) {
            me.events.on(me.eventListeners);
        }
    },

    /**
     * APIMethod: destroy
     * 释放资源，将引用的资源属性置空。
     */
    destroy: function() {
        SuperMap.ServiceBase.prototype.destroy.apply(this, arguments);
        var me = this;
        me.EVENT_TYPES = null;
        if (me.events) {
            me.events.destroy();
            me.events = null;
        }
        if (me.eventListeners) {
            me.eventListeners = null;
        }
        if (me.lastResult) {
            me.lastResult.destroy();
            me.lastResult = null;
        }
    },

    /**
     * APIMethod: processAsync
     * 负责将客户端的坐标转换参数传递到服务端。
     *
     * Parameters:
     * params - {<SuperMap.REST.MeasureParameters>} 坐标转换参数。
     * credential - {<SuperMap.Credential>} 可选参数，权限信息
     */
    processAsync: function(params,credential) {
        if(!params){
            return;
        }
        if (!params.features) {
            return;
        }
        var data = params.toJSON();
        var features = params.features;
        var newFeatures = [];
        for(var i = 0, len = features.length; i < len; i++){
            var feature = features[i].clone();
            newFeatures.push(feature);
        }
        var newParams={};
        if (this.isInTheSameDomain) {
            this.url += ".json?";
            newParams.returnContent = true;
        } else {
            this.url +=  ".jsonp?returnContent=true";
        }
        this.request({
            method: "POST",
            params:newParams,
            data:data,
            scope: this,
            credential:credential,
            success: this.coordTransferComplete(newFeatures),
            failure: this.coordTransferError
        });

    },

    /**
     * Method: coordTransferComplete
     * 坐标转换完成，执行此方法。
     *
     * Parameters:
     * result - {Object} 服务器返回的结果对象。
     */
    coordTransferComplete: function(features){
        return function(result) {
            var me = this,
                event = null,
                measureResult = null;
            result = SuperMap.Util.transformResult(result);
            measureResult = SuperMap.REST.CoordTransferResult.fromJson(result,features);
            me.lastResult = measureResult;
            event = new SuperMap.REST.CoordTransferEventArgs(measureResult, result);
            me.events.triggerEvent("processCompleted", event);
        };
    },

    /**
     * Method: coordTransferError
     * 坐标转换失败，执行此方法。
     *
     * Parameters:
     * result -  {Object} 服务器返回的结果对象。
     */
    coordTransferError: function(result) {
        var me = this,
            error = null,
            serviceException = null,
            event = null;
        result = SuperMap.Util.transformResult(result);
        error = result.error;
        if (!error) {
            return;
        }
        serviceException = SuperMap.ServiceException.fromJson(error);
        event = new SuperMap.ServiceFailedEventArgs(serviceException, result);
        me.events.triggerEvent("processFailed", event);
    }
});