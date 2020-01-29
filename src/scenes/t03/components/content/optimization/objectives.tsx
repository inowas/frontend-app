import React, {ChangeEvent, SyntheticEvent, useEffect, useState} from 'react';
import {Button, DropdownProps, Form, Grid, Icon, InputOnChangeData, Message, Segment, Table} from 'semantic-ui-react';
import {ModflowModel} from '../../../../../core/model/modflow';
import {EConstraintType} from '../../../../../core/model/modflow/optimization/OptimizationConstraint.type';
import OptimizationInput from '../../../../../core/model/modflow/optimization/OptimizationInput';
import {IOptimizationInput} from '../../../../../core/model/modflow/optimization/OptimizationInput.type';
import OptimizationLocation from '../../../../../core/model/modflow/optimization/OptimizationLocation';
import OptimizationObjective from '../../../../../core/model/modflow/optimization/OptimizationObjective';
import {IOptimizationObjective} from '../../../../../core/model/modflow/optimization/OptimizationObjective.type';
import {RangeWithTooltip} from '../../../../shared/complexTools/RangeWithTooltip';
import ContentToolBar from '../../../../shared/ContentToolbar';
import {OptimizationMap} from './shared';

const styles = {
    sliderDiv: {
        paddingBottom: 30
    },
    linkedCell: {
        cursor: 'pointer'
    }
};

interface IProps {
    isDirty: boolean;
    optimizationInput: OptimizationInput;
    model: ModflowModel;
    onChange: (input: OptimizationInput, save: boolean) => any;
    onSave: () => any;
}

const optimizationObjectivesComponent = (props: IProps) => {
    const [optimizationInput, setOptimizationInput] = useState<IOptimizationInput>(props.optimizationInput.toObject());
    const [selectedObjective, setSelectedObjective] = useState<IOptimizationObjective | null>(null);

    useEffect(() => {
        setOptimizationInput(props.optimizationInput.toObject());
    }, [props.optimizationInput]);

    const handleClickBack = () => setSelectedObjective(null);

    const handleClickDelete = (id: string) => {
        const cInput = OptimizationInput.fromObject(optimizationInput);
        cInput.objectivesCollection.removeById(id);
        props.onChange(cInput, true);
    };

    const handleClickNew = (e: SyntheticEvent, {value}: DropdownProps) => {
        const newObjective = OptimizationObjective.fromDefaults();
        newObjective.type = Object.values(EConstraintType).includes(value) ? value as EConstraintType
            : EConstraintType.FLUX;
        newObjective.location.ts.max = props.model.stressperiods.count - 1;

        const cInput = OptimizationInput.fromObject(optimizationInput);
        cInput.objectivesCollection.add(newObjective.toObject());
        props.onChange(cInput, false);

        return setSelectedObjective(newObjective.toObject());
    };

    const handleClickObjective = (objective: IOptimizationObjective) => setSelectedObjective(objective);

    const handleClickSave = () => {
        if (selectedObjective) {
            const cInput = OptimizationInput.fromObject(optimizationInput);
            cInput.objectivesCollection.update(selectedObjective);
            props.onChange(cInput, false);
        }
        return props.onSave();
    };

    const handleChange = () => {
        const cInput = OptimizationInput.fromObject(optimizationInput);
        if (selectedObjective) {
            cInput.objectivesCollection.update(selectedObjective);
        }
        return props.onChange(cInput, false);
    };

    const handleChangeMap = ({name, value}: {name: string, value: OptimizationLocation}) => {
        const cInput = OptimizationInput.fromObject(optimizationInput);
        const objective = selectedObjective;
        if (objective) {
            objective[name] = value;
            cInput.objectivesCollection.update(objective);
            setSelectedObjective(objective);
            return props.onChange(cInput, false);
        }
    };

    const handleChangeSelect = (e: SyntheticEvent, {name, value}: DropdownProps) => {
        const cInput = OptimizationInput.fromObject(optimizationInput);
        const objective = selectedObjective;
        if (objective) {
            objective[name] = value;
            cInput.objectivesCollection.update(objective);
            setSelectedObjective(objective);
            return props.onChange(cInput, false);
        }
    };

    const handleChangeStressPeriods = (e: number[]) => {
        const cInput = OptimizationInput.fromObject(optimizationInput);
        const objective = selectedObjective;
        if (objective) {
            objective.location.ts = {
                min: e[0],
                max: e[1],
                result: null
            };
            cInput.objectivesCollection.update(objective);
            setSelectedObjective(objective);

            // TODO: difference between onChange and onSliderEnd?
            return props.onChange(cInput, false);
        }
    };

    const handleLocalChange = (e: ChangeEvent, {name, value}: InputOnChangeData) => {
        const objective = selectedObjective;
        if (objective) {
            objective[name] = value;
            return setSelectedObjective(objective);
        }
    };

    const formatTimestamp = (key: number) => props.model.stressperiods.dateTimes[key];

    const sliderMarks = () => {
        const marks: { [key: number]: string } = {};
        props.model.stressperiods.dateTimes.forEach((dt, key) => {
            marks[key] = key.toFixed(2);
        });
        return marks;
    };

    const {model} = props;
    const input = OptimizationInput.fromObject(optimizationInput);
    const objectives = input.objectivesCollection;

    const typeOptions = [
        {key: 'type1', text: 'Concentration', value: 'concentration'},
        {key: 'type2', text: 'Head', value: 'head'},
        {key: 'type3', text: 'Flux', value: 'flux'},
        {key: 'type4', text: 'Distance', value: 'distance'},
        {key: 'type5', text: 'Input Concentration', value: 'inputConc'}
    ];

    return (
        <div>
            <ContentToolBar
                saveButton={!!selectedObjective}
                backButton={!!selectedObjective}
                onBack={handleClickBack}
                onSave={handleClickSave}
                dropdown={!selectedObjective ? {
                    text: 'Add New',
                    icon: 'plus',
                    options: typeOptions,
                    onChange: handleClickNew
                } : null}
                isDirty={props.isDirty}
                isError={false}
            />
            <Grid>
                <Grid.Row columns={1}>
                    <Grid.Column>
                        {(!selectedObjective && objectives.length < 1) &&
                        <Message>
                            <p>No optimization objectives</p>
                        </Message>
                        }
                        {(!selectedObjective && objectives.length >= 1) &&
                        <Table celled={true} striped={true}>
                            <Table.Header>
                                <Table.Row>
                                    <Table.HeaderCell>Name</Table.HeaderCell>
                                    <Table.HeaderCell>Type</Table.HeaderCell>
                                    <Table.HeaderCell/>
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
                                {
                                    objectives.all.map((objective) =>
                                        <Table.Row key={objective.id}>
                                            <Table.Cell
                                                width={9}
                                                style={styles.linkedCell}
                                                onClick={() => handleClickObjective(objective.toObject())}
                                            >
                                                {objective.name}
                                            </Table.Cell>
                                            <Table.Cell width={5}>{objective.type}</Table.Cell>
                                            <Table.Cell width={2} textAlign="right">
                                                <Button
                                                    icon={true}
                                                    negative={true}
                                                    onClick={() => handleClickDelete(objective.id)}
                                                    size="small"
                                                >
                                                    <Icon name="trash"/>
                                                </Button>
                                            </Table.Cell>
                                        </Table.Row>
                                    )
                                }
                            </Table.Body>
                        </Table>
                        }
                        {selectedObjective &&
                        <Form>
                            <Form.Field>
                                <label>Name</label>
                                <Form.Input
                                    type="text"
                                    name="name"
                                    value={selectedObjective.name}
                                    placeholder="name ="
                                    onChange={handleLocalChange}
                                    onBlur={handleChange}
                                />
                            </Form.Field>
                            <Form.Group widths="equal">
                                <Form.Field>
                                    <label>Objective type</label>
                                    <Form.Select
                                        name="type"
                                        value={selectedObjective.type}
                                        placeholder="type ="
                                        options={typeOptions}
                                        onChange={handleChangeSelect}
                                    />
                                </Form.Field>
                                <Form.Field>
                                    <label>Method how each objective scalar will be calculated.</label>
                                    <Form.Select
                                        name="summary_method"
                                        value={selectedObjective.summaryMethod}
                                        placeholder="summary_method ="
                                        options={[
                                            {key: 'min', text: 'Min', value: 'min'},
                                            {key: 'max', text: 'Max', value: 'max'},
                                            {key: 'mean', text: 'Mean', value: 'mean'},
                                        ]}
                                        onChange={handleChangeSelect}
                                    />
                                </Form.Field>
                            </Form.Group>
                            <Form.Group widths="equal">
                                <Form.Field>
                                    <label>Objective weight factor</label>
                                    <Form.Input
                                        type="number"
                                        name="weight"
                                        value={selectedObjective.weight}
                                        placeholder="weight ="
                                        onChange={handleLocalChange}
                                        onBlur={handleChange}
                                        defaultChecked={true}
                                    />
                                </Form.Field>
                                <Form.Field>
                                    <label>Objective penalty value</label>
                                    <Form.Input
                                        type="number"
                                        name="penalty_value"
                                        value={selectedObjective.penaltyValue}
                                        placeholder="penalty_value ="
                                        onChange={handleLocalChange}
                                        onBlur={handleChange}
                                    />
                                </Form.Field>
                            </Form.Group>
                            {selectedObjective.type !== EConstraintType.DISTANCE &&
                            <div>
                                <Form.Field>
                                    <label>Stress Periods</label>
                                    <Segment style={styles.sliderDiv}>
                                        <RangeWithTooltip
                                            min={0}
                                            max={model.stressperiods.count - 1}
                                            step={1}
                                            marks={sliderMarks()}
                                            onChange={handleChangeStressPeriods}
                                            defaultValue={
                                                [selectedObjective.location.ts.min, selectedObjective.location.ts.max]
                                            }
                                            tipFormatter={(value: number) => formatTimestamp(value)}
                                        />
                                    </Segment>
                                </Form.Field>
                                <Form.Field>
                                    <label>Location</label>
                                    <Segment>
                                        <OptimizationMap
                                            name="location"
                                            model={props.model}
                                            location={OptimizationLocation.fromObject(selectedObjective.location)}
                                            onlyObjects={
                                                selectedObjective.type === EConstraintType.FLUX ||
                                                selectedObjective.type === EConstraintType.INPUT_CONC
                                            }
                                            objectsCollection={input.objectsCollection}
                                            onChange={handleChangeMap}
                                            readOnly={true}
                                        />
                                    </Segment>
                                </Form.Field>
                            </div>
                            }
                            {selectedObjective.type === EConstraintType.DISTANCE &&
                            <Form.Field>
                                <h4>Distance</h4>
                                <Segment>
                                    <Grid divided={'vertically'}>
                                        <Grid.Row columns={2}>
                                            <Grid.Column width={8}>
                                                <OptimizationMap
                                                    name="location1"
                                                    label="Edit Location 1"
                                                    model={props.model}
                                                    location={
                                                        OptimizationLocation.fromObject(selectedObjective.location1)
                                                    }
                                                    onChange={handleChangeMap}
                                                    readOnly={true}
                                                />
                                            </Grid.Column>
                                            <Grid.Column width={8}>
                                                <OptimizationMap
                                                    name="location2"
                                                    label="Edit Location 2"
                                                    model={props.model}
                                                    location={
                                                        OptimizationLocation.fromObject(selectedObjective.location2)
                                                    }
                                                    onChange={handleChangeMap}
                                                    readOnly={true}
                                                />
                                            </Grid.Column>
                                        </Grid.Row>
                                    </Grid>
                                </Segment>
                            </Form.Field>
                            }
                        </Form>
                        }
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </div>
    );

};

export default optimizationObjectivesComponent;
