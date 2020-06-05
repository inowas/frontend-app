import {Layer} from 'leaflet';
import React from 'react';
import {MapLayer, withLeaflet} from 'react-leaflet';
import {canvasHeatMapOverlay} from './leafletCanvasHeatMapOverlay';
import {IReactLeafletHeatMapClass, IReactLeafletHeatMapProps} from './ReactLeafletHeatMapCanvasOverlay.type';

class ReactLeafletHeatMapCanvasOverlay extends MapLayer<IReactLeafletHeatMapProps, Layer & IReactLeafletHeatMapClass> {
    public createLeafletElement(props: IReactLeafletHeatMapProps) {
        return canvasHeatMapOverlay(
            props.nX,
            props.nY,
            props.data,
            props.bounds,
            props.rainbow,
            props.rotationAngle,
            props.rotationCenter,
            props.sharpening,
            this.getOptions(props)
        );
    }

    public updateLeafletElement(
        fromProps: IReactLeafletHeatMapProps, toProps: IReactLeafletHeatMapProps
    ) {
        if (toProps.nX !== fromProps.nX) {
            this.leafletElement.setNX(toProps.nX);
        }
        if (toProps.nY !== fromProps.nY) {
            this.leafletElement.setNY(toProps.nY);
        }
        if (toProps.data !== fromProps.data) {
            this.leafletElement.setDataArray(toProps.data);
        }
        if (toProps.bounds !== fromProps.bounds) {
            this.leafletElement.setBounds(toProps.bounds);
        }
        if (toProps.rainbow !== fromProps.rainbow) {
            this.leafletElement.setRainbow(toProps.rainbow);
        }
        /*if (toProps.opacity !== fromProps.opacity) {
            this.leafletElement.setOpacity(toProps.opacity);
        }
        if (toProps.zIndex !== fromProps.zIndex) {
            this.leafletElement.setZIndex(toProps.zIndex);
        }*/
        if (toProps.sharpening && toProps.sharpening !== fromProps.sharpening) {
            this.leafletElement.setSharpening(toProps.sharpening);
        }
        if (toProps.rotationAngle && toProps.rotationAngle !== fromProps.rotationAngle) {
            this.leafletElement.setRotationAngle(toProps.rotationAngle);
        }
        if (toProps.rotationCenter && toProps.rotationCenter !== fromProps.rotationCenter) {
            this.leafletElement.setRotationCenter(toProps.rotationCenter);
        }
    }
}

export default withLeaflet(ReactLeafletHeatMapCanvasOverlay);
