import PropTypes from 'prop-types';
import React from 'react';
import {createGridData} from '../../../shared/rasterData/helpers';
import {BasicTileLayer} from '../../../../services/geoTools/tileLayers';
import {Map, Rectangle, FeatureGroup} from 'react-leaflet';
import {Raster} from '../../../../core/model/mcda/gis';
import CanvasHeatMapOverlay from '../../../shared/rasterData/ReactLeafletHeatMapCanvasOverlay';
import ColorLegend from '../../../shared/rasterData/ColorLegend';
import ColorLegendDiscrete from '../../../shared/rasterData/ColorLegendDiscrete';
import {EditControl} from 'react-leaflet-draw';
import {getStyle} from '../../../t03/components/maps';
import {BoundingBox} from '../../../../core/model/geometry';
import Rainbow from '../../../../../node_modules/rainbowvis.js/rainbowvis';
import RasterDataImage from '../../../shared/rasterData/rasterDataImage';
import {Button, Icon} from 'semantic-ui-react';
import {getActiveCellFromCoordinate} from "../../../../services/geoTools";

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

const maximumGridCells = 10000;

class CriteriaRasterMap extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            showMap: props.raster.gridSize.nX * props.raster.gridSize.nY <= maximumGridCells
        }
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            showMap: nextProps.showBasicLayer === true || nextProps.raster.gridSize.nX * nextProps.raster.gridSize.nY <= maximumGridCells
        });
    }

    onClickMap = e => {
        const latlng = e.latlng;
        if (latlng) {
            const raster = this.props.raster;

            const cell = getActiveCellFromCoordinate(
                [latlng.lng, latlng.lat],
                raster.boundingBox,
                raster.gridSize
            );

            if (cell[0] < 0 || cell[1] < 0 || cell[0] > raster.gridSize.nX || cell[1] > raster.gridSize.nY) {
                return;
            }

            return this.props.onClickCell({x: cell[0], y: cell[1]});
        }
    };

    onEditPath = e => {
        const layers = e.layers;

        layers.eachLayer(layer => {
            const boundingBox = BoundingBox.fromGeoJson(layer.toGeoJSON());
            const raster = this.props.raster;
            raster.boundingBox = boundingBox;
            this.props.onChange(raster);
        });
    };

    onToggleShowMap = () => this.setState(prevState => ({
        showMap: !prevState.showMap
    }));

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
        const {raster, showButton} = this.props;
        const {boundingBox, gridSize} = this.props.raster;

        if (!this.state.showMap) {
            return (
                <div>
                    {showButton &&
                    <Button
                        icon
                        fluid
                        onClick={this.onToggleShowMap}
                        labelPosition='left'
                    >
                        <Icon name='map'/>
                        Show on map (might take a while to render because of big grid size)
                    </Button>
                    }
                    <RasterDataImage
                        onClickCell={e => this.props.onClickCell(e)}
                        data={raster.data}
                        legend={this.props.legend}
                        unit=''
                        gridSize={gridSize}
                    />
                </div>
            );
        }

        return (
            <div>
                {showButton && gridSize.nX * gridSize.nY > maximumGridCells &&
                <Button
                    icon
                    fluid
                    onClick={this.onToggleShowMap}
                    labelPosition='left'
                >
                    <Icon name='image'/>
                    Show as Image (better performance)
                </Button>
                }
                <Map
                    style={{
                        width: '100%',
                        height: this.props.mapHeight || '600px'
                    }}
                    bounds={boundingBox.getBoundsLatLng()}
                    onClick={this.onClickMap}
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
                    {raster.data.length > 0 &&
                    <div>
                        <CanvasHeatMapOverlay
                            nX={gridSize.nX}
                            nY={gridSize.nY}
                            rainbow={this.props.legend}
                            dataArray={createGridData(raster.data, gridSize.nX, gridSize.nY)}
                            bounds={boundingBox.getBoundsLatLng()}
                            opacity={0.75}
                            sharpening={10}
                        />
                        {this.props.showLegend && this.renderLegend(this.props.legend)}
                    </div>
                    }
                </Map>
            </div>
        );
    }
}

CriteriaRasterMap.propTypes = {
    onChange: PropTypes.func,
    onClickCell: PropTypes.func,
    raster: PropTypes.instanceOf(Raster).isRequired,
    showBasicLayer: PropTypes.bool.isRequired,
    showButton: PropTypes.bool,
    showLegend: PropTypes.bool,
    legend: PropTypes.oneOfType([PropTypes.array, PropTypes.instanceOf(Rainbow)]).isRequired,
    mapHeight: PropTypes.string
};

CriteriaRasterMap.defaultProps = {
    showLegend: true
};

export default CriteriaRasterMap;
