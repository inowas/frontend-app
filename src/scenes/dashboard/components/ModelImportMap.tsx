import React from 'react';
import {CircleMarker, FeatureGroup, GeoJSON, LayersControl, Map} from 'react-leaflet';
import {BoundingBox, Geometry} from '../../../core/model/modflow';
import {Boundary, BoundaryCollection, HeadObservationWell, WellBoundary} from '../../../core/model/modflow/boundaries';
import {getStyle} from '../../../services/geoTools/mapHelpers';
import {BasicTileLayer} from '../../../services/geoTools/tileLayers';

interface IProps {
    boundaries: BoundaryCollection;
    boundingBox: BoundingBox;
    geometry: Geometry;
}

const style = {
    map: {
        height: '400px',
        width: '100%',
        cursor: 'pointer'
    }
};

const modelImportMap = (props: IProps) => {

    const isWellBoundary = (b: Boundary): b is WellBoundary => {
        return b.type === 'wel';
    };

    const isHeadObservationWell = (b: Boundary): b is HeadObservationWell => {
        return b.type === 'hob';
    };

    const renderBoundaryOverlay = (boundaries: BoundaryCollection, name: string, type: string, checked = false) => (
        <LayersControl.Overlay name={name} checked={checked}>
            <FeatureGroup>
                {boundaries.all.filter((b: Boundary) => b.type === type).map((b) => {
                    if (isWellBoundary(b) || isHeadObservationWell(b)) {

                        let st = getStyle(b.type);
                        if (isWellBoundary(b)) {
                            st = getStyle(b.type, b.wellType);
                        }

                        return (
                            <CircleMarker
                                key={b.id}
                                center={[
                                    b.geometry.coordinates[1],
                                    b.geometry.coordinates[0]
                                ]}
                                {...st}
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

    return (
        <Map
            style={style.map}
            bounds={props.geometry.getBoundsLatLng()}
            boundsOptions={{padding: [5, 5]}}
        >
            <BasicTileLayer/>
            <LayersControl position="topright">
                <LayersControl.Overlay name="Model area" checked={true}>
                    <GeoJSON
                        key={props.geometry.hash()}
                        data={props.geometry.toGeoJSON()}
                        style={getStyle('area')}
                    />
                </LayersControl.Overlay>
                <LayersControl.Overlay name={'Bounding Box'} checked={true}>
                    <GeoJSON
                        key={props.boundingBox.hash()}
                        data={props.boundingBox.geoJson}
                        style={getStyle('bounding_box')}
                    />
                </LayersControl.Overlay>

                {renderBoundaryOverlay(props.boundaries, 'Constant head boundaries', 'chd', true)}
                {renderBoundaryOverlay(props.boundaries, 'General head boundaries', 'ghb', true)}
                {renderBoundaryOverlay(props.boundaries, 'Rivers', 'riv', true)}
                {renderBoundaryOverlay(props.boundaries, 'Recharge', 'rch', true)}
                {renderBoundaryOverlay(props.boundaries, 'Wells', 'wel', true)}

            </LayersControl>
        </Map>
    );
};

export default modelImportMap;
