import {
    Bounds,
    default as Leaflet,
    DomUtil, latLngBounds as toLatLngBounds,
    LatLngExpression, Layer,
    Util
} from 'leaflet';
import {MapLayerProps} from 'react-leaflet';
import Rainbow from '../../../services/rainbowvis/Rainbowvis';
import {ILegendItemContinuous, ILegendItemDiscrete, RainbowOrLegend} from '../../../services/rainbowvis/types';
import {IData} from './ReactLeafletHeatMapCanvasOverlay.type';

export const canvasHeatMapOverlayClass = Layer.extend({
    options: {
        opacity: 1,
        interactive: false,
        zIndex: 1,
        className: ''
    },

    initialize(nX: number, nY: number, data: IData[], bounds: LatLngExpression[], rainbow: RainbowOrLegend,
               rotationAngle?: number, rotationCenter?: number, sharpening?: number, options?: MapLayerProps) {
        this._nX = nX;
        this._nY = nY;
        this._dataArray = data;
        this._bounds = toLatLngBounds(bounds);
        this._rainbow = rainbow;
        this._sharpening = sharpening || 1;
        this._rotationAngle = rotationAngle || 0;
        this._rotationCenter = rotationCenter || [0, 0];
        if (options) {
            Util.setOptions(this, options);
        }
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

    setStyle(styleOpts: any) {
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

    setDataArray(dataArray: IData[]) {
        this._dataArray = dataArray;

        if (this._map) {
            this._runDraw();
        }
        return this;
    },

    setBounds(bounds: LatLngExpression[]) {
        this._bounds = toLatLngBounds(bounds);

        if (this._map) {
            this._reset();
        }
        return this;
    },

    setRainbow(rainbow: RainbowOrLegend) {
        this._rainbow = rainbow;

        if (this._map) {
            this._runDraw();
        }
        return this;
    },

    setRotationAngle(angle: number) {
        this._rotationAngle = angle;

        if (this._map) {
            this._runDraw();
        }
        return this;
    },

    setRotationCenter(center: number[]) {
        this._rotationCenter = center;

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
        return {
            zoom: this._reset,
            zoomanim: this._zoomAnimated ? this._animateZoom : undefined,
            viewreset: this._reset
        };
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
        )) as HTMLCanvasElement;

        this._ctx = canvas.getContext('2d');

        canvas.width = this._nX * this._sharpening;
        canvas.height = this._nY * this._sharpening;

        canvas.onselectstart = Util.falseFn;
        canvas.onmousemove = Util.falseFn;

        canvas.onload = Util.bind(this.fire, this, 'load');
        canvas.onerror = Util.bind(this._overlayOnError, this, 'error');

        /*if (this.options.crossOrigin) {
            canvas.crossOrigin = '';
        }*/

        if (this.options.zIndex) {
            this._updateZIndex();
        }

        this._ctx.scale(this._sharpening, this._sharpening);
        this._runDraw();
    },

    _animateZoom(e: Leaflet.ZoomAnimEvent) {
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
        if (bounds.min) {
            const size = bounds.getSize();

            DomUtil.setPosition(canvas, bounds.min);

            canvas.style.width = size.x + 'px';
            canvas.style.height = size.y + 'px';
        }
    },

    _drawRasterCell(x: number, y: number, width: number, height: number, color: string) {
        this._ctx.fillStyle = color;
        this._ctx.fillRect(x, y, width, height);
    },

    _runDraw() {
        this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
        this._dataArray.forEach((d: IData) => {
            if (isNaN(d.value)) {
                this._ctx.clearRect(d.x, d.y, this._canvas.width, this._canvas.height);
            } else if (this._rainbow instanceof Rainbow) {
                this._drawRasterCell(
                    d.x, d.y, this._sharpening, this._sharpening, '#' + this._rainbow.colorAt(d.value)
                );
            } else {
                const data = this._rainbow[0].isContinuous ?
                    (this._rainbow as ILegendItemContinuous[])
                        .filter((row) => (row.fromOperator === '>' ? d.value > row.from :
                            d.value >= row.from) && (row.toOperator === '<' ? d.value < row.to : d.value <= row.to)) :
                    (this._rainbow as ILegendItemDiscrete[]).filter((row) => row.value === d.value);
                this._drawRasterCell(
                    d.x, d.y, this._sharpening, this._sharpening, data.length > 0 ? data[0].color : '#fff'
                );
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
    data: IData[],
    bounds: LatLngExpression[],
    rainbow: RainbowOrLegend,
    rotationAngle?: number,
    rotationCenter?: number[],
    sharpening?: number,
    options?: MapLayerProps
) => {
    const overlay = new canvasHeatMapOverlayClass();
    overlay.initialize(nX, nY, data, bounds, rainbow, rotationAngle, rotationCenter, sharpening, options);
    return overlay;
};
