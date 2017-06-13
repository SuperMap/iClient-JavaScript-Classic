/**
 * @requires SuperMap/Layer/XYZ.js
 */

/** 
 * Class: SuperMap.Layer.BingMap
 * 国外版Bing图层，直接访问的是Bing地图的rest服务。
 * See http://msdn.microsoft.com/en-us/library/ff701713.aspx for more
 * information. Note: Terms of Service compliant use requires the map to be
 * configured with an <SuperMap.Control.Attribution> control and the
 * attribution placed on or near the map.
 * 
 * Inherits from:
 *  - <SuperMap.Layer.XYZ>
 */
SuperMap.Layer.BingMap = SuperMap.Class(SuperMap.Layer.XYZ, {

    /**
     * Property: key
     * {String} API key for Bing maps, get your own key 
     *     at http://bingmapsportal.com/ .
     */
    key: null,

    /**
     * Property: serverResolutions
     * {Array} the resolutions provided by the Bing servers.
     */
    serverResolutions: [
        156543.03390625, 78271.516953125, 39135.7584765625,
        19567.87923828125, 9783.939619140625, 4891.9698095703125,
        2445.9849047851562, 1222.9924523925781, 611.4962261962891,
        305.74811309814453, 152.87405654907226, 76.43702827453613,
        38.218514137268066, 19.109257068634033, 9.554628534317017,
        4.777314267158508, 2.388657133579254, 1.194328566789627,
        0.5971642833948135, 0.29858214169740677, 0.14929107084870338,
        0.07464553542435169, 0.03732276771218, 0.01866138385609
    ],
    
    /**
     * Property: attributionTemplate
     * {String}
     */
    attributionTemplate: '<span class="olBingAttribution ${type}">' +
         '<div><a target="_blank" href="http://www.bing.com/maps/">' +
         '<img src="${logo}" /></a></div>${copyrights}' +
         '<a style="white-space: nowrap" target="_blank" '+
         'href="http://www.microsoft.com/maps/product/terms.html">' +
         'Terms of Use</a></span>',

    /**
     * Property: metadata
     * {Object} Metadata for this layer, as returned by the callback script
     */
    metadata: null,

    /**
     * Property: protocolRegex
     * {RegExp} Regular expression to match and replace http: in bing urls
     */
    protocolRegex: /^http:/i,
    
    /**
     * APIProperty: type
     * {String} The layer identifier.  Any non-birdseye imageryType
     *     from http://msdn.microsoft.com/en-us/library/ff701716.aspx can be
     *     used.  Default is "Road".
     */
    type: "Road",
    
    /**
     * APIProperty: culture
     * {String} The culture identifier.  See http://msdn.microsoft.com/en-us/library/ff701709.aspx
     * for the definition and the possible values.  Default is "en-US".
     */
    culture: "en-US",
    
    /**
     * APIProperty: metadataParams
     * {Object} Optional url parameters for the Get Imagery Metadata request
     * as described here: http://msdn.microsoft.com/en-us/library/ff701716.aspx
     */
    metadataParams: null,

    /** APIProperty: tileOptions
     *  {Object} optional configuration options for <SuperMap.Tile> instances
     *  created by this Layer. Default is
     *
     *  (code)
     *  {crossOriginKeyword: 'anonymous'}
     *  (end)
     */
    tileOptions: null,

    /** APIProperty: protocol
     *  {String} Protocol to use to fetch Imagery Metadata, tiles and bing logo
     *  Can be 'http:' 'https:' or ''
     *
     *  Warning: tiles may not be available under both HTTP and HTTPS protocols.
     *  Microsoft approved use of both HTTP and HTTPS urls for tiles. However
     *  this is undocumented and the Imagery Metadata API always returns HTTP
     *  urls.
     *
     *  Default is '', unless when executed from a file:/// uri, in which case
     *  it is 'http:'.
     */
    protocol: ~window.location.href.indexOf('http') ? '' : 'http:',

    /**
     * Constructor: SuperMap.Layer.BingMap
     * 国外版Bing图层的构造函数
     *
     * Example:
     * (code)
     * var road = new SuperMap.Layer.BingMap({
     *     name: "My Bing Aerial Layer",
     *     type: "Aerial",
     *     key: "my-api-key-here",
     * });
     * (end)
     *
     * Parameters:
     * options - {Object} Configuration properties for the layer.
     *
     * Required configuration properties:
     * key - {String} Bing Maps API key for your application. Get one at
     *     http://bingmapsportal.com/.
     * type - {String} The layer identifier.  Any non-birdseye imageryType
     *     from http://msdn.microsoft.com/en-us/library/ff701716.aspx can be
     *     used.
     *
     * Any other documented layer properties can be provided in the config object.
     */
    initialize: function(options) {
        options = SuperMap.Util.applyDefaults({
            sphericalMercator: true
        }, options);
        var name = options.name || "Bing " + (options.type || this.type);
        
        var newArgs = [name, null, options];
        SuperMap.Layer.XYZ.prototype.initialize.apply(this, newArgs);
        this.tileOptions = SuperMap.Util.extend({
            crossOriginKeyword: 'anonymous'
        }, this.options.tileOptions);
        this.loadMetadata(); 
    },

    /**
     * Method: loadMetadata
     */
    loadMetadata: function() {
        this._callbackId = "_callback_" + this.id.replace(/\./g, "_");
        // link the processMetadata method to the global scope and bind it
        // to this instance
        window[this._callbackId] = SuperMap.Function.bind(
            SuperMap.Layer.BingMap.processMetadata, this
        );
        var params = SuperMap.Util.applyDefaults({
            key: this.key,
            jsonp: this._callbackId,
            include: "ImageryProviders"
        }, this.metadataParams);
        var url = this.protocol + "//dev.virtualearth.net/REST/v1/Imagery/Metadata/" +
            this.type + "?" + SuperMap.Util.getParameterString(params);
        var script = document.createElement("script");
        script.type = "text/javascript";
        script.src = url;
        script.id = this._callbackId;
        document.getElementsByTagName("head")[0].appendChild(script);
    },
    
    /**
     * Method: initLayer
     *
     * Sets layer properties according to the metadata provided by the API
     */
    initLayer: function() {
        var res = this.metadata.resourceSets[0].resources[0];
        var url = res.imageUrl.replace("{quadkey}", "${quadkey}");
        url = url.replace("{culture}", this.culture);
        url = url.replace(this.protocolRegex, this.protocol);
        this.url = [];
        for (var i=0; i<res.imageUrlSubdomains.length; ++i) {
            this.url.push(url.replace("{subdomain}", res.imageUrlSubdomains[i]));
        }
        this.addOptions({
            maxResolution: Math.min(
                this.serverResolutions[res.zoomMin],
                this.maxResolution || Number.POSITIVE_INFINITY
            ),
            numZoomLevels: Math.min(
                res.zoomMax + 1 - res.zoomMin, this.numZoomLevels
            )
        }, true);
        if (!this.isBaseLayer) {
            this.redraw();
        }
        this.updateAttribution();
    },
    
    /**
     * Method: getURL
     *
     * Parameters:
     * bounds - {<SuperMap.Bounds>}
     */
    getURL: function(bounds) {
        if (!this.url) {
            return;
        }
        var xyz = this.getXYZ(bounds), x = xyz.x, y = xyz.y, z = xyz.z;
        var quadDigits = [];
        for (var i = z; i > 0; --i) {
            var digit = '0';
            var mask = 1 << (i - 1);
            if ((x & mask) != 0) {
                digit++;
            }
            if ((y & mask) != 0) {
                digit++;
                digit++;
            }
            quadDigits.push(digit);
        }
        var quadKey = quadDigits.join("");
        var url = this.selectUrl('' + x + y + z, this.url);

        return SuperMap.String.format(url, {'quadkey': quadKey});
    },
    
    /**
     * Method: updateAttribution
     * Updates the attribution according to the requirements outlined in
     * http://gis.638310.n2.nabble.com/Bing-imagery-td5789168.html
     */
    updateAttribution: function() {
        var metadata = this.metadata;
        if (!metadata || !metadata.resourceSets || !this.map || !this.map.center) {
            return ;
        }
        var res = metadata.resourceSets[0].resources[0];
        var extent = this.map.getExtent().transform(
            this.map.getProjectionObject(),
            new SuperMap.Projection("EPSG:4326")
        );
        var providers = res.imageryProviders || [],
            zoom = SuperMap.Util.indexOf(this.serverResolutions,
                                           this.getServerResolution()),
            copyrights = "", provider, i, ii, j, jj, bbox, coverage;
        for (i=0,ii=providers.length; i<ii; ++i) {
            provider = providers[i];
            for (j=0,jj=provider.coverageAreas.length; j<jj; ++j) {
                coverage = provider.coverageAreas[j];
                // axis order provided is Y,X
                bbox = SuperMap.Bounds.fromArray(coverage.bbox, true);
                if (extent.intersectsBounds(bbox) &&
                        zoom <= coverage.zoomMax && zoom >= coverage.zoomMin) {
                    copyrights += provider.attribution + " ";
                }
            }
        }
        var logo = metadata.brandLogoUri.replace(this.protocolRegex, this.protocol);
        this.attribution = SuperMap.String.format(this.attributionTemplate, {
            type: this.type.toLowerCase(),
            logo: logo,
            copyrights: copyrights
        });
        this.map && this.map.events.triggerEvent("changelayer", {
            layer: this,
            property: "attribution"
        });
    },
    
    /**
     * Method: setMap
     */
    setMap: function() {
        SuperMap.Layer.XYZ.prototype.setMap.apply(this, arguments);
        this.map.events.register("moveend", this, this.updateAttribution);
    },
    
    /**
     * APIMethod: clone
     * 
     * Parameters:
     * obj - {Object}
     * 
     * Returns:
     * {<SuperMap.Layer.BingMap>} An exact clone of this <SuperMap.Layer.BingMap>
     */
    clone: function(obj) {
        if (obj == null) {
            obj = new SuperMap.Layer.BingMap(this.options);
        }
        //get all additions from superclasses
        obj = SuperMap.Layer.XYZ.prototype.clone.apply(this, [obj]);
        // copy/set any non-init, non-simple values here
        return obj;
    },
    
    /**
     * Method: destroy
     */
    destroy: function() {
        this.map &&
            this.map.events.unregister("moveend", this, this.updateAttribution);
        SuperMap.Layer.XYZ.prototype.destroy.apply(this, arguments);
    },
    
    CLASS_NAME: "SuperMap.Layer.BingMap"
});

/**
 * Function: SuperMap.Layer.BingMap.processMetadata
 * This function will be bound to an instance, linked to the global scope with
 * an id, and called by the JSONP script returned by the API.
 *
 * Parameters:
 * metadata - {Object} metadata as returned by the API
 */
SuperMap.Layer.BingMap.processMetadata = function(metadata) {
    this.metadata = metadata;
    this.initLayer();
    var script = document.getElementById(this._callbackId);
    script.parentNode.removeChild(script);
    window[this._callbackId] = undefined; // cannot delete from window in IE
    delete this._callbackId;
};
