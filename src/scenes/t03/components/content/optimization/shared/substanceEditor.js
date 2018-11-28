import React from 'react';
import {Button, Dropdown, Form, Icon, List, Modal} from 'semantic-ui-react';
import PropTypes from 'prop-types';
import FluxDataTable from "./fluxDataTable";
import {Stressperiods} from "core/model/modflow";

class SubstanceEditor extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            addedSubstances: this.props.object.substances.map(s => {
                if (!s.data) {
                    s.data = (new Array(this.props.stressPeriods.dateTimes.length)).fill(0).map(() => {
                        return {
                            min: 0,
                            max: 0,
                            result: 0
                        };
                    });
                }
                return s;
            }),
            selectedSubstance: null
        };
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            addedSubstances: nextProps.object.substances.map(s => {
                if (!s.data) {
                    s.data = (new Array(nextProps.stressPeriods.dateTimes.length)).fill(0).map(() => {
                        return {
                            min: 0,
                            max: 0,
                            result: 0
                        };
                    });
                }
                return s;
            })
        });
    }

    handleChangeSubstanceData = rows => {
        const substance = this.state.selectedSubstance;
        substance.data = rows.map((row, key) => {
            return {
                id: key,
                min: parseFloat(row.min),
                max: parseFloat(row.max)
            };
        });

        return this.setState({
            selectedSubstance: substance,
        });
    };

    addSubstance = (e, {name, value}) => {
        const substance = this.props.substances.filter(s => s.id === value)[0];

        if (substance) {
            substance.data = (new Array(this.props.stressPeriods.dateTimes.length)).fill(0).map(() => {
                return {
                    min: 0,
                    max: 0,
                    result: 0
                };
            });
            return this.setState({
                selectedSubstance: substance
            });
        }
    };

    removeSubstance = (id) => {
        const substances = this.state.addedSubstances.filter(s => s.id !== id);
        return this.props.onChange(substances);
    };

    editSubstance = (id) => {
        const substance = this.state.addedSubstances.filter(s => s.id === id)[0];
        return this.setState({
            selectedSubstance: substance
        })
    };

    onCancelModal = () => this.setState({
        selectedSubstance: null
    });

    onSaveModal = () => {
        const substance = this.state.selectedSubstance;
        let substanceHasBeenAdded = false;

        const addedSubstances = this.state.addedSubstances.map(s => {
            if (s.id === substance.id) {
                substanceHasBeenAdded = true;
                return substance;
            }
            return s;
        });

        if (!substanceHasBeenAdded) {
            addedSubstances.push(substance);
        }

        this.setState({
            selectedSubstance: null
        });

        return this.props.onChange(addedSubstances);
    };

    render() {
        const styles = {
            dropDownWithButtons: {
                marginRight: 0,
                marginLeft: 0,
            },
        };

        const tableConfig = [
            {property: 'min', label: 'Min'},
            {property: 'max', label: 'Max'}
        ];

        if (this.props.showResults) {
            tableConfig.push(
                {property: 'result', label: 'result'}
            );
        }

        // Only show substances in dropdown, which hasn't already been added.
        let addableSubstances = [];
        this.props.substances.forEach((value) => {
            const added = this.state.addedSubstances.filter(s => s.id === value.id).length > 0;

            if (!added) {
                addableSubstances.push({
                    key: String(value.id),
                    text: String(value.name),
                    value: String(value.id)
                });
            }
        });

        let substanceRows = [];
        if (this.state.selectedSubstance) {
            substanceRows = this.props.stressPeriods.dateTimes.map((dt, key) => {
                return {
                    id: key,
                    date_time: dt,
                    min: this.state.selectedSubstance.data[key] ? this.state.selectedSubstance.data[key].min : 0,
                    max: this.state.selectedSubstance.data[key] ? this.state.selectedSubstance.data[key].max : 0,
                    result: this.state.selectedSubstance.data[key] ? this.state.selectedSubstance.data[key].result : 0
                };
            });
        }

        return (
            <div>
                <Form.Group style={styles.dropDownWithButtons}>
                    <Dropdown
                        placeholder={addableSubstances.length < 1 ? "Add Substances in Transport -> Source/Sink Package" : "Select Substance"}
                        fluid
                        search
                        selection
                        options={addableSubstances}
                        onChange={this.addSubstance}
                        disabled={addableSubstances.length < 1}
                        value={this.state.selectedSubstance ? this.state.selectedSubstance.id : null}
                    />
                </Form.Group>
                {!this.props.readOnly &&
                <div>
                    {this.state.addedSubstances && this.state.addedSubstances.length > 0
                        ?
                        <List divided verticalAlign='middle'>
                            {this.state.addedSubstances.map((s) => (
                                <List.Item key={s.id}>
                                    <List.Content floated='right'>
                                        <Button.Group>
                                            <Button icon color="blue"
                                                    size="small"
                                                    onClick={() => this.editSubstance(s.id)}>
                                                <Icon name="pencil"/>
                                            </Button>
                                            <Button icon color="red"
                                                    size="small"
                                                    onClick={() => this.removeSubstance(s.id)}>
                                                <Icon name="trash"/>
                                            </Button>
                                        </Button.Group>
                                    </List.Content>
                                    <List.Content>{s.name}</List.Content>
                                </List.Item>
                            ))}
                        </List>
                        :
                        <p>No substance in object.</p>
                    }
                </div>
                }
                {this.state.selectedSubstance && this.props.readOnly &&
                <FluxDataTable
                    config={tableConfig}
                    readOnly={true}
                    rows={substanceRows}
                />
                }
                {this.state.selectedSubstance && !this.props.readOnly &&
                <Modal size={'large'} open onClose={this.onCancelModal} dimmer={'inverted'}>
                    <Modal.Header>{this.state.selectedSubstance.name}</Modal.Header>
                    <Modal.Content>
                        <FluxDataTable
                            config={tableConfig}
                            readOnly={false}
                            rows={substanceRows}
                            onChange={this.handleChangeSubstanceData}
                        />
                    </Modal.Content>
                    <Modal.Actions>
                        <Button negative onClick={this.onCancelModal}>Cancel</Button>
                        <Button
                            positive
                            onClick={this.onSaveModal}
                        >
                            Save
                        </Button>
                    </Modal.Actions>
                </Modal>
                }
            </div>
        )
    }
}

SubstanceEditor.propTypes = {
    object: PropTypes.object.isRequired,
    substances: PropTypes.array.isRequired,
    stressPeriods: PropTypes.instanceOf(Stressperiods),
    onChange: PropTypes.func,
    readOnly: PropTypes.bool,
    showResults: PropTypes.bool
};

export default SubstanceEditor;