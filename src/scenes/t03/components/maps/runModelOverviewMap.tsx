import {uniqueId} from 'lodash';
import React from 'react';
import {GeoJSON, Map} from 'react-leaflet';
import {ModflowModel} from '../../../../core/model/modflow';
import AffectedCellsLayer from '../../../../services/geoTools/affectedCellsLayer';
import {BasicTileLayer} from '../../../../services/geoTools/tileLayers';
import {disableMap, getStyle, invalidateSize} from './index';

interface IProps {
    model: ModflowModel;
}

const styles = {
    map: {
        minHeight: 300
    }
};

const runModelOverviewMap = (props: IProps) => {
    const {cells, boundingBox, geometry, gridSize, rotation} = props.model;

    const getBoundsLatLng = () => {
        return geometry.getBoundsLatLng();
    };

    const renderBoundingBox = () => {
        const data = rotation ?
            boundingBox.geoJsonWithRotation(rotation, geometry.centerOfMass) :
            boundingBox.geoJson;
        return (
            <GeoJSON
                key={uniqueId()}
                data={data}
                style={getStyle('bounding_box')}
            />
        );
    };

    return (
        <Map
            style={styles.map}
            ref={(map) => {
                disableMap(map);
                invalidateSize(map);
            }}
            zoomControl={false}
            bounds={getBoundsLatLng()}
        >
            <BasicTileLayer/>
            <GeoJSON
                key={geometry.hash()}
                data={geometry.toGeoJSON()}
                style={getStyle('area')}
            />
            {renderBoundingBox()}
            <AffectedCellsLayer
                boundingBox={boundingBox}
                gridSize={gridSize}
                cells={cells}
                rotation={rotation % 369 !== 0 ? {geometry, angle: rotation} : undefined}
            />
        </Map>
    );
};

export default runModelOverviewMap;
