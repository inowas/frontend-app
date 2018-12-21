import React from 'react';
import PropTypes from 'prop-types';
import {BoundaryCollection, ModflowModel} from 'core/model/modflow';
import {CircleMarker, GeoJSON, LayersControl, Map} from 'react-leaflet';
import {BasicTileLayer} from 'services/geoTools/tileLayers';
import {getStyle} from './helpers';
import CanvasHeatMapOverlay from '../../../shared/rasterData/ReactLeafletHeatMapCanvasOverlay';
import {createGridData, max, min, rainbowFactory} from '../../../shared/rasterData/helpers';
import ColorLegend from '../../../shared/rasterData/ColorLegend';

const style = {
    map: {
        height: '400px',
        width: '100%'
    }
};

class ResultsMap extends React.Component {

    handleClickOnMap = ({latlng}) => {
        const x = latlng.lng;
        const y = latlng.lat;
        console.log(x, y);
    };

    renderLegend = (rainbow) => {
        const gradients = rainbow.getGradients().slice().reverse();
        const lastGradient = gradients[gradients.length - 1];
        const legend = gradients.map(gradient => ({
            color: '#' + gradient.getEndColour(),
            value: Number(gradient.getMaxNum()).toExponential(2)
        }));

        legend.push({
            color: '#' + lastGradient.getStartColour(),
            value: Number(lastGradient.getMinNum()).toExponential(2)
        });

        return <ColorLegend legend={legend} unit={''}/>;
    };

    render() {
        const {boundaries, data, model} = this.props;
        const {boundingBox, geometry, gridSize} = model;
        const rainbowVis = rainbowFactory(
            {min: min(data), max: max(data)},
            ['#800080', '#ff2200', '#fcff00', '#45ff8e', '#15d6ff', '#0000FF']
        );

        return (
            <Map
                style={style.map}
                bounds={geometry.getBoundsLatLng()}
                onClick={this.handleClickOnMap}
                boundsOptions={{padding: [20, 20]}}

            >
                <BasicTileLayer/>
                <LayersControl position="topright">
                    <LayersControl.Overlay name="Model area" checked>
                        <GeoJSON
                            key={geometry.hash()}
                            data={geometry.geoJson}
                            style={getStyle('area')}
                        />
                    </LayersControl.Overlay>
                    <LayersControl.Overlay name={'Bounding Box'} checked>
                        <GeoJSON
                            key={boundingBox.hash()}
                            data={boundingBox.geoJson}
                            style={getStyle('bounding_box')}
                        />
                    </LayersControl.Overlay>
                    <LayersControl.Overlay name={'Boundaries'}>
                        {boundaries.all.map(b => {
                            if (b.type === 'wel' || b.type === 'hob') {
                                return (
                                    <CircleMarker
                                        key={b.id}
                                        center={[
                                            b.geometry.coordinates[1],
                                            b.geometry.coordinates[0]
                                        ]}
                                        {...getStyle(b.type, b.metadata.well_type)}
                                    />
                                );
                            }

                            return (
                                <GeoJSON
                                    key={b.geometry.hash()}
                                    data={b.geometry}
                                    style={getStyle(b.type)}
                                />
                            );
                        })}
                    </LayersControl.Overlay>

                    <CanvasHeatMapOverlay
                        nX={gridSize.nX}
                        nY={gridSize.nY}
                        rainbow={rainbowVis}
                        dataArray={createGridData(data, gridSize.nX, gridSize.nY)}
                        bounds={boundingBox.getBoundsLatLng()}
                        opacity={0.5}
                        model={model}
                    />
                    {this.renderLegend(rainbowVis)}
                </LayersControl>
            </Map>
        )
    }
}

ResultsMap.propTypes = {
    boundaries: PropTypes.instanceOf(BoundaryCollection).isRequired,
    data: PropTypes.array.isRequired,
    globalMinMax: PropTypes.array,
    model: PropTypes.instanceOf(ModflowModel).isRequired,
    onClick: PropTypes.func.isRequired
};

export default ResultsMap;
