import React, {MouseEvent, SyntheticEvent, useState} from 'react';
import {
    Accordion,
    AccordionTitleProps,
    Button,
    DropdownProps,
    Form,
    Grid,
    Icon,
    List,
    Modal,
    Segment
} from 'semantic-ui-react';
import {ModflowModel, Stressperiods} from '../../../../../../core/model/modflow';
import OptimizationObject from '../../../../../../core/model/modflow/optimization/OptimizationObject';
import {IOptimizationObject} from '../../../../../../core/model/modflow/optimization/OptimizationObject.type';
import OptimizationSolution from '../../../../../../core/model/modflow/optimization/OptimizationSolution';
import FluxDataTable from './fluxDataTable';
import OptimizationResultsMap from './resultsMap';
import SubstanceEditor from './substanceEditor';

interface IProps {
    model: ModflowModel;
    stressPeriods: Stressperiods;
    onCancel: () => any;
    solution: OptimizationSolution;
}

const optimizationSolutionModal = (props: IProps) => {
    const [activeIndex, setActiveIndex] = useState<number>(0);
    const [selectedObject, setSelectedObject] = useState<IOptimizationObject>(props.solution.objects.first);

    const handleCancelModal = () => props.onCancel();

    const handleClickAccordion = (e: MouseEvent, titleProps: AccordionTitleProps) => {
        const {index} = titleProps;
        if (typeof index === 'number') {
            const newIndex = activeIndex === index ? -1 : index;
            return setActiveIndex(newIndex);
        }
    };

    const handleSelectObject = (e: SyntheticEvent, {value}: DropdownProps) => setSelectedObject(
        props.solution.objects.all.filter((o) => o.id === value)[0]
    );

    let fluxRows = null;

    if (selectedObject) {
        fluxRows = props.stressPeriods.dateTimes.map((dt, key) => {
            return {
                id: key,
                date_time: dt,
                min: selectedObject.flux[key] ? selectedObject.flux[key].min : 0,
                max: selectedObject.flux[key] ? selectedObject.flux[key].max : 0,
                result: selectedObject.flux[key] ? selectedObject.flux[key].result : 0
            };
        });
    }

    return (
        <Modal size={'large'} open={true} onClose={handleCancelModal} dimmer={'inverted'}>
            <Modal.Header>Solution Details</Modal.Header>
            <Modal.Content>
                <Form>
                    <Form.Field>
                        <Grid divided={'vertically'}>
                            <Grid.Row columns={2}>
                                <Grid.Column width={12}>
                                    <OptimizationResultsMap
                                        area={props.model.geometry}
                                        bbox={props.model.boundingBox}
                                        objects={props.solution.objects}
                                        selectedObject={OptimizationObject.fromObject(selectedObject)}
                                        readOnly={true}
                                        gridSize={props.model.gridSize}
                                    />
                                </Grid.Column>
                                <Grid.Column width={4}>
                                    <Form.Field>
                                        <label>Objects</label>
                                        <Form.Select
                                            placeholder="Select Object"
                                            fluid={true}
                                            options={props.solution.objects.all.map((s, key) => {
                                                return {
                                                    key,
                                                    value: s.id,
                                                    text: s.meta.name
                                                };
                                            })}
                                            onChange={handleSelectObject}
                                            value={selectedObject ? selectedObject.id : undefined}
                                        />
                                    </Form.Field>
                                    <Form.Field>
                                        <label>Position of {selectedObject.meta.name}</label>
                                        <Segment>
                                            <List>
                                                <List.Item>Layer: {selectedObject.position.lay.result}</List.Item>
                                                <List.Item>Row: {selectedObject.position.row.result}</List.Item>
                                                <List.Item>Column: {selectedObject.position.col.result}</List.Item>
                                            </List>
                                        </Segment>
                                    </Form.Field>
                                    <Form.Field>
                                        <label>Fitness</label>
                                        <Segment>
                                            <List>
                                                {props.solution.fitness.map((f, key) =>
                                                    <List.Item key={key}>
                                                        Objective {key + 1}: <b>{f.toFixed(3)}</b>
                                                    </List.Item>
                                                )}
                                            </List>
                                        </Segment>
                                    </Form.Field>
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                    </Form.Field>
                    {selectedObject &&
                    <Form.Field>
                        <Accordion fluid={true} styled={true}>
                            <Accordion.Title
                                active={activeIndex === 1}
                                index={1}
                                onClick={handleClickAccordion}
                            >
                                <Icon name="dropdown"/>
                                Pumping Rates
                            </Accordion.Title>
                            <Accordion.Content active={activeIndex === 1}>
                                {fluxRows &&
                                <FluxDataTable
                                    onChange={() => null}
                                    readOnly={true}
                                    rows={fluxRows}
                                />
                                }
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
                                    object={selectedObject}
                                    model={props.model}
                                    substances={[]}
                                    stressPeriods={props.stressPeriods}
                                    showResults={true}
                                    readOnly={true}
                                />
                            </Accordion.Content>
                        </Accordion>
                    </Form.Field>
                    }
                </Form>
            </Modal.Content>
            <Modal.Actions>
                <Button negative={true} onClick={handleCancelModal}>Cancel</Button>
            </Modal.Actions>
        </Modal>
    );
};

export default optimizationSolutionModal;
