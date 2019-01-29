import React from 'react';
import PropTypes from 'prop-types';
import {Map, GeoJSON} from 'react-leaflet';
import {ModflowModel} from 'core/model/modflow';
import {
    min,
    max,
    createGridData,
    disableMap,
    invalidateSize,
    rainbowFactory
} from './helpers';
import ColorLegend from './ColorLegend';
import CanvasHeatMapOverlay from './ReactLeafletHeatMapCanvasOverlay';
import {BasicTileLayer} from 'services/geoTools/tileLayers';

const styles = {
    map: {
        minHeight: 400
    },
    area: {
        weight: 1,
        opacity: 0.7,
        color: 'grey',
        fill: false
    },
};

const renderLegend = (rainbow) => {
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

const RasterDataMap = ({data, model, unit = ''}) => {
    const {boundingBox, geometry, gridSize} = model;
    const rainbowVis = rainbowFactory({min: min(data), max: max(data)});

    return (
        <Map
            style={styles.map}
            zoomControl={false}
            ref={map => {
                invalidateSize(map);
                disableMap(map);
            }}
            bounds={boundingBox.getBoundsLatLng()}
        >
            <BasicTileLayer/>
            <GeoJSON
                key={geometry.hash()}
                data={geometry.toGeoJSON()}
                style={styles.area}
            />
            <CanvasHeatMapOverlay
                nX={gridSize.nX}
                nY={gridSize.nY}
                rainbow={rainbowVis}
                dataArray={createGridData(data, gridSize.nX, gridSize.nY)}
                bounds={boundingBox.getBoundsLatLng()}
                opacity={0.75}
            />
            {renderLegend(rainbowVis, unit)}
        </Map>
    );
};

RasterDataMap.propTypes = {
    model: PropTypes.instanceOf(ModflowModel).isRequired,
    data: PropTypes.oneOfType([PropTypes.array, PropTypes.number]).isRequired,
    unit: PropTypes.string
};


export default RasterDataMap;
