import React from 'react';
import PropTypes from 'prop-types';
import {BoundaryCollection, ModflowModel} from 'core/model/modflow';
import {CircleMarker, GeoJSON, LayersControl, Map, Rectangle} from 'react-leaflet';
import {BasicTileLayer} from 'services/geoTools/tileLayers';
import {getStyle} from './helpers';
import CanvasHeatMapOverlay from '../../../shared/rasterData/ReactLeafletHeatMapCanvasOverlay';
import {createGridData, max, min, rainbowFactory} from '../../../shared/rasterData/helpers';
import ColorLegend from '../../../shared/rasterData/ColorLegend';
import {getActiveCellFromCoordinate} from 'services/geoTools';
import FeatureGroup from 'react-leaflet/es/FeatureGroup';

const style = {
    map: {
        height: '400px',
        width: '100%'
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

class ResultsMap extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            activeCell: [0, 0]
        }
    }

    componentDidMount() {
        const activeCell = [
            Math.floor(this.props.model.gridSize.nX / 2),
            Math.floor(this.props.model.gridSize.nY / 2),
        ];

        this.setState({activeCell});
        this.props.onClick(activeCell);
    }

    handleClickOnMap = ({latlng}) => {
        const x = latlng.lng;
        const y = latlng.lat;
        const activeCell = getActiveCellFromCoordinate([x, y], this.props.model.boundingBox, this.props.model.gridSize);
        this.setState({activeCell});
        this.props.onClick(activeCell);
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

    renderSelectedRowAndCol = () => {
        const [selectedCol, selectedRow] = this.state.activeCell;
        const {boundingBox, gridSize} = this.props.model;

        const dX = boundingBox.dX / gridSize.nX;
        const dY = boundingBox.dY / gridSize.nY;

        const selectedRowBoundsLatLng = [
            [boundingBox.yMax - selectedRow * dY, boundingBox.xMin],
            [boundingBox.yMax - (selectedRow + 1) * dY, boundingBox.xMax]
        ];

        const selectedColBoundsLatLng = [
            [boundingBox.yMin, boundingBox.xMin + selectedCol * dX],
            [boundingBox.yMax, boundingBox.xMin + (selectedCol + 1) * dX]
        ];

        return (
            <FeatureGroup>
                <Rectangle
                    bounds={selectedColBoundsLatLng}
                    color={style.selectedCol.color}
                    weight={style.selectedCol.weight}
                    opacity={style.selectedCol.opacity}
                    fillColor={style.selectedCol.fillColor}
                    fillOpacity={style.selectedCol.fillOpacity}
                />
                <Rectangle
                    bounds={selectedRowBoundsLatLng}
                    color={style.selectedRow.color}
                    weight={style.selectedRow.weight}
                    opacity={style.selectedRow.opacity}
                    fillColor={style.selectedRow.fillColor}
                    fillOpacity={style.selectedRow.fillOpacity}
                />
            </FeatureGroup>
        )
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
                {this.renderSelectedRowAndCol()}
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
