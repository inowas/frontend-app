import React from 'react';
import {Button, Message, Form, Grid, Icon, Table, Accordion} from 'semantic-ui-react';
import PropTypes from 'prop-types';
import OptimizationObject from "core/model/modflow/optimization/Object";
import {FluxDataTable, OptimizationMap, OptimizationToolbar, SubstanceEditor} from "./shared";
import {
    OPTIMIZATION_EDIT_NOCHANGES,
    OPTIMIZATION_EDIT_SAVED,
    OPTIMIZATION_EDIT_UNSAVED
} from "../../../defaults/optimization";

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
            objects: props.objects.map((object) => {
                object.numberOfStressPeriods = this.props.stressPeriods.dateTimes.length;
                return object.toObject;
            }),
            selectedObject: null,
            selectedSubstance: null,
            activeIndex: 0,
            showOverlay: false,
            editState: OPTIMIZATION_EDIT_NOCHANGES
        };
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            objects: nextProps.objects.map((object) => {
                object.numberOfStressPeriods = this.props.stressPeriods.dateTimes.length;
                return object.toObject;
            })
        });
    }

    handleChange = (e, {name, value}) => this.setState({
        selectedObject: {
            ...this.state.selectedObject,
            [name]: value
        },
        editState: OPTIMIZATION_EDIT_UNSAVED
    });

    handleChangeLocation = (e, {name, value}) => this.setState({
        selectedObject: {
            ...this.state.selectedObject,
            position: value
        },
        editState: OPTIMIZATION_EDIT_UNSAVED
    });

    onClickNew = (e, {name, value}) => {
        const newObject = new OptimizationObject();
        newObject.type = value;
        newObject.numberOfStressPeriods = this.props.stressPeriods.dateTimes.length;
        return this.setState({
            selectedObject: newObject.toObject,
            editState: OPTIMIZATION_EDIT_UNSAVED
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
        selectedObject: OptimizationObject.fromObject(prevState.selectedObject).updateFlux(rows).toObject,
        editState: OPTIMIZATION_EDIT_UNSAVED
    }));

    handleChangeSubstances = (substances) => this.setState((prevState) => ({
        selectedObject: OptimizationObject.fromObject(prevState.selectedObject).updateSubstances(substances).toObject,
        editState: OPTIMIZATION_EDIT_UNSAVED
    }));

    onClickBack = () => this.setState({
        selectedObject: null,
        selectedSubstance: null,
        editState: OPTIMIZATION_EDIT_NOCHANGES
    });

    onClickSave = () => {
        const {objects, selectedObject} = this.state;

        if (objects.length < 1) {
            objects.push(selectedObject);
        }

        if (objects.length >= 1 && objects.filter(item => item.id === selectedObject.id).length === 0) {
            objects.push(selectedObject);
        }

        this.props.onChange({
            key: 'objects',
            value: objects.map((obj) => {
                if (obj.id === selectedObject.id) {
                    return OptimizationObject.fromObject(selectedObject);
                }

                return OptimizationObject.fromObject(obj);
            })
        });

        return this.setState({
            selectedObject: null,
            selectedSubstance: null,
            editState: OPTIMIZATION_EDIT_SAVED
        });
    };

    render() {
        const typeOptions = [
            {key: 'type1', text: 'Well', value: 'wel'},
        ];

        const fluxConfig = [
            {property: 'min', label: 'Min'},
            {property: 'max', label: 'Max'}
        ];

        let fluxRows = null;

        if (this.state.selectedObject) {
            fluxRows = this.props.stressPeriods.dateTimes.map((dt, key) => {
                return {
                    id: key,
                    date_time: dt,
                    min: this.state.selectedObject.flux[key] ? this.state.selectedObject.flux[key].min : 0,
                    max: this.state.selectedObject.flux[key] ? this.state.selectedObject.flux[key].max : 0
                };
            });
        }

        return (
            <div>
                <OptimizationToolbar
                    save={this.state.selectedObject ? {onClick: this.onClickSave} : null}
                    back={this.state.selectedObject ? {onClick: this.onClickBack} : null}
                    dropdown={ !this.state.selectedObject ? {
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
                    editState={this.state.editState}
                />
                <Grid style={styles.tableWidth}>
                    <Grid.Row columns={1}>
                        <Grid.Column>
                            {(!this.state.selectedObject && (!this.state.objects || this.state.objects.length < 1)) ?
                                <Message>
                                    <p>No optimization objects</p>
                                </Message>
                                : ''
                            }
                            {(!this.state.selectedObject && this.state.objects && this.state.objects.length > 0) ?
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
                                            this.state.objects.map((object) =>
                                                <Table.Row key={object.id}>
                                                    <Table.Cell>
                                                        <a style={styles.link}
                                                           onClick={() => this.onClickObject(object)}
                                                        >
                                                            {object.name}
                                                        </a>
                                                    </Table.Cell>
                                                    <Table.Cell>{object.type}</Table.Cell>
                                                    <Table.Cell textAlign="center">
                                                        <Button icon color="red"
                                                                size="small"
                                                                style={styles.iconFix}
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
                            {(this.state.selectedObject) ?
                                <Form>
                                    <Form.Group widths="equal">
                                        <Form.Field>
                                            <label>Type</label>
                                            <Form.Select
                                                name="type"
                                                value={this.state.selectedObject.type}
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
                                                value={this.state.selectedObject.name}
                                                placeholder="name ="
                                                style={styles.inputFix}
                                                onChange={this.handleChange}
                                            />
                                        </Form.Field>
                                    </Form.Group>
                                    <Accordion fluid styled>
                                        <Accordion.Title active={this.state.activeIndex === 0} index={0}
                                                         onClick={this.handleClickAccordion}>
                                            <Icon name="dropdown"/>
                                            Location
                                        </Accordion.Title>
                                        <Accordion.Content active={this.state.activeIndex === 0}>
                                            <OptimizationMap
                                                name="position"
                                                area={this.props.model.geometry}
                                                bbox={this.props.model.bounding_box}
                                                location={this.state.selectedObject.position}
                                                gridSize={this.props.model.grid_size}
                                                onChange={this.handleChangeLocation}
                                                onlyBbox={true}
                                                readOnly
                                            />
                                        </Accordion.Content>
                                        <Accordion.Title active={this.state.activeIndex === 1} index={1}
                                                         onClick={this.handleClickAccordion}>
                                            <Icon name="dropdown"/>
                                            Pumping Rates‚
                                        </Accordion.Title>
                                        <Accordion.Content active={this.state.activeIndex === 1}>
                                            <FluxDataTable
                                                config={fluxConfig}
                                                readOnly={false}
                                                rows={fluxRows}
                                                onChange={this.handleChangeFlux}
                                            />
                                        </Accordion.Content>
                                        <Accordion.Title active={this.state.activeIndex === 2} index={2}
                                                         onClick={this.handleClickAccordion}>
                                            <Icon name="dropdown"/>
                                            Substances
                                        </Accordion.Title>
                                        <Accordion.Content active={this.state.activeIndex === 2}>
                                            <SubstanceEditor
                                                object={this.state.selectedObject}
                                                stressPeriods={this.props.stressPeriods}
                                                substances={this.props.model.mt3dms && this.props.model.mt3dms.ssm ? this.props.model.mt3dms.ssm._meta.substances : []}
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
    objects: PropTypes.array.isRequired,
    model: PropTypes.object,
    substances: PropTypes.array,
    stressPeriods: PropTypes.instanceOf(Stressperiods),
    onChange: PropTypes.func.isRequired,
};

export default OptimizationObjectsComponent;