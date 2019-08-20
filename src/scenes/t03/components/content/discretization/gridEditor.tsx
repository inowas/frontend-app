import React, {ChangeEvent} from 'react';
import {connect} from 'react-redux';
import {Form, Grid} from 'semantic-ui-react';
import {IBoundingBox} from '../../../../../core/model/geometry/BoundingBox.type';
import {ICells} from '../../../../../core/model/geometry/Cells.type';
import {IGeometry} from '../../../../../core/model/geometry/Geometry.type';
import {IGridSize} from '../../../../../core/model/geometry/GridSize.type';
import {BoundingBox, Cells, Geometry, GridSize, ModflowModel} from '../../../../../core/model/modflow';
import {ILengthUnit} from '../../../../../core/model/modflow/LengthUnit.type';

import {sendCommand} from '../../../../../services/api';
import {dxCell, dyCell} from '../../../../../services/geoTools/distance';
import ContentToolBar from '../../../../shared/ContentToolbar';
import ModflowModelCommand from '../../../commands/modflowModelCommand';
import {ModelDiscretizationMap} from '../../maps';

import {updateModel} from '../../../actions/actions';
import DiscretizationImport from './discretizationImport';

interface IState {
    boundingBox: IBoundingBox;
    geometry: IGeometry;
    gridSize: IGridSize;
    gridSizeLocal: IGridSize;
    cells: ICells;
    lengthUnit: ILengthUnit;
    isDirty: boolean;
    isError: boolean;
}

interface IStateProps {
    model: ModflowModel;
}

interface IDispatchProps {
    onChange: (modflowModel: ModflowModel) => void;
}

type IProps = IStateProps & IDispatchProps;

class GridEditor extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.state = {
            cells: props.model.cells.toObject(),
            boundingBox: props.model.boundingBox.toObject(),
            lengthUnit: props.model.lengthUnit.toInt(),
            geometry: props.model.geometry.toObject(),
            gridSize: props.model.gridSize.toObject(),
            gridSizeLocal: props.model.gridSize.toObject(),
            isDirty: false,
            isError: false
        };
    }

    public render() {
        const gridSize = GridSize.fromObject(this.state.gridSize);
        const gridSizeLocal = GridSize.fromObject(this.state.gridSizeLocal);
        const boundingBox = BoundingBox.fromObject(this.state.boundingBox);
        const readOnly = this.props.model.readOnly;

        return (
            <Grid>
                <Grid.Row>
                    <Grid.Column width={16}>
                        <ContentToolBar
                            isDirty={this.state.isDirty}
                            isError={this.state.isError}
                            visible={!readOnly}
                            saveButton={true}
                            onSave={this.onSave}
                            importButton={
                                <DiscretizationImport
                                    onChange={this.handleImport}
                                    model={this.props.model}
                                />
                            }
                        />
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column>
                        <Form>
                            <Form.Group>
                                <Form.Input
                                    type="number"
                                    label="Rows"
                                    name={'n_y'}
                                    value={gridSizeLocal.nY}
                                    onChange={this.handleGridSizeChange}
                                    onBlur={this.handleGridSizeChange}
                                    width={'6'}
                                    readOnly={readOnly}
                                />
                                <Form.Input
                                    type="number"
                                    label="Columns"
                                    name={'n_x'}
                                    value={gridSizeLocal.nX}
                                    onChange={this.handleGridSizeChange}
                                    onBlur={this.handleGridSizeChange}
                                    width={'6'}
                                    readOnly={readOnly}
                                />
                                <Form.Input
                                    type="number"
                                    label="Cell height"
                                    value={Math.round(dyCell(boundingBox, gridSize) * 10000) / 10}
                                    width={'6'}
                                    readOnly={readOnly}
                                />
                                <Form.Input
                                    type="number"
                                    label="Cell width"
                                    value={Math.round(dxCell(boundingBox, gridSize) * 10000) / 10}
                                    width={'6'}
                                    readOnly={readOnly}
                                />
                                <Form.Select
                                    compact={true}
                                    label="Length unit"
                                    options={[{key: 2, text: 'meters', value: 2}]}
                                    style={{zIndex: 10000}}
                                    value={this.state.lengthUnit}
                                    disabled={readOnly}
                                />
                            </Form.Group>
                        </Form>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column>
                        <ModelDiscretizationMap
                            cells={Cells.fromObject(this.state.cells)}
                            boundingBox={BoundingBox.fromObject(this.state.boundingBox)}
                            geometry={Geometry.fromObject(this.state.geometry)}
                            gridSize={GridSize.fromObject(this.state.gridSize)}
                            onChange={this.handleMapChange}
                        /></Grid.Column>
                </Grid.Row>

                <Grid.Row>
                    <Grid.Column width={16}/>
                </Grid.Row>
            </Grid>
        );
    }

    private handleImport = (model: ModflowModel) =>
        this.setState({
            boundingBox: model.boundingBox.toObject(),
            geometry: model.geometry.toObject(),
            gridSize: model.gridSize.toObject(),
            gridSizeLocal: model.gridSize.toObject(),
            cells: model.cells.toObject(),
            lengthUnit: model.lengthUnit.toInt(),
            isDirty: true
        });

    private onSave = () => {
        const model = this.props.model;
        model.cells = Cells.fromObject(this.state.cells);
        model.boundingBox = BoundingBox.fromObject(this.state.boundingBox);
        model.geometry = Geometry.fromObject(this.state.geometry);
        model.gridSize = GridSize.fromObject(this.state.gridSize);
        const command = ModflowModelCommand.updateModflowModelDiscretization(
            model.id,
            model.geometry.toObject(),
            model.boundingBox.toObject(),
            model.gridSize.toObject(),
            model.cells.toObject(),
            model.stressperiods.toObject(),
            model.lengthUnit.toInt(),
            model.timeUnit.toInt()
        );

        return sendCommand(command,
            () => {
                this.setState({isDirty: false});
                this.props.onChange(model);
            },
            () => this.setState({isError: true})
        );
    };

    private handleGridSizeChange = (e: ChangeEvent<HTMLInputElement>) => {
        const {type, target} = e;
        const {name, value} = target;

        if (type === 'change') {
            this.setState((prevState) => ({
                gridSizeLocal: {...prevState.gridSizeLocal, [name]: parseInt(value, 10)}
            }));
        }

        if (type === 'blur') {
            this.setState({
                gridSize: this.state.gridSizeLocal,
                isDirty: true
            });
        }
    };

    private handleMapChange = (
        {cells, boundingBox, geometry}: { cells: Cells, boundingBox: BoundingBox, geometry: Geometry }
    ) => {
        this.setState({
            cells: cells.toObject(),
            boundingBox: boundingBox.toObject(),
            geometry: geometry.toObject(),
            isDirty: true
        });
    };
}

const mapStateToProps = (state: any) => ({
    model: ModflowModel.fromObject(state.T03.model)
});

const mapDispatchToProps = (dispatch: any) => ({
    onChange: (model: ModflowModel) => dispatch(updateModel(model))
});

export default connect(mapStateToProps, mapDispatchToProps)(GridEditor);
