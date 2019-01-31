import {
    Layer,
    Util,
    Bounds,
    DomUtil,
    latLngBounds as toLatLngBounds
} from 'leaflet';
import Rainbow from '../../../../node_modules/rainbowvis.js/rainbowvis';

export const CanvasHeatMapOverlay = Layer.extend({
    options: {
        opacity: 1,
        interactive: false,
        zIndex: 1,
        className: ''
    },

    initialize: function(nX, nY, data, bounds, rainbow, options) {
        this._nX = nX;
        this._nY = nY;
        this._dataArray = data;
        this._bounds = toLatLngBounds(bounds);
        this._rainbow = rainbow;

        Util.setOptions(this, options);
    },

    onAdd: function() {
        if (!this._canvas) {
            this._initCanvas();

            if (this.options.opacity < 1) {
                this._updateOpacity();
            }
        }

        if (this.options.interactive) {
            DomUtil.addClass(this._canvas, 'leaflet-interactive');
            this.addInteractiveTarget(this._canvas);
        }

        this.getPane().appendChild(this._canvas);
        this._reset();
    },

    onRemove: function() {
        DomUtil.remove(this._canvas);
        if (this.options.interactive) {
            this.removeInteractiveTarget(this._canvas);
        }
    },

    setOpacity: function(opacity) {
        this.options.opacity = opacity;

        if (this._canvas) {
            this._updateOpacity();
        }
        return this;
    },

    setStyle: function(styleOpts) {
        if (styleOpts.opacity) {
            this.setOpacity(styleOpts.opacity);
        }
        return this;
    },

    bringToFront: function() {
        if (this._map) {
            DomUtil.toFront(this._canvas);
        }
        return this;
    },

    bringToBack: function() {
        if (this._map) {
            DomUtil.toBack(this._canvas);
        }
        return this;
    },

    setNX: function(nX) {
        this._nX = nX;

        if (this._map) {
            this._canvas.width = nX;
            this._runDraw();
        }
        return this;
    },

    setNY: function(nY) {
        this._nY = nY;

        if (this._map) {
            this._canvas.height = nY;
            this._runDraw();
        }
        return this;
    },

    setDataArray: function(dataArray) {
        this._dataArray = dataArray;

        if (this._map) {
            this._runDraw();
        }
        return this;
    },

    setBounds: function(bounds) {
        this._bounds = toLatLngBounds(bounds);

        if (this._map) {
            this._reset();
        }
        return this;
    },

    setRainbow: function(rainbow) {
        this._rainbow = rainbow;

        if (this._map) {
            this._runDraw();
        }
        return this;
    },

    getEvents: function() {
        const events = {
            zoom: this._reset,
            viewreset: this._reset
        };

        if (this._zoomAnimated) {
            events.zoomanim = this._animateZoom;
        }

        return events;
    },

    setZIndex: function(value) {
        this.options.zIndex = value;
        this._updateZIndex();
        return this;
    },

    getBounds: function() {
        return this._bounds;
    },

    getElement: function() {
        return this._canvas;
    },

    _initCanvas: function() {
        const canvas = (this._canvas = DomUtil.create(
            'canvas',
            'leaflet-layer ' +
            (this._zoomAnimated ? 'leaflet-zoom-animated' : '') +
            (this.options.className || '')
        ));

        this._ctx = canvas.getContext('2d');

        canvas.width = this._nX;
        canvas.height = this._nY;

        canvas.onselectstart = Util.falseFn;
        canvas.onmousemove = Util.falseFn;

        canvas.onload = Util.bind(this.fire, this, 'load');
        canvas.onerror = Util.bind(this._overlayOnError, this, 'error');

        if (this.options.crossOrigin) {
            canvas.crossOrigin = '';
        }

        if (this.options.zIndex) {
            this._updateZIndex();
        }

        this._runDraw();
    },

    _animateZoom: function(e) {
        const scale = this._map.getZoomScale(e.zoom);
        const offset = this._map._latLngBoundsToNewLayerBounds(
            this._bounds,
            e.zoom,
            e.center
        ).min;

        DomUtil.setTransform(this._canvas, offset, scale);
    },

    _reset: function() {
        const canvas = this._canvas;
        const bounds = new Bounds(
            this._map.latLngToLayerPoint(this._bounds.getNorthWest()),
            this._map.latLngToLayerPoint(this._bounds.getSouthEast())
        );
        const size = bounds.getSize();

        DomUtil.setPosition(canvas, bounds.min);

        canvas.style.width = size.x + 'px';
        canvas.style.height = size.y + 'px';
    },

    _runDraw: function() {
        this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
        this._dataArray.forEach(d => {
            if (this._rainbow instanceof Rainbow) {
                this._ctx.fillStyle = '#' + this._rainbow.colourAt(d.value);
            } else {
                this._ctx.fillStyle = this._rainbow[d.value];
            }
            this._ctx.fillRect(d.x, d.y, 1, 1);
        });
    },

    _updateOpacity: function() {
        DomUtil.setOpacity(this._canvas, this.options.opacity);
    },

    _updateZIndex: function() {
        if (
            this._canvas &&
            this.options.zIndex !== undefined &&
            this.options.zIndex !== null
        ) {
            this._canvas.style.zIndex = this.options.zIndex;
        }
    },

    _overlayOnError: function() {
        this.fire('error');

        const errorUrl = this.options.errorOverlayUrl;
        if (errorUrl && this._url !== errorUrl) {
            this._url = errorUrl;
            this._canvas.src = errorUrl;
        }
    }
});

export const canvasHeatMapOverlay = function(nX,
                                             nY,
                                             data,
                                             bounds,
                                             rainbow,
                                             options) {
    return new CanvasHeatMapOverlay(nX, nY, data, bounds, rainbow, options);
};
