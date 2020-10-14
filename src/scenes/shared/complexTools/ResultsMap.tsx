import {LeafletMouseEvent} from 'leaflet';
import React, {useEffect, useRef, useState} from 'react';
import {
    FeatureGroup, GeoJSON,
    LayersControl,
    Map,
    Viewport
} from 'react-leaflet';
import uuid from 'uuid';
import {Array2D} from '../../../core/model/geometry/Array2D.type';
import {ICell} from '../../../core/model/geometry/Cells.type';
import {Geometry, ModflowModel} from '../../../core/model/modflow';
import {BoundaryCollection} from '../../../core/model/modflow/boundaries';
import {getCellFromClick} from '../../../services/geoTools/getCellFromClick';
import {BasicTileLayer} from '../../../services/geoTools/tileLayers';
import Rainbow from '../../../services/rainbowvis/Rainbowvis';
import {renderAreaLayer, renderBoundaryOverlays, renderBoundingBoxLayer} from '../../t03/components/maps/mapLayers';
import {ColorLegend, ReactLeafletHeatMapCanvasOverlay} from '../rasterData';
import ContourLayer from '../rasterData/contourLayer';
import {
    createGridData,
    max,
    min,
    rainbowFactory
} from '../rasterData/helpers';
import {IReactLeafletHeatMapProps} from '../rasterData/ReactLeafletHeatMapCanvasOverlay.type';
import {FullscreenControl} from './index';

const style = {
    map: {
        height: '400px',
        width: '100%',
        cursor: 'pointer'
    },
    selectedRow: {
        color: '#000',
        weight: 0.5,
        opacity: 0.5,
        fillColor: '#000',
        fillOpacity: 0.5
    },
    selectedCol: {
        color: '#000',
        weight: 0.5,
        opacity: 0.5,
        fillColor: '#000',
        fillOpacity: 0.5
    },
};

interface IProps {
    activeCell: ICell;
    boundaries: BoundaryCollection;
    data: Array2D<number>;
    globalMinMax?: [number, number];
    ibound?: Array2D<number>;
    mode?: 'contour' | 'heatmap';
    model: ModflowModel;
    onClick: (cell: ICell) => any;
    onViewPortChange?: (viewport: Viewport) => any;
    viewport?: Viewport;
    colors?: string[];
    opacity?: number;
}

interface IState {
    viewport: Viewport | null;
}

const ResultsMap = (props: IProps) => {
    const [state, setState] = useState<IState>({viewport: null});
    const [renderKey, setRenderKey] = useState<string>(uuid.v4());
    const mapRef = useRef<Map | null>(null);

    useEffect(() => {
        const {viewport} = props;
        if (viewport) {
            setState({viewport});
        }
    }, []);

    useEffect(() => {
        const {viewport} = props;
        if (viewport) {
            setState({viewport});
        }
    }, [props.viewport]);

    useEffect(() => {
        setRenderKey(uuid.v4());
    }, [props.activeCell]);

    const handleClickOnMap = ({latlng}: LeafletMouseEvent) => {
        const activeCell = getCellFromClick(
            props.model.boundingBox,
            props.model.gridSize,
            latlng,
            props.model.rotation,
            props.model.geometry.centerOfMass
        );

        if (!props.model.gridSize.isWithIn(activeCell[0], activeCell[1])) {
            return;
        }

        props.onClick(activeCell);
    };

    const renderLegend = (rainbow: Rainbow) => {
        const gradients = rainbow.gradients.slice().reverse();
        const lastGradient = gradients[gradients.length - 1];
        const legend = gradients.map((gradient) => ({
            color: '#' + gradient.endColor,
            value: Number(gradient.maxNum).toExponential(2)
        }));

        legend.push({
            color: '#' + lastGradient.startColor,
            value: Number(lastGradient.minNum).toExponential(2)
        });

        return <ColorLegend legend={legend} unit="m"/>;
    };

    const renderSelectedRowAndCol = () => {
        const [selectedCol, selectedRow] = props.activeCell;

        const dX = props.model.boundingBox.dX / props.model.gridSize.nX;
        const dY = props.model.boundingBox.dY / props.model.gridSize.nY;

        const selectedRowJson = Geometry.fromGeoJson({
            type: 'Feature',
            geometry: {
                type: 'Polygon',
                coordinates: [
                    [
                        [props.model.boundingBox.xMin, props.model.boundingBox.yMax - selectedRow * dY],
                        [props.model.boundingBox.xMax, props.model.boundingBox.yMax - selectedRow * dY],
                        [props.model.boundingBox.xMax, props.model.boundingBox.yMax - (selectedRow + 1) * dY],
                        [props.model.boundingBox.xMin, props.model.boundingBox.yMax - (selectedRow + 1) * dY],
                        [props.model.boundingBox.xMin, props.model.boundingBox.yMax - selectedRow * dY]
                    ]
                ]
            }
        });

        const selectedColJson = Geometry.fromGeoJson({
            type: 'Feature',
            geometry: {
                type: 'Polygon',
                coordinates: [
                    [
                        [props.model.boundingBox.xMin + selectedCol * dX, props.model.boundingBox.yMin],
                        [props.model.boundingBox.xMin + selectedCol * dX, props.model.boundingBox.yMax],
                        [props.model.boundingBox.xMin + (selectedCol + 1) * dX, props.model.boundingBox.yMax],
                        [props.model.boundingBox.xMin + (selectedCol + 1) * dX, props.model.boundingBox.yMin],
                        [props.model.boundingBox.xMin + selectedCol * dX, props.model.boundingBox.yMin]
                    ]
                ]
            }
        });

        return (
            <FeatureGroup key={renderKey}>
                <GeoJSON
                    data={selectedColJson.toGeoJSONWithRotation(
                        -1 * props.model.rotation, props.model.geometry.centerOfMass
                    )}
                    color={style.selectedCol.color}
                    weight={style.selectedCol.weight}
                    opacity={style.selectedCol.opacity}
                    fillColor={style.selectedCol.fillColor}
                    fillOpacity={style.selectedCol.fillOpacity}
                />
                <GeoJSON
                    data={selectedRowJson.toGeoJSONWithRotation(
                        -1 * props.model.rotation, props.model.geometry.centerOfMass
                    )}
                    color={style.selectedCol.color}
                    weight={style.selectedCol.weight}
                    opacity={style.selectedCol.opacity}
                    fillColor={style.selectedCol.fillColor}
                    fillOpacity={style.selectedCol.fillOpacity}
                />
            </FeatureGroup>
        );
    };

    const handleViewPortChange = () => {
        if (!mapRef.current) {
            return;
        }

        const {viewport} = mapRef.current;
        setState({viewport});

        if (!props.onViewPortChange) {
            return;
        }

        return props.onViewPortChange(viewport);
    };

    let minData = min(props.data);
    let maxData = max(props.data);

    if (props.globalMinMax) {
        [minData, maxData] = props.globalMinMax;
    }

    const rainbowVis = rainbowFactory(
        {min: minData, max: maxData},
        props.colors || ['#800080', '#ff2200', '#fcff00', '#45ff8e', '#15d6ff', '#0000FF']
    );

    const renderRaster = () => {
        const mapProps = {
            nX: props.model.gridSize.nX,
            nY: props.model.gridSize.nY,
            rainbow: rainbowVis,
            data: createGridData(props.data, props.model.gridSize.nX, props.model.gridSize.nY),
            bounds: props.model.boundingBox.getBoundsLatLng(),
            opacity: 0.75,
            sharpening: 10,
            zIndex: 1
        } as IReactLeafletHeatMapProps;

        if ((props.mode && props.mode === 'contour') || (!props.mode && props.model.rotation % 360 !== 0)) {
            return (
                <ContourLayer
                    boundingBox={props.model.boundingBox}
                    data={props.data}
                    geometry={props.model.geometry}
                    gridSize={props.model.gridSize}
                    ibound={props.ibound}
                    rainbow={rainbowVis}
                    rotation={props.model.rotation}
                />
            );
        }
        return (
            <ReactLeafletHeatMapCanvasOverlay
                {
                    ...mapProps
                }
            />
        );
    };

    return (
        <Map
            ref={mapRef}
            style={style.map}
            bounds={state.viewport ? undefined : props.model.geometry.getBoundsLatLng()}
            zoom={state.viewport && state.viewport.zoom ? state.viewport.zoom : undefined}
            center={state.viewport && state.viewport.center ? state.viewport.center : undefined}
            onclick={handleClickOnMap}
            boundsOptions={{padding: [20, 20]}}
            onmoveend={handleViewPortChange}
        >
            <BasicTileLayer/>
            <FullscreenControl position="topright"/>
            <LayersControl position="topright">
                <LayersControl.Overlay name="Model area" checked={true}>
                    {renderAreaLayer(props.model.geometry)}
                </LayersControl.Overlay>
                {renderRaster()}
                {renderBoundingBoxLayer(props.model.boundingBox, props.model.rotation, props.model.geometry)}
                {renderBoundaryOverlays(props.boundaries)}
                {renderLegend(rainbowVis)}
            </LayersControl>
            {renderSelectedRowAndCol()}
        </Map>
    );
};

export default ResultsMap;
