/* COPYRIGHT 2012 SUPERMAP
 * 本程序只能在有效的授权许可下使用。
 * 未经许可，不得以任何手段擅自使用或传播。*/

/**
 * @requires SuperMap/Renderer.js
 */

/**
 * SuperMap.Renderer.Graphic
 * A renderer based on the 2D 'canvas' drawing Graphic Object.
 *
 * Inherits:
 *  - <SuperMap.Renderer>
 */
SuperMap.Renderer.Graphic = SuperMap.Class(SuperMap.Renderer, {

    /**
     * Property: hitDetection
     * {Boolean} Allow for hit detection of features.  Default is true.
     */
    hitDetection: false,

    /**
     * Property: hitOverflow
     * {Number} The method for converting graphic identifiers to color values
     *     supports 16777215 sequential values.  Two graphics cannot be
     *     predictably detected if their identifiers differ by more than this
     *     value.  The hitOverflow allows for bigger numbers (but the
     *     difference in values is still limited).
     */
    hitOverflow: 0,

    /**
     * Property: canvas
     * {Canvas} The canvas context object.
     */
    canvas: null,

    /**
     * Property: graphis
     * {Object} Internal object of graphic/style pairs for use in redrawing the layer.
     */
    graphics: null,

    /**
     * Property: pendingRedraw
     * {Boolean} The renderer needs a redraw call to render graphics added while
     *     the renderer was locked.
     */
    pendingRedraw: false,

    /**
     * Property: cachedSymbolBounds
     * {Object} Internal cache of calculated symbol extents.
     */
    cachedSymbolBounds: {},

    /**
     * Property: londingimgs
     * {Object} 处于下载中的图片
     */
    londingimgs:{},

    /**
     * Property: useCanvasEvent
     * {Boolean} 是否使用Canvas来进行要素的选择，默认为false；
     *           如果用户使用此选项graphicLayer的渲染速度会大幅度提升，但是用户点击某一要素进行选择时,
     *           我们在误差允许的范围内进行了判断，对于某些特殊图形，为了更精确的选择，用户在事件点击后需要对范围的要素进行进一步的判断。
     */
    useCanvasEvent: false,

    /**
     * Property: graphicsArr
     * {Array} 要绘制在Canvas上的要素集合
     */
    graphicsArr: null,

    /**
     * Constructor: SuperMap.Renderer.Canvas
     *
     * Parameters:
     * containerID - {<String>}
     * options - {Object} Optional properties to be set on the renderer.
     */
    initialize: function(containerID, options,layer) {
        SuperMap.Renderer.prototype.initialize.apply(this, arguments);
        this.root = document.createElement("canvas");
        this.container.appendChild(this.root);
        this.canvas = this.root.getContext("2d");
        this.layer = layer;
        this.graphics = {};
        this.graphicsArr = [];
        if (options && options.hitDetection) {
            this.hitDetection = options.hitDetection;
            if(!!options.useCanvasEvent) {
                this.useCanvasEvent = options.useCanvasEvent;
            }
            if(this.useCanvasEvent) {
                this.hitCanvas = document.createElement("canvas");
                this.hitContext = this.hitCanvas.getContext("2d");
            }
        }
    },

    /**
     * Method: setExtent
     * Set the visible part of the layer.
     *
     * Parameters:
     * extent - {<SuperMap.Bounds>}
     * resolutionChanged - {Boolean}
     *
     * Returns:
     * {Boolean} true to notify the layer that the new extent does not exceed
     *     the coordinate range, and the graphics will not need to be redrawn.
     *     False otherwise.
     */
    setExtent: function(extent, resolutionChanged) {
        SuperMap.Renderer.prototype.setExtent.apply(this, arguments);
        // always redraw graphics
        return false;
    },

    /**
     * Method: eraseGeometry
     * Erase a geometry from the renderer. Because the Canvas renderer has
     *     'memory' of the graphics that it has drawn, we have to remove the
     *     graphic so it doesn't redraw.
     *
     * Parameters:
     * geometry - {<SuperMap.Geometry>}
     * graphicId - {String}
     */
    eraseGeometry: function(geometry, graphicId) {
        this.eraseGraphics(this.graphics[graphicId][0]);
    },

    /**
     * APIMethod: supported
     *
     * Returns:
     * {Boolean} Whether or not the browser supports the renderer class
     */
    supported: function() {
        var canvas = document.createElement("canvas");
        return !!canvas.getContext;
    },

    /**
     * Method: setSize
     * Sets the size of the drawing surface.
     *
     * Once the size is updated, redraw the canvas.
     *
     * Parameters:
     * size - {<SuperMap.Size>}
     */
    setSize: function(size) {
        this.size = size.clone();
        var root = this.root;
        root.style.width = size.w + "px";
        root.style.height = size.h + "px";
        root.width = size.w;
        root.height = size.h;
        this.resolution = null;
        if (this.hitDetection && this.useCanvasEvent) {
            var hitCanvas = this.hitCanvas;
            hitCanvas.style.width = size.w + "px";
            hitCanvas.style.height = size.h + "px";
            hitCanvas.width = size.w;
            hitCanvas.height = size.h;
        }
    },

    /**
     * Method: drawGraphic
     * Draw the graphic. Stores the graphic in the graphics list,
     * then redraws the layer.
     *
     * Parameters:
     * graphic - {<SuperMap.Graphic>}
     * style - {<Object>}
     *
     * Returns:
     * {Boolean} The graphic has been drawn completely.  If the graphic has no
     *     geometry, undefined will be returned.  If the graphic  is not rendered
     *     for other reasons, false will be returned.
     */
    drawGraphic: function(graphic, option) {
        var rendered;
        if(!option.isNewAdd && option.index === 0) {
            this.graphicsArr = [];
            this.graphics = {};
        }
        if (graphic.geometry) {
            // if(option && option.isNewAdd) {
            //
            // }
            //style = this.applyDefaultSymbolizer(style || graphic.style);
            // don't render if display none or graphic outside extent
            var bounds = graphic.geometry.getBounds();
            rendered = !!bounds &&
                bounds.intersectsBounds(this.extent);
            if (rendered) {
                // keep track of what we have rendered for redraw
                if(this.useCanvasEvent) {
                    this.graphics[graphic.id] = graphic;
                } else {
                    this.graphicsArr.push(graphic);
                }
            }
            // else {
            //     // remove from graphics tracked for redraw
            //     delete(this.graphics[graphic.id]);
            //     this.eraseGraphicsArr(graphic.id);
            // }
            this.pendingRedraw = true;
        }
        if (this.pendingRedraw && !this.locked) {
            this.redraw();
            this.pendingRedraw = false;
        }
        return rendered;
    },

    /**
     * Method: drawGeometry
     * Used when looping (in redraw) over the graphics; draws
     * the canvas.
     *
     * Parameters:
     * geometry - {<SuperMap.Geometry>}
     * style - {Object}
     */
    drawGeometry: function(geometry, style, graphicId) {
        if(SuperMap.Geometry.Point && (geometry instanceof SuperMap.Geometry.Point)){
            this.drawPoint(geometry, style, graphicId);
        }
    },


    /**
     * Method: graphicIdToHex
     * Convert a graphic ID string into an RGB hex string.
     *
     * Parameters:
     * graphicId - {String} Graphic id
     *
     * Returns:
     * {String} RGB hex string.
     */
    graphicIdToHex: function(graphicId) {
        var id = Number(graphicId.split("_").pop()) + 1; // zero for no graphic
        if (id >= 16777216) {
            this.hitOverflow = id - 16777215;
            id = id % 16777216 + 1;
        }
        var hex = "000000" + id.toString(16);
        var len = hex.length;
        hex = "#" + hex.substring(len-6, len);
        return hex;
    },

    /**
     * Method: setHitContextStyle
     * Prepare the hit canvas for drawing by setting various global settings.
     *
     * Parameters:
     * type - {String} one of 'stroke', 'fill', or 'reset'
     * graphicId - {String} The graphic id.
     * symbolizer - {<SuperMap.Symbolizer>} The symbolizer.
     */
    setHitContextStyle: function(type, graphicId, symbolizer) {
        var hex = this.graphicIdToHex(graphicId);
        if (type === "fill") {
            this.hitContext.globalAlpha = 1.0;
            this.hitContext.fillStyle = hex;
            this.hitContext.strokeStyle = hex;
        }
    },

    /**
     * Method: drawPoint
     * This method is only called by the renderer itself.
     *
     * Parameters:
     * geometry - {<SuperMap.Geometry>}
     * style    - {Object}
     * graphicId - {String}
     */
    drawPoint: function(geometry, style, graphicId) {
        style = style || this.layer.style;
        if(style.image){
            var pt = this.getLocalXY(geometry);
            var p0 = pt[0] - style.image.anchor[0]; //偏移到图片中心点
            var p1 = pt[1] - style.image.anchor[1];
            var img = style.image.img || style.image.canvas;
            if(style.graphicHeight && style.graphicWidth){
              this.canvas.drawImage(img,p0,p1,style.graphicHeight,style.graphicWidth);
            }else{
              this.canvas.drawImage(img,p0,p1);
            }
            if(this.hitDetection && this.useCanvasEvent){
                // 离屏canvas 绘制Graphic元素，以记录其ID，事件选择元素
                this.setHitContextStyle("fill",graphicId);
                style.image.drawHitDetectionCanvas(this.hitContext, p0, p1);
            }
        }
    },
    /**
     * Method: getLocalXY
     * transform geographic xy into pixel xy
     *
     * Parameters:
     * point - {<SuperMap.Geometry.Point>}
     */
    getLocalXY: function(point) {
        var resolution = this.getResolution();
        var extent = this.extent;
        var x = (point.x / resolution + (-extent.left / resolution));
        var y = ((extent.top / resolution) - point.y / resolution);
        return [x, y];
    },

    /**
     * Method: clear
     * Clear all vectors from the renderer.
     */
    clear: function() {
        var height = this.root.height;
        var width = this.root.width;
        this.canvas.clearRect(0, 0, width, height);
        this.graphics = {};
        this.graphicsArr.length = 0;
        if (this.hitDetection) {
            if(this.useCanvasEvent) {
                this.hitContext.clearRect(0, 0, width, height);
            }
        }
    },

    /**
     * Method: getGraphicIdFromEvent
     * 返回通过事件获取的要素。
     *
     * Parameters:
     * evt - {<SuperMap.Event>}
     *
     * Returns:
     * {<SuperMap.Graphic} graphic 或者 null.  直接返回要素，以避免从图层上再次查询此graphic。.
     */
    getGraphicIdFromEvent: function(evt) {
        var myGraphic = null, pt, r;
        if (this.hitDetection) {
            // this dragging check should go in the graphic handler
            if (this.map && !this.map.dragging) {
                var xy = evt.xy;
                var tarX = xy.x | 0;
                var tarY = xy.y | 0;
                //对事件选择的处理方式不同，分别进行判断
                if(this.useCanvasEvent) {
                    var data = this.hitContext.getImageData(tarX, tarY, 1, 1).data;
                    if (data[3] === 255) { // antialiased
                        var id = data[2] + (256 * (data[1] + (256 * data[0])));
                        if (id) {
                            var graphicInfo = this.graphics["SuperMap.Graphic_" + (id - 1 + this.hitOverflow)];
                            myGraphic = graphicInfo;
                            //icL-834 解决办法 导致原因：引擎渲染边缘改变原有的RGB值 导致反算ID不正确 change by yuzy
                            if(myGraphic && myGraphic.geometry) {
                                var size = myGraphic.style && myGraphic.style.image.size || (this.layer.style && this.layer.style.image.size);
                                var pixel = this.map.getPixelFromLonLat(new SuperMap.LonLat(myGraphic.geometry.x, myGraphic.geometry.y));
                                if(Math.abs(pixel.x - tarX) >= size[0]/2 ){
                                    myGraphic = null;
                                } else if(Math.abs(pixel.y - tarY) >= size[0]/2){
                                    myGraphic = null;
                                }
                            }
                        }
                    }
                } else {
                    var len = this.graphicsArr.length - 1, graphic = null;
                    if(len > 0) {
                        var top,bottom,left,right;
                        var style = this.graphicsArr[0].style || this.layer.style;
                        var styleImage = style && style.image;
                        var offsetX = styleImage.anchor && styleImage.anchor[0] || 0;
                        var offsetY = styleImage.anchor && styleImage.anchor[1] || 0;
                        if(styleImage.img || styleImage.size)
                        for (var i = 0; i <= len; i ++) {
                            graphic = this.graphicsArr[i];
                            pt = this.getLocalXY(graphic.geometry);
                            if(styleImage.img){
                              var w = style.graphicWidth || (styleImage.size && styleImage.size.width) || (styleImage.img && styleImage.img.width);
                              var h = style.graphicHeight || (styleImage.size && styleImage.size.height) || (styleImage.img && styleImage.img.height);
                              top = pt[1] - offsetY;
                              bottom =pt[1] - offsetY + h;
                              left = pt[0] - offsetX;
                              right = pt[0] - offsetX + w;
                            }else{
                              var r = styleImage.radius;
                              top = pt[1] - r;
                              bottom = pt[1] + r;
                              left = pt[0] - r;
                              right = pt[0] + r;
                            }
                            if (tarX > left && tarX < right && tarY > top && tarY < bottom) {
                                myGraphic = graphic;
                                break;
                            }
                        }
                    }
                }
            }
        }
        return myGraphic;
    },

    /**
     * Method: eraseGraphics
     * This is called by the layer to erase graphics; removes the graphic from
     *     the list, then redraws the layer.
     *
     * Parameters:
     * graphics - {Array(<SuperMap.Graphic>)}
     */
    eraseGraphics: function(graphics) {
        if(!(SuperMap.Util.isArray(graphics))) {
            graphics = [graphics];
        }

        for(var i=0, len = graphics.length; i<len; ++i) {
            if(this.useCanvasEvent) {
                delete this.graphics[graphics[i].id];
            } else {
                this.eraseGraphicsArr(graphics[i].id);
            }
        }
        this.redraw();
    },

    /**
     * Method: eraseGraphicsArr
     * 清除保存在graphicsArr中id为给定ID的要素
     *
     * Parameters:
     * ID - {String}
     */
    eraseGraphicsArr: function(ID) {
        var len = this.graphicsAttr.length - 1;
        for(var i = len; i >=0; i ++) {
            if(this.graphicsArr[i].id === ID) {
                this.graphicsArr.splice(i, 1);
                break;
            }
        }
    },

    /**
     * Method: redraw
     * The real 'meat' of the function: any time things have changed,
     *     redraw() can be called to loop over all the data and (you guessed
     *     it) redraw it.  Unlike Elements-based Renderers, we can't interact
     *     with things once they're drawn, to remove them, for example, so
     *     instead we have to just clear everything and draw from scratch.
     */
    redraw: function() {
        if (!this.locked) {
            var height = this.root.height;
            var width = this.root.width;
            var graphic;
            this.canvas.clearRect(0, 0, width, height);
            if (this.hitDetection && this.useCanvasEvent) {
                this.hitContext.setTransform(1, 0, 0, 1, 0, 0);
                this.hitContext.clearRect(0, 0, width, height);
            }
            if(this.useCanvasEvent) {
                for (var id in this.graphics) {
                    if (!this.graphics.hasOwnProperty(id)) { continue; }
                    graphic = this.graphics[id];
                    this.drawGeometry(graphic.geometry, graphic.style, graphic.id);
                }
            } else {
                var len = this.graphicsArr.length - 1;
                for (var i = len; i >= 0; i--) {
                    graphic = this.graphicsArr[i];
                    this.drawGeometry(graphic.geometry, graphic.style, graphic.id);
                }
            }
        }
    },

    CLASS_NAME: "SuperMap.Renderer.Graphic"
});
