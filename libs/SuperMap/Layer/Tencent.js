/* COPYRIGHT 2012 SUPERMAP
 * 本程序只能在有效的授权许可下使用。
 * 未经许可，不得以任何手段擅自使用或传播。*/

/**
 * @requires SuperMap/Util.js
 * @requires SuperMap/BaseTypes/Bounds.js
 * @requires SuperMap/CanvasLayer.js
 */

/**
 * Class: SuperMap.Layer.Tencent
 * 腾讯地图平面图。
 *     
 *
 * Inherits from:
 *  - <SuperMap.Layer.CanvasLayer>
 */

SuperMap.Layer.Tencent = SuperMap.Class(SuperMap.CanvasLayer, {

    /**
     * APIProperty: name
     * {String} 图层标识名称，默认为：Tencent。
     */
    name: "tencent",
    
    /**
     * APIProperty: url
     * {String} 地图资源地址。默认为：http://p2.map.gtimg.com/hwaptiles/5/3/2/56_37.png
     */
    url: ["http://p0.map.gtimg.com/hwaptiles/${z}/${minX}/${minY}/${x}_${y}.png",
		"http://p1.map.gtimg.com/hwaptiles/${z}/${minX}/${minY}/${x}_${y}.png",
		"http://p2.map.gtimg.com/hwaptiles/${z}/${minX}/${minY}/${x}_${y}.png",
		"http://p3.map.gtimg.com/hwaptiles/${z}/${minX}/${minY}/${x}_${y}.png"],
	/**腾讯首页所用的服务地址
	url: ["http://m3.map.gtimg.com/hwap?z=${z}&x=${x}&y=${y}&styleid=1000&scene=0&version=221",
	"http://m0.map.gtimg.com/hwap?z=${z}&x=${x}&y=${y}&styleid=1000&scene=0&version=221",
	"http://m1.map.gtimg.com/hwap?z=${z}&x=${x}&y=${y}&styleid=1000&scene=0&version=221",
	"http://m2.map.gtimg.com/hwap?z=${z}&x=${x}&y=${y}&styleid=1000&scene=0&version=221"],**/
    
    /**
     * APIProperty: attribution
     * {String} 地图属性信息，可显示到地图上。
     */
    attribution: null, //"©2017 Tencent - GS(2016)930号 - Data© NavInfo",

    /**
     * APIProperty: mapName
     * {String} 地图名称，默认为 tencent。
     */
    mapName: "tencent",
        
    /**
     * Property: type
     * {String} 地图投影。
     */
    type: "web",
	
	zoomOffset: 0,

    /**
     * Constructor: SuperMap.Layer.Tencent
     * 腾讯地图平面图。
     *
     * Parameters:
     * options - {Object}  附加到图层属性上的可选项。
     */
    initialize: function (options) {
        var me = this;
        this.attribution = SuperMap.i18n("tencent_map");
        //超图云只有一个开放的出图地址，投影为墨卡托投影，所以maxExtent和resolutions可以直接设置好
        options = SuperMap.Util.extend({
            maxExtent: new SuperMap.Bounds(
                -2.00375083427892E7,
                -2.00375083427892E7,
                2.00375083427892E7,
                2.00375083427892E7
            ),
            resolutions: [4891.96981025127, 2445.98490512563,
                1222.99245256282, 611.496226281409, 305.748113140704, 152.874056570352,
                76.4370282851761, 38.218514142588, 19.109257071294, 9.55462853564701,
                4.77731426782351, 2.38865713391175, 1.19432856695588, 0.597164283477938]

        }, options);
        SuperMap.CanvasLayer.prototype.initialize.apply(me, [me.name, me.url, null, options]);
        me.units = "meter";
    },
    
    /**
     * APIMethod: destroy
     * 解构Tencent类，释放资源。  
     */
    destroy: function () {
        var me = this;
        SuperMap.CanvasLayer.prototype.destroy.apply(me, arguments);
        me.mapName = null;
        me.name = null;
        me.url = null;
    },

    /**
     * APIMethod: clone
     * 创建当前图层的副本。
     *
     * Parameters:
     * obj - {Object} 
     *
     * Returns:
     * {<SuperMap.Layer.Tencent>}新的图层。
     */
    clone: function (obj) {
        var me = this;
        if (obj == null) {
            obj = new SuperMap.Layer.Tencent(
                me.name, me.url, me.layerName, me.getOptions());
        }
       
        obj = SuperMap.CanvasLayer.prototype.clone.apply(me, [obj]);

        return obj;
    },
    
    /** 
     * Method: getTileUrl
     * 获取瓦片的URL。
     *
     * Parameters:
     * xyz - {Object} 一组键值对，表示瓦片X, Y, Z方向上的索引。
     *
     * Returns
     * {String} 瓦片的 URL。
     */
    getTileUrl: function (xyz) {
        var me = this,
            url = me.url,
			realZ = xyz.z + 5,
			realY =  Math.pow(2, realZ) - xyz.y - 1;
		if (SuperMap.Util.isArray(url)) {
            url = me.selectUrl("" + xyz.x + xyz.y, url);
		}
        return SuperMap.String.format(url, {
			//腾讯地图官网红色版不需要minX,minY两个属性
            minX: Math.floor(xyz.x / 16.0),
            minY: Math.floor(realY / 16.0),
            x: xyz.x,
			y: realY,
			z: realZ -1
        });
    },

    CLASS_NAME: "SuperMap.Layer.Tencent"
});
