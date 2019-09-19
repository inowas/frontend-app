import React, {ChangeEvent, SyntheticEvent, useEffect, useState} from 'react';
import {Button, DropdownProps, Form, Grid, Icon, InputOnChangeData, Message, Radio, Table} from 'semantic-ui-react';
import {Criterion, Rule, RulesCollection} from '../../../../core/model/mcda/criteria';
import {CriteriaType, ICriterion} from '../../../../core/model/mcda/criteria/Criterion.type';
import {IRule, RuleIndex} from '../../../../core/model/mcda/criteria/Rule.type';
import {Raster} from '../../../../core/model/mcda/gis';
import {dropData} from '../../../../services/api';
import {ILegendItemDiscrete} from '../../../../services/rainbowvis/types';
import CriteriaRasterMap from './criteriaRasterMap';

const legend: ILegendItemDiscrete[] = [
    {
        color: 'green',
        isContinuous: false,
        label: 'Suitable',
        value: 1
    }
];

interface IProps {
    criterion: Criterion;
    onChange: (criterion: Criterion) => any;
    readOnly: boolean;
}

const criteriaDataConstraints = (props: IProps) => {
    const [criterion, setCriterion] = useState<ICriterion>(props.criterion.toObject);
    const [showInfo, setShowInfo] = useState<boolean>(true);

    useEffect(() => {
        setCriterion(props.criterion.toObject());
    }, [props.criterion]);

    const saveRaster = (cCriterion: Criterion) => {
        dropData(
            cCriterion.constraintRaster.data,
            (response) => {
                cCriterion.constraintRaster.url = response.filename;
                props.onChange(cCriterion);
            },
            (response) => {
                throw new Error(response);
            }
        );
    };

    const handleDismiss = () => setShowInfo(false);

    const handleAddConstraint = () => {
        if (props.readOnly) {
            return null;
        }
        const rule = Rule.fromDefaults();
        rule.value = NaN;
        const cCriterion = Criterion.fromObject(criterion);
        cCriterion.constraintRules.add(rule);
        cCriterion.raster.calculateMinMax(cCriterion.constraintRules);
        props.onChange(cCriterion);
    };

    const handleLocalChange = (id: string) => (e: ChangeEvent<HTMLInputElement>, {name, value}: InputOnChangeData) => {
        if (props.readOnly) {
            return null;
        }

        const cCriterion = Criterion.fromObject(criterion);
        cCriterion.constraintRules.items = cCriterion.constraintRules.all.map((r: IRule) => {
            if (r.id === id) {
                r[name as RuleIndex] = value || NaN;
            }
            return r;
        });

        return setCriterion(cCriterion.toObject());
    };

    const handleChangeSelect = (id: string) => (e: SyntheticEvent<HTMLElement>, {name, value}: DropdownProps) => {
        if (props.readOnly) {
            return null;
        }

        const cCriterion = Criterion.fromObject(criterion);
        cCriterion.constraintRules.items = cCriterion.constraintRules.all.map((r) => {
            if (r.id === id) {
                r[name as RuleIndex] = value as string || NaN;
            }
            return r;
        });
        cCriterion.raster.calculateMinMax(cCriterion.constraintRules);
        props.onChange(cCriterion);
    };

    const handleChange = () => {
        if (props.readOnly) {
            return null;
        }

        const cCriterion = Criterion.fromObject(criterion);
        cCriterion.raster.calculateMinMax(cCriterion.constraintRules);
        props.onChange(cCriterion);
    };

    const handleClickRecalculate = () => {
        if (props.readOnly) {
            return null;
        }

        const cCriterion = Criterion.fromObject(criterion);
        cCriterion.calculateConstraints();
        cCriterion.raster.calculateMinMax(cCriterion.constraintRules);
        saveRaster(cCriterion);
    };

    const handleClickRemoveRule = (id: string) => () => handleRemoveRule(id);

    const handleRemoveRule = (id: string) => {
        if (props.readOnly) {
            return null;
        }

        const cCriterion = Criterion.fromObject(criterion);
        cCriterion.raster.calculateMinMax(cCriterion.constraintRules);
        cCriterion.constraintRules.removeById(id);
        props.onChange(cCriterion);
    };

    const handleToggleRule = (rule: IRule) => {
        if (props.readOnly) {
            return null;
        }

        rule.value = rule.value === 1 ? NaN : 1;
        const cCriterion = props.criterion;
        cCriterion.constraintRules.update(rule);
        cCriterion.calculateConstraints();
        saveRaster(cCriterion);
    };

    const handleChangeToggleRule = (rule: IRule) => () => handleToggleRule(rule);

    const renderEditorDiscrete = () => {
        const constraints = props.criterion.constraintRules.orderBy('from', 'asc');

        return (
            <Grid.Row>
                <Grid.Column width={5}>
                    <Table>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell>Value</Table.HeaderCell>
                                <Table.HeaderCell textAlign="center">Suitable?</Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {constraints.all.map((rule, key) =>
                                <Table.Row key={key}>
                                    <Table.Cell textAlign="right">{rule.from}</Table.Cell>
                                    <Table.Cell textAlign="center">
                                        <Radio
                                            checked={rule.value === 1}
                                            onChange={handleChangeToggleRule(rule)}
                                            readOnly={props.readOnly}
                                            toggle={true}
                                        />
                                    </Table.Cell>
                                </Table.Row>
                            )}
                        </Table.Body>
                    </Table>
                </Grid.Column>
                <Grid.Column width={11}>
                    <CriteriaRasterMap
                        legend={legend}
                        raster={Raster.fromObject(criterion.constraintRaster)}
                        showBasicLayer={false}
                        showButton={false}
                        showLegend={true}
                    />
                </Grid.Column>
            </Grid.Row>
        );
    };

    const renderEditorContinuous = () => {
        const iCriterion = Criterion.fromObject(criterion);
        const constraints = RulesCollection.fromObject(criterion.constraintRules).orderBy('from', 'asc');

        return (
            <Grid.Row>
                <Grid.Column width={8}>
                    {constraints.length > 0 &&
                    <Table>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell>From</Table.HeaderCell>
                                <Table.HeaderCell>To</Table.HeaderCell>
                                <Table.HeaderCell/>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {constraints.all.map((rule, key) =>
                                <Table.Row key={key}>
                                    <Table.Cell>
                                        <Form>
                                            <Form.Group widths="equal">
                                                <Form.Select
                                                    fluid={true}
                                                    options={[
                                                        {key: 0, text: '>', value: '>'},
                                                        {key: 1, text: '>=', value: '>='}
                                                    ]}
                                                    placeholder="Operator"
                                                    name={RuleIndex.FROMOPERATOR}
                                                    onChange={handleChangeSelect(rule.id)}
                                                    readOnly={props.readOnly}
                                                    value={rule.fromOperator}
                                                />
                                                <Form.Input
                                                    fluid={true}
                                                    name={RuleIndex.FROM}
                                                    onBlur={handleChange}
                                                    onChange={handleLocalChange(rule.id)}
                                                    type="number"
                                                    readOnly={props.readOnly}
                                                    value={rule.from}
                                                />
                                            </Form.Group>
                                        </Form>
                                    </Table.Cell>
                                    <Table.Cell>
                                        <Form>
                                            <Form.Group widths="equal">
                                                <Form.Select
                                                    fluid={true}
                                                    options={[
                                                        {key: 0, text: '<', value: '<'},
                                                        {key: 1, text: '<=', value: '<='}
                                                    ]}
                                                    placeholder="Operator"
                                                    name={RuleIndex.TOOPERATOR}
                                                    onChange={handleChangeSelect(rule.id)}
                                                    readOnly={props.readOnly}
                                                    value={rule.toOperator}
                                                />
                                                <Form.Input
                                                    fluid={true}
                                                    type="number"
                                                    onBlur={handleChange}
                                                    onChange={handleLocalChange(rule.id)}
                                                    name={RuleIndex.TO}
                                                    readOnly={props.readOnly}
                                                    value={rule.to}
                                                />
                                            </Form.Group>
                                        </Form>
                                    </Table.Cell>
                                    <Table.Cell textAlign="right">
                                        {!props.readOnly &&
                                        <Button.Group>
                                            <Button onClick={handleClickRemoveRule(rule.id)} icon="trash"/>
                                        </Button.Group>
                                        }
                                    </Table.Cell>
                                </Table.Row>
                            )}
                        </Table.Body>
                    </Table>
                    }
                    {!props.readOnly &&
                    <Button primary={true} icon={true} fluid={true} labelPosition="left" onClick={handleAddConstraint}>
                        <Icon name="add"/>
                        Add Rule
                    </Button>
                    }
                </Grid.Column>
                <Grid.Column width={8}>
                    {!props.readOnly &&
                    <Button
                        primary={true}
                        icon={true}
                        fluid={true}
                        labelPosition="left"
                        onClick={handleClickRecalculate}
                    >
                        <Icon name="calculator"/>
                        Recalculate Raster
                    </Button>
                    }
                    {iCriterion.constraintRaster && iCriterion.constraintRaster.data.length > 0 &&
                    iCriterion.step > 1 &&
                    <CriteriaRasterMap
                        legend={legend}
                        raster={iCriterion.constraintRaster}
                        showBasicLayer={true}
                        showButton={false}
                        showLegend={true}
                    />
                    }
                </Grid.Column>
            </Grid.Row>
        );
    };

    return (
        <div>
            <Grid>
                <Grid.Row>
                    <Grid.Column width={16}>
                        {showInfo &&
                        <Message onDismiss={handleDismiss}>
                            <Message.Header>Constraints</Message.Header>
                            {props.criterion.type === CriteriaType.CONTINUOUS ?
                                <p>You can set intervals, for which the corresponding cells should not be respected
                                    in the suitability calculation.</p> :
                                <p>You can deactivate the switch on values, for which the corresponding cells should
                                    not be respected in the suitability calculation.</p>
                            }
                            <p>Data interval: [{props.criterion.raster.min.toFixed(3)},
                                {props.criterion.raster.max.toFixed(3)}]</p>
                        </Message>
                        }
                    </Grid.Column>
                </Grid.Row>
                {props.criterion.type === CriteriaType.CONTINUOUS
                    ?
                    renderEditorContinuous()
                    :
                    renderEditorDiscrete()
                }
            </Grid>
        </div>
    );
};

export default criteriaDataConstraints;
