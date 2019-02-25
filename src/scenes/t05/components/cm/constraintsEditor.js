import React from 'react';
import PropTypes from 'prop-types';
import {Button, Dimmer, Form, Grid, Loader, Message, Radio, Segment} from 'semantic-ui-react';
import {GisMap} from 'core/model/mcda/gis';
import ConstraintsMap from './constraintsMap';
import {dropData} from 'services/api';
import {retrieveDroppedData} from 'services/api';

class ConstraintsEditor extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            constraints: props.constraints.toObject(),
            isFetching: false,
            mode: 'map',
            showInfo: true
        }
    }

    componentWillReceiveProps(nextProps) {
        const raster = nextProps.constraints.raster;

        if (raster && raster.data && raster.data.length === 0 && raster.url) {
            this.setState({
                isFetching: true
            }, () => {
                retrieveDroppedData(
                    raster.url,
                    response => {
                        raster.data = response;
                        this.setState({
                            isFetching: false,
                            constraints: {
                                ...nextProps.constraints.toObject(),
                                raster: raster.toObject()
                            }
                        });
                    },
                    response => {
                        throw new Error(response);
                    }
                )
            })
        }

        return this.setState({
            constraints: nextProps.constraints.toObject()
        });
    }

    handleDismiss = () => this.setState({showInfo: false});

    handleChange = constraints => {
        if (!(constraints instanceof GisMap)) {
            throw new Error('Constraints expected to be of type GisMap.');
        }

        const raster = constraints.raster;
        dropData(
            JSON.stringify(raster.data),
            response => {
                raster.url = response.filename;
                constraints.raster = raster;
                this.props.handleChange({
                    name: 'constraints',
                    value: constraints
                });
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
        this.handleChange(constraints);

        this.setState({
            mode: 'raster'
        });
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
                                        disabled={!constraints.activeCells || constraints.activeCells.length === 0}
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
                                disabled={readOnly || constraints.areas.length === 0}
                                onClick={this.onCalculateActiveCells}
                            >
                                Cut and Process
                            </Button>
                        </div>
                        }
                    </Grid.Column>
                    <Grid.Column width={11}>
                        <ConstraintsMap
                            map={this.props.constraints}
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
    constraints: PropTypes.instanceOf(GisMap).isRequired,
    readOnly: PropTypes.bool
};

export default ConstraintsEditor;