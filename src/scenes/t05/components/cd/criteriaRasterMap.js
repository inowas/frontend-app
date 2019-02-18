import PropTypes from 'prop-types';
import React from 'react';
import {createGridData} from '../../../shared/rasterData/helpers';
import {BasicTileLayer} from 'services/geoTools/tileLayers';
import {Map, Rectangle, FeatureGroup} from 'react-leaflet';
import {Raster} from 'core/model/mcda/gis';
import CanvasHeatMapOverlay from '../../../shared/rasterData/ReactLeafletHeatMapCanvasOverlay';
import ColorLegend from '../../../shared/rasterData/ColorLegend';
import ColorLegendDiscrete from '../../../shared/rasterData/ColorLegendDiscrete';
import {EditControl} from 'react-leaflet-draw';
import {getStyle} from '../../../t03/components/maps';
import {BoundingBox} from 'core/model/geometry';
import Rainbow from '../../../../../node_modules/rainbowvis.js/rainbowvis';

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
        if (rainbow instanceof Rainbow) {
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
        }
        return <ColorLegendDiscrete legend={rainbow} unit={''}/>;
    };

    render() {
        const {data, boundingBox, gridSize} = this.props.raster;

        return (
            <Map
                style={{
                    width: '100%',
                    height: this.props.mapHeight || '600px'
                }}
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
                        rainbow={this.props.legend}
                        dataArray={createGridData(data, gridSize.nX, gridSize.nY)}
                        bounds={boundingBox.getBoundsLatLng()}
                        opacity={0.75}
                        sharpening={10}
                    />
                    {this.renderLegend(this.props.legend)}
                </div>
                }
            </Map>
        );
    }
}

CriteriaRasterMap.propTypes = {
    onChange: PropTypes.func,
    raster: PropTypes.instanceOf(Raster).isRequired,
    showBasicLayer: PropTypes.bool.isRequired,
    legend: PropTypes.oneOfType([PropTypes.array, PropTypes.instanceOf(Rainbow)]).isRequired,
    mapHeight: PropTypes.string
};

export default CriteriaRasterMap;
