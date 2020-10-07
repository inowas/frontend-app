import md5 from 'md5';
import React from 'react';
import {CircleMarker, FeatureGroup, GeoJSON, LayersControl} from 'react-leaflet';
import {BoundingBox, Geometry} from '../../../../core/model/geometry';
import {HeadObservationWell, WellBoundary} from '../../../../core/model/modflow/boundaries';
import {EBoundaryType} from '../../../../core/model/modflow/boundaries/Boundary.type';
import BoundaryCollection from '../../../../core/model/modflow/boundaries/BoundaryCollection';
import {getStyle} from '../../../../services/geoTools/mapHelpers';

export const renderAreaLayer = (geometry: Geometry) => {
    return (
        <GeoJSON
            key={geometry.hash()}
            data={geometry.toGeoJSON()}
            style={getStyle('area')}
        />
    );
};

export const renderBoundaryOverlay = (
    boundaries: BoundaryCollection,
    name: string,
    type: EBoundaryType,
    checked: boolean = false
) => {
    const filtered = boundaries.all.filter((b) => b.type === type);

    if (filtered.length === 0) {
        return null;
    }

    return (
        <LayersControl.Overlay key={type} name={name} checked={checked}>
            <FeatureGroup>
                {filtered.map((b) => {
                    if (b instanceof WellBoundary || b instanceof HeadObservationWell) {
                        return (
                            <CircleMarker
                                key={b.id}
                                center={[
                                    b.geometry.coordinates[1],
                                    b.geometry.coordinates[0]
                                ]}
                                {...getStyle(b.type, b instanceof WellBoundary ? b.wellType : undefined)}
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
};

export const renderBoundaryOverlays = (boundaries: BoundaryCollection) => {
    return [
        renderBoundaryOverlay(boundaries, 'Constant head boundaries', EBoundaryType.CHD),
        renderBoundaryOverlay(boundaries, 'Drainage', EBoundaryType.DRN),
        renderBoundaryOverlay(boundaries, 'Evapotranspiration', EBoundaryType.EVT),
        renderBoundaryOverlay(boundaries, 'Flow and head boundaries', EBoundaryType.FHB),
        renderBoundaryOverlay(boundaries, 'General head boundaries', EBoundaryType.GHB),
        renderBoundaryOverlay(boundaries, 'Head observations', EBoundaryType.HOB),
        renderBoundaryOverlay(boundaries, 'Recharge', EBoundaryType.RCH),
        renderBoundaryOverlay(boundaries, 'Rivers', EBoundaryType.RIV, true),
        renderBoundaryOverlay(boundaries, 'Wells', EBoundaryType.WEL, true)
    ];
};

export const renderBoundingBoxLayer = (boundingBox: BoundingBox, rotation?: number, geometry?: Geometry) => {
    const data = rotation && geometry ?
        boundingBox.geoJsonWithRotation(rotation, geometry.centerOfMass) :
        boundingBox.geoJson;
    return (
        <GeoJSON
            key={md5(JSON.stringify(data))}
            data={data}
            style={getStyle('bounding_box')}
        />
    );
};
