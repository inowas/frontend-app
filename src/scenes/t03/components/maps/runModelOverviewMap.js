import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {GeoJSON, Map, Rectangle} from 'react-leaflet';
import {disableMap, getStyle, invalidateSize} from './index';

import ActiveCellsLayer from 'services/geoTools/activeCellsLayer';
import {BasicTileLayer} from 'services/geoTools/tileLayers';

const styles = {
    map: {
        minHeight: 300
    }
};

class RunModelOverviewMap extends Component {
    render() {
        const {activeCells, boundingBox, geometry, gridSize} = this.props.model;

        return (
            <Map
                style={styles.map}
                ref={map => {
                    disableMap(map);
                    invalidateSize(map);
                }}
                zoomControl={false}
                bounds={boundingBox.getBoundsLatLng()}
            >
                <BasicTileLayer/>
                <GeoJSON
                    key={geometry.hash}
                    data={geometry.toGeoJSON()}
                    style={getStyle('area')}
                />
                <Rectangle
                    bounds={boundingBox.getBoundsLatLng()}
                    {...getStyle('bounding_box')}
                />
                <ActiveCellsLayer
                    boundingBox={boundingBox}
                    gridSize={gridSize}
                    activeCells={activeCells}
                    styles={getStyle('active_cells')}
                />
            </Map>
        )
    }
}

RunModelOverviewMap.propTypes = {
    model: PropTypes.object
};

export default RunModelOverviewMap;
