import React from 'react';
import PropTypes from 'prop-types';
import {Button, Form, Grid, Message} from 'semantic-ui-react';
import {MCDA} from 'core/model/mcda';
import {GisMap} from 'core/model/mcda/gis';
import ConstraintsMap from './constraintsMap';


class ConstraintsEditor extends React.Component {
    constructor(props) {
        super();

        this.state = {
            constraints: props.mcda.constraints.toObject(),
            mode: 'map'
        }
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            constraints: nextProps.mcda.constraints.toObject()
        });
    }

    handleChange = constraints => {
        if (!(constraints instanceof GisMap)) {
            throw new Error('Constraints expected to be of type GisMap.');
        }

        return this.props.handleChange({
            name: 'constraints',
            value: constraints
        });
    };

    onClickBack = () => this.setState({
        mode: 'map'
    });

    onBlur = () => {
        this.handleChange(GisMap.fromObject(this.state.constraints));
    };

    onChangeGridSize = (e, {name, value}) => this.setState(prevState => ({
        constraints: {
            ...prevState.constraints,
            gridSize: {
                ...prevState.constraints.gridSize,
                [name]: value
            }
        }
    }));

    onCalculateActiveCells = () => {
        const constraints = GisMap.fromObject(this.state.constraints);
        const area = constraints.areasCollection.findBy('type', 'area', {first: true});

        if (!area) {
            return null;
        }

        constraints.calculateActiveCells();
        this.handleChange(constraints);

        this.setState({
            mode: 'cells'
        });
    };

    render() {
        const {readOnly} = this.props;
        const {constraints, mode} = this.state;

        return (
            <div>
                <Message>
                    <Message.Header>Spatial Discretization</Message.Header>
                    <p>Set the outline of your project area and define the grid size.</p>
                </Message>
                <Grid>
                    <Grid.Column width={4}>
                        {mode !== 'cells' &&
                        <div>
                            <Form>
                                <Form.Input
                                    type='number'
                                    label='Rows'
                                    name='n_y'
                                    value={constraints.gridSize.n_y}
                                    onBlur={this.onBlur}
                                    onChange={this.onChangeGridSize}
                                />
                                <Form.Input
                                    type='number'
                                    label='Columns'
                                    name='n_x'
                                    value={constraints.gridSize.n_x}
                                    onBlur={this.onBlur}
                                    onChange={this.onChangeGridSize}
                                />
                            </Form>

                            <Message>
                                <p>Click the button below, to cut out the created clip features from the project area
                                    and
                                    calculate the suitability grid according to the given grid size.</p>
                            </Message>

                            <Button
                                fluid positive
                                disabled={readOnly || constraints.areas.length === 0}
                                onClick={this.onCalculateActiveCells}
                            >
                                Cut and Process
                            </Button>
                        </div>
                        }
                        {mode === 'cells' &&
                        <Button
                            fluid
                            onClick={this.onClickBack}
                        >
                            Back
                        </Button>
                        }
                    </Grid.Column>
                    <Grid.Column width={12}>
                        <ConstraintsMap
                            map={this.props.mcda.constraints}
                            onChange={this.handleChange}
                            mode={this.state.mode}
                            readOnly={readOnly}
                        />
                    </Grid.Column>
                </Grid>
            </div>
        );
    }

}

ConstraintsEditor.propTypes = {
    handleChange: PropTypes.func.isRequired,
    mcda: PropTypes.instanceOf(MCDA).isRequired,
    readOnly: PropTypes.bool
};

export default ConstraintsEditor;