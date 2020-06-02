import {latLngBounds, Layer, default as Leaflet} from 'leaflet';
import PropTypes from 'prop-types';
import {CSSProperties} from 'react';
import {MapLayer, MapLayerProps, withLeaflet} from 'react-leaflet';
import { canvasHeatMapOverlay, canvasHeatMapOverlayClass} from './leafletCanvasHeatMapOverlay';

interface IOwnProps {
    nX: number;
    nY: number;
    dataArray: any;
    bounds: any;
    rainbow: any;
    rotationAngle: number;
    rotationCenter: number[];
    sharpening: number;
}

type IProps = IOwnProps & MapLayerProps & CSSProperties;

export default withLeaflet(class CanvasHeatMapOverlay extends MapLayer {
    private leafletElement: canvasHeatMapOverlayClass;

    public static childContextTypes = {
        popupContainer: PropTypes.object
    };
    public getChildContext() {
        return {
            popupContainer: this.leafletElement
        };
    }

    public createLeafletElement(props: IProps) {
        return canvasHeatMapOverlay(
            props.nX,
            props.nY,
            props.dataArray,
            props.bounds,
            props.rainbow,
            props.rotationAngle,
            props.rotationCenter,
            props.sharpening,
            this.getOptions(props)
        );
    }

    public updateLeafletElement = (fromProps: IProps, toProps: IProps) => {
        if (toProps.nX !== fromProps.nX) {
            this.leafletElement.setNX(toProps.nX);
        }
        if (toProps.nY !== fromProps.nY) {
            this.leafletElement.setNY(toProps.nY);
        }
        if (toProps.dataArray !== fromProps.dataArray) {
            this.leafletElement.setDataArray(toProps.dataArray);
        }
        if (toProps.bounds !== fromProps.bounds) {
            this.leafletElement.setBounds(
                latLngBounds(toProps.bounds)
            );
        }

        if (toProps.rainbow !== fromProps.rainbow) {
            this.leafletElement.setRainbow(toProps.rainbow);
        }
        if (toProps.opacity !== fromProps.opacity) {
            this.leafletElement.setOpacity(toProps.opacity);
        }
        if (toProps.zIndex !== fromProps.zIndex) {
            this.leafletElement.setZIndex(toProps.zIndex);
        }
        if (toProps.sharpening !== fromProps.sharpening) {
            this.leafletElement.setSharpening(toProps.sharpening);
        }
        if (toProps.rotationAngle !== fromProps.rotationAngle) {
            this.leafletElement.setRotationAngle(toProps.rotationAngle);
        }
        if (toProps.rotationCenter !== fromProps.rotationCenter) {
            this.leafletElement.setRotationCenter(toProps.rotationCenter);
        }
    };
});
