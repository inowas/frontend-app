import React, {ChangeEvent} from 'react';
import {Form, Grid} from 'semantic-ui-react';
import {IBoundingBox} from '../../../../../core/model/geometry/BoundingBox.type';
import {ICells} from '../../../../../core/model/geometry/Cells.type';
import {IGeometry} from '../../../../../core/model/geometry/Geometry.type';
import {IGridSize} from '../../../../../core/model/geometry/GridSize.type';
import {BoundingBox, Cells, Geometry, GridSize, ModflowModel} from '../../../../../core/model/modflow';
import {BoundaryCollection} from '../../../../../core/model/modflow/boundaries';
import {ILengthUnit} from '../../../../../core/model/modflow/LengthUnit.type';
import {dxCell, dyCell} from '../../../../../services/geoTools/distance';
import ContentToolBar from '../../../../shared/ContentToolbar';
import {ModelDiscretizationMap} from '../../maps';

interface IState {
    boundingBox: IBoundingBox;
    geometry: IGeometry;
    gridSize: IGridSize;
    gridSizeLocal: IGridSize;
    cells: ICells;
    lengthUnit: ILengthUnit;
}

interface IProps {
    boundaries: BoundaryCollection;
    model: ModflowModel;
    isDirty: boolean;
    isError: boolean;
    onChange: (modflowModel: ModflowModel) => void;
    onSave: (modflowModel: ModflowModel) => void;
}

class GridEditor extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.state = {
            cells: props.model.cells.toObject(),
            boundingBox: props.model.boundingBox.toObject(),
            lengthUnit: props.model.lengthUnit.toInt(),
            geometry: props.model.geometry.toObject(),
            gridSize: props.model.gridSize.toObject(),
            gridSizeLocal: props.model.gridSize.toObject()
        };
    }

    public render() {
        const gridSize = GridSize.fromObject(this.state.gridSize);
        const gridSizeLocal = GridSize.fromObject(this.state.gridSizeLocal);
        const boundingBox = BoundingBox.fromObject(this.state.boundingBox);
        const readOnly = this.props.model.readOnly;

        return (
            <Grid>
                {!readOnly &&
                <Grid.Row>
                    <Grid.Column width={16}>
                        <ContentToolBar
                            isDirty={this.props.isDirty}
                            isError={this.props.isError}
                            visible={!(readOnly)}
                            saveButton={true}
                            onSave={this.onSave}
                        />
                    </Grid.Column>
                </Grid.Row>}
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
                                    readOnly={readOnly || this.props.boundaries.length > 0}
                                />
                                <Form.Input
                                    type="number"
                                    label="Columns"
                                    name={'n_x'}
                                    value={gridSizeLocal.nX}
                                    onChange={this.handleGridSizeChange}
                                    onBlur={this.handleGridSizeChange}
                                    width={'6'}
                                    readOnly={readOnly || this.props.boundaries.length > 0}
                                />
                                <Form.Input
                                    type="number"
                                    label="Cell height"
                                    value={Math.round(dyCell(boundingBox, gridSize) * 10000) / 10}
                                    width={'6'}
                                    readOnly={readOnly || this.props.boundaries.length > 0}
                                />
                                <Form.Input
                                    type="number"
                                    label="Cell width"
                                    value={Math.round(dxCell(boundingBox, gridSize) * 10000) / 10}
                                    width={'6'}
                                    readOnly={readOnly || this.props.boundaries.length > 0}
                                />
                                <Form.Select
                                    compact={true}
                                    label="Length unit"
                                    options={[{key: 2, text: 'meters', value: 2}]}
                                    style={{zIndex: 10000}}
                                    value={this.state.lengthUnit}
                                    disabled={readOnly || this.props.boundaries.length > 0}
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
                            readOnly={readOnly || this.props.boundaries.length > 0}
                        />
                    </Grid.Column>
                </Grid.Row>

                <Grid.Row>
                    <Grid.Column width={16}/>
                </Grid.Row>
            </Grid>
        );
    }

    private onSave = () => {
        const model = this.props.model.getClone();
        model.cells = Cells.fromObject(this.state.cells);
        model.boundingBox = BoundingBox.fromObject(this.state.boundingBox);
        model.geometry = Geometry.fromObject(this.state.geometry);
        model.gridSize = GridSize.fromObject(this.state.gridSize);
        return this.props.onSave(model);
    };

    private onChange = () => {
        const model = this.props.model.getClone();
        model.cells = Cells.fromObject(this.state.cells);
        model.boundingBox = BoundingBox.fromObject(this.state.boundingBox);
        model.geometry = Geometry.fromObject(this.state.geometry);
        model.gridSize = GridSize.fromObject(this.state.gridSize);
        this.props.onChange(model);
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
            }, () => this.onChange());
        }
    };

    private handleMapChange = (
        {cells, boundingBox, geometry}: { cells: Cells, boundingBox: BoundingBox, geometry: Geometry }
    ) => {
        this.setState({
            cells: cells.toObject(),
            boundingBox: boundingBox.toObject(),
            geometry: geometry.toObject(),
        }, () => this.onChange());
    };
}

export default GridEditor;
