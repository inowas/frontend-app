import * as GeoJSON from 'geojson';
import {BasicTileLayer} from '../../../../../services/geoTools/tileLayers';
import {BoundingBox} from '../../../../../core/model/geometry';
import {Button, Form, Grid, Modal, Tab, TabProps} from 'semantic-ui-react';
import {CircleMarker, MapContainer, Polygon, Polyline} from 'react-leaflet';
import {GeoJson} from '../../../../../core/model/geometry/Geometry.type'
import {GeoJsonGeometryTypes} from 'geojson';
import {Geometry} from '../../../../../core/model/modflow';
import {IGeometry} from '../../../../../core/model/geometry/Geometry.type';
import {JSON_SCHEMA_URL} from '../../../../../services/api';
import {LatLngBoundsExpression, LatLngExpression} from 'leaflet';
import {SemanticSIZES} from 'semantic-ui-react/dist/commonjs/generic';
import {convertGeometry} from '../../../../../services/geoTools/convertGeometry';
import {getStyle} from '../../../../../services/geoTools/mapHelpers';
import {uniqueId} from 'lodash';
import {validate} from '../../../../../services/jsonSchemaValidator';
import React, {MouseEvent, useEffect, useRef, useState} from 'react';
import UploadGeoJSONFile from './UploadGeoJSONFile';
import _ from 'lodash';

type TGeometryString = 'linestring' | 'point' | 'polygon';

interface IProps {
    onChange: (geometry: Geometry) => void;
    geometry?: TGeometryString;
    size?: SemanticSIZES;
}

const style = {
    map: {
        height: 500,
        width: '100%'
    },
    textArea: {
        minHeight: 500

    }
};
const examples: { [index in TGeometryString]: string } = {
    linestring: `{
    "type": "LineString",
    "coordinates": [
        [32.50803990407131, 34.76602340671524],
        [32.50778413028787, 34.76640018660390],
        [32.50739565519518, 34.76665194213551]
    ]
}`,
    point: `{
    "type": "Point",
    "coordinates": [
        32.459729998186553,
        34.731475001275314
    ]
}`,
    polygon: `{
    "type": "Polygon",
    "coordinates": [
        [
            [
                32.45585808775890,
                34.73041834971243
            ],
            [
                32.45630544090171,
                34.72972783194123
            ],
            [
                32.45701791200979,
                34.72928746921800
            ],
            [
                32.45585808775890,
                34.73041834971243
            ]
        ]
    ]
}`
};

const UploadGeoJSONModal = (props: IProps) => {
    const [showModal, setShowModal] = useState<boolean>(false);
    const [geometry, setGeometry] = useState<IGeometry | undefined>(undefined);
    const [geoJson, setGeoJson] = useState<string>('');
    const [isValid, setIsValid] = useState<boolean>(false);
    const [activeTab, setActiveTab] = useState<number>(0);

    const mapRef = useRef<JSX.Element>(null);

    useEffect(() => {
        if (geometry && geometry.type === 'Point' && mapRef.current) {
            mapRef.current.leafletElement.flyTo({
                lat: geometry.coordinates[1],
                lng: geometry.coordinates[0]
            }, 6);
        }
    }, [geometry]);

    const handleChangeGeometry = () => {
        if (geometry === undefined || !isValid) {
            return;
        }

        props.onChange(Geometry.fromObject(geometry));
        setShowModal(false);
    };

    const getBoundsLatLng = () => {
        if (geometry && geometry.type !== 'Point') {
            return BoundingBox.fromGeoJson(geometry).getBoundsLatLng() as LatLngBoundsExpression;
        }

        return [[60, 10], [45, 30]] as LatLngBoundsExpression;
    };

    const handleChangeGeoJSON = (e: any, {value}: any) => {
        setGeoJson(value);
        try {
            const parsedJSON: GeoJson = convertGeometry(JSON.parse(value), props.geometry);
            validate(parsedJSON, `${JSON_SCHEMA_URL}/geojson/${props.geometry || 'polygon'}.json`).then((r) => {
                if (!r[0]) {
                    return setIsValid(false);
                }

                setGeometry(Geometry.fromObject(parsedJSON).toGeoJSON());
                setIsValid(true);
                return;
            });
        } catch (e) {
            return setIsValid(false);
        }
    };

    const handleBlurGeoJSON = () => {
        if (isValid) {
            const parsedJSON = JSON.parse(geoJson);
            setGeoJson(JSON.stringify(parsedJSON, undefined, 4));
        }
    };

    const handleChangeTab = (e: MouseEvent<HTMLDivElement>, {activeIndex}: TabProps) => {
        if (activeIndex !== undefined) {
            setActiveTab(typeof activeIndex === 'number' ? activeIndex : parseInt(activeIndex, 10));
        }
    };

    const areaLayer = () => {
        if (geometry === undefined) {
            return;
        }

        switch (geometry.type.toLowerCase()) {
            case 'point':
                return (
                    <CircleMarker
                        key={uniqueId(Geometry.fromObject(geometry as GeoJSON.Point).hash())}
                        center={[
                            geometry.coordinates[1],
                            geometry.coordinates[0]
                        ]}
                        {...getStyle('well')}
                    />
                );
            case 'linestring':
                return (
                    <Polyline
                        key={uniqueId(Geometry.fromObject(geometry as GeoJSON.LineString).hash())}
                        positions={
                            Geometry.fromObject(geometry as GeoJSON.LineString).coordinatesLatLng as LatLngExpression[]
                        }
                    />
                );
            case 'polygon':
                return (
                    <Polygon
                        key={uniqueId(Geometry.fromObject(geometry as GeoJSON.Polygon).hash())}
                        positions={
                            Geometry.fromObject(geometry as GeoJSON.Polygon).coordinatesLatLng as LatLngExpression[]
                        }
                    />
                );
            default:
                return null;
        }
    };

    if (!showModal) {
        return (
            <Button
                fluid={!!props.size}
                onClick={() => {
                    setShowModal(true);
                    setGeometry(undefined);
                }}
                size={props.size || 'massive'}
                content={'Load geoJSON'}
            />
        );
    }

    return (
        <Modal open={true} dimmer={'inverted'}>
            <Modal.Header>Load geoJSON</Modal.Header>
            <Modal.Content>
                <Grid columns={2}>
                    <Grid.Row>
                        <Grid.Column>
                            <Tab
                                activeIndex={activeTab}
                                menu={{
                                    secondary: true,
                                    pointing: true
                                }}
                                panes={[
                                    {menuItem: 'Copy/Paste'},
                                    {menuItem: 'File'}
                                ]}
                                onTabChange={handleChangeTab}
                            />
                        </Grid.Column>
                    </Grid.Row>
                    {activeTab === 0 ?
                        <Grid.Row>
                            <Grid.Column>
                                <Form>
                                    <Form.TextArea
                                        onChange={handleChangeGeoJSON}
                                        onBlur={handleBlurGeoJSON}
                                        placeholder={`Paste GeoJson here:
${props.geometry ? examples[props.geometry] : examples.polygon}`}
                                        value={geoJson}
                                        width={16}
                                        style={style.textArea}
                                    />
                                </Form>
                            </Grid.Column>
                            <Grid.Column>
                                <MapContainer
                                    style={style.map}
                                    bounds={getBoundsLatLng()}
                                    ref={mapRef}
                                >
                                    <BasicTileLayer/>
                                    {geometry && areaLayer()}
                                </MapContainer>
                            </Grid.Column>
                        </Grid.Row>
                        :
                        <UploadGeoJSONFile
                            geometry={geometry ? Geometry.fromObject(geometry) : undefined}
                            onChange={(data) => handleChangeGeoJSON(undefined, {value: data})}
                            type={_.capitalize(props.geometry) as GeoJsonGeometryTypes || 'Polygon'}
                        />
                    }
                </Grid>
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

export default UploadGeoJSONModal;
