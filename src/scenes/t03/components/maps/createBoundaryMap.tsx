import {BasicTileLayer} from '../../../../services/geoTools/tileLayers';
import {BoundaryFactory} from '../../../../core/model/modflow/boundaries';
import {BoundaryType} from '../../../../core/model/modflow/boundaries/Boundary.type';
import {EditControl} from 'react-leaflet-draw';
import {FeatureGroup, LayersControl, MapContainer} from 'react-leaflet';
import {Geometry} from '../../../../core/model/modflow';
import { renderAreaLayer, renderBoundaryOverlays } from './mapLayers';
import BoundaryCollection from '../../../../core/model/modflow/boundaries/BoundaryCollection';
import CenterControl from '../../../shared/leaflet/CenterControl';
import React, {useRef, useState} from 'react';

interface IProps {
    area: Geometry;
    boundaries: BoundaryCollection;
    geometry: Geometry | null;
    onChangeGeometry: (geometry: Geometry) => any;
    onToggleEditMode?: () => any;
    type: BoundaryType;
}

const style = {
    map: {
        height: '400px'
    }
};

const CreateBoundaryMap = (props: IProps) => {
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const mapRef = useRef<any>(null);

    const handleOnCreated = (e: any) => {
        const cGeometry = Geometry.fromGeoJson(e.layer.toGeoJSON());
        props.onChangeGeometry(cGeometry);
    };

    const handleOnEdited = (e: any) => {
        e.layers.eachLayer((layer: any) => {
            const cGeometry = Geometry.fromGeoJson(layer.toGeoJSON());
            props.onChangeGeometry(cGeometry);
        });
    };

    const handleToggleIsEditing = () => setIsEditing(!isEditing);

    const editControl = () => {
        const geometryType = BoundaryFactory.geometryTypeByType(props.type).toLowerCase();
        return (
            <FeatureGroup>
                <EditControl
                    position="topright"
                    draw={{
                        circle: false,
                        circlemarker: geometryType.toLowerCase() === 'point' && !props.geometry,
                        marker: false,
                        polyline: geometryType.toLowerCase() === 'linestring' && !props.geometry,
                        rectangle: false,
                        polygon: geometryType.toLowerCase() === 'polygon' && !props.geometry
                    }}
                    edit={{
                        edit: !!props.geometry,
                        remove: false
                    }}
                    onCreated={handleOnCreated}
                    onEdited={handleOnEdited}
                    onEditStart={handleToggleIsEditing}
                    onEditStop={handleToggleIsEditing}
                />
            </FeatureGroup>
        );
    };

    return (
        <React.Fragment>
            <MapContainer
                style={style.map}
                bounds={props.area.getBoundsLatLng()}
                ref={mapRef}
            >
                {mapRef.current &&
                <CenterControl
                    map={mapRef.current}
                    bounds={props.area.getBoundsLatLng()}
                />
                }
                <BasicTileLayer/>
                {props.boundaries.length > 0 &&
                    <LayersControl position="topright">
                        {renderBoundaryOverlays(props.boundaries)}
                    </LayersControl>
                }
                {editControl()}
                {renderAreaLayer(props.area)}
            </MapContainer>
        </React.Fragment>
    );
};

export default CreateBoundaryMap;
