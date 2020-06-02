import {uniqueId} from 'lodash';
import React from 'react';
import {GeoJSON} from 'react-leaflet';
import {ModflowModel} from '../../../../core/model/modflow';
import {getStyle} from '../../../../services/geoTools/mapHelpers';

export const renderAreaLayer = (model: ModflowModel) => {
    return (
        <GeoJSON
            key={model.geometry.hash()}
            data={model.geometry.toGeoJSON()}
            style={getStyle('area')}
        />
    );
};

export const renderBoundingBoxLayer = (model: ModflowModel) => {
    const data = model.rotation ?
        model.boundingBox.geoJsonWithRotation(model.rotation, model.geometry.centerOfMass) :
        model.boundingBox.geoJson;
    return (
        <GeoJSON
            key={uniqueId()}
            data={data}
            style={getStyle('bounding_box')}
        />
    );
};
