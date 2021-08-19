import {AdvancedCsvUpload} from '../upload';
import {Array2D} from '../../../core/model/geometry/Array2D.type';
import {CircleMarker, FeatureGroup, Tooltip} from 'react-leaflet';
import {DropdownProps, Form, Grid, InputOnChangeData, Segment} from 'semantic-ui-react';
import {ECsvColumnType} from '../upload/types';
import {IIdwOptions, distanceWeighting} from '../../../services/geoTools/interpolation';
import {IRootReducer} from '../../../reducers';
import {ModflowModel} from '../../../core/model/modflow';
import {RasterDataMap} from './index';
import {useSelector} from 'react-redux';
import React, {ChangeEvent, FormEvent, useEffect, useState} from 'react';
import uuid from 'uuid';

interface IProps {
    onChange: (r: Array2D<number>) => any;
    unit: string;
}

const RasterFromPoints = (props: IProps) => {
    const [activeInput, setActiveInput] = useState<string>();
    const [activeValue, setActiveValue] = useState<string>('');
    const [data, setData] = useState<Array<{ x: number, y: number, z: number }>>();
    const [mode, setMode] = useState<string>('idw');
    const [idwOptions, setIdwOptions] = useState<IIdwOptions>({
        mode: 'number',
        numberOfPoints: 5,
        range: 3
    });
    const [raster, setRaster] = useState<Array2D<number>>();

    const T03 = useSelector((state: IRootReducer) => state.T03);
    const model = T03.model ? ModflowModel.fromObject(T03.model) : null;

    useEffect(() => {
        runCalculation();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data, idwOptions]);

    if (!model) {
        return (
            <Segment color={'grey'} loading={true}/>
        );
    }

    const handleBlurInput = () => {
        if (activeInput) {
            setIdwOptions({
                ...idwOptions,
                [activeInput]: parseFloat(activeValue)
            });
            setActiveInput(undefined);
        }
    };

    const handleChangeInput = (e: ChangeEvent<HTMLInputElement>, {name, value}: InputOnChangeData) => {
        setActiveInput(name);
        setActiveValue(value);
    };

    const handleChangeSelect = (e: FormEvent<HTMLElement>, {name, value}: DropdownProps) => {
        if (typeof value === 'string') {
            if (name === 'mode') {
                return setMode(value);
            }
            if (name === 'idwMode') {
                return setIdwOptions({
                    ...idwOptions,
                    mode: value
                });
            }
        }
    };

    const handleChangeData = (r: any[][]) => {
        if (r.length > 0 && r[0].length === 3 &&
            typeof r[0][0] === 'number' && typeof r[0][1] === 'number' && typeof r[0][2] === 'number') {
            setData(r.map((row) => {
                return {x: row[0], y: row[1], z: row[2]};
            }));
        }
    };

    const runCalculation = () => {
        if (!data) {
            return null;
        }

        const cRaster = distanceWeighting(
            model.geometry,
            model.boundingBox,
            model.gridSize,
            data,
            model.rotation,
            idwOptions
        );
        setRaster(cRaster);
        props.onChange(cRaster);
    };

    // TODO: Points are behind contour layer but should be in front of it (#1934)
    const renderPoints = () => {
        if (!data) {
            return null;
        }
        return (
            <FeatureGroup zIndex={10000}>
                {data.map((point) => (
                    <CircleMarker
                        key={uuid.v4()}
                        center={[
                            point.y,
                            point.x
                        ]}
                        radius={3}
                    >
                        <Tooltip>
                            <span>{point.z} {props.unit}</span>
                        </Tooltip>
                    </CircleMarker>
                ))}
            </FeatureGroup>
        );
    };

    return (
        <Grid>
            <Grid.Row>
                <Grid.Column width={8}>
                    <Segment color={'green'}>
                        <p>Upload CSV file with columns lat, lng and value:</p>
                        <AdvancedCsvUpload
                            columns={[
                                {key: 0, value: 'x', text: 'x', type: ECsvColumnType.NUMBER},
                                {key: 1, value: 'y', text: 'y', type: ECsvColumnType.NUMBER},
                                {key: 2, value: 'z', text: 'z', type: ECsvColumnType.NUMBER}
                            ]}
                            onCancel={() => null}
                            onSave={handleChangeData}
                            withoutModal={true}
                        />
                    </Segment>
                </Grid.Column>
                <Grid.Column width={8}>
                    <Segment>
                        <Form>
                            <Form.Select
                                fluid={true}
                                label="Interpolation method"
                                name="mode"
                                options={[
                                    {key: 'idw', text: 'Inverse Distance Weighting (IDW)', value: 'idw'}
                                ]}
                                onChange={handleChangeSelect}
                                value={mode}
                            />
                            {mode === 'idw' &&
                            <Form.Select
                                fluid={true}
                                label="Method of selecting neighbors"
                                name="idwMode"
                                options={[
                                    {key: 'number', text: 'Select x closest neighbors', value: 'number'},
                                    {key: 'range', text: 'Select by range in degrees', value: 'range'}
                                ]}
                                onChange={handleChangeSelect}
                                value={idwOptions.mode}
                            />
                            }
                            {mode === 'idw' && idwOptions.mode === 'number' &&
                            <Form.Input
                                fluid={true}
                                label="Number of neighbors"
                                name="numberOfPoints"
                                onBlur={handleBlurInput}
                                onChange={handleChangeInput}
                                type="number"
                                value={activeInput === 'numberOfPoints' ? activeValue : idwOptions.numberOfPoints}
                            />
                            }
                            {mode === 'idw' && idwOptions.mode === 'range' &&
                            <Form.Input
                                fluid={true}
                                label="Range [degrees]"
                                name="range"
                                onBlur={handleBlurInput}
                                onChange={handleChangeInput}
                                type="number"
                                value={activeInput === 'range' ? activeValue : idwOptions.range}
                            />
                            }
                        </Form>
                    </Segment>
                    {data !== undefined && raster &&
                    <Segment>
                        <RasterDataMap
                            data={raster}
                            model={model}
                            unit={props.unit}
                        >
                            {renderPoints()}
                        </RasterDataMap>
                    </Segment>
                    }
                </Grid.Column>
            </Grid.Row>
        </Grid>
    );
};

export default RasterFromPoints;
