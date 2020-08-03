import React, {FormEvent, useState} from 'react';
import {useSelector} from 'react-redux';
import {Dimmer, DropdownProps, Form, Grid, Loader, Segment} from 'semantic-ui-react';
import uuid from 'uuid';
import {Array2D} from '../../../core/model/geometry/Array2D.type';
import {ModflowModel} from '../../../core/model/modflow';
import {BoundaryCollection, BoundaryFactory} from '../../../core/model/modflow/boundaries';
import {IBoundary} from '../../../core/model/modflow/boundaries/Boundary.type';
import {IRootReducer} from '../../../reducers';
import {distanceWeighting} from '../../../services/geoTools/interpolation';
import {AdvancedCsvUpload} from '../simpleTools/upload';
import {ECsvColumnType} from '../simpleTools/upload/types';
import {RasterDataMap} from './index';

interface IProps {
    onChange: (r: Array2D<number>) => any;
    unit: string;
}

const rasterFromPoints = (props: IProps) => {
    const [points, setPoints] = useState<IBoundary[]>();
    const [data, setData] = useState<number[][]>();
    const [isFetching, setIsFetching] = useState<boolean>(false);
    const [mode, setMode] = useState<string>('idw');
    const [raster, setRaster] = useState<Array2D<number>>();

    const T03 = useSelector((state: IRootReducer) => state.T03);
    const model = T03.model ? ModflowModel.fromObject(T03.model) : null;

    if (!model) {
        return (
            <Segment color={'grey'} loading={true}/>
        );
    }

    const handleChangeMode = (e: FormEvent<HTMLElement>, {value}: DropdownProps) => {
        if (typeof value === 'string') {
            return setMode(value);
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

            const cRaster = distanceWeighting(
                model.geometry,
                model.boundingBox,
                model.gridSize,
                r.map((row) => {
                    return {x: row[0], y: row[1], z: row[2]};
                })
            );

            setData(r);
            setPoints(boundaries.toObject());
            setRaster(cRaster);
            props.onChange(cRaster);
        }
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
                                options={[
                                    {key: 'idw', text: 'Inverse Distance Weighting (IDW)', value: 'idw'}
                                ]}
                                onChange={handleChangeMode}
                                value={mode}
                            />
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
            <Grid.Row/>
            <Grid.Row>
                <Grid.Column>
                    {isFetching &&
                    <Dimmer active={true} inverted={true}>
                        <Loader inverted={true}>Loading</Loader>
                    </Dimmer>
                    }
                </Grid.Column>
            </Grid.Row>
        </Grid>
    );
};

export default rasterFromPoints;
