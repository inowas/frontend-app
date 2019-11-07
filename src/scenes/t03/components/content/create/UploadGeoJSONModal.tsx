import {LatLngBoundsExpression} from 'leaflet';
import md5 from 'md5';
import React, {useState} from 'react';
import {GeoJSON, Map} from 'react-leaflet';
import {Button, Form, Grid, Modal} from 'semantic-ui-react';
import {BoundingBox} from '../../../../../core/model/geometry';
import {Geometry} from '../../../../../core/model/modflow';
import {JSON_SCHEMA_URL} from '../../../../../services/api';
import {getStyle} from '../../../../../services/geoTools/mapHelpers';
import {BasicTileLayer} from '../../../../../services/geoTools/tileLayers';
import {validate} from '../../../../../services/jsonSchemaValidator';

interface IProps {
    onChange: (geometry: Geometry) => void;
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

const uploadGeoJSONModal = (props: IProps) => {
    const [showModal, setShowModal] = useState<boolean>(false);
    const [geometry, setGeometry] = useState<Geometry | undefined>(undefined);
    const [geoJson, setGeoJson] = useState<string>('');
    const [isValid, setIsValid] = useState<boolean>(false);

    const handleChangeGeometry = () => {
        if (geometry === undefined) {
            return;
        }

        if (!isValid) {
            return;
        }

        props.onChange(geometry);
        setShowModal(false);
    };

    const getBoundsLatLng = () => {
        if (geometry) {
            return BoundingBox.fromGeoJson(geometry.toGeoJSON()).getBoundsLatLng() as LatLngBoundsExpression;
        }

        return [[60, 10], [45, 30]] as LatLngBoundsExpression;
    };

    const handleChangeGeoJSON = (e: any, {value}: any) => {
        setGeoJson(value);
        try {
            const parsedJSON = JSON.parse(value);
            validate(parsedJSON, `${JSON_SCHEMA_URL}/geojson/polygon.json`).then((r) => {
                if (r[0] === false) {
                    return setIsValid(false);
                }

                setGeometry(Geometry.fromObject(parsedJSON));
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
                            <Form>
                                <Form.TextArea
                                    onChange={handleChangeGeoJSON}
                                    onBlur={handleBlurGeoJSON}
                                    placeholder="Paste your geoJson here"
                                    value={geoJson}
                                    width={16}
                                    style={style.textArea}
                                />
                            </Form>
                        </Grid.Column>
                        <Grid.Column>
                            <Map
                                style={style.map}
                                bounds={getBoundsLatLng()}
                            >
                                <BasicTileLayer/>
                                {geometry && areaLayer()}
                            </Map>
                        </Grid.Column>
                    </Grid.Row>
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

export default uploadGeoJSONModal;
