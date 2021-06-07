import * as math from 'mathjs';
import {Button, Grid, Icon, Message, Segment, Table} from 'semantic-ui-react';
import {CartesianGrid, Scatter, ScatterChart, XAxis, YAxis} from 'recharts';
import {CriteriaType} from '../../../../core/model/mcda/criteria/Criterion.type';
import {Criterion, Rule} from '../../../../core/model/mcda/criteria';
import {IRule} from '../../../../core/model/mcda/criteria/Rule.type';
import {criterionStep} from '../../defaults/defaults';
import {dropData} from '../../../../services/api';
import CriteriaReclassificationDiscrete from './criteriaReclassificationDiscrete';
import CriteriaReclassificationModal from './criteriaReclassificationModal';
import React, {useState} from 'react';

interface IProps {
    criterion: Criterion;
    onChange: (criterion: Criterion) => any;
    readOnly: boolean;
}

const CriteriaReclassification = (props: IProps) => {
    const [selectedRule, setSelectedRule] = useState<IRule | null>(null);
    const [showInfo, setShowInfo] = useState<boolean>(true);

    const saveRaster = (criterion: Criterion) => {
        dropData(
            criterion.suitability.data,
            (response) => {
                criterion.suitability.url = response.filename;
                props.onChange(criterion);
            },
            (response) => {
                throw new Error(response);
            }
        );
    };

    const handleClickEditRule = (id: string) => () => handleEditRule(id);
    const handleClickRemoveRule = (id: string) => () => handleRemoveRule(id);
    const handleCloseModal = () => setSelectedRule(null);

    const handleDismiss = () => setShowInfo(false);

    const handleAddRule = () => {
        if (props.readOnly) {
            return null;
        }
        const rule = Rule.fromDefaults();
        setSelectedRule(rule.toObject());
    };

    const handleEditRule = (id: string) => {
        if (props.readOnly) {
            return null;
        }
        const rule = props.criterion.rulesCollection.findById(id);
        if (rule) {
            setSelectedRule(rule);
        }
    };

    const handleRemoveRule = (id: string) => {
        if (props.readOnly) {
            return null;
        }
        const criterion = props.criterion;
        criterion.removeRule(id);
        criterion.calculateSuitability();
        criterion.step = criterionStep.AFTER_CONSTRAINTS;
        return props.onChange(criterion);
    };

    const handleClickCalculate = () => {
        if (props.readOnly) {
            return null;
        }
        const criterion = props.criterion;
        criterion.calculateSuitability();
        criterion.step = criterionStep.AFTER_RECLASSIFICATION;
        return saveRaster(criterion);
    };

    const handleChangeRule = (rule: Rule) => {
        if (props.readOnly) {
            return null;
        }

        // Todo! Robert
        // eslint-disable-next-line no-self-assign
        rule.from = rule.from;
        // eslint-disable-next-line no-self-assign
        rule.to = rule.to;
        const criterion = props.criterion;
        criterion.updateRule(rule.toObject());
        criterion.step = criterionStep.AFTER_CONSTRAINTS;
        handleCloseModal();
        return props.onChange(criterion);
    };

    const renderEditorContinuous = () => {
        const {criterion, readOnly} = props;
        const raster = criterion.raster;

        if (!criterion.rulesCollection) {
            return (
                <Message warning={true}>
                    <Message.Header>No data found</Message.Header>
                    <p>You need to upload a raster file before adding reclassification rules.</p>
                </Message>
            );
        }

        const rules = criterion.rulesCollection.orderBy('to', 'desc');

        const data = [];
        for (let x = raster.min; x <= raster.max; x += (raster.max - raster.min) / 100) {
            const filteredRules = rules.findByValue(x);
            if (filteredRules.length > 0) {
                const rule = filteredRules[0];
                if (rule.type === 'calc') {
                    const value = math.eval(rule.expression, {min: raster.min, max: raster.max, x});
                    data.push({x, y: value});
                }
                if (rule.type === 'fixed') {
                    data.push({x, y: rule.value});
                }
            }
            if (filteredRules.length === 0) {
                data.push({x, y: 0});
            }
        }

        // tslint:disable-next-line:variable-name
        const RenderNoShape = () => null;

        return (
            <Grid>
                {showInfo &&
                <Grid.Row>
                    <Grid.Column width={16}>
                        <Message onDismiss={handleDismiss}>
                            <Message.Header>Reclassification for continuous values</Message.Header>
                            <p>
                                Classes are defined by intervals of cell values and a corresponding suitability value
                                or formula to calculate the suitability value. All cells, which are not covered by the
                                rules, will be set with value 1. In formula you can use following commands:
                            </p>
                            <p>
                                x ... current value | max ... maximum value | min ... minimum value | sqrt(x) ... square
                                root | sin(x), cos(x), etc. ... mathematical functions <br/> x + 1, x - 1, x / max, -1 *
                                x ... basic mathematical operations | x^(-1*sin(x/max)) ... complex equations
                            </p>
                            <p>
                                It is also possible to choose a color and name for each value for a better
                                visualization of the criteria data in the next step. It is necessary to click on the
                                &lsquo;Perform Reclassification&lsquo; button after making changes.
                            </p>
                            <p>Data interval: [{raster.min.toFixed(3)}, {raster.max.toFixed(3)}]</p>
                        </Message>
                    </Grid.Column>
                </Grid.Row>
                }
                <Grid.Row>
                    <Grid.Column width={5}>
                        <Segment textAlign="center" inverted={true} color="grey" secondary={true}>
                            Commands
                        </Segment>
                        <Segment>
                            <Button
                                disabled={readOnly}
                                primary={true}
                                icon={true}
                                fluid={true}
                                labelPosition="left"
                                onClick={handleAddRule}
                            >
                                <Icon name="add"/>
                                Add Class
                            </Button>
                            <br/>
                            <Button
                                disabled={readOnly}
                                positive={true}
                                icon={true}
                                fluid={true}
                                labelPosition="left"
                                onClick={handleClickCalculate}
                            >
                                <Icon name="calculator"/>
                                Perform reclassification
                            </Button>
                        </Segment>
                    </Grid.Column>
                    <Grid.Column width={11}>
                        <Table>
                            <Table.Header>
                                <Table.Row>
                                    <Table.HeaderCell/>
                                    <Table.HeaderCell>Name</Table.HeaderCell>
                                    <Table.HeaderCell>From</Table.HeaderCell>
                                    <Table.HeaderCell>To</Table.HeaderCell>
                                    <Table.HeaderCell>Class</Table.HeaderCell>
                                    <Table.HeaderCell/>
                                </Table.Row>
                                {rules.all.map((rule, key) =>
                                    <Table.Row key={key}>
                                        <Table.Cell>
                                            <Icon name="circle" style={{color: rule.color}}/>
                                        </Table.Cell>
                                        <Table.Cell>
                                            {rule.name}
                                        </Table.Cell>
                                        <Table.Cell>
                                            {rule.fromOperator} {rule.from}
                                        </Table.Cell>
                                        <Table.Cell>
                                            {rule.toOperator} {rule.to}
                                        </Table.Cell>
                                        <Table.Cell>
                                            {rule.type === 'calc' ? rule.expression : rule.value}
                                        </Table.Cell>
                                        <Table.Cell textAlign="right">
                                            {!readOnly &&
                                            <Button.Group>
                                                {props.criterion.rulesCollection.isError(rule) &&
                                                <Button negative={true} icon="warning sign"/>
                                                }
                                                <Button onClick={handleClickEditRule(rule.id)} icon="edit"/>
                                                <Button onClick={handleClickRemoveRule(rule.id)} icon="trash"/>
                                            </Button.Group>
                                            }
                                        </Table.Cell>
                                    </Table.Row>
                                )}
                            </Table.Header>
                        </Table>
                    </Grid.Column>
                </Grid.Row>
                {rules.length > 0 &&
                <Grid.Row>
                    <Grid.Column width={16}>
                        <ScatterChart
                            width={900}
                            height={250}
                            margin={{top: 5, right: 30, left: 20, bottom: 5}}
                        >
                            <CartesianGrid strokeDasharray="3 3"/>
                            <XAxis
                                type="number"
                                dataKey={'x'}
                                domain={[Math.floor(raster.min), Math.ceil(raster.max)]}
                                name="criterion"
                            />
                            <YAxis type="number" dataKey={'y'} domain={[0, 1]} name="suitability"/>
                            <Scatter
                                name="Suitability"
                                line={{stroke: '#8884d8', strokeWidth: 1}}
                                data={data}
                                shape={<RenderNoShape/>}
                            />
                        </ScatterChart>
                    </Grid.Column>
                </Grid.Row>
                }
            </Grid>
        );
    };

    return (
        <div>
            {selectedRule &&
            <CriteriaReclassificationModal
                onSave={handleChangeRule}
                onClose={handleCloseModal}
                rule={Rule.fromObject(selectedRule)}
            />
            }
            {props.criterion.type === CriteriaType.CONTINUOUS &&
            renderEditorContinuous()
            }
            {props.criterion.type === 'discrete' &&
            <CriteriaReclassificationDiscrete
                criterion={props.criterion}
                onChange={props.onChange}
                readOnly={props.readOnly}
            />
            }
        </div>
    );
};

export default CriteriaReclassification;
