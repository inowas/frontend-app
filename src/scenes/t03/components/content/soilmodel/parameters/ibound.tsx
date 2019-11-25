import {cloneDeep} from 'lodash';
import React from 'react';
import {Checkbox, Grid, Header} from 'semantic-ui-react';
import {Cells} from '../../../../../../core/model/geometry';
import {ICell} from '../../../../../../core/model/geometry/Cells.type';
import {ModflowModel} from '../../../../../../core/model/modflow';
import {RasterParameter} from '../../../../../../core/model/modflow/soilmodel';
import SoilmodelLayer from '../../../../../../core/model/modflow/soilmodel/SoilmodelLayer';
import RasterDataImage from '../../../../../shared/rasterData/rasterDataImage';
import {DiscretizationMap} from '../../discretization';

interface IProps {
    model: ModflowModel;
    layer: SoilmodelLayer;
    onChange: (layer: SoilmodelLayer) => any;
    parameter: RasterParameter;
}

const ibound = (props: IProps) => {
    const parameters = props.layer.toObject().parameters;

    const handleChangeCells = (cells: Cells) => {
        const layer = props.layer.toObject();
        layer.parameters = parameters.map((p) => {
            if (p.id === props.parameter.id) {
                p.value = cells.toArray();
            }
            return p;
        });
        return props.onChange(SoilmodelLayer.fromObject(layer));
    };

    const handleToggleDefault = () => {
        const cParameters = cloneDeep(parameters);

        if (cParameters.filter((p) => p.id === props.parameter.id).length === 0) {
            cParameters.push({
                id: props.parameter.id,
                data: {file: null},
                value: props.model.cells.toObject()
            });
            const cLayer = props.layer.toObject();
            cLayer.parameters = cParameters;
            return props.onChange(SoilmodelLayer.fromObject(cLayer));
        }

        const layer = props.layer.toObject();
        layer.parameters = parameters.filter((p) => p.id !== props.parameter.id);
        return props.onChange(SoilmodelLayer.fromObject(layer));
    };

    const renderData = () => {
        let cells: Cells = new Cells();
        const cParameters = parameters.filter((p) => p.id === props.parameter.id);

        if (cParameters.length > 0) {
            const parameter = cParameters[0];
            const data = parameter.value !== null && parameter.value !== undefined ? parameter.value :
                parameter.data.data;
            if (Array.isArray(data)) {
                cells = Cells.fromArray(data as ICell[]);
            }

            return (
                <DiscretizationMap
                    cells={cells}
                    boundingBox={props.model.boundingBox}
                    geometry={props.model.geometry}
                    gridSize={props.model.gridSize}
                    onChangeCells={handleChangeCells}
                    readOnly={parameters.filter((p) => p.id === props.parameter.id).length === 0}
                />
            );
        }

        return (
            <RasterDataImage
                data={props.model.cells.calculateIBound(props.model.gridSize.nY, props.model.gridSize.nX)}
                gridSize={props.model.gridSize}
                unit={props.parameter.unit}
            />
        );
    };

    return (
        <Grid>
            <Grid.Row>
                <Grid.Column>
                    <Header as="h4">{props.parameter.title}, {props.parameter.id} [{props.parameter.unit}]
                        <Checkbox
                            checked={parameters.filter((p) => p.id === props.parameter.id).length === 0}
                            disabled={props.model.readOnly}
                            label="Use default value."
                            onChange={handleToggleDefault}
                            style={{float: 'right'}}
                            toggle={true}
                        />
                    </Header>
                    {renderData()}
                </Grid.Column>
            </Grid.Row>
        </Grid>
    );
};

export default ibound;
