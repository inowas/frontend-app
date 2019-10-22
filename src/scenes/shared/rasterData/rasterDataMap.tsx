import React from 'react';
import {GeoJSON, Map, MapLayerProps} from 'react-leaflet';
import {Array2D} from '../../../core/model/geometry/Array2D.type';
import BoundingBox from '../../../core/model/geometry/BoundingBox';
import GridSize from '../../../core/model/geometry/GridSize';
import {BasicTileLayer} from '../../../services/geoTools/tileLayers';
import {createGridData, rainbowFactory} from '../../../services/rainbowvis/helpers';
import Rainbow from '../../../services/rainbowvis/Rainbowvis';
import {ILegendItem} from '../../../services/rainbowvis/types';
import ColorLegend from './ColorLegend';
import {
    disableMap,
    invalidateSize,
    max,
    min
} from './helpers';
import CanvasHeatMapOverlay from './ReactLeafletHeatMapCanvasOverlay';

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

const renderLegend = (rainbow: Rainbow, unit: string = '') => {
    const gradients = rainbow.gradients.slice().reverse();
    const lastGradient = gradients[gradients.length - 1];
    const legend: ILegendItem[] = gradients.map((gradient) => ({
        color: '#' + gradient.endColor,
        value: Number(gradient.maxNum).toExponential(2)
    }));

    legend.push({
        color: '#' + lastGradient.startColor,
        value: Number(lastGradient.minNum).toExponential(2)
    });

    return <ColorLegend legend={legend} unit={unit}/>;
};

interface IProps {
    boundingBox: BoundingBox;
    data: number | Array2D<number>;
    gridSize: GridSize;
    unit: string;
}

const rasterDataMap = (props: IProps) => {
    const {boundingBox, data, gridSize, unit} = props;
    const rainbowVis = rainbowFactory({min: min(data), max: max(data)});

    const mapProps = {
        nX: gridSize.nX,
        nY: gridSize.nY,
        rainbow: rainbowVis,
        dataArray: createGridData(data, gridSize.nX, gridSize.nY),
        bounds: boundingBox.getBoundsLatLng(),
        opacity: 0.75,
        sharpening: 10,
        zIndex: 1
    } as MapLayerProps;

    return (
        <Map
            style={styles.map}
            zoomControl={false}
            ref={(map) => {
                invalidateSize(map);
                disableMap(map);
            }}
            bounds={boundingBox.getBoundsLatLng()}
        >
            <BasicTileLayer/>
            <GeoJSON
                key={boundingBox.hash()}
                data={boundingBox.geoJson}
                style={styles.area}
            />
            <CanvasHeatMapOverlay
                {
                    ...mapProps
                }
            />
            {renderLegend(rainbowVis, unit)}
        </Map>
    );
};

export default rasterDataMap;
