import React from 'react';
import PropTypes from 'prop-types';
import {BoundingBox, Geometry} from '../../../core/model/modflow';
import {CircleMarker, FeatureGroup, GeoJSON, LayersControl, Map} from 'react-leaflet';
import {BasicTileLayer} from '../../../services/geoTools/tileLayers';
import {getStyle} from '../../../services/geoTools/mapHelpers';
import {BoundaryCollection} from '../../../core/model/modflow/boundaries';

const style = {
    map: {
        height: '400px',
        width: '100%',
        cursor: 'pointer'
    }
};

class ModelImportMap extends React.Component {

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

    render() {
        const {boundaries, boundingBox, geometry} = this.props;

        return (
            <Map
                ref={map => this.map = map}
                style={style.map}
                bounds={this.props.geometry.getBoundsLatLng()}
                boundsOptions={{padding: [5, 5]}}
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

                    {this.renderBoundaryOverlay(boundaries, 'Constant head boundaries', 'chd', true)}
                    {this.renderBoundaryOverlay(boundaries, 'General head boundaries', 'ghb', true)}
                    {this.renderBoundaryOverlay(boundaries, 'Rivers', 'riv', true)}
                    {this.renderBoundaryOverlay(boundaries, 'Recharge', 'rch', true)}
                    {this.renderBoundaryOverlay(boundaries, 'Wells', 'wel', true)}

                </LayersControl>
            </Map>
        )
    }
}

ModelImportMap.propTypes = {
    boundaries: PropTypes.instanceOf(BoundaryCollection).isRequired,
    boundingBox: PropTypes.instanceOf(BoundingBox).isRequired,
    geometry: PropTypes.instanceOf(Geometry).isRequired
};

export default ModelImportMap;
