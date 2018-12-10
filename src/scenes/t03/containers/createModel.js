import React from 'react';
import PropTypes from 'prop-types';
import {withRouter} from 'react-router-dom';
import {sendCommand} from 'services/api';
import {Button, Checkbox, Form, Grid, Icon, Segment} from 'semantic-ui-react';
import {CreateModelMap} from '../components/maps';
import {GridSize, ModflowModel, Stressperiods} from 'core/model/modflow';
import Command from '../commands/command';
import defaults from '../defaults/createModel';
import moment from 'moment/moment';
import AppContainer from '../../shared/AppContainer';

const navigation = [{
    name: 'Documentation',
    path: 'https://inowas.hydro.tu-dresden.de/tools/t02-groundwater-mounding-hantush/',
    icon: <Icon name="file"/>
}];

class CreateModel extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: defaults.id,
            name: defaults.name,
            description: defaults.description,
            geometry: null,
            boundingBox: null,
            gridSize: defaults.gridSize.toObject(),
            lengthUnit: defaults.lengthUnit,
            timeUnit: defaults.timeUnit,
            isPublic: defaults.isPublic,
            stressperiods: defaults.stressperiods.toObject(),
            error: false,
            loading: false,
            gridSizeLocal: defaults.gridSize.toObject(),
            stressperiodsLocal: defaults.stressperiods.toObject(),
            validation: [false, []]
        }
    }

    getPayload = () => (ModflowModel.fromParameters(
        this.state.id,
        this.state.name,
        this.state.description,
        this.state.geometry,
        this.state.boundingBox,
        this.state.gridSize,
        this.state.activeCells,
        this.state.lengthUnit,
        this.state.timeUnit,
        this.state.stressperiods,
        this.state.isPublic
    )).toPayload();

    handleSave = () => {
        return sendCommand(
            Command.createModflowModel(this.getPayload()),
            () => sendCommand(Command.updateModflowModel(this.getPayload()),
                () => sendCommand(Command.updateStressperiods({
                        id: this.state.id,
                        stress_periods: Stressperiods.fromObject(this.state.stressperiods).toObject()
                    }),
                    () => this.props.history.push('T03/' + this.state.id),
                    (e) => this.setState({error: e})),
                (e) => this.setState({error: e})),
            (e) => this.setState({error: e})
        );
    };

    handleInputChange = (e, {value, name, checked}) => {
        this.setState({
            [name]: value || checked
        });
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

    handleStressperiodsChange = (e) => {
        const {type, target} = e;
        const {name, value} = target;

        const date = moment(value);

        if (type === 'change') {
            const stressperiods = Stressperiods.fromObject(this.state.stressperiods);
            stressperiods[name] = date;
            this.setState({stressperiodsLocal: stressperiods.toObject()});
        }

        if (type === 'blur') {
            this.setState({stressperiods: this.state.stressperiodsLocal}, () => this.validate());
        }
    };

    handleMapInputChange = ({activeCells, boundingBox, geometry}) => {
        this.setState({
            activeCells: activeCells.toArray(),
            boundingBox: boundingBox.toArray(),
            geometry: geometry.toObject()
        }, () => this.validate())
    };

    validate = () => (
        this.setState({validation: Command.createModflowModel(this.getPayload()).validate()})
    );

    render() {
        return (
            <AppContainer navbarItems={navigation}>
                <Segment color={'grey'}>
                    <Grid padded>
                        <Grid.Row>
                            <Grid.Column width={8}>
                                <Segment color={'grey'}>
                                    <Form color={'grey'}>
                                        <Form.Group>
                                            <Form.Input
                                                label='Name'
                                                name={'name'}
                                                value={this.state.name}
                                                width={14}
                                                onChange={this.handleInputChange}
                                            />
                                            <Form.Field width={1}>
                                                <label>Public</label>
                                                <Checkbox
                                                    toggle
                                                    checked={this.state.isPublic}
                                                    onChange={this.handleInputChange}
                                                    name={'isPublic'}
                                                    width={2}
                                                />
                                            </Form.Field>
                                        </Form.Group>
                                        <Form.Group>
                                            <Form.TextArea
                                                label="Description"
                                                name="description"
                                                onChange={this.handleInputChange}
                                                placeholder="Description"
                                                value={this.state.description}
                                                width={16}
                                            />
                                        </Form.Group>
                                    </Form>
                                </Segment>
                            </Grid.Column>
                            <Grid.Column width={4}>
                                <Segment color={'grey'}>
                                    <Form color={'grey'}>
                                        <Form.Input
                                            type='number'
                                            label='Rows'
                                            name={'nY'}
                                            value={(GridSize.fromObject(this.state.gridSizeLocal)).nY}
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
                                </Segment>
                            </Grid.Column>
                            <Grid.Column width={4}>
                                <Segment color={'grey'}>
                                    <Form color={'grey'}>
                                        <Form.Input
                                            type='date'
                                            label='Start Date'
                                            name={'startDateTime'}
                                            value={Stressperiods.fromObject(this.state.stressperiodsLocal).startDateTime.format('YYYY-MM-DD')}
                                            onChange={this.handleStressperiodsChange}
                                            onBlur={this.handleStressperiodsChange}
                                        />
                                        <Form.Input
                                            type='date'
                                            label='End Date'
                                            name={'endDateTime'}
                                            value={Stressperiods.fromObject(this.state.stressperiodsLocal).endDateTime.format('YYYY-MM-DD')}
                                            onChange={this.handleStressperiodsChange}
                                            onBlur={this.handleStressperiodsChange}
                                        />
                                        <Form.Select
                                            label='Time unit'
                                            options={[{key: 4, text: 'days', value: 4}]}
                                            style={{zIndex: 10000}}
                                            value={this.state.timeUnit}
                                            width={16}
                                        />
                                    </Form>
                                </Segment>
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row>
                            <Grid.Column width={16}>
                                <CreateModelMap
                                    gridSize={GridSize.fromObject(this.state.gridSize)}
                                    styles={this.state.styles}
                                    onChange={this.handleMapInputChange}
                                />
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row>
                            <Grid.Column width={16}>
                                <Button
                                    type='submit'
                                    onClick={this.handleSave}
                                    disabled={!this.state.validation[0]}
                                >
                                    Create
                                </Button>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Segment>
            </AppContainer>
        )
    }
}

CreateModel.proptypes = {
    history: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired
};

export default withRouter(CreateModel);
