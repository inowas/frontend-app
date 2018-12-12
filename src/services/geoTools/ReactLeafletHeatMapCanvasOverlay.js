import PropTypes from 'prop-types';
import { latLngBounds } from 'leaflet';
import { MapLayer } from 'react-leaflet';

export default class CanvasHeatMapOverlay extends MapLayer {
    getChildContext() {
        return {
            popupContainer: this.leafletElement
        };
    }

    static childContextTypes = {
        popupContainer: PropTypes.object
    };

    createLeafletElement(props) {
        console.log(props);

        return new CanvasHeatMapOverlay(
            props.nX,
            props.nY,
            props.dataArray,
            props.bounds,
            props.rainbow,
            this.getOptions(props)
        );
    }

    updateLeafletElement = (fromProps, toProps) => {
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
    };
}
