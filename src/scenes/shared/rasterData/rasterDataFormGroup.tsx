import {chunk} from 'lodash';
import React, {MouseEvent} from 'react';
import {Button, ButtonProps, Form} from 'semantic-ui-react';
import {Array2D} from '../../../core/model/geometry/Array2D.type';
import LayersCollection from '../../../core/model/gis/LayersCollection';
import {ModflowModel} from '../../../core/model/modflow';
import {ISoilmodelLayer} from '../../../core/model/modflow/soilmodel/SoilmodelLayer.type';
import {RasterDataImage} from './index';

interface IProps {
    data: number | Array2D<number>;
    onClickEdit: (e: MouseEvent<HTMLButtonElement>, data: ButtonProps) => any;
    layers: LayersCollection;
    model: ModflowModel;
}

const rasterDataFormGroup = (props: IProps) => {

    const renderLayer = (layer: ISoilmodelLayer, i: number) => (
        <Form.Field key={i} width={8}>
            <div>
                <label style={{float: 'left'}}>{layer.number}: {layer.name}</label>
                <Button
                    onClick={props.onClickEdit}
                    size="mini"
                    value={layer.id}
                >
                    Edit
                </Button>
            </div>
            <RasterDataImage
                data={props.data}
                gridSize={props.model.gridSize}
                legend={Array.isArray(props.data) ? undefined : [{
                    value: props.data,
                    color: 'rgb(173, 221, 142)',
                    isContinuous: false,
                    label: props.data.toFixed(2)
                }]}
                unit={''}
            />
        </Form.Field>
    );

    const renderFG = (e: ISoilmodelLayer[], i: number) => {
        return (
            <Form.Group key={i}>
                {renderLayer(e[0], 0)}
                {e.length === 2 ? renderLayer(e[1], 1) : null}
            </Form.Group>
        );
    };

    const renderRows = () => {
        const rows: JSX.Element[] = [];
        const chunkedLayers = chunk(props.layers.all, 2);
        chunkedLayers.forEach((layers, i) => {
            rows.push(renderFG(layers as ISoilmodelLayer[], i));
        });
        return rows;
    };

    return (
        <React.Fragment>
            {renderRows()}
        </React.Fragment>
    );
};

export default rasterDataFormGroup;
