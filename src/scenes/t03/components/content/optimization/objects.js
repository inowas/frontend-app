import React from 'react';
import {Button, Form, Grid, Icon, Table, Accordion, Dropdown} from 'semantic-ui-react';
import PropTypes from 'prop-types';
import {FluxDataTable, OptimizationMap, SubstanceEditor} from './shared';
import {OptimizationInput, OptimizationObject} from 'core/model/modflow/optimization';

const styles = {
    dropDownWithButtons: {
        marginRight: 0,
        marginLeft: 0,
    },
};

class OptimizationObjectsComponent extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            optimizationInput: props.optimizationInput.toObject(),
            selectedObject: null,
            selectedSubstance: null,
            activeIndex: 0
        };
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            optimizationInput: nextProps.optimizationInput.toObject()
        });
    }

    handleChange = () => this.props.onChange(OptimizationInput.fromObject(this.state.optimizationInput));

    handleLocalChange = (e, {name, value}) => {
        const object = this.state.selectedObject;
        object[name] = value;
        this.setState({
            selectedObject: object
        })
    } ;

    handleSaveSelectedObject = () => {
        const input = OptimizationInput.fromObject(this.state.optimizationInput);
        input.objects.update(this.state.selectedObject);

        this.props.onChange(input);

        return this.setState({
            selectedObject: null,
            selectedSubstance: null
        });
    };

    handleChangeSelectedObject = (e, {name, value}) => {
        const object = this.state.selectedObject;
        object[name] = value;

        return this.setState({
            selectedObject: object
        });
    };

    handleChangeLocation = (e, {name, value}) => this.setState({
        selectedObject: {
            ...this.state.selectedObject,
            position: value
        }
    });

    onClickNew = (e, {name, value}) => {
        const newObject = new OptimizationObject();
        newObject.type = value;
        newObject.numberOfStressPeriods = this.props.model.stressperiods.count;

        const input = OptimizationInput.fromObject(this.state.optimizationInput);
        input.objects.add(newObject);

        return this.setState({
            optimizationInput: input.toObject(),
            selectedObject: newObject.toObject()
        });
    };

    onClickDelete = (id) => {
        const input = OptimizationInput.fromObject(this.state.optimizationInput);
        input.objects.remove(id);
        this.props.onChange(input);
    };

    onClickObject = (object) => this.setState({
        selectedObject: object
    });

    handleClickAccordion = (e, titleProps) => {
        const {index} = titleProps;
        const {activeIndex} = this.state;
        const newIndex = activeIndex === index ? -1 : index;

        this.setState({activeIndex: newIndex});
    };

    handleChangeFlux = rows => this.setState((prevState) => ({
        selectedObject: OptimizationObject.fromObject(prevState.selectedObject).updateFlux(rows).toObject()
    }));

    handleChangeSubstances = (substances) => this.setState((prevState) => ({
        selectedObject: OptimizationObject.fromObject(prevState.selectedObject).updateSubstances(substances).toObject()
    }));

    onClickBack = () => this.setState({
        selectedObject: null,
        selectedSubstance: null
    });

    render() {
        const {model} = this.props;
        const {activeIndex, selectedObject} = this.state;
        const optimizationInput = OptimizationInput.fromObject(this.state.optimizationInput);
        const objects = optimizationInput.objects;
        const substances = [];

        const typeOptions = [
            {key: 'type1', text: 'Well', value: 'wel'},
        ];

        const fluxConfig = [
            {property: 'min', label: 'Min'},
            {property: 'max', label: 'Max'}
        ];

        let fluxRows = null;

        if (selectedObject) {
            fluxRows = model.stressperiods.dateTimes.map((dt, key) => {
                return {
                    id: key,
                    date_time: dt,
                    min: selectedObject.flux[key] ? selectedObject.flux[key].min : 0,
                    max: selectedObject.flux[key] ? selectedObject.flux[key].max : 0
                };
            });
        }

        return (
            <div>
                <Grid>
                    <Grid.Row columns={1}>
                        <Grid.Column>
                            {!selectedObject &&
                            <Dropdown text='Add Decision Variable' icon='add' fluid floating labeled button
                                      className='icon'>
                                <Dropdown.Menu>
                                    <Dropdown.Item value='wel' onClick={this.onClickNew} text='wel'/>
                                </Dropdown.Menu>
                            </Dropdown>
                            }
                            {(!selectedObject && objects && objects.length > 0) ?
                                <Table celled striped>
                                    <Table.Header>
                                        <Table.Row>
                                            <Table.HeaderCell>Name</Table.HeaderCell>
                                            <Table.HeaderCell>Type</Table.HeaderCell>
                                            <Table.HeaderCell/>
                                        </Table.Row>
                                    </Table.Header>
                                    <Table.Body>
                                        {
                                            objects.all.map((object) =>
                                                <Table.Row key={object.id}>
                                                    <Table.Cell>
                                                        <Button
                                                            size="small"
                                                            onClick={() => this.onClickObject(object.toObject())}
                                                        >
                                                            {object.name}
                                                        </Button>
                                                    </Table.Cell>
                                                    <Table.Cell>{object.type}</Table.Cell>
                                                    <Table.Cell textAlign="center">
                                                        <Button icon color="red"
                                                                size="small"
                                                                onClick={() => this.onClickDelete(object.id)}
                                                        >
                                                            <Icon name="trash"/>
                                                        </Button>
                                                    </Table.Cell>
                                                </Table.Row>
                                            )
                                        }
                                    </Table.Body>
                                </Table>
                                : ''
                            }
                            {(selectedObject) ?
                                <Form>
                                    <Form.Group widths="equal">
                                        <Form.Field>
                                            <label>Type</label>
                                            <Form.Select
                                                name="type"
                                                value={selectedObject.type}
                                                placeholder="type ="
                                                options={typeOptions}
                                                onChange={this.handleLocalChange}
                                            />
                                        </Form.Field>
                                        <Form.Field>
                                            <label>Name</label>
                                            <Form.Input
                                                type="text"
                                                name="name"
                                                value={selectedObject.name}
                                                placeholder="name ="
                                                style={styles.inputFix}
                                                onBlur={this.handleChange}
                                                onChange={this.handleLocalChange}
                                            />
                                        </Form.Field>
                                    </Form.Group>
                                    <Accordion fluid styled>
                                        <Accordion.Title active={activeIndex === 0} index={0}
                                                         onClick={this.handleClickAccordion}>
                                            <Icon name="dropdown"/>
                                            Location
                                        </Accordion.Title>
                                        <Accordion.Content active={activeIndex === 0}>
                                            <OptimizationMap
                                                name="position"
                                                area={model.geometry}
                                                bbox={model.boundingBox}
                                                location={selectedObject.position}
                                                gridSize={model.gridSize}
                                                onChange={this.handleChangeLocation}
                                                onlyBbox={true}
                                                readOnly
                                            />
                                        </Accordion.Content>
                                        <Accordion.Title active={activeIndex === 1} index={1}
                                                         onClick={this.handleClickAccordion}>
                                            <Icon name="dropdown"/>
                                            Pumping Rates‚
                                        </Accordion.Title>
                                        <Accordion.Content active={activeIndex === 1}>
                                            <FluxDataTable
                                                config={fluxConfig}
                                                readOnly={false}
                                                rows={fluxRows}
                                                onChange={this.handleChangeFlux}
                                            />
                                        </Accordion.Content>
                                        <Accordion.Title active={activeIndex === 2} index={2}
                                                         onClick={this.handleClickAccordion}>
                                            <Icon name="dropdown"/>
                                            Substances
                                        </Accordion.Title>
                                        <Accordion.Content active={activeIndex === 2}>
                                            <SubstanceEditor
                                                object={selectedObject}
                                                stressPeriods={model.stressPeriods}
                                                substances={substances || []}
                                                onChange={this.handleChangeSubstances}
                                            />
                                        </Accordion.Content>
                                    </Accordion>
                                </Form>
                                : ''
                            }
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </div>
        );
    }
}

OptimizationObjectsComponent.propTypes = {
    optimizationInput: PropTypes.instanceOf(OptimizationInput).isRequired,
    model: PropTypes.object,
    onChange: PropTypes.func.isRequired
};

export default OptimizationObjectsComponent;