import React, {MouseEvent, SyntheticEvent, useEffect, useState} from 'react';
import {
    Accordion,
    AccordionTitleProps,
    Button,
    DropdownProps,
    Form,
    Grid,
    Icon,
    InputOnChangeData,
    Message,
    Table
} from 'semantic-ui-react';
import {ModflowModel} from '../../../../../core/model/modflow';
import OptimizationInput from '../../../../../core/model/modflow/optimization/OptimizationInput';
import {IOptimizationInput} from '../../../../../core/model/modflow/optimization/OptimizationInput.type';
import OptimizationLocation from '../../../../../core/model/modflow/optimization/OptimizationLocation';
import OptimizationObject from '../../../../../core/model/modflow/optimization/OptimizationObject';
import {
    EObjectType,
    IMinMaxResult,
    IOptimizationObject
} from '../../../../../core/model/modflow/optimization/OptimizationObject.type';
import {ISubstance} from '../../../../../core/model/modflow/transport/Substance.type';
import SubstanceCollection from '../../../../../core/model/modflow/transport/SubstanceCollection';
import ContentToolBar from '../../../../shared/ContentToolbar';
import {FluxDataTable, SubstanceEditor} from './shared';
import OptimizationMap from './shared/map';

const styles = {
    dropDownWithButtons: {
        marginRight: 0,
        marginLeft: 0,
    },
    linkedCell: {
        cursor: 'pointer'
    }
};

interface IProps {
    isDirty: boolean;
    optimizationInput: OptimizationInput;
    model: ModflowModel;
    onChange: (input: OptimizationInput) => any;
    onSave: () => any;
}

const optimizationObjectsComponent = (props: IProps) => {
    const [optimizationInput, setOptimizationInput] = useState<IOptimizationInput>(props.optimizationInput.toObject());
    const [selectedObject, setSelectedObject] = useState<IOptimizationObject | null>(null);
    const [selectedSubstance, setSelectedSubstance] = useState<ISubstance | null>(null);
    const [activeIndex, setActiveIndex] = useState<number>(0);

    useEffect(() => {
        setOptimizationInput(props.optimizationInput.toObject());
    }, [props.optimizationInput]);

    const handleChange = () => {
        const input = OptimizationInput.fromObject(optimizationInput);
        if (selectedObject) {
            input.objectsCollection.update(selectedObject);
        }
        props.onChange(input);
    };

    const handleChangeFlux = (rows: IMinMaxResult[]) => {
        if (selectedObject) {
            const object = OptimizationObject.fromObject(selectedObject).updateFlux(rows);
            setSelectedObject(object.toObject());
        }
    };

    const handleChangeLocation = (result: {name: string, value: OptimizationLocation}) => {
        return setSelectedObject({
            ...selectedObject,
            position: result.value.toObject()
        });
    };

    const handleChangeSubstances = (substances: SubstanceCollection) => {
        if (selectedObject) {
            return setSelectedObject(OptimizationObject.fromObject(selectedObject)
                .updateSubstances(substances.toArray()).toObject());
        }
    };

    const handleClickAccordion = (e: MouseEvent, titleProps: AccordionTitleProps) => {
        const {index} = titleProps;
        const newIndex = activeIndex === index ? -1 : index;
        if (typeof newIndex === 'number') {
            return setActiveIndex(newIndex);
        }
    };

    const handleClickBack = () => {
        setSelectedObject(null);
        setSelectedSubstance(null);
    };

    const handleClickDelete = (id: string) => () => {
        const input = OptimizationInput.fromObject(optimizationInput);
        input.objectsCollection.removeById(id);
        props.onChange(input);
    };

    const handleClickNew = (e: SyntheticEvent, {value}: DropdownProps) => {
        const newObject = OptimizationObject.createFromTypeAndStressPeriods(
            value as EObjectType, props.model.stressperiods.count
        );
        const input = OptimizationInput.fromObject(optimizationInput);
        input.objectsCollection.add(newObject.toObject());
        props.onChange(input);

        return setSelectedObject(newObject.toObject());
    };

    const handleClickObject = (object: IOptimizationObject) => setSelectedObject(object);

    const handleClickSave = () => {
        if (selectedObject) {
            const object = OptimizationObject.fromObject(selectedObject);
            const input = OptimizationInput.fromObject(optimizationInput);
            input.objectsCollection.update(object.toObject());
            props.onChange(input);
        }

        props.onSave();
    };

    const handleLocalChange = (e: SyntheticEvent, {name, value}: InputOnChangeData | DropdownProps) => {
        const object = selectedObject;
        object[name] = value;
        return setSelectedObject(object);
    };

    const typeOptions = [
        {key: 'type1', text: 'Well', value: EObjectType.WEL},
    ];

    let fluxRows = null;

    if (selectedObject) {
        fluxRows = props.model.stressperiods.dateTimes.map((dt, key) => {
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
        onChange: handleClickNew
    } : null;

    return (
        <div>
            <ContentToolBar
                isError={false}
                isDirty={props.isDirty}
                onBack={handleClickBack}
                onSave={handleClickSave}
                backButton={!!selectedObject}
                dropdown={addObjectDropdown}
                saveButton={!!selectedObject}
            />
            <Grid>
                <Grid.Row columns={1}>
                    <Grid.Column>
                        {(!selectedObject && optimizationInput.objects.length < 1) &&
                        <Message>
                            <p>No decision variables</p>
                        </Message>
                        }
                        {(!selectedObject && optimizationInput.objects.length > 0) ?
                            <Table small={true} striped={true}>
                                <Table.Header>
                                    <Table.Row>
                                        <Table.HeaderCell>Name</Table.HeaderCell>
                                        <Table.HeaderCell>Type</Table.HeaderCell>
                                        <Table.HeaderCell/>
                                    </Table.Row>
                                </Table.Header>
                                <Table.Body>
                                    {
                                        optimizationInput.objects.map((object) =>
                                            <Table.Row key={object.id}>
                                                <Table.Cell
                                                    width={9}
                                                    style={styles.linkedCell}
                                                    onClick={() => handleClickObject(object)}
                                                >
                                                    {object.meta.name}
                                                </Table.Cell>
                                                <Table.Cell width={5}>{object.type}</Table.Cell>
                                                <Table.Cell width={2} textAlign="right">
                                                    <Button
                                                        icon={true}
                                                        negative={true}
                                                        onClick={handleClickDelete(object.id)}
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
                                            onChange={handleLocalChange}
                                        />
                                    </Form.Field>
                                    <Form.Field>
                                        <label>Name</label>
                                        <Form.Input
                                            type="text"
                                            name="name"
                                            value={selectedObject.meta.name}
                                            placeholder="name ="
                                            onBlur={handleChange}
                                            onChange={handleLocalChange}
                                        />
                                    </Form.Field>
                                </Form.Group>
                                <Accordion fluid={true} styled={true}>
                                    <Accordion.Title
                                        active={activeIndex === 0}
                                        index={0}
                                        onClick={handleClickAccordion}
                                    >
                                        <Icon name="dropdown"/>
                                        Location
                                    </Accordion.Title>
                                    <Accordion.Content active={activeIndex === 0}>
                                        <OptimizationMap
                                            location={OptimizationObject.fromObject(selectedObject).position}
                                            name="position"
                                            model={props.model}
                                            onChange={handleChangeLocation}
                                            onlyBbox={true}
                                        />
                                    </Accordion.Content>
                                    <Accordion.Title
                                        active={activeIndex === 1}
                                        index={1}
                                        onClick={handleClickAccordion}
                                    >
                                        <Icon name="dropdown"/>
                                        Pumping Rates
                                    </Accordion.Title>
                                    <Accordion.Content active={activeIndex === 1}>
                                        <FluxDataTable
                                            readOnly={props.model.readOnly}
                                            rows={fluxRows}
                                            onChange={handleChangeFlux}
                                        />
                                    </Accordion.Content>
                                    <Accordion.Title
                                        active={activeIndex === 2}
                                        index={2}
                                        onClick={handleClickAccordion}
                                    >
                                        <Icon name="dropdown"/>
                                        Substances
                                    </Accordion.Title>
                                    <Accordion.Content active={activeIndex === 2}>
                                        <SubstanceEditor
                                            object={OptimizationObject.fromObject(selectedObject)}
                                            model={props.model}
                                            onChange={handleChangeSubstances}
                                            readOnly={props.model.readOnly}
                                            showResults={false}
                                            stressPeriods={props.model.stressperiods}
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
};

export default optimizationObjectsComponent;
