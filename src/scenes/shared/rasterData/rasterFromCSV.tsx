import React, {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import {Grid, List, Segment} from 'semantic-ui-react';
import {Array2D} from '../../../core/model/geometry/Array2D.type';
import {ModflowModel} from '../../../core/model/modflow';
import {IRootReducer} from '../../../reducers';
import {AdvancedCsvUpload} from '../simpleTools/upload';
import {ECsvColumnType} from '../simpleTools/upload/types';
import RasterDataMap from './rasterDataMap';

interface IProps {
    onChange: (r: Array2D<number>) => any;
    unit: string;
}

const RasterFromCSV = (props: IProps) => {
    const [data, setData] = useState<Array<{ col: number, row: number, value: number }>>();
    const [isCalculating, setIsCalculating] = useState<boolean>(false);

    const [raster, setRaster] = useState<Array2D<number>>();

    const T03 = useSelector((state: IRootReducer) => state.T03);
    const model = T03.model ? ModflowModel.fromObject(T03.model) : null;

    useEffect(() => {
        if (data) {
            setIsCalculating(true);
        }
    }, [data]);

    useEffect(() => {
        if (isCalculating && data) {
            runCalculation();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isCalculating]);

    if (!model) {
        return (
            <Segment color={'grey'} loading={true}/>
        );
    }

    const handleChangeData = (r: any[][]) => {
        if (r.length > 0 && r[0].length === 3 &&
            typeof r[0][0] === 'number' && typeof r[0][1] === 'number' && typeof r[0][2] === 'number') {
            setData(r.map((row) => {
                return {col: row[1] - 1, row: row[0] - 1, value: row[2]};
            }));
        }
    };

    const runCalculation = () => {
        if (!data) {
            return null;
        }

        const cRaster = new Array(model.gridSize.nY).fill(0).map(() => new Array(model.gridSize.nX)
            .fill(0)) as Array2D<number>;

        data.forEach((s) => {
            if (cRaster.length > s.row && cRaster[s.row] && cRaster[s.row].length > s.col) {
                cRaster[s.row][s.col] = s.value;
            }
        });

        setRaster(cRaster);
        setIsCalculating(false);
        props.onChange(cRaster);
    };

    return (
        <Grid>
            <Grid.Row>
                <Grid.Column width={8}>
                    <Segment color={'green'}>
                        <List>
                            <List.Item>Upload CSV file with columns col, row and value.</List.Item>
                            <List.Item>Number of rows and columns must match model grid size
                                (nX = {model.gridSize.nX}, nY = {model.gridSize.nY}).</List.Item>
                        </List>
                        <AdvancedCsvUpload
                            columns={[
                                {key: 0, value: 'row', text: 'row', type: ECsvColumnType.NUMBER},
                                {key: 1, value: 'col', text: 'col', type: ECsvColumnType.NUMBER},
                                {key: 2, value: 'value', text: 'value', type: ECsvColumnType.NUMBER}
                            ]}
                            onCancel={() => null}
                            onSave={handleChangeData}
                            withoutModal={true}
                        />
                    </Segment>
                </Grid.Column>
                <Grid.Column width={8}>
                    {raster &&
                    <RasterDataMap
                        data={raster}
                        model={model}
                        unit={props.unit}
                    />
                    }
                </Grid.Column>
            </Grid.Row>
        </Grid>
    );
};

export default RasterFromCSV;
