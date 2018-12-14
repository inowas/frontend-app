import React from 'react';
import PropTypes from 'prop-types';
import {Map, GeoJSON, TileLayer} from 'react-leaflet';
import {ModflowModel} from 'core/model/modflow';
import {generateKey} from './helpers';
import {
    min,
    max,
    createGridData,
    disableMap,
    invalidateSize,
    rainbowFactory
} from 'services/geoTools/components/rasterData/helpers';
import ColorLegend from './ColorLegend';
import CanvasHeatMapOverlay from './ReactLeafletHeatMapCanvasOverlay';

const styles = {
    map: {
        minHeight: 200
    },
    area: {
        weight: 1,
        opacity: 0.7,
        color: 'grey',
        fill: false
    },
};

const renderLegend = (rainbow, unit) => {
    const gradients = rainbow
        .getGradients()
        .slice()
        .reverse();
    const lastGradient = gradients[gradients.length - 1];
    const legend = gradients.map(gradient => ({
        color: '#' + gradient.getEndColour(),
        value: Number(gradient.getMaxNum()).toFixed(2)
    }));

    legend.push({
        color: '#' + lastGradient.getStartColour(),
        value: Number(lastGradient.getMinNum()).toFixed(2)
    });

    return <ColorLegend legend={legend} unit={unit}/>;
};

const RasterDataMap = ({data, model, unit}) => {
    const {gridSize} = model;
    const geometry = model.geometry.toObject();
    const boundingBox = model.boundingBox.toArray();

    const bounds = [
        [boundingBox[0][1], boundingBox[0][0]],
        [boundingBox[1][1], boundingBox[1][0]]
    ];

    const rainbowVis = rainbowFactory({min: min(data), max: max(data)});

    return (
        <Map
            style={styles.map}
            zoomControl={false}
            ref={map => {
                invalidateSize(map);
                disableMap(map);
            }}
            bounds={bounds}
        >
            <TileLayer
                url="http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png"
                attribution=""
            />
            <GeoJSON
                key={generateKey(geometry)}
                data={geometry}
                style={styles.area}
            />
            <CanvasHeatMapOverlay
                nX={gridSize.nX}
                nY={gridSize.nY}
                rainbow={rainbowVis}
                dataArray={createGridData(data, gridSize.nX, gridSize.nY)}
                bounds={bounds}
                opacity={0.75}
            />
            {renderLegend(rainbowVis, '')}
        </Map>
    );
};

RasterDataMap.propTypes = {
    model: PropTypes.instanceOf(ModflowModel).isRequired,
    data: PropTypes.oneOfType([PropTypes.array, PropTypes.number]).isRequired,
    unit: PropTypes.string
};


export default RasterDataMap;
