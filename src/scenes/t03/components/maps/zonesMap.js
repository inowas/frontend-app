import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {GeoJSON, Map, FeatureGroup, Polygon} from 'react-leaflet';
import {ModflowModel} from 'core/model/modflow';
import {BasicTileLayer} from 'services/geoTools/tileLayers';

import {disableMap, generateKey, getStyle} from './index';
import {getBoundsLatLonFromGeoJSON} from 'services/geoTools/index';
import {EditControl} from 'react-leaflet-draw';
import {SoilmodelLayer, SoilmodelZone} from 'core/model/modflow/soilmodel';

const styles = {
    map: {
        height: '400px',
        width: '100%'
    }
};

class ZonesMap extends Component {
    componentDidMount() {
        disableMap(this.map);
    }

    render() {
        const {model, readOnly, zone, layer} = this.props;
        const zones = layer.zones;

        let options = {
            edit: {
                remove: false
            },
            draw: {
                polyline: false,
                polygon: !zone.geometry,
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
                dragging={!readOnly}
                boxZoom={!readOnly}
                touchZoom={!readOnly}
                doubleClickZoom={!readOnly}
                scrollWheelZoom={!readOnly}
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
                {zones.all.filter(z => z.id !== zone.id).length > 0 ?
                    <FeatureGroup>
                        {zones.all.filter(z => z.id !== zone.id).map(z => {
                            return (
                                <Polygon
                                    key={z.id}
                                    id={z.id}
                                    positions={z.geometry.coordinatesLatLng}
                                    color='grey'
                                    weight={0.1}
                                />
                            );
                        })
                        })}
                    </FeatureGroup>
                    :
                    <div/>
                }
                <FeatureGroup>
                    <EditControl
                        position="bottomright"
                        onCreated={this.props.onCreatePath}
                        onEdited={this.props.onEditPath}
                        {...options}
                    />
                    {zone.geometry &&
                    <Polygon
                        key={zone.id}
                        id={zone.id}
                        positions={zone.geometry.coordinatesLatLng}
                    />
                    }
                </FeatureGroup>
            </Map>
        );
    }
}

ZonesMap.propTypes = {
    zone: PropTypes.instanceOf(SoilmodelZone).isRequired,
    layer: PropTypes.instanceOf(SoilmodelLayer).isRequired,
    model: PropTypes.instanceOf(ModflowModel).isRequired,
    onCreatePath: PropTypes.func.isRequired,
    onEditPath: PropTypes.func.isRequired,
    readOnly: PropTypes.bool
};

export default ZonesMap;
