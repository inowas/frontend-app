import PropTypes from 'prop-types';
import React from 'react';
import {createGridData, max, min, rainbowFactory} from '../../../shared/rasterData/helpers';
import {BasicTileLayer} from 'services/geoTools/tileLayers';
import {Map, Rectangle, FeatureGroup} from 'react-leaflet';
import {Raster} from 'core/mcda/gis';
import CanvasHeatMapOverlay from '../../../shared/rasterData/ReactLeafletHeatMapCanvasOverlay';
import {EditControl} from 'react-leaflet-draw';
import {getStyle} from '../../../t03/components/maps';
import {BoundingBox} from 'core/geometry';

const styles = {
    map: {
        width: '100%',
        height: '600px'
    }
};

const options = {
    edit: {
        remove: false
    },
    draw: {
        polyline: false,
        polygon: false,
        rectangle: false,
        circle: false,
        circlemarker: false,
        marker: false,
        poly: {
            allowIntersection: false
        }
    }
};

class CriteriaRasterMap extends React.Component {

    onEditPath = e => {
        const layers = e.layers;

        layers.eachLayer(layer => {
            const boundingBox = BoundingBox.fromGeoJson(layer.toGeoJSON());
            const raster = this.props.raster;
            raster.boundingBox = boundingBox;
            this.props.onChange(raster);
        });
    };

    render() {
        const {data, boundingBox, gridSize} = this.props.raster;

        return (
            <Map
                style={styles.map}
                bounds={boundingBox.getBoundsLatLng()}
            >
                {this.props.showBasicLayer &&
                <BasicTileLayer/>
                }
                <FeatureGroup>
                    <EditControl
                        position="bottomright"
                        onEdited={this.onEditPath}
                        {...options}
                    />
                    <Rectangle
                        bounds={boundingBox.getBoundsLatLng()}
                        {...getStyle('bounding_box')}
                    />
                </FeatureGroup>
                {data.length > 0 &&
                <CanvasHeatMapOverlay
                    nX={gridSize.nX}
                    nY={gridSize.nY}
                    rainbow={rainbowFactory({min: min(data), max: max(data)})}
                    dataArray={createGridData(data, gridSize.nX, gridSize.nY)}
                    bounds={boundingBox.getBoundsLatLng()}
                    opacity={0.75}
                />
                }
            </Map>
        );
    }
}

CriteriaRasterMap.propTypes = {
    onChange: PropTypes.func.isRequired,
    raster: PropTypes.instanceOf(Raster).isRequired,
    showBasicLayer: PropTypes.bool.isRequired
};

export default CriteriaRasterMap;
