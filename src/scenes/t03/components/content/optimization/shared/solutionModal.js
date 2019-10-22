import React from 'react';
import PropTypes from 'prop-types';
import {Grid, Button, Icon, Modal, Accordion, Form, List, Segment} from 'semantic-ui-react';
import {OptimizationSolution} from '../../../../../../core/model/modflow/optimization';
import FluxDataTable from './fluxDataTable';
import SubstanceEditor from './substanceEditor';
import OptimizationResultsMap from './resultsMap';
import {Stressperiods} from '../../../../../../core/model/modflow';

class OptimizationSolutionModal extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            activeIndex: 0,
            selectedObject: this.props.solution.objects[0]
        }
    }

    onCancelModal = () => this.props.onCancel();

    onClickAccordion = (e, titleProps) => {
        const {index} = titleProps;
        const {activeIndex} = this.state;
        const newIndex = activeIndex === index ? -1 : index;

        this.setState({activeIndex: newIndex});
    };

    onSelectObject = (e, {name, value}) => this.setState({
        selectedObject: this.props.solution.objects.filter(o => o.id === value)[0]
    });

    render() {
        const fluxConfig = [
            {property: 'min', label: 'Min'},
            {property: 'max', label: 'Max'},
            {property: 'result', label: 'Result'}
        ];

        let fluxRows = null;

        if (this.state.selectedObject) {
            fluxRows = this.props.stressPeriods.dateTimes.map((dt, key) => {
                return {
                    id: key,
                    date_time: dt,
                    min: this.state.selectedObject.flux[key] ? this.state.selectedObject.flux[key].min : 0,
                    max: this.state.selectedObject.flux[key] ? this.state.selectedObject.flux[key].max : 0,
                    result: this.state.selectedObject.flux[key] ? this.state.selectedObject.flux[key].result : 0
                };
            });
        }

        return (
            <Modal size={'large'} open onClose={this.onCancelModal} dimmer={'inverted'}>
                <Modal.Header>Solution Details</Modal.Header>
                <Modal.Content>
                    <Form>
                        <Form.Field>
                            <Grid divided={'vertically'}>
                                <Grid.Row columns={2}>
                                    <Grid.Column width={12}>
                                        <OptimizationResultsMap
                                            area={this.props.model.geometry}
                                            bbox={this.props.model.bounding_box}
                                            objects={this.props.solution.objects}
                                            selectedObject={this.state.selectedObject}
                                            readOnly={true}
                                            gridSize={this.props.model.grid_size}
                                        />
                                    </Grid.Column>
                                    <Grid.Column width={4}>
                                        <Form.Field>
                                            <label>Objects</label>
                                            <Form.Select
                                                placeholder="Select Object"
                                                fluid
                                                options={this.props.solution.objects.map((s, key) => {
                                                    return {
                                                        key: key,
                                                        value: s.id,
                                                        text: s.name
                                                    };
                                                })}
                                                onChange={this.onSelectObject}
                                                value={this.state.selectedObject ? this.state.selectedObject.id : null}
                                            />
                                        </Form.Field>
                                        <Form.Field>
                                            <label>Position of {this.state.selectedObject.name}</label>
                                            <Segment>
                                                <List>
                                                    <List.Item>Layer: {this.state.selectedObject.position.lay.result}</List.Item>
                                                    <List.Item>Row: {this.state.selectedObject.position.row.result}</List.Item>
                                                    <List.Item>Column: {this.state.selectedObject.position.col.result}</List.Item>
                                                </List>
                                            </Segment>
                                        </Form.Field>
                                        <Form.Field>
                                            <label>Fitness</label>
                                            <Segment>
                                                <List>
                                                    {this.props.solution.fitness.map((f, key) =>
                                                        <List.Item key={key}>
                                                            Objective {key + 1}: <b>{parseFloat(f).toFixed(3)}</b>
                                                        </List.Item>
                                                    )}
                                                </List>
                                            </Segment>
                                        </Form.Field>
                                    </Grid.Column>
                                </Grid.Row>
                            </Grid>
                        </Form.Field>
                        {this.state.selectedObject &&
                        <Form.Field>
                            <Accordion fluid styled>
                                <Accordion.Title active={this.state.activeIndex === 1} index={1}
                                                 onClick={this.onClickAccordion}>
                                    <Icon name="dropdown"/>
                                    Pumping Rates
                                </Accordion.Title>
                                <Accordion.Content active={this.state.activeIndex === 1}>
                                    <FluxDataTable
                                        config={fluxConfig}
                                        readOnly={true}
                                        rows={fluxRows}
                                    />
                                </Accordion.Content>
                                <Accordion.Title active={this.state.activeIndex === 2} index={2}
                                                 onClick={this.onClickAccordion}>
                                    <Icon name="dropdown"/>
                                    Substances
                                </Accordion.Title>
                                <Accordion.Content active={this.state.activeIndex === 2}>
                                    <SubstanceEditor
                                        object={this.state.selectedObject}
                                        substances={this.props.model.mt3dms && this.props.model.mt3dms.ssm ? this.props.model.mt3dms.ssm._meta.substances : []}
                                        stressPeriods={this.props.stressPeriods}
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
                    <Button negative onClick={this.onCancelModal}>Cancel</Button>
                </Modal.Actions>
            </Modal>
        );
    }
}

OptimizationSolutionModal.propTypes = {
    model: PropTypes.object.isRequired,
    stressPeriods: PropTypes.instanceOf(Stressperiods),
    onCancel: PropTypes.func.isRequired,
    solution: PropTypes.instanceOf(OptimizationSolution)
};

export default OptimizationSolutionModal;