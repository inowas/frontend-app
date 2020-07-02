import React from 'react';
import {LayersControl, Map} from 'react-leaflet';
import {Array2D} from '../../../core/model/geometry/Array2D.type';
import {ModflowModel} from '../../../core/model/modflow';
import BoundaryCollection from '../../../core/model/modflow/boundaries/BoundaryCollection';
import {BasicTileLayer} from '../../../services/geoTools/tileLayers';
import {rainbowFactory} from '../../../services/rainbowvis/helpers';
import Rainbow from '../../../services/rainbowvis/Rainbowvis';
import {ILegendItem} from '../../../services/rainbowvis/types';
import {renderBoundaryOverlays, renderBoundingBoxLayer} from '../../t03/components/maps/mapLayers';
import ColorLegend from './ColorLegend';
import ContourLayer from './contourLayer';
import {
    createGridData,
    max,
    min
} from './helpers';
import {ReactLeafletHeatMapCanvasOverlay} from './index';
import {IReactLeafletHeatMapProps} from './ReactLeafletHeatMapCanvasOverlay.type';

const styles = {
    map: {
        minHeight: 400
    }
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
    boundaries?: BoundaryCollection;
    data: number | Array2D<number>;
    model: ModflowModel;
    unit: string;
}

const rasterDataMap = (props: IProps) => {
    const {model, data, unit} = props;
    const rainbowVis = rainbowFactory({min: min(data), max: max(data)});

    const mapProps = {
        nX: model.gridSize.nX,
        nY: model.gridSize.nY,
        rainbow: rainbowVis,
        data: createGridData(data, model.gridSize.nX, model.gridSize.nY),
        bounds: model.boundingBox.getBoundsLatLng(),
        opacity: 0.75,
        sharpening: 10,
        zIndex: 1
    } as IReactLeafletHeatMapProps;

    return (
        <Map
            style={styles.map}
            zoomControl={false}
            bounds={model.boundingBox.getBoundsLatLng()}
        >
            <BasicTileLayer/>
            {renderBoundingBoxLayer(model.boundingBox, model.rotation, model.geometry)}
            {props.boundaries && props.boundaries.length > 0 &&
            <LayersControl position="topright">
                {renderBoundaryOverlays(props.boundaries)}
            </LayersControl>
            }
            {model.rotation % 360 !== 0 ?
                <ContourLayer
                    boundingBox={model.boundingBox}
                    data={data}
                    geometry={model.geometry}
                    gridSize={model.gridSize}
                    rainbow={rainbowVis}
                    rotation={model.rotation}
                    steps={0}
                /> :
                <ReactLeafletHeatMapCanvasOverlay
                    {
                        ...mapProps
                    }
                />
            }
            {renderLegend(rainbowVis, unit)}
        </Map>
    );
};

export default rasterDataMap;
