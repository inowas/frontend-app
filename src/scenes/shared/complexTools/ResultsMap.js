import React from 'react';
import PropTypes from 'prop-types';
import {Geometry, ModflowModel} from '../../../core/model/modflow';
import {CircleMarker, FeatureGroup, GeoJSON, LayersControl, Map, Rectangle} from 'react-leaflet';
import {BasicTileLayer} from '../../../services/geoTools/tileLayers';
import {getStyle} from '../../../services/geoTools/mapHelpers';
import {ColorLegend, ReactLeafletHeatMapCanvasOverlay} from '../rasterData';
import {createGridData, max, min, rainbowFactory} from '../rasterData/helpers';
import {getActiveCellFromCoordinate} from '../../../services/geoTools';
import {BoundaryCollection} from '../../../core/model/modflow/boundaries';

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

class ResultsMap extends React.Component {

    state = {viewport: null};
    map = null;

    componentDidMount() {
        const {viewport} = this.props;
        if (viewport) {
            this.setState({viewport})
        }
    }

    componentWillReceiveProps(nextProps, nextContext) {
        const {viewport} = nextProps;
        if (viewport) {
            this.setState({viewport})
        }
    }

    handleClickOnMap = ({latlng}) => {
        const x = latlng.lng;
        const y = latlng.lat;
        const activeCell = getActiveCellFromCoordinate([x, y], this.props.model.boundingBox, this.props.model.gridSize);
        const {gridSize} = this.props.model;

        if (!gridSize.isWithIn(activeCell[0], activeCell[1])) {
            return;
        }

        this.props.onClick(activeCell);
    };

    renderLegend = (rainbow) => {
        const gradients = rainbow.gradients.slice().reverse();
        const lastGradient = gradients[gradients.length - 1];
        const legend = gradients.map(gradient => ({
            color: '#' + gradient.endColor,
            value: Number(gradient.maxNum).toExponential(2)
        }));

        legend.push({
            color: '#' + lastGradient.startColor,
            value: Number(lastGradient.minNum).toExponential(2)
        });

        return <ColorLegend legend={legend} unit={''}/>;
    };

    renderSelectedRowAndCol = () => {
        const [selectedCol, selectedRow] = this.props.activeCell;
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

    renderBoundaryOverlay = (boundaries, name, type, checked = false) => (
        <LayersControl.Overlay name={name} checked={checked}>
            <FeatureGroup>
                {boundaries.all.filter(b => b.type === type).map(b => {
                    if (b.type === 'wel' || b.type === 'hob') {
                        return (
                            <CircleMarker
                                key={b.id}
                                center={[
                                    b.geometry.coordinates[1],
                                    b.geometry.coordinates[0]
                                ]}
                                {...getStyle(b.type, b.wellType)}
                            />
                        );
                    }

                    return (
                        <GeoJSON
                            key={Geometry.fromGeoJson(b.geometry).hash() + '-' + b.layers.join('-')}
                            data={b.geometry}
                            style={getStyle(b.type)}
                        />
                    );
                })}
            </FeatureGroup>
        </LayersControl.Overlay>
    );

    onViewPortChange = () => {
        if (!this.map) {
            return;
        }

        const {viewport} = this.map;
        this.setState({viewport});

        if (!this.props.onViewPortChange) {
            return;
        }

        this.props.onViewPortChange(viewport);
    };

    render() {
        const {boundaries, data, model} = this.props;
        const {boundingBox, geometry, gridSize} = model;

        let minData = min(data);
        let maxData = max(data);

        if (this.props.globalMinMax) {
            [minData, maxData] = this.props.globalMinMax;
        }

        const rainbowVis = rainbowFactory(
            {min: minData, max: maxData},
            this.props.colors || ['#800080', '#ff2200', '#fcff00', '#45ff8e', '#15d6ff', '#0000FF']
        );

        return (
            <Map
                ref={map => this.map = map}
                style={style.map}
                bounds={this.state.viewport ? null : this.props.model.geometry.getBoundsLatLng()}
                zoom={this.state.viewport ? this.state.viewport.zoom : null}
                center={this.state.viewport ? this.state.viewport.center : null}
                onClick={this.handleClickOnMap}
                boundsOptions={{padding: [20, 20]}}
                onMoveEnd={this.onViewPortChange}
            >
                <BasicTileLayer/>
                <LayersControl position="topright">
                    <LayersControl.Overlay name="Model area" checked>
                        <GeoJSON
                            key={geometry.hash()}
                            data={geometry.toGeoJSON()}
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

                    {this.renderBoundaryOverlay(boundaries, 'Constant head boundaries', 'chd')}
                    {this.renderBoundaryOverlay(boundaries, 'General head boundaries', 'ghb')}
                    {this.renderBoundaryOverlay(boundaries, 'Rivers', 'riv', true)}
                    {this.renderBoundaryOverlay(boundaries, 'Recharge', 'rch')}
                    {this.renderBoundaryOverlay(boundaries, 'Wells', 'wel', true)}

                    {data && <ReactLeafletHeatMapCanvasOverlay
                        nX={gridSize.nX}
                        nY={gridSize.nY}
                        rainbow={rainbowVis}
                        dataArray={createGridData(data, gridSize.nX, gridSize.nY)}
                        bounds={boundingBox.getBoundsLatLng()}
                        opacity={this.props.opacity || 0.5}
                        model={model}
                    />}
                    {this.renderLegend(rainbowVis)}
                </LayersControl>
                {this.renderSelectedRowAndCol()}
            </Map>
        )
    }
}

ResultsMap.propTypes = {
    activeCell: PropTypes.array.isRequired,
    boundaries: PropTypes.instanceOf(BoundaryCollection).isRequired,
    data: PropTypes.array.isRequired,
    globalMinMax: PropTypes.array,
    model: PropTypes.instanceOf(ModflowModel).isRequired,
    onClick: PropTypes.func,
    onViewPortChange: PropTypes.func,
    viewport: PropTypes.object,
    colors: PropTypes.array
};

export default ResultsMap;
