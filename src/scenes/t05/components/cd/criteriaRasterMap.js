import PropTypes from 'prop-types';
import React from 'react';
import {createGridData, max, min, rainbowFactory} from '../../../shared/rasterData/helpers';
import {BasicTileLayer} from 'services/geoTools/tileLayers';
import {Map, Rectangle, FeatureGroup} from 'react-leaflet';
import {Raster} from 'core/mcda/gis';
import CanvasHeatMapOverlay from '../../../shared/rasterData/ReactLeafletHeatMapCanvasOverlay';
import ColorLegend from '../../../shared/rasterData/ColorLegend';
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

    renderLegend(rainbow) {
        const gradients = rainbow.getGradients().slice().reverse();
        const lastGradient = gradients[gradients.length - 1];
        const legend = gradients.map(gradient => ({
            color: '#' + gradient.getEndColour(),
            value: Number(gradient.getMaxNum()).toFixed(2)
        }));

        legend.push({
            color: '#' + lastGradient.getStartColour(),
            value: Number(lastGradient.getMinNum()).toFixed(2)
        });

        return <ColorLegend legend={legend} unit={''}/>;
    };

    render() {
        let rainbowVis = null;
        const {data, boundingBox, gridSize} = this.props.raster;

        if (data.length > 0) {
            rainbowVis = rainbowFactory({min: min(data), max: max(data)}, this.props.colors);
        }

        return (
            <Map
                style={styles.map}
                bounds={boundingBox.getBoundsLatLng()}
            >
                {this.props.showBasicLayer &&
                <BasicTileLayer/>
                }
                {!!this.props.onChange &&
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
                }
                {data.length > 0 &&
                <div>
                    <CanvasHeatMapOverlay
                        nX={gridSize.nX}
                        nY={gridSize.nY}
                        rainbow={rainbowFactory({min: min(data), max: max(data)}, this.props.colors)}
                        dataArray={createGridData(data, gridSize.nX, gridSize.nY)}
                        bounds={boundingBox.getBoundsLatLng()}
                        opacity={0.75}
                    />
                    {this.renderLegend(rainbowVis)}
                </div>
                }
            </Map>
        );
    }
}

CriteriaRasterMap.propTypes = {
    colors: PropTypes.array,
    onChange: PropTypes.func,
    raster: PropTypes.instanceOf(Raster).isRequired,
    showBasicLayer: PropTypes.bool.isRequired
};

export default CriteriaRasterMap;
