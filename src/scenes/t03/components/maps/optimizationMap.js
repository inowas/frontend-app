import React from 'react';
import PropTypes from 'prop-types';
import {GeoJSON, Map, FeatureGroup, CircleMarker, Rectangle} from 'react-leaflet';
import {ModflowModel} from 'core/model/modflow';
import {BasicTileLayer} from 'services/geoTools/tileLayers';

import {disableMap, generateKey, getStyle} from './index';
import {getBoundsLatLonFromGeoJSON} from 'services/geoTools/index';
import {EditControl} from 'react-leaflet-draw';
import {AbstractPosition} from 'core/model/modflow/optimization';

import uuidv4 from 'uuid/v4';

const styles = {
    map: {
        height: '400px',
        width: '100%'
    }
};

class OptimizationMap extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isEditing: false
        };
    }

    componentDidMount() {
        disableMap(this.map);
    }

    toggleEditingState = () => this.setState({
        isEditing: !this.state.isEditing
    });

    drawObject = (location, color = 'red') => {
        const styles = {
            line: {
                color: color,
                weight: 0.3
            }
        };

        const {boundingBox, gridSize} = this.props.model;

        const dX = (boundingBox.xMax - boundingBox.xMin) / gridSize.nX;
        const dY = (boundingBox.yMax - boundingBox.yMin) / gridSize.nY;

        const cXmin = boundingBox.xMin + location.col.min * dX;
        const cXmax = boundingBox.xMin + location.col.max * dX;
        const cYmin = boundingBox.yMax - location.row.min * dY;
        const cYmax = boundingBox.yMax - location.row.max * dY;

        if (cXmin === cXmax && cYmin === cYmax && !this.state.isEditing) {
            return (
                <CircleMarker
                    key={uuidv4()}
                    center={[
                        cYmin,
                        cXmin
                    ]}
                    {...styles.line}
                />
            );
        }
        return (
            <Rectangle
                key={uuidv4()}
                bounds={[
                    {lng: cXmin, lat: cYmin},
                    {lng: cXmin, lat: cYmax},
                    {lng: cXmax, lat: cYmax},
                    {lng: cXmax, lat: cYmin},
                ]}
                {...styles.line}
            />
        );
    };

    render() {
        const {model} = this.props;

        let options = {
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

        return (
            <Map
                zoomControl={false}
                dragging={true}
                boxZoom={true}
                touchZoom={true}
                doubleClickZoom={true}
                scrollWheelZoom={true}
                bounds={getBoundsLatLonFromGeoJSON(model.geometry.toGeoJSON())}
                ref={map => {
                    this.map = map
                }}
                style={styles.map}
            >
                <BasicTileLayer/>
                <GeoJSON
                    key={generateKey(model.geometry.toGeoJSON())}
                    data={model.geometry.toGeoJSON()}
                    style={getStyle('area')}
                />
                <FeatureGroup>
                    {!model.readOnly ?
                    <EditControl
                        position="bottomright"
                        onEdited={this.props.onEditPath}
                        {...options}
                        onEditStart={this.toggleEditingState}
                        onEditStop={this.toggleEditingState}
                    /> : <div/>
                    }
                    {this.drawObject(this.props.location)}
                </FeatureGroup>
            </Map>
        );
    }
}

OptimizationMap.propTypes = {
    location: PropTypes.instanceOf(AbstractPosition).isRequired,
    model: PropTypes.instanceOf(ModflowModel).isRequired,
    onEditPath: PropTypes.func.isRequired
};

export default OptimizationMap;
