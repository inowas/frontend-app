import React from 'react';
import {Button, Message, Form, Grid, Icon, Table, Accordion} from 'semantic-ui-react';
import PropTypes from 'prop-types';
import {FluxDataTable, OptimizationMap, SubstanceEditor} from './shared';
import {OptimizationInput, OptimizationObject} from 'core/model/modflow/optimization';
import ContentToolBar from '../../shared/contentToolbar';

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
            optimizationInput: props.optimizationInput,
            selectedObject: null,
            selectedSubstance: null,
            activeIndex: 0,
            showOverlay: false
        };
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            objects: nextProps.optimizationInput
        });
    }

    handleChange = () => this.props.onChange(OptimizationInput.fromObject(this.state.optimizationInput));

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
        newObject.numberOfStressPeriods = this.props.model.stressPeriods.dateTimes.length;
        return this.setState({
            selectedObject: newObject.toObject
        });
    };

    onClickDelete = (object) => {
        const objects = this.state.objects;
        this.props.onChange({
            key: 'objects',
            value: objects
                .filter(obj => obj.id !== object.id)
                .map(obj => {
                    return OptimizationObject.fromObject(obj);
                })
        });
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
        selectedObject: OptimizationObject.fromObject(prevState.selectedObject).updateFlux(rows).toObject
    }));

    handleChangeSubstances = (substances) => this.setState((prevState) => ({
        selectedObject: OptimizationObject.fromObject(prevState.selectedObject).updateSubstances(substances).toObject
    }));

    onClickBack = () => this.setState({
        selectedObject: null,
        selectedSubstance: null
    });

    render() {
        const {model} = this.props;
        const {activeIndex, optimizationInput, selectedObject} = this.state;
        const objects = optimizationInput.objects.all;
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
            fluxRows = model.stressPeriods.dateTimes.map((dt, key) => {
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
                <ContentToolBar
                    backButton={selectedObject}
                    dropdown={!selectedObject ? {
                        text: 'Add New',
                        icon: 'plus',
                        options: [
                            {
                                key: 'wel',
                                value: 'wel',
                                text: 'Well'
                            },
                        ],
                        onChange: this.onClickNew
                    } : null}
                    isError={this.props.isError}
                    isDirty={this.props.isDirty}
                    save
                    onSave={this.props.onSave}
                />
                <Grid>
                    <Grid.Row columns={1}>
                        <Grid.Column>
                            {(!selectedObject && (!objects || objects.length < 1)) ?
                                <Message>
                                    <p>No optimization objects</p>
                                </Message>
                                : ''
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
                                            objects.map((object) =>
                                                <Table.Row key={object.id}>
                                                    <Table.Cell>
                                                        <Button
                                                            size="small"
                                                            onClick={() => this.onClickObject(object)}
                                                        >
                                                            {object.name}
                                                        </Button>
                                                    </Table.Cell>
                                                    <Table.Cell>{object.type}</Table.Cell>
                                                    <Table.Cell textAlign="center">
                                                        <Button icon color="red"
                                                                size="small"
                                                                onClick={() => this.onClickDelete(object)}
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
                                                onChange={this.handleChange}
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
                                                onChange={this.handleChange}
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
    isDirty: PropTypes.bool,
    isError: PropTypes.bool,
    onChange: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired
};

export default OptimizationObjectsComponent;