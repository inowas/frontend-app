import PropTypes from 'prop-types';
import React from 'react';
import {createGridData, max, min, rainbowFactory} from '../../../shared/rasterData/helpers';
import {BasicTileLayer} from 'services/geoTools/tileLayers';
import {Map} from 'react-leaflet';
import {GisMap} from 'core/mcda/gis';
import CanvasHeatMapOverlay from '../../../shared/rasterData/ReactLeafletHeatMapCanvasOverlay';
import uuidv4 from 'uuid/v4';

const styles = {
    canvas: {
        width: '100%',
        height: '400px'
    },
    map: {
        width: '100%',
        height: '400px'
    }
};

class CriteriaRasterMap extends React.Component {

    constructor(props) {
        super(props);
        this.leafletMap = React.createRef();
        this.state = {
            data: this.props.data,
            bounds: this.props.map.boundingBox.getBoundsLatLng(),
            gridSize: this.props.map.gridSize.toObject(),
            refreshKey: uuidv4(),
            viewport: this.props.map.boundingBox.getBoundsLatLng()
        }
    }

    render() {
        const {data, bounds, gridSize, refreshKey, viewport} = this.state;

        return (
            <div>
                <p>{refreshKey}</p>
                <Map
                    style={styles.map}
                    bounds={viewport}
                    ref={this.leafletMap}
                    onMoveend={this.handleMoved}
                    key={refreshKey}
                >
                    <BasicTileLayer/>
                    {data.length > 0 &&
                    <CanvasHeatMapOverlay
                        nX={gridSize.n_x}
                        nY={gridSize.n_y}
                        rainbow={rainbowFactory({min: min(data), max: max(data)})}
                        dataArray={createGridData(data, gridSize.n_x, gridSize.n_y)}
                        bounds={bounds}
                        opacity={0.75}
                    />
                    }
                </Map>
            </div>
        );
    }
}

CriteriaRasterMap.propTypes = {
    data: PropTypes.oneOfType([PropTypes.array, PropTypes.number]).isRequired,
    map: PropTypes.instanceOf(GisMap).isRequired
};

export default CriteriaRasterMap;
