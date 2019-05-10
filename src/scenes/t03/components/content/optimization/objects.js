import React from 'react';
import {Button, Form, Grid, Icon, Table, Accordion, Message} from 'semantic-ui-react';
import PropTypes from 'prop-types';
import {FluxDataTable, SubstanceEditor} from './shared';
import {OptimizationInput, OptimizationObject} from '../../../../../core/model/modflow/optimization';
import OptimizationMap from './shared/map';
import {ModflowModel} from '../../../../../core/model/modflow';
import ContentToolBar from '../../../../shared/ContentToolbar';

const styles = {
    dropDownWithButtons: {
        marginRight: 0,
        marginLeft: 0,
    },
    linkedCell: {
        cursor: 'pointer'
    }
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

    handleChange = () => {
        const input = OptimizationInput.fromObject(this.state.optimizationInput);

        if (this.state.selectedObject) {
            const object = OptimizationObject.fromObject(this.state.selectedObject);
            input.objectsCollection.update(object);
        }

        this.props.onChange(input);
    };

    handleChangeFlux = rows => {
        const object = OptimizationObject.fromObject(this.state.selectedObject).updateFlux(rows);

        this.setState({
            selectedObject: object.toObject()
        }, this.handleChange);
    };

    handleChangeLocation = (e, {value}) => this.setState({
        selectedObject: {
            ...this.state.selectedObject,
            position: value
        }
    }, this.handleChange);

    handleChangeSubstances = (substances) => this.setState((prevState) => ({
        selectedObject: OptimizationObject.fromObject(prevState.selectedObject).updateSubstances(substances).toObject()
    }), this.handleChange);

    handleClickAccordion = (e, titleProps) => {
        const {index} = titleProps;
        const {activeIndex} = this.state;
        const newIndex = activeIndex === index ? -1 : index;

        this.setState({activeIndex: newIndex});
    };

    handleClickBack = () => this.setState({
        selectedObject: null,
        selectedSubstanceId: null
    });

    handleClickDelete = (id) => {
        const input = OptimizationInput.fromObject(this.state.optimizationInput);
        input.objectsCollection.remove(id);
        this.props.onChange(input, true);
    };

    handleClickNew = (e, {value}) => {
        const newObject = new OptimizationObject();
        newObject.type = value;
        newObject.numberOfStressPeriods = this.props.model.stressperiods.count;

        const input = OptimizationInput.fromObject(this.state.optimizationInput);
        input.objectsCollection.add(newObject);
        this.props.onChange(input);

        return this.setState({
            selectedObject: newObject.toObject()
        });
    };

    handleClickObject = (object) => this.setState({
        selectedObject: object
    });

    handleClickSave = () => {
        if (this.state.selectedObject) {
            const object = OptimizationObject.fromObject(this.state.selectedObject);
            const input = OptimizationInput.fromObject(this.state.optimizationInput);
            input.objectsCollection.update(object);
            this.props.onChange(input);
        }

        this.props.onSave();
    };

    handleLocalChange = (e, {name, value}) => {
        const object = this.state.selectedObject;
        object[name] = value;
        return this.setState({
            selectedObject: object
        });
    };

    render() {
        const {model} = this.props;
        const {activeIndex, selectedObject} = this.state;
        const optimizationInput = OptimizationInput.fromObject(this.state.optimizationInput);
        const objects = optimizationInput.objectsCollection;

        const typeOptions = [
            {key: 'type1', text: 'Well', value: 'wel'},
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

        const addObjectDropdown = !selectedObject ? {
            text: 'Add New',
            icon: 'add',
            options: typeOptions,
            onChange: this.handleClickNew
        } : null;

        return (
            <div>
                <ContentToolBar
                    isError={false}
                    isDirty={this.props.isDirty}
                    onBack={this.handleClickBack}
                    onSave={this.handleClickSave}
                    backButton={!!selectedObject}
                    dropdown={addObjectDropdown}
                    saveButton={!!selectedObject}
                />
                <Grid>
                    <Grid.Row columns={1}>
                        <Grid.Column>
                            {(!selectedObject && objects.length < 1) &&
                            <Message>
                                <p>No decision variables</p>
                            </Message>
                            }
                            {(!selectedObject && objects.length > 0) ?
                                <Table small striped>
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
                                                    <Table.Cell
                                                        width={9}
                                                        style={styles.linkedCell}
                                                        onClick={() => this.handleClickObject(object.toObject())}
                                                    >
                                                        {object.name}
                                                    </Table.Cell>
                                                    <Table.Cell width={5}>{object.type}</Table.Cell>
                                                    <Table.Cell width={2} textAlign="right">
                                                        <Button
                                                            icon
                                                            negative
                                                            onClick={() => this.handleClickDelete(object.id)}
                                                            size='small'
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
                                                location={OptimizationObject.fromObject(selectedObject).position}
                                                name='position'
                                                model={model}
                                                onChange={this.handleChangeLocation}
                                                onlyBbox
                                            />
                                        </Accordion.Content>
                                        <Accordion.Title active={activeIndex === 1} index={1}
                                                         onClick={this.handleClickAccordion}>
                                            <Icon name="dropdown"/>
                                            Pumping Rates
                                        </Accordion.Title>
                                        <Accordion.Content active={activeIndex === 1}>
                                            <FluxDataTable
                                                readOnly={model.readOnly}
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
                                                object={OptimizationObject.fromObject(selectedObject)}
                                                model={model}
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
    isDirty: PropTypes.bool,
    optimizationInput: PropTypes.instanceOf(OptimizationInput).isRequired,
    model: PropTypes.instanceOf(ModflowModel).isRequired,
    onChange: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired
};

export default OptimizationObjectsComponent;