import {
    Bounds,
    DomUtil,
    latLngBounds as toLatLngBounds,
    Layer,
    Util
} from 'leaflet';
import Rainbow from '../../../services/rainbowvis/Rainbowvis';

export interface ILeafletCanvasHeatMapOverlay {
    options: {
        opacity: number;
        interactivity: boolean;
        zIndex: number;
        className: string;
    };
    initialize: () => void;
    setOpacity: () => void;
    setStyle: () => void;
    bringToFront: () => void;
    bringToBack: () => void;
    setNx: (v: number) => void;
    setNy: (v: number) => void;
    setDataArray: () => void;
    setBounds: () => void;
    getBounds: () => any;
    setRainbow: () => void;
    setRotationAngle: (v: number) => void;
    setRotationCenter: (v: number[]) => void;
    setSharpening: (v: number) => void;
    setZIndex: (v: number) => void;
    getElement: () => void;
    _animateZoom: (e: any) => void;
    _initCanvas: () => void;
    _overlayOnError: () => any;
    _reset: () => void;
    _runDraw: () => void;
    _updateOpacity: () => void;
    _updateZIndex: () => void;
}

type overlayType = Layer extends ILeafletCanvasHeatMapOverlay;

export const canvasHeatMapOverlayClass: ILeafletCanvasHeatMapOverlay = Layer.extend({
    options: {
        opacity: 1,
        interactive: false,
        zIndex: 1,
        className: ''
    },

    initialize(
        nX: number, nY: number, data, bounds, rainbow,
        rotationAngle: number, rotationCenter: number[], sharpening = 1, options
    ) {
        this._nX = nX;
        this._nY = nY;
        this._dataArray = data;
        this._bounds = toLatLngBounds(bounds);
        this._rainbow = rainbow;
        this._rotationAngle = rotationAngle;
        this._rotationCenter = rotationCenter;
        this._sharpening = sharpening;

        Util.setOptions(this, options);
    },

    onAdd() {
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

    onRemove() {
        DomUtil.remove(this._canvas);
        if (this.options.interactive) {
            this.removeInteractiveTarget(this._canvas);
        }
    },

    setOpacity(opacity: number) {
        this.options.opacity = opacity;

        if (this._canvas) {
            this._updateOpacity();
        }
        return this;
    },

    setStyle(styleOpts) {
        if (styleOpts.opacity) {
            this.setOpacity(styleOpts.opacity);
        }
        return this;
    },

    bringToFront() {
        if (this._map) {
            DomUtil.toFront(this._canvas);
        }
        return this;
    },

    bringToBack() {
        if (this._map) {
            DomUtil.toBack(this._canvas);
        }
        return this;
    },

    setNX(nX: number) {
        this._nX = nX;

        if (this._map) {
            this._canvas.width = nX;
            this._runDraw();
        }
        return this;
    },

    setNY(nY: number) {
        this._nY = nY;

        if (this._map) {
            this._canvas.height = nY;
            this._runDraw();
        }
        return this;
    },

    setDataArray(dataArray) {
        this._dataArray = dataArray;

        if (this._map) {
            this._runDraw();
        }
        return this;
    },

    setBounds(bounds) {
        this._bounds = toLatLngBounds(bounds);

        if (this._map) {
            this._reset();
        }
        return this;
    },

    setRainbow(rainbow) {
        this._rainbow = rainbow;

        if (this._map) {
            this._runDraw();
        }
        return this;
    },

    setRotationAngle(rotationAngle: number) {
        this._rotationAngle = rotationAngle;

        if (this._map) {
            this._runDraw();
        }
        return this;
    },

    setRotationCenter(rotationCenter: number[]) {
        this._rotationCenter = rotationCenter;

        if (this._map) {
            this._runDraw();
        }
        return this;
    },

    setSharpening(sharpening: number) {
        this._sharpening = sharpening;

        if (this._map) {
            this._runDraw();
        }
        return this;
    },

    getEvents() {
        const events = {
            zoom: this._reset,
            viewreset: this._reset
        };

        if (this._zoomAnimated) {
            events.zoomanim = this._animateZoom;
        }

        return events;
    },

    setZIndex(value: number) {
        this.options.zIndex = value;
        this._updateZIndex();
        return this;
    },

    getBounds() {
        return this._bounds;
    },

    getElement() {
        return this._canvas;
    },

    _initCanvas() {
        const canvas = (this._canvas = DomUtil.create(
            'canvas',
            'leaflet-layer ' +
            (this._zoomAnimated ? 'leaflet-zoom-animated' : '') +
            (this.options.className || '')
        ));

        this._ctx = canvas.getContext('2d');

        canvas.width = this._nX * this._sharpening;
        canvas.height = this._nY * this._sharpening;

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

        this._ctx.scale(this._sharpening, this._sharpening);
        this._runDraw();
    },

    _animateZoom(e) {
        const scale = this._map.getZoomScale(e.zoom);
        const offset = this._map._latLngBoundsToNewLayerBounds(
            this._bounds,
            e.zoom,
            e.center
        ).min;

        DomUtil.setTransform(this._canvas, offset, scale);
    },

    _reset() {
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

    _runDraw() {
        this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
        this._dataArray.forEach((d) => {
            if (isNaN(d.value)) {
                this._ctx.clearRect(d.x, d.y, this._canvas.width, this._canvas.height);
            } else if (this._rainbow instanceof Rainbow) {
                this._ctx.fillStyle = '#' + this._rainbow.colorAt(d.value);
                this._ctx.fillRect(d.x, d.y, 1 * this._sharpening, 1 * this._sharpening);
            } else {
                const data = this._rainbow[0].isContinuous ?
                    this._rainbow.filter((row) => (row.fromOperator === '>' ? d.value > row.from : d.value >= row.from) && (row.toOperator === '<' ? d.value < row.to : d.value <= row.to)) :
                    this._rainbow.filter((row) => row.value === d.value);
                this._ctx.fillStyle = data.length > 0 ? data[0].color : '#fff';
                this._ctx.fillRect(d.x, d.y, 1 * this._sharpening, 1 * this._sharpening);
            }
        });
    },

    _updateOpacity() {
        DomUtil.setOpacity(this._canvas, this.options.opacity);
    },

    _updateZIndex() {
        if (
            this._canvas &&
            this.options.zIndex !== undefined &&
            this.options.zIndex !== null
        ) {
            this._canvas.style.zIndex = this.options.zIndex;
        }
    },

    _overlayOnError() {
        this.fire('error');

        const errorUrl = this.options.errorOverlayUrl;
        if (errorUrl && this._url !== errorUrl) {
            this._url = errorUrl;
            this._canvas.src = errorUrl;
        }
    }
});

export const canvasHeatMapOverlay = (
    nX: number,
    nY: number,
    data,
    bounds,
    rainbow,
    rotationAngle: number,
    rotationCenter: number[],
    sharpening: number,
    options
) => {
    const overlay = new CanvasHeatMapOverlay();
    overlay.initialize(nX, nY, data, bounds, rainbow, rotationAngle, rotationCenter, sharpening, options);
    return overlay;
};
