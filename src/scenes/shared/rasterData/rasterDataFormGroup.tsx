import {chunk} from 'lodash';
import React, {MouseEvent} from 'react';
import {Button, ButtonProps, Form, Icon} from 'semantic-ui-react';
import LayersCollection from '../../../core/model/gis/LayersCollection';
import {ModflowModel} from '../../../core/model/modflow';
import {ISoilmodelLayer} from '../../../core/model/modflow/soilmodel/SoilmodelLayer.type';
import {RasterDataImage} from './index';

interface IProps {
    parameter: string;
    onClickEdit: (layerId: string, parameter: string) => any;
    layers: LayersCollection;
    model: ModflowModel;
}

const rasterDataFormGroup = (props: IProps) => {

    const renderLayer = (layer: ISoilmodelLayer, i: number) => {
        const param = layer.parameters.filter((p) => p.id === props.parameter);
        if (param.length === 0) {
            return (
                <Form.Field>
                    ERROR
                </Form.Field>
            );
        }

        const handleClickEdit = () => {
            return props.onClickEdit(layer.id, props.parameter);
        };

        return (
            <Form.Field key={i} width={8}>
                <div>
                    <label style={{float: 'left'}}>{layer.number}: {layer.name}</label>
                    <Icon
                        link={true}
                        style={{float: 'right', zIndex: 10000}}
                        name="edit"
                        onClick={handleClickEdit}
                        data-layer={layer.id}
                    />
                    <div style={{clear: 'both'}} />
                </div>
                <RasterDataImage
                    data={param[0].value}
                    gridSize={props.model.gridSize}
                    legend={Array.isArray(param[0].value) ? undefined : [{
                        value: param[0].value,
                        color: 'rgb(173, 221, 142)',
                        isContinuous: false,
                        label: param[0].value.toFixed(2)
                    }]}
                    unit={''}
                />
            </Form.Field>
        );
    };

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
