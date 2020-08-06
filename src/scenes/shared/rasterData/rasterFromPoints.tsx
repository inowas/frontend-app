import React, {ChangeEvent, FormEvent, useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import {DropdownProps, Form, Grid, InputOnChangeData, Segment} from 'semantic-ui-react';
import uuid from 'uuid';
import {Array2D} from '../../../core/model/geometry/Array2D.type';
import {ModflowModel} from '../../../core/model/modflow';
import {BoundaryCollection, BoundaryFactory} from '../../../core/model/modflow/boundaries';
import {IBoundary} from '../../../core/model/modflow/boundaries/Boundary.type';
import {IRootReducer} from '../../../reducers';
import {distanceWeighting, IIdwOptions} from '../../../services/geoTools/interpolation';
import {AdvancedCsvUpload} from '../simpleTools/upload';
import {ECsvColumnType} from '../simpleTools/upload/types';
import {RasterDataMap} from './index';

interface IProps {
    onChange: (r: Array2D<number>) => any;
    unit: string;
}

const rasterFromPoints = (props: IProps) => {
    const [activeInput, setActiveInput] = useState<string>();
    const [activeValue, setActiveValue] = useState<string>('');
    const [points, setPoints] = useState<IBoundary[]>();
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

    if (!model) {
        return (
            <Segment color={'grey'} loading={true}/>
        );
    }

    useEffect(() => {
        runCalculation();
    }, [data, idwOptions]);

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
            const boundaries = BoundaryCollection.fromObject(r.map((rr, key) => BoundaryFactory.fromObject({
                id: uuid.v4(),
                type: 'Feature',
                geometry: {
                    type: 'Point',
                    coordinates: [rr[0], rr[1]]
                },
                properties: {
                    cells: [],
                    layers: [],
                    name: `point ${key}`,
                    sp_values: [],
                    type: 'wel',
                    well_type: 'puw'
                }
            }).toObject()));

            setData(r.map((row) => {
                return {x: row[0], y: row[1], z: row[2]};
            }));
            setPoints(boundaries.toObject());
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

    return (
        <Grid>
            <Grid.Row>
                <Grid.Column width={8}>
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
                    {data !== undefined && points && raster &&
                    <Segment>
                        <RasterDataMap
                            boundaries={BoundaryCollection.fromObject(points)}
                            data={raster}
                            model={model}
                            unit={props.unit}
                        />
                    </Segment>
                    }
                </Grid.Column>
            </Grid.Row>
        </Grid>
    );
};

export default rasterFromPoints;
