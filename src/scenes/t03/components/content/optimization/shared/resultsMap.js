import React from 'react';
import PropTypes from 'prop-types';
import {GeoJSON, Map, TileLayer, CircleMarker, Tooltip} from 'react-leaflet';
import {geoJSON as leafletGeoJSON} from 'leaflet';
//TODO: import md5 from 'js-md5';
import {uniqueId} from 'lodash';

class OptimizationResultsMap extends React.Component {

    getBounds = geometry => leafletGeoJSON(geometry).getBounds();

    generateKeyFunction = geometry => JSON.stringify(geometry); //TODO: md5(JSON.stringify(geometry));

    drawObject = (boundingBox, gridSize, location, label = null, color = 'red') => {
        const bbXmin = boundingBox[0][0];
        const bbYmin = boundingBox[0][1];
        const bbXmax = boundingBox[1][0];
        const bbYmax = boundingBox[1][1];

        const styles = {
            point: {
                color: color,
                weight: 0.3
            },
            polygon: {
                color: 'grey',
                weight: 0.3
            },
            mapFix: {
                zIndex: -1
            }
        };

        const dX = (bbXmax - bbXmin) / gridSize.n_x;
        const dY = (bbYmax - bbYmin) / gridSize.n_y;

        const cXres = bbXmin + location.col.result * dX;
        const cYres = bbYmax - location.row.result * dY;

        return (
            <div key={uniqueId()}>
                <CircleMarker
                    center={[
                        cYres,
                        cXres
                    ]}
                    {...styles.point}
                >
                    {label &&
                    <Tooltip permanent
                             direction="right"
                             offset={[10, 0]}
                             opacity={0.5}
                    >
                        <span>{label}</span>
                    </Tooltip>
                    }
                </CircleMarker>
            </div>
        );
    };

    render() {
        const {area} = this.props;
        if (!this.props.bbox || !area) {
            return null;
        }

        return (
            <Map
                className="boundaryGeometryMap"
                bounds={this.getBounds(this.props.area)}
            >
                <TileLayer url="http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png"/>
                <GeoJSON
                    key={this.generateKeyFunction(area)}
                    data={area}
                />
                {this.props.objects && this.props.objects.length > 0 &&
                <div>
                    {
                        this.props.objects.map(object => {
                            if (this.props.selectedObject && object.id === this.props.selectedObject.id) {
                                return this.drawObject(this.props.bbox, this.props.gridSize, object.position, object.name, 'red');
                            }
                            return this.drawObject(this.props.bbox, this.props.gridSize, object.position, object.name, 'blue');
                        })
                    }
                </div>
                }
            </Map>
        );
    }
}

OptimizationResultsMap.propTypes = {
    area: PropTypes.object.isRequired,
    bbox: PropTypes.array.isRequired,
    objects: PropTypes.array.isRequired,
    selectedObject: PropTypes.object,
    readOnly: PropTypes.bool,
    gridSize: PropTypes.object.isRequired,
};

export default OptimizationResultsMap;