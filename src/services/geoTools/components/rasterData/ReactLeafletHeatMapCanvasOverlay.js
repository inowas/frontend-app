import PropTypes from 'prop-types';
import { latLngBounds } from 'leaflet';
import { CanvasHeatMapOverlay as LeafletCanvasHeatMapOverlay } from './leafletCanvasHeatMapOverlay';
import {MapLayer, withLeaflet} from 'react-leaflet';

export default withLeaflet(class CanvasHeatMapOverlay extends MapLayer {
    getChildContext() {
        return {
            popupContainer: this.leafletElement
        };
    }

    static childContextTypes = {
        popupContainer: PropTypes.object
    };

    createLeafletElement(props) {
        return new LeafletCanvasHeatMapOverlay(
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
})
