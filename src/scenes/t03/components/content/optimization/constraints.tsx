import React, {ChangeEvent, SyntheticEvent, useEffect, useState} from 'react';
import {Button, DropdownProps, Form, Grid, Icon, InputOnChangeData, Message, Segment, Table} from 'semantic-ui-react';
import {ModflowModel} from '../../../../../core/model/modflow';
import OptimizationConstraint from '../../../../../core/model/modflow/optimization/OptimizationConstraint';
import {
    EConstraintType,
    IOptimizationConstraint
} from '../../../../../core/model/modflow/optimization/OptimizationConstraint.type';
import OptimizationInput from '../../../../../core/model/modflow/optimization/OptimizationInput';
import {IOptimizationInput} from '../../../../../core/model/modflow/optimization/OptimizationInput.type';
import OptimizationLocation from '../../../../../core/model/modflow/optimization/OptimizationLocation';
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

const optimizationConstraintsComponent = (props: IProps) => {
    const [optimizationInput, setOptimizationInput] = useState<IOptimizationInput>(props.optimizationInput.toObject());
    const [selectedConstraint, setSelectedConstraint] = useState<IOptimizationConstraint | null>(null);

    useEffect(() => {
        setOptimizationInput(props.optimizationInput.toObject());
    }, [props.optimizationInput]);

    const handleClickBack = () => setSelectedConstraint(null);

    const handleClickDelete = (id: string) => {
        const cInput = OptimizationInput.fromObject(optimizationInput);
        cInput.constraintsCollection.removeById(id);
        return props.onChange(cInput, true);
    };

    const handleClickNew = (e: SyntheticEvent, {value}: DropdownProps) => {
        const newConstraint = OptimizationConstraint.fromDefaults();
        newConstraint.type = Object.values(EConstraintType).includes(value) ? value as EConstraintType
            : EConstraintType.FLUX;
        newConstraint.location.ts.max = props.model.stressperiods.count - 1;
        const cInput = OptimizationInput.fromObject(optimizationInput);
        cInput.constraintsCollection.add(newConstraint.toObject());
        props.onChange(cInput, false);
        return setSelectedConstraint(newConstraint.toObject());
    };

    const handleClickConstraint = (constraint: IOptimizationConstraint) => () => setSelectedConstraint(constraint);

    const handleClickSave = () => {
        if (selectedConstraint) {
            const cInput = OptimizationInput.fromObject(optimizationInput);
            cInput.constraintsCollection.update(selectedConstraint);
            props.onChange(cInput, false);
        }
        return props.onSave();
    };

    const handleChange = () => {
        if (selectedConstraint) {
            const cInput = OptimizationInput.fromObject(optimizationInput);
            cInput.constraintsCollection.update(selectedConstraint);
            return props.onChange(cInput, false);
        }
    };

    const handleChangeMap = ({name, value}: {name: string, value: OptimizationLocation}) => {
        if (selectedConstraint) {
            const cInput = OptimizationInput.fromObject(optimizationInput);
            const constraint = selectedConstraint;
            constraint[name] = value;
            cInput.constraintsCollection.update(constraint);
            setSelectedConstraint(constraint);
            return props.onChange(cInput, false);
        }
    };

    const handleChangeSelect = (e: SyntheticEvent, {name, value}: DropdownProps) => {
        if (selectedConstraint) {
            const cInput = OptimizationInput.fromObject(optimizationInput);
            const constraint = selectedConstraint;
            constraint[name] = value;
            cInput.constraintsCollection.update(constraint);
            setSelectedConstraint(constraint);
            return props.onChange(cInput, false);
        }
    };

    const handleChangeStressPeriods = (e: number[]) => {
        if (selectedConstraint) {
            const cInput = OptimizationInput.fromObject(optimizationInput);
            const constraint = selectedConstraint;
            constraint.location.ts = {
                min: e[0],
                max: e[1],
                result: null
            };
            cInput.constraintsCollection.update(constraint);
            setSelectedConstraint(constraint);
            // TODO: difference between onChange and onSliderEnd?
            return props.onChange(cInput, false);
        }
    };

    const handleLocalChange = (e: ChangeEvent, {name, value}: InputOnChangeData) => {
        if (selectedConstraint) {
            const constraint = selectedConstraint;
            constraint[name] = value;
            return setSelectedConstraint(constraint);
        }
    };

    const formatTimestamp = (key: number) => () => props.model.stressperiods.dateTimes[key];

    const sliderMarks = () => {
        const marks: { [key: number]: string } = {};
        props.model.stressperiods.dateTimes.forEach((dt, key) => {
            marks[key] = key.toFixed(2);
        });
        return marks;
    };

    const {model} = props;
    const input = OptimizationInput.fromObject(optimizationInput);
    const constraints = input.constraintsCollection;

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
                saveButton={!!selectedConstraint}
                backButton={!!selectedConstraint}
                onBack={handleClickBack}
                onSave={handleClickSave}
                dropdown={!selectedConstraint ? {
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
                        {(!selectedConstraint && constraints.length < 1) &&
                        <Message>
                            <p>No optimization constraints</p>
                        </Message>
                        }
                        {(!selectedConstraint && constraints.length >= 1) &&
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
                                    constraints.all.map((constraint: IOptimizationConstraint) =>
                                        <Table.Row key={constraint.id}>
                                            <Table.Cell
                                                width={9}
                                                style={styles.linkedCell}
                                                onClick={handleClickConstraint(constraint)}
                                            >
                                                {constraint.name}
                                            </Table.Cell>
                                            <Table.Cell width={5}>{constraint.type}</Table.Cell>
                                            <Table.Cell width={2} textAlign="right">
                                                <Button
                                                    icon={true}
                                                    negative={true}
                                                    onClick={() => handleClickDelete(constraint.id)}
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
                        {selectedConstraint &&
                        <Form>
                            <Form.Field>
                                <label>Name</label>
                                <Form.Input
                                    type="text"
                                    name="name"
                                    value={selectedConstraint.name}
                                    placeholder="name ="
                                    onChange={handleLocalChange}
                                    onBlur={handleChange}
                                />
                            </Form.Field>
                            <Form.Group widths="equal">
                                <Form.Field>
                                    <label>Constraint type</label>
                                    <Form.Select
                                        name="type"
                                        value={selectedConstraint.type}
                                        placeholder="type ="
                                        options={typeOptions}
                                        onChange={handleChangeSelect}
                                    />
                                </Form.Field>
                                <Form.Field>
                                    <label>Method how each constraint scalar will be calculated.</label>
                                    <Form.Select
                                        name="summary_method"
                                        value={selectedConstraint.summaryMethod}
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
                            <Form.Field>
                                <label>Constraint value</label>
                                <Form.Input
                                    type="number"
                                    name="value"
                                    value={selectedConstraint.value}
                                    placeholder="value ="
                                    onChange={handleLocalChange}
                                    onBlur={handleChange}
                                    defaultChecked={true}
                                />
                            </Form.Field>
                            <Form.Field>
                                <label>Operator that compares the observed value with the constraint
                                    value.</label>
                                <Form.Select
                                    name="operator"
                                    value={selectedConstraint.operator}
                                    placeholder="operator ="
                                    options={[
                                        {key: 'more', text: 'More', value: 'more'},
                                        {key: 'less', text: 'Less', value: 'less'}
                                    ]}
                                    onChange={handleChangeSelect}
                                />
                            </Form.Field>
                            {selectedConstraint.type !== 'distance' &&
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
                                                [selectedConstraint.location.ts.min, selectedConstraint.location.ts.max]
                                            }
                                            tipFormatter={formatTimestamp}
                                        />
                                    </Segment>
                                </Form.Field>
                                <Form.Field>
                                    <label>Location</label>
                                    <Segment>
                                        <OptimizationMap
                                            name="location"
                                            model={props.model}
                                            location={OptimizationLocation.fromObject(selectedConstraint.location)}
                                            onlyObjects={
                                                selectedConstraint.type === 'flux' ||
                                                selectedConstraint.type === 'inputConc'
                                            }
                                            objectsCollection={input.objectsCollection}
                                            onChange={handleChangeMap}
                                            readOnly={true}
                                        />
                                    </Segment>
                                </Form.Field>
                            </div>
                            }
                            {selectedConstraint.type === 'distance' &&
                            <Form.Field>
                                <label>Distance</label>
                                <Segment>
                                    <Grid divided={'vertically'}>
                                        <Grid.Row columns={2}>
                                            <Grid.Column width={8}>
                                                <OptimizationMap
                                                    name="location1"
                                                    label="Edit Location 1"
                                                    model={props.model}
                                                    location={
                                                        OptimizationLocation.fromObject(selectedConstraint.location1)
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
                                                        OptimizationLocation.fromObject(selectedConstraint.location2)
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

export default optimizationConstraintsComponent;
