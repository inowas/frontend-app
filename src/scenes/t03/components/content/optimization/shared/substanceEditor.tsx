import React, {SyntheticEvent, useEffect, useState} from 'react';
import {Button, Divider, Dropdown, DropdownProps, Form, Icon, List, Modal} from 'semantic-ui-react';
import {ModflowModel} from '../../../../../../core/model/modflow';
import OptimizationObject from '../../../../../../core/model/modflow/optimization/OptimizationObject';
import Stressperiods from '../../../../../../core/model/modflow/Stressperiods';
import {ISubstance} from '../../../../../../core/model/modflow/transport/Substance.type';
import SubstanceCollection from '../../../../../../core/model/modflow/transport/SubstanceCollection';
import FluxDataTable from './fluxDataTable';

interface IProps {
    object: OptimizationObject;
    model: ModflowModel;
    onChange: (substances: SubstanceCollection) => any;
    readOnly: boolean;
    showResults: boolean;
    stressPeriods: Stressperiods;
}

const substanceEditor = (props: IProps) => {
    const [addedSubstance, setAddedSubstance] = useState<ISubstance[]>();
    const [selectedSubstance, setSelectedSubstance] = useState<ISubstance | null>(null);

    useEffect(() => {
        /*setAddedSubstance(props.object.substances.all.map((s) => {
            if (!s.data) {
                s.data = (new Array(props.stressPeriods.dateTimes.length)).fill(0).map(() => {
                    return {
                        min: 0,
                        max: 0,
                        result: 0
                    };
                });
            }
            return s;
        }));*/
    }, [props.object, props.stressPeriods]);

    const handleChangeSubstanceData = (rows: any[]) => {
        /*const cSubstance = substance;
        cSubstance.data = rows.map((row, key) => {
            return {
                id: key,
                min: parseFloat(row.min),
                max: parseFloat(row.max)
            };
        });
        return setSelectedSubstance(cSubstance);*/
    };

    const addSubstance = (e: SyntheticEvent, {value}: DropdownProps) => {
        /*const substances = props.model.mt3dms.packages.ssm._meta.substances;
        const substance = substances.filter((s) => s.id === value)[0];

        if (substance) {
            substance.data = (new Array(props.model.stressperiods.count)).fill(0).map(() => {
                return {
                    min: 0,
                    max: 0,
                    result: 0
                };
            });
            return setSelectedSubstance(substance);
        }*/
    };

    const removeSubstance = (id: string) => {
        //const substances = addedSubstances.filter((s) => s.id !== id);
        //return props.onChange(substances);
    };

    const editSubstance = (id: string) => {
        //const substance = addedSubstances.filter((s) => s.id === id)[0];
        //return setSelectedSubstance(substance);
    };

    const handleCancelModal = () => setSelectedSubstance(null);

    const handleSaveModal = () => {
        const substance = selectedSubstance;
        let substanceHasBeenAdded = false;

        /*const addedSubstances = addedSubstances.map((s) => {
            if (s.id === substance.id) {
                substanceHasBeenAdded = true;
                return substance;
            }
            return s;
        });

        if (!substanceHasBeenAdded) {
            addedSubstances.push(substance);
        }*/

        setSelectedSubstance(null);
        //return props.onChange(addedSubstances);
    };

    //const mSubstances = props.model.mt3dms.packages.ssm._meta.substances;

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

    if (props.showResults) {
        tableConfig.push(
            {property: 'result', label: 'result'}
        );
    }

    // Only show substances in dropdown, which hasn't already been added.
    /*const addableSubstances: ISubstance[] = [];
    mSubstances.forEach((value) => {
        const added = addedSubstances.filter((s) => s.id === value.id).length > 0;

        if (!added) {
            addableSubstances.push({
                key: String(value.id),
                text: String(value.name),
                value: String(value.id)
            });
        }
    });

    let substanceRows = [];
    if (selectedSubstance) {
        substanceRows = props.model.stressperiods.dateTimes.map((dt, key) => {
            return {
                id: key,
                date_time: dt,
                min: 0,
                max: 0,
                result: 0
            };
        });
    }*/

    return (
        <div>
            <Form.Group style={styles.dropDownWithButtons}>
                {/*<Dropdown
                    placeholder={addableSubstances.length < 1 ?
                        'Add Substances in Transport -> Source/Sink Package' : 'Select Substance'}
                    fluid={true}
                    search={true}
                    selection={true}
                    options={addableSubstances}
                    onChange={() => null}
                    disabled={addableSubstances.length < 1}
                    value={selectedSubstance ? selectedSubstance.id : undefined}
                />*/}
            </Form.Group>
            {!props.readOnly &&
            <div>
                {addedSubstance && addedSubstance.length > 0
                    ?
                    <List divided={true} verticalAlign="middle">
                        {addedSubstance.map((s) => (
                            <List.Item key={s.id}>
                                <List.Content floated="right">
                                    <Button.Group>
                                        <Button
                                            icon={true}
                                            color="blue"
                                            size="small"
                                            onClick={() => editSubstance(s.id)}
                                        >
                                            <Icon name="pencil"/>
                                        </Button>
                                        <Button
                                            icon={true}
                                            color="red"
                                            size="small"
                                            onClick={() => removeSubstance(s.id)}
                                        >
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
            {selectedSubstance && props.readOnly &&
            <div>
                <Divider horizontal={true}>{selectedSubstance.name}</Divider>
                <FluxDataTable
                    onChange={handleChangeSubstanceData}
                    readOnly={props.readOnly}
                    rows={[]}
                />
            </div>
            }
            {selectedSubstance && !props.readOnly &&
            <Modal size={'large'} open={true} onClose={handleCancelModal} dimmer={'inverted'}>
                <Modal.Header>{selectedSubstance.name}</Modal.Header>
                <Modal.Content>
                    <FluxDataTable
                        readOnly={props.readOnly}
                        rows={[]}
                        onChange={handleChangeSubstanceData}
                    />
                </Modal.Content>
                <Modal.Actions>
                    <Button negative={true} onClick={handleCancelModal}>Cancel</Button>
                    <Button
                        positive={true}
                        onClick={handleSaveModal}
                    >
                        Save
                    </Button>
                </Modal.Actions>
            </Modal>
            }
        </div>
    );
};

export default substanceEditor;
