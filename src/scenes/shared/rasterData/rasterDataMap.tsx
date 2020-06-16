import * as turf from '@turf/turf';
import * as d3 from 'd3';
import React from 'react';
import {GeoJSON, LayersControl, Map, Tooltip} from 'react-leaflet';
import {Array2D} from '../../../core/model/geometry/Array2D.type';
import {ModflowModel} from '../../../core/model/modflow';
import BoundaryCollection from '../../../core/model/modflow/boundaries/BoundaryCollection';
import {BasicTileLayer} from '../../../services/geoTools/tileLayers';
import {rainbowFactory} from '../../../services/rainbowvis/helpers';
import Rainbow from '../../../services/rainbowvis/Rainbowvis';
import {ILegendItem} from '../../../services/rainbowvis/types';
import {renderBoundaryOverlays, renderBoundingBoxLayer} from '../../t03/components/maps/mapLayers';
import ColorLegend from './ColorLegend';
import {
    max,
    min
} from './helpers';

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

    const generateContours = () => {
        const cData: any = data;
        const fData = [].concat(...cData);
        const thresholds = d3.range(min(cData), max(cData));
        const contours = d3.contours().size([model.gridSize.nX, model.gridSize.nY])
            .thresholds(thresholds)(fData);

        const xMin = model.boundingBox.xMin;
        const yMax = model.boundingBox.yMax;
        const dX = model.boundingBox.dX / model.gridSize.nX;
        const dY = model.boundingBox.dY / model.gridSize.nY;

        const tContours = contours.map((mp) => {
            mp.coordinates = mp.coordinates.map((c) => {
                c = c.map((cc) => {
                    cc = cc.map((ccc) => {
                        ccc[0] = xMin + ccc[0] * dX;
                        ccc[1] = yMax - ccc[1] * dY;
                        return ccc;
                    });
                    return cc;
                });
                return c;
            });

            if (model.rotation % 360 !== 0) {
                return turf.transformRotate(mp, model.rotation, {pivot: model.geometry.centerOfMass});
            }

            return mp;
        });

        return tContours.map((mp, key) => (
            <GeoJSON
                key={key}
                data={mp}
                color={`#${rainbowVis.colorAt(thresholds[key])}`}
                fillOpacity={0.8}
            >
                <Tooltip>{thresholds[key]}</Tooltip>
            </GeoJSON>
        ));
    };

    const p = generateContours();

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
            {p}
            {renderLegend(rainbowVis, unit)}
        </Map>
    );
};

export default rasterDataMap;
