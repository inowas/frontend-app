import PropTypes from 'prop-types';
import React from 'react';
import {createGridData, max, min, rainbowFactory} from '../../../shared/rasterData/helpers';
import {BasicTileLayer} from 'services/geoTools/tileLayers';
import {Map} from 'react-leaflet';
import {GisMap} from 'core/mcda/gis';
import CanvasHeatMapOverlay from '../../../shared/rasterData/ReactLeafletHeatMapCanvasOverlay';
import {cloneDeep} from 'lodash';
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

    distance(lat1, lon1, lat2, lon2) {
        const p = Math.PI / 180;
        const c = Math.cos;
        const a = 0.5 - c((lat2 - lat1) * p) / 2 + c(lat1 * p) * c(lat2 * p) * (1 - c((lon2 - lon1) * p)) / 2;

        return 12742000 * Math.asin(Math.sqrt(a));
    }

    handleMoved = () => {
        const dataBounds = this.props.map.boundingBox.getBoundsLatLng();
        const gridSize = this.props.map.gridSize.toObject();
        const viewport = this.leafletMap.current.leafletElement.getBounds(); // Find appropriate cell in data
        const data = cloneDeep(this.props.data);

        const southWest = {
            y1: dataBounds[0][0],
            x1: dataBounds[0][1],
            y2: viewport._southWest.lat,
            x2: viewport._southWest.lng
        };

        const northEast = {
            y1: dataBounds[1][0],
            x1: dataBounds[1][1],
            y2: viewport._northEast.lat,
            x2: viewport._northEast.lng,
        };

        const distanceX = this.distance(southWest.y1, southWest.x1, southWest.y1, northEast.x1);
        const cellSizeX = distanceX / gridSize.n_x;

        const distanceY = this.distance(southWest.y1, southWest.x1, northEast.y1, southWest.x1);
        const cellSizeY = distanceY / gridSize.n_y;

        let bounds = cloneDeep(dataBounds);
        let newGridSize = cloneDeep(gridSize);
        let cellsX1 = 0;
        let cellsX2 = gridSize.n_x;
        let cellsY1 = 0;
        let cellsY2 = gridSize.n_y;

        // BoundingBox is not in viewport:
        if (southWest.x2 > northEast.x1 || northEast.x2 < southWest.x1 || southWest.y2 > northEast.y1 || northEast.y2 < southWest.y1) {
            return;
        }

        // BoundingBox is completely in viewport:
        if (southWest.y2 < southWest.y1 && southWest.x2 < southWest.x1 && northEast.y2 > northEast.y1 && northEast.x2 > northEast.x1) {

        }

        // BoundingBox is partially in viewport:
        if (southWest.y2 > southWest.y1) {
            const distance = this.distance(southWest.y1, southWest.x1, southWest.y2, southWest.x1);
            cellsY2 = gridSize.n_y - Math.floor(distance / cellSizeY);
            bounds[0][0] = southWest.y2;
        }
        if (northEast.y2 < northEast.y1) {
            const distance = this.distance(northEast.y1, northEast.x1, northEast.y2, northEast.x1);
            cellsY1 = Math.floor(distance / cellSizeY);
            bounds[1][0] = northEast.y2;
        }
        if (southWest.x2 > southWest.x1) {
            const distance = this.distance(southWest.y1, southWest.x1, southWest.y1, southWest.x2);
            cellsX1 = Math.floor(distance / cellSizeX);
            bounds[0][1] = southWest.x2;
        }
        if (northEast.x2 < northEast.x1) {
            const distance = this.distance(northEast.y1, northEast.x1, northEast.y1, northEast.x2);
            cellsX2 = gridSize.n_x - Math.floor(distance / cellSizeX);
            bounds[1][1] = northEast.x2;
        }

        const sliced = data.slice(cellsY1, cellsY2 + 1).map(i => i.slice(cellsX1, cellsX2 + 1));

        newGridSize.n_y = sliced.length;
        if (sliced.length === 0 || sliced[0].length === 0) {
            return;
        }
        newGridSize.n_x = sliced[0].length;

        return this.setState({
            data: sliced,
            bounds: bounds,
            gridSize: newGridSize,
            refreshKey: uuidv4(),
            viewport: viewport
        });
    };

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
