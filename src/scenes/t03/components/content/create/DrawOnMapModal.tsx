import {LatLngBoundsExpression} from 'leaflet';
import md5 from 'md5';
import React, {useState} from 'react';
import {FeatureGroup, GeoJSON, Map} from 'react-leaflet';
import {EditControl} from 'react-leaflet-draw';
import {Button, Modal} from 'semantic-ui-react';
import {Geometry} from '../../../../../core/model/modflow';
import {getStyle} from '../../../../../services/geoTools/mapHelpers';
import {BasicTileLayer} from '../../../../../services/geoTools/tileLayers';

interface IProps {
    onChange: (geometry: Geometry) => void;
}

const style = {
    map: {
        height: '500px',
        width: '100%'
    }
};

const drawOnMapModal = (props: IProps) => {
    const [showModal, setShowModal] = useState<boolean>(false);
    const [geometry, setGeometry] = useState<Geometry | undefined>(undefined);

    const handleChangeGeometry = () => {
        if (geometry === undefined) {
            return;
        }

        props.onChange(geometry);
        setShowModal(false);
    };

    const onCreated = (e: any) => {
        const polygon = e.layer;
        setGeometry(Geometry.fromGeoJson(polygon.toGeoJSON()));
    };

    const editControl = () => (
        <FeatureGroup>
            <EditControl
                position={'topright'}
                draw={{
                    circle: false,
                    circlemarker: false,
                    marker: false,
                    polyline: false,
                    rectangle: false,
                    polygon: geometry === undefined
                }}
                edit={{
                    edit: geometry !== undefined,
                    remove: geometry !== undefined
                }}
                onCreated={onCreated}
            />
        </FeatureGroup>
    );

    const areaLayer = () => {
        if (geometry === undefined) {
            return;
        }

        return (
            <GeoJSON
                key={md5(JSON.stringify(geometry))}
                data={geometry}
                style={getStyle('area')}
            />
        );
    };

    if (!showModal) {
        return (
            <Button
                onClick={() => {
                    setShowModal(true);
                    setGeometry(undefined);
                }}
                size={'massive'}
                content={'Draw on map'}
            />
        );
    }

    return (
        <Modal open={true} dimmer={'inverted'}>
            <Modal.Header>Draw your Polygon on map</Modal.Header>
            <Modal.Content>
                <Map
                    style={style.map}
                    bounds={[[60, 10], [45, 30]] as LatLngBoundsExpression}
                >
                    <BasicTileLayer/>
                    {!geometry && editControl()}
                    {geometry && areaLayer()}
                </Map>
            </Modal.Content>
            <Modal.Actions>
                <Button color={'black'} onClick={() => setShowModal(false)}>
                    Cancel
                </Button>
                <Button
                    positive={true}
                    disabled={geometry === undefined}
                    icon={'checkmark'}
                    labelPosition={'right'}
                    content={'Apply'}
                    onClick={handleChangeGeometry}
                />
            </Modal.Actions>
        </Modal>
    );
};

export default drawOnMapModal;
