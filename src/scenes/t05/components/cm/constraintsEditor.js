import React from 'react';
import PropTypes from 'prop-types';
import {Button, Dimmer, Form, Grid, Loader, Message, Radio, Segment} from 'semantic-ui-react';
import {GisMap} from 'core/model/mcda/gis';
import ConstraintsMap from './constraintsMap';
import {dropData} from 'services/api';
import {MCDA} from 'core/model/mcda';
import {retrieveRasters} from 'services/api/rasterHelper';

class ConstraintsEditor extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            constraints: props.mcda.constraints.toObject(),
            isFetching: false,
            mode: 'map',
            showInfo: true
        }
    }

    componentWillReceiveProps(nextProps) {
        const prevConstraints = this.props.mcda.constraints || null;
        const constraints = nextProps.mcda.constraints;

        if (!constraints.raster) {
            return this.setState({
                constraints: constraints.toObject()
            })
        }

        if (constraints) {
            this.constraintsToState(prevConstraints ? prevConstraints.toObject() : null, constraints.toObject());
        }
    }

    constraintsToState = (prevConstraints, constraints) => {
        this.setState({
            isFetching: true
        });

        const newConstraints = constraints;

        const tasks = [
            {
                raster: constraints.raster,
                oldUrl: prevConstraints && prevConstraints.raster ? prevConstraints.raster.url : '',
                onSuccess: raster => newConstraints.raster = raster
            }
        ];

        retrieveRasters(tasks, () => {
            this.setState({
                constraints: newConstraints,
                isFetching: false
            });
        });
    };

    handleDismiss = () => this.setState({showInfo: false});

    handleChange = constraints => {
        if (!(constraints instanceof GisMap)) {
            throw new Error('Constraints expected to be of type GisMap.');
        }

        const mcda = this.props.mcda;
        mcda.constraints = constraints;

        if (!constraints.raster || !constraints.raster.data) {
            return this.props.onChange(mcda);
        }

        dropData(
            JSON.stringify(constraints.raster.data),
            response => {
                mcda.constraints.raster.url = response.filename;
                this.props.onChange(mcda);
            },
            response => {
                throw new Error(response)
            }
        );
    };

    onBlur = () => {
        this.handleChange(GisMap.fromObject(this.state.constraints));
    };

    onCalculateActiveCells = () => {
        const constraints = GisMap.fromObject(this.state.constraints);

        constraints.calculateActiveCells();
        return this.handleChange(constraints);
    };

    onChangeMode = (e, {name, value}) => this.setState({
        mode: value
    });

    render() {
        const {readOnly} = this.props;
        const {constraints, isFetching, mode, showInfo} = this.state;

        return (
            <div>
                {isFetching &&
                <Dimmer active inverted>
                    <Loader indeterminate>Preparing Files</Loader>
                </Dimmer>
                }
                {showInfo &&
                <Message onDismiss={this.handleDismiss}>
                    <Message.Header>Global Constraints</Message.Header>
                    <p>
                        Draw zones, which should not be respected in the suitability calculation. It is necessary to
                        click on the 'Cut and Process' button, after making changes.
                    </p>
                </Message>
                }
                <Grid>
                    <Grid.Column width={5}>
                        <Segment textAlign='center' inverted color='grey' secondary>
                            Mode
                        </Segment>
                        <Form>
                            <Form.Group grouped>
                                <Form.Field>
                                    <Radio
                                        label='Constraints'
                                        name='mode'
                                        value='map'
                                        checked={mode === 'map'}
                                        onChange={this.onChangeMode}
                                    />
                                </Form.Field>
                                <Form.Field>
                                    <Radio
                                        label='Raster'
                                        name='mode'
                                        value='raster'
                                        checked={mode === 'raster'}
                                        disabled={!constraints.raster || constraints.raster.data.length === 0}
                                        onChange={this.onChangeMode}
                                    />
                                </Form.Field>
                                <Form.Field>
                                    <Radio
                                        label='Suitable Cells'
                                        name='mode'
                                        value='cells'
                                        checked={mode === 'cells'}
                                        disabled={!constraints.cells || constraints.cells.length === 0}
                                        onChange={this.onChangeMode}
                                    />
                                </Form.Field>
                            </Form.Group>
                        </Form>
                        {mode === 'map' &&
                        <div>
                            <Segment textAlign='center' inverted color='grey' secondary>
                                Commands
                            </Segment>
                            <Message>
                                <p>Click the button below, to cut out the created clip features from the project area
                                    and
                                    calculate the suitability grid according to the given grid size.</p>
                            </Message>
                            <Button
                                fluid positive
                                onClick={this.onCalculateActiveCells}
                            >
                                Cut and Process
                            </Button>
                        </div>
                        }
                    </Grid.Column>
                    <Grid.Column width={11}>
                        <ConstraintsMap
                            map={GisMap.fromObject(constraints)}
                            onChange={this.handleChange}
                            mode={mode}
                            readOnly={readOnly}
                        />
                    </Grid.Column>
                </Grid>
            </div>
        );
    }

}

ConstraintsEditor.propTypes = {
    onChange: PropTypes.func.isRequired,
    mcda: PropTypes.instanceOf(MCDA).isRequired,
    readOnly: PropTypes.bool
};

export default ConstraintsEditor;