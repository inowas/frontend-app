import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {Form, Grid} from 'semantic-ui-react';
import ContentToolBar from '../../../../shared/ContentToolbar';
import {ActiveCells, BoundingBox, Geometry, GridSize, ModflowModel} from 'core/model/modflow';
import {updateModel} from '../../../actions/actions';
import Command from '../../../commands/command';

import {sendCommand} from 'services/api';
import SpatialDiscretizationMap from '../../maps/spatialDiscretizationMap';

class GridEditor extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            activeCells: props.model.activeCells.toArray(),
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

        const command = Command.updateModflowModel({
            id: model.id,
            model: model.toObject()
        });

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
            this.setState({gridSize: this.state.gridSizeLocal}, () => this.validate());
        }
    };

    handleMapChange = ({activeCells, boundingBox, geometry}) => {
        this.setState({
            activeCells: activeCells.toArray(),
            boundingBox: boundingBox.toArray(),
            geometry: geometry.toObject()
        })
    };


    render() {
        return (
            <Grid>
                <Grid.Row>
                    <Grid.Column width={16}>
                        <ContentToolBar
                            isDirty={this.state.isDirty}
                            isError={this.state.isError}
                            saveButton
                            onSave={this.onSave}
                        />
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column width={5}>
                        <Form color={'grey'}>
                            <Form.Input
                                type='number'
                                label='Rows'
                                name={'nY'}
                                value={GridSize.fromObject(this.state.gridSizeLocal).nY}
                                onChange={this.handleGridSizeChange}
                                onBlur={this.handleGridSizeChange}
                            />
                            <Form.Input
                                type='number'
                                label='Columns'
                                name={'nX'}
                                value={GridSize.fromObject(this.state.gridSizeLocal).nX}
                                onChange={this.handleGridSizeChange}
                                onBlur={this.handleGridSizeChange}
                            />
                            <Form.Select
                                label='Length unit'
                                options={[{key: 2, text: 'meters', value: 2}]}
                                style={{zIndex: 10000}}
                                value={this.state.lengthUnit}
                                width={16}
                            />
                        </Form>
                    </Grid.Column>
                    <Grid.Column width={11}>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column width={16}>
                        <SpatialDiscretizationMap
                            activeCells={ActiveCells.fromArray(this.state.activeCells)}
                            boundingBox={BoundingBox.fromArray(this.state.boundingBox)}
                            geometry={Geometry.fromObject(this.state.geometry)}
                            gridSize={GridSize.fromObject(this.state.geometry)}
                            onChange={this.handleMapChange}
                        />
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

GridEditor.proptypes = {
    model: PropTypes.instanceOf(ModflowModel).isRequired,
    onChange: PropTypes.func.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(GridEditor);
