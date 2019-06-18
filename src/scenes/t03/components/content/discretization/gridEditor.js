import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {Form, Grid} from 'semantic-ui-react';
import {Cells, BoundingBox, Geometry, GridSize, ModflowModel} from '../../../../../core/model/modflow';

import {dxCell, dyCell} from '../../../../../services/geoTools/distance';
import {sendCommand} from '../../../../../services/api';

import ContentToolBar from '../../../../shared/ContentToolbar';
import ModflowModelCommand from '../../../commands/modflowModelCommand';
import {ModelDiscretizationMap} from '../../maps';

import {updateModel} from '../../../actions/actions';

class GridEditor extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            cells: props.model.cells.toArray(),
            boundingBox: props.model.boundingBox.toArray(),
            lengthUnit: props.model.lengthUnit,
            geometry: props.model.geometry.toObject(),
            gridSize: props.model.gridSize.toObject(),
            gridSizeLocal: props.model.gridSize.toObject(),
            isDirty: false,
            isError: false
        }
    }

    onSave = () => {
        const model = this.props.model;
        model.cells = Cells.fromArray(this.state.cells);
        model.boundingBox = BoundingBox.fromArray(this.state.boundingBox);
        model.geometry = Geometry.fromObject(this.state.geometry);
        model.gridSize = GridSize.fromObject(this.state.gridSize);
        const command = ModflowModelCommand.updateModflowModelDiscretization(
            model.id,
            model.geometry.toObject(),
            model.boundingBox.toArray(),
            model.gridSize.toObject(),
            model.cells.toArray(),
            model.stressperiods.toObject(),
            model.lengthUnit, model.timeUnit
        );

        return sendCommand(command,
            () => {
                this.setState({isDirty: false});
                this.props.onChange(model);
            },
            () => this.setState({error: true})
        )
    };


    handleGridSizeChange = (e) => {
        const {type, target} = e;
        const {name, value} = target;

        if (type === 'change') {
            const gridSize = GridSize.fromObject(this.state.gridSizeLocal);
            gridSize[name] = value;
            this.setState({gridSizeLocal: gridSize.toObject()});
        }

        if (type === 'blur') {
            this.setState({
                gridSize: this.state.gridSizeLocal,
                isDirty: true
            }, () => this.validate());
        }
    };

    validate = () => {
    };

    handleMapChange = ({cells, boundingBox, geometry}) => {
        this.setState({
            cells: cells.toArray(),
            boundingBox: boundingBox.toArray(),
            geometry: geometry.toObject(),
            isDirty: true
        })
    };

    render() {
        const gridSize = GridSize.fromObject(this.state.gridSize);
        const gridSizeLocal = GridSize.fromObject(this.state.gridSizeLocal);
        const boundingBox = BoundingBox.fromArray(this.state.boundingBox);
        const {model} = this.props;
        const readOnly = model.readOnly;
        return (
            <Grid>
                <Grid.Row>
                    <Grid.Column width={16}>
                        <ContentToolBar
                            isDirty={this.state.isDirty}
                            isError={this.state.isError}
                            saveButton
                            onSave={this.onSave}
                            importButton={!readOnly}
                        />
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column>
                        <Form>
                            <Form.Group>
                                <Form.Input
                                    type='number'
                                    label='Rows'
                                    name={'nY'}
                                    value={gridSizeLocal.nY}
                                    onChange={this.handleGridSizeChange}
                                    onBlur={this.handleGridSizeChange}
                                    width={'6'}
                                    readOnly
                                />
                                <Form.Input
                                    type='number'
                                    label='Columns'
                                    name={'nX'}
                                    value={gridSizeLocal.nX}
                                    onChange={this.handleGridSizeChange}
                                    onBlur={this.handleGridSizeChange}
                                    width={'6'}
                                    readOnly
                                />
                                <Form.Input
                                    type='number'
                                    label='Cell height'
                                    value={Math.round(dyCell(boundingBox, gridSize) * 10000) / 10}
                                    width={'6'}
                                    readOnly
                                />
                                <Form.Input
                                    type='number'
                                    label='Cell width'
                                    value={Math.round(dxCell(boundingBox, gridSize) * 10000) / 10}
                                    width={'6'}
                                    readOnly
                                />
                                <Form.Select compact
                                             label='Length unit'
                                             options={[{key: 2, text: 'meters', value: 2}]}
                                             style={{zIndex: 10000}}
                                             value={this.state.lengthUnit}
                                />
                            </Form.Group>
                        </Form>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column>
                        <ModelDiscretizationMap
                            cells={Cells.fromArray(this.state.cells)}
                            boundingBox={BoundingBox.fromArray(this.state.boundingBox)}
                            geometry={Geometry.fromObject(this.state.geometry)}
                            gridSize={GridSize.fromObject(this.state.gridSize)}
                            onChange={this.handleMapChange}
                        /></Grid.Column>
                </Grid.Row>

                <Grid.Row>
                    <Grid.Column width={16}>

                    </Grid.Column>
                </Grid.Row>
            </Grid>
        )
    }
}

const mapStateToProps = state => {
    return {
        model: ModflowModel.fromObject(state.T03.model)
    };
};

const mapDispatchToProps = {
    onChange: updateModel
};

GridEditor.propTypes = {
    model: PropTypes.instanceOf(ModflowModel).isRequired,
    onChange: PropTypes.func.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(GridEditor);
