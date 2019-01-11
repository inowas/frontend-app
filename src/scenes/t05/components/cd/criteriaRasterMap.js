import PropTypes from 'prop-types';
import React from 'react';
import {createGridData, disableMap, invalidateSize, max, min, rainbowFactory} from '../../../shared/rasterData/helpers';
import {BasicTileLayer} from 'services/geoTools/tileLayers';
import {ImageOverlay, Map} from 'react-leaflet';
import {GisMap} from 'core/mcda/gis';
import {Image} from 'semantic-ui-react';

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

    componentDidMount() {
        if (this.canvas) {
            const {data, map} = this.props;
            const rainbowVis = rainbowFactory({min: min(data), max: max(data)});
            const width = map.gridSize.nX;
            const height = map.gridSize.nY;
            this.drawCanvas(data, width, height, rainbowVis);
        }
    }

    shouldComponentUpdate(nextProps) {
        return this.props.data !== nextProps.data;
    }

    drawCanvas(data, width, height, rainbowVis) {
        console.log('DRAW CANVAS');

        const ctx = this.canvas.getContext('2d');
        ctx.clearRect(0, 0, width, height);
        const gridData = createGridData(data, width, height);
        gridData.forEach(d => {
            ctx.fillStyle = '#' + rainbowVis.colourAt(d.value);
            ctx.fillRect(d.x, d.y, 1, 1);
        });
    }

    renderImage() {
        const {data, map} = this.props;

        console.log('RENDERING IMAGE');

        const rainbowVis = rainbowFactory({min: min(data), max: max(data)});
        const width = map.gridSize.nX;
        const height = map.gridSize.nY;

        if (this.canvas) {
            this.drawCanvas(data, width, height, rainbowVis);
        }

        return (
            <canvas
                style={styles.canvas}
                ref={(canvas) => {
                    this.canvas = canvas;
                }}
                width={width}
                height={height}
                data-paper-resize
            />
        );
    }

    render() {
        const {data, map} = this.props;

        console.log(this.props);

        //return data && data.length > 0 ? this.renderImage() : null;

        return (
            <Map
                style={styles.map}
                bounds={map.boundingBox.getBoundsLatLng()}
            >
                <BasicTileLayer/>
                {data.length > 0 &&
                <ImageOverlay
                    url={this.renderImage()}
                    bounds={map.boundingBox.getBoundsLatLng()}
                />
                }
            </Map>
        );
    }
}

CriteriaRasterMap.propTypes = {
    data: PropTypes.oneOfType([PropTypes.array, PropTypes.number]).isRequired,
    map: PropTypes.instanceOf(GisMap).isRequired
};

export default CriteriaRasterMap;
