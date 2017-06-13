/* COPYRIGHT 2012 SUPERMAP
 * 本程序只能在有效的授权许可下使用。
 * 未经许可，不得以任何手段擅自使用或传播。*/

SuperMap.Animal = SuperMap.Class({
    /**
     * Property: count
     * {Number} 缩放动画执行的次数
     */
    count: 15,

    duration:250,

    /**
     * Property: ratio
     * {Number} 缩放比例，根据此值判断是放大还是缩小。
     */
    ratio: 0,

    /**
     * Property: lefttop
     * {<SuperMap.Pixel>} canvas 的左上角
     */
    lefttop: null,

    /**
     * Property: backupCanvas
     * {Canvas} 备份层
     */
    backupCanvas: null,

    /**
     * Property: backupCtx
     * {Canvas.getContext('2d')}  备份层绘图板
     */
    backupCtx: null,

    /**
     * Property: aniCanvas
     * {Canvas}  动画层，通过动态绘制该层，实现动画效果
     */
    aniCanvas: null,

    /**
     * Property: aniCtx
     * {Canvas.getContext('2d')} 动画层的绘图板
     */
    aniCtx: null,

    /**
     * Property: width
     * {Number} 画图区域的宽度
     */
    width: 0,

    /**
     * Property: height
     * {Number} 画图区域的高度
     */
    height: 0,

    /**
     * Property: callback, 
     * {Function} 动画执行完毕调用的回调函数。
     */
    callback: null,

    /**
     * Property: timeoutID, 
     * {Number}
     */
    timeoutID: null,
    /**
     * Property: layer
     * {<SuperMap.CanvasLayer> | <SuperMap.Layer.CanvasLayer>} 调用该类的layer引用。
     */
    layer: null,

    /**
     * Property: baseCanvas
     * {Canvas} 需要进行缩放动画的Canvas元素。
     */
    baseCanvas: null,

    /**
     * Property: baseCanvasCtx
     * Canvas.getContext('2d'), 需要进行缩放动画的canvas绘图板。
     */
    baseCanvasCtx: null,

    /**
     * Property: aniFinish
     * {bool} 当前动画是否执行完毕。
     */
    aniFinish: true,

    /**
     * Property: step
     * {Number} 当前执行的缩放此事。最大值为this.ratio
     */
    step: 0,

    /**
     * options: 必选参数
     * layer: 调用该类的图层引用。
     */
    initialize: function(layer) {
        this.layer = layer;
        this.backupCanvas = document.createElement('canvas');
        this.backupCanvas.style.display = 'none';
        this.backupCtx = this.backupCanvas.getContext('2d');
        if (this.layer.useHighSpeed && SuperMap.Browser.device === 'pc') {
            this.aniCanvas = document.createElement('canvas');
            this.aniCtx = this.aniCanvas.getContext('2d');
            this.aniCanvas.style.position = "absolute";

        }
        window.requestAnimation_frame_ = window.requestAnimation_frame_ || 
            window.requestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            function(callback) {
                return setTimeout(callback, 1000 / 60); };

        window.cancelAnimation_frame_ = window.cancelAnimation_frame_ || 
            window.cancelAnimationFrame ||
            window.webkitCancelAnimationFrame ||
            window.mozCancelAnimationFrame ||
            window.oCancelAnimationFrame ||
            function(id) {
                window.clearTimeout(id);
            };

        //bezierEase，返回一个渐变函数，可传入0到1的值去获取对应的位置上的值。
        this.animalEase = SuperMap.Animal.Functions.bezierEase(0, 0, 0.25, 1);
    },

    /**
     * params: canvas,lefttop, callback
     *
     * canvas: 即将进行缩放动画的canvas元素。
     * lefttop: 绘图板相对应图层承载区域的左上角。
     * callback: 动画完成后执行的用户方法。
     */
    begin: function(canvas, layerAniCanvas, lefttop, ratio, duration, callback) {
        this.startTime = new Date().getTime();
        this.duration = duration;
        this.ratio = ratio;
        this.leftTop = lefttop;
        this.baseCanvas = canvas;
        this.baseCanvasCtx = canvas.getContext('2d');
        this.width = canvas.width;
        this.height = canvas.height;

        this.backupCanvas.width = this.width;
        this.backupCanvas.height = this.height;

        try {
            this.backupCtx.drawImage(layerAniCanvas, 0, 0);
        } catch (e) {
            return;
        }
        this.layer.resetCanvas();
        this.baseCanvasCtx.drawImage(this.backupCanvas, this.leftTop.x, this.leftTop.y, this.width * this.ratio, this.height * this.ratio);
        if (SuperMap.Browser.device === 'pc') {
            this.triggerAnimal(callback);
        }
    },

    //实现缩放动画
    triggerAnimal: function(callback) {
        if (!this.aniFinish) {
            return;
        }
        this.layer.div.appendChild(this.aniCanvas);
        this.aniCanvas.width = this.width;
        this.aniCanvas.height = this.height;
        this.aniCanvas.style.left = this.baseCanvas.style.left;
        this.aniCanvas.style.top = this.baseCanvas.style.top;
        this.aniFinish = false;
        this.step = 0;
        this.baseCanvas.style.display = "none";
        this._execZoomTo = SuperMap.Function.bind(this.execZoomTo, this, callback);
        window.requestAnimation_frame_(this._execZoomTo);
    },

    //动画结束后调用此函数，清除动画层的图像。
    animalEnd: function() {
        this.aniFinish = true;
        this.aniCtx.clearRect(0, 0, this.width, this.height);
        this.aniCtx.drawImage(this.baseCanvas, 0, 0, this.width, this.height);
        this.layer.div.removeChild(this.aniCanvas);
        this.baseCanvas.style.display = "";
    },

    //执行缩放动画
    execZoomTo: function(callback) {
        //动画信息初始化

        var me = this;
        var now = new Date().getTime();
        var elapsed = now - this.startTime;
        this.aniFinish = false;
        if (elapsed > this.duration) {
            this.animalEnd();
            callback && callback();
        } else {
            var bounds = this.getBoundsByElapsed(elapsed);
            me.aniCtx.clearRect(0, 0, this.width, this.height);
            me.aniCtx.drawImage(me.backupCanvas, bounds.x, bounds.y, bounds.width, bounds.height);
            window.requestAnimation_frame_(this._execZoomTo);
        }
    },

    getBoundsByElapsed: function(elapsed) {
        var x = this.leftTop.x,
            y = this.leftTop.y;
        var width = this.width,
            height = this.height;
        var ratio = this.ratio;
        return {
            x: this.getTransitionValue(elapsed, 0, x),
            y: this.getTransitionValue(elapsed, 0, y),
            width: this.getTransitionValue(elapsed, width, width * ratio),
            height: this.getTransitionValue(elapsed, height, height * ratio)
        };
    },

    getTransitionValue: function(elapsed, from, to) {
        var ratio = this.animalEase(elapsed / this.duration);
        return (to - from) * ratio + from;
    },

    destroy: function() {
        var me = this;
        me.leftTop = null;
        me.backupCanvas = null;
        me.backupCtx = null;
        me.AniCanvas = null;
        me.AniCtx = null;
        me.callback = null;
        me.baseCanvas = null;
        me.baseCanvasCtx = null;
        me.layer = null;
        me.timeoutID && window.clearTimeout(me.timeoutID);
        me.timeoutID = null;
    }
});

SuperMap.Animal.Functions = {
    /**
     * https://github.com/gre/bezier-easing
     * BezierEasing - use bezier curve for transition easing function
     * by Gaëtan Renaudeau 2014 - 2015 – MIT License
     */

    bezierEase: function(mX1, mY1, mX2, mY2) {
        var NEWTON_ITERATIONS = 4;
        var NEWTON_MIN_SLOPE = 0.001;
        var SUBDIVISION_PRECISION = 0.0000001;
        var SUBDIVISION_MAX_ITERATIONS = 10;

        var kSplineTableSize = 11;
        var kSampleStepSize = 1.0 / (kSplineTableSize - 1.0);

        var float32ArraySupported = typeof Float32Array === 'function';

        function A(aA1, aA2) {
            return 1.0 - 3.0 * aA2 + 3.0 * aA1;
        }

        function B(aA1, aA2) {
            return 3.0 * aA2 - 6.0 * aA1;
        }

        function C(aA1) {
            return 3.0 * aA1;
        }

        // Returns x(t) given t, x1, and x2, or y(t) given t, y1, and y2.
        function calcBezier(aT, aA1, aA2) {
            return ((A(aA1, aA2) * aT + B(aA1, aA2)) * aT + C(aA1)) * aT;
        }

        // Returns dx/dt given t, x1, and x2, or dy/dt given t, y1, and y2.
        function getSlope(aT, aA1, aA2) {
            return 3.0 * A(aA1, aA2) * aT * aT + 2.0 * B(aA1, aA2) * aT + C(aA1);
        }

        function binarySubdivide(aX, aA, aB, mX1, mX2) {
            var currentX, currentT, i = 0;
            do {
                currentT = aA + (aB - aA) / 2.0;
                currentX = calcBezier(currentT, mX1, mX2) - aX;
                if (currentX > 0.0) {
                    aB = currentT;
                } else {
                    aA = currentT;
                }
            } while (Math.abs(currentX) > SUBDIVISION_PRECISION && ++i < SUBDIVISION_MAX_ITERATIONS);
            return currentT;
        }

        function newtonRaphsonIterate(aX, aGuessT, mX1, mX2) {
            for (var i = 0; i < NEWTON_ITERATIONS; ++i) {
                var currentSlope = getSlope(aGuessT, mX1, mX2);
                if (currentSlope === 0.0) {
                    return aGuessT;
                }
                var currentX = calcBezier(aGuessT, mX1, mX2) - aX;
                aGuessT -= currentX / currentSlope;
            }
            return aGuessT;
        }

        if (!(0 <= mX1 && mX1 <= 1 && 0 <= mX2 && mX2 <= 1)) {
            throw new Error('bezier x values must be in [0, 1] range');
        }

        // Precompute samples table
        var sampleValues = float32ArraySupported ? new Float32Array(kSplineTableSize) : new Array(kSplineTableSize);
        if (mX1 !== mY1 || mX2 !== mY2) {
            for (var i = 0; i < kSplineTableSize; ++i) {
                sampleValues[i] = calcBezier(i * kSampleStepSize, mX1, mX2);
            }
        }

        function getTForX(aX) {
            var intervalStart = 0.0;
            var currentSample = 1;
            var lastSample = kSplineTableSize - 1;

            for (; currentSample !== lastSample && sampleValues[currentSample] <= aX; ++currentSample) {
                intervalStart += kSampleStepSize;
            }
            --currentSample;

            // Interpolate to provide an initial guess for t
            var dist = (aX - sampleValues[currentSample]) / (sampleValues[currentSample + 1] - sampleValues[currentSample]);
            var guessForT = intervalStart + dist * kSampleStepSize;

            var initialSlope = getSlope(guessForT, mX1, mX2);
            if (initialSlope >= NEWTON_MIN_SLOPE) {
                return newtonRaphsonIterate(aX, guessForT, mX1, mX2);
            } else if (initialSlope === 0.0) {
                return guessForT;
            } else {
                return binarySubdivide(aX, intervalStart, intervalStart + kSampleStepSize, mX1, mX2);
            }
        }

        return function BezierEasing(x) {
            if (mX1 === mY1 && mX2 === mY2) {
                return x; // linear
            }
            // Because JavaScript number are imprecise, we should guarantee the extremes are right.
            if (x === 0) {
                return 0;
            }
            if (x === 1) {
                return 1;
            }
            return calcBezier(getTForX(x), mY1, mY2);
        };
    }
};
