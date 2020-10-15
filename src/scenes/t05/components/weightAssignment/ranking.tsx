import React, {ChangeEvent, SyntheticEvent, useEffect, useState} from 'react';
import {pure} from 'recompose';
import {DropdownProps, Form, Grid, InputOnChangeData, Message, Segment, Table} from 'semantic-ui-react';
import {WeightAssignment, WeightsCollection} from '../../../../core/model/mcda/criteria';
import {IWeight} from '../../../../core/model/mcda/criteria/Weight.type';
import {
    IWeightAssignment,
    WARankingSubMethod,
    WeightAssignmentIndex
} from '../../../../core/model/mcda/criteria/WeightAssignment.type';
import DragAndDropList from '../shared/dragAndDropList';

interface IProps {
    handleChange: (wa: WeightAssignment) => any;
    readOnly: boolean;
    weightAssignment: WeightAssignment;
}

interface IDragAndDropItem {
    id: string;
    data: string;
    rank: number;
}

const Ranking = (props: IProps) => {
    const [showInfo, setShowInfo] = useState<boolean>(true);
    const [wa, setWa] = useState<IWeightAssignment>(props.weightAssignment.toObject());

    useEffect(() => {
        setWa(props.weightAssignment.toObject());
    }, [props.weightAssignment]);

    const handleDismiss = () => setShowInfo(false);

    const handleChangeState = () => props.handleChange(WeightAssignment.fromObject(wa));

    const handleChangeSubMethod = (e: SyntheticEvent<HTMLElement>, {name, value}: DropdownProps) => {
        if (props.readOnly) {
            return;
        }

        if (value === WARankingSubMethod.EXPONENTIAL) {
            wa.subParam = 2;
        }

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        wa[name as WeightAssignmentIndex] = value;

        const cWa = WeightAssignment.fromObject(wa);
        cWa.calculateWeights();
        return props.handleChange(cWa);
    };

    const handleChangeSubParam = () => {
        if (props.readOnly) {
            return;
        }
        const cWa = WeightAssignment.fromObject(wa);
        cWa.calculateWeights();
        return props.handleChange(cWa);
    };

    const handleLocalChange = (e: ChangeEvent<HTMLInputElement>, {name, value}: InputOnChangeData) => {
        if (props.readOnly) {
            return;
        }
        return setWa({
                ...wa,
                [name]: value
            }
        );
    };

    const handleChange = (cWeights: IWeight[]) => {
        if (props.readOnly) {
            return;
        }
        const weightAssignment = WeightAssignment.fromObject(wa);
        weightAssignment.weightsCollection = WeightsCollection.fromObject(cWeights);
        weightAssignment.calculateWeights();
        return props.handleChange(weightAssignment);
    };

    const handleChangeOrder = (cItems: IDragAndDropItem[]) => {
        if (props.readOnly) {
            return;
        }
        const newWeights: IWeight[] = [];

        cItems.forEach((item) => {
            const weight = props.weightAssignment.weightsCollection.findById(item.id);

            if (weight) {
                weight.initialValue = item.rank;
                newWeights.push(weight);
            }
        });

        return handleChange(newWeights);
    };

    const weights = props.weightAssignment.weightsCollection.orderBy('initialValue');

    const items: IDragAndDropItem[] = weights.all.map((weight) => {
        return {
            id: weight.id,
            data: weight.criterion.name,
            rank: weight.initialValue
        };
    });

    return (
        <div>
            {showInfo &&
            <Message onDismiss={handleDismiss}>
                <Message.Header>Weight Assignment: Ranking</Message.Header>
                <p>Place the criteria in your preferred order by drag and drop or using the arrow buttons. The
                    higher a position of a criterion, the more important and the higher is its weight. You can
                    choose between two methods:</p>
                <p><b>Rank sum weight:</b> (n - rj + 1) / &Sigma;(n - rj + 1)</p>
                <p><b>Reciprocal weight:</b> (1 / rj) / &Sigma;(1 / rj)</p>
                <p><b>Exponential weight:</b> (n - rj + 1) ^ z / &Sigma;(n - rj + 1) ^ z</p>
                <p>... for n = number of criteria, j = 1...n, rj = rank of criteria j and &Sigma; sum from j to n,
                    exponent z</p>
            </Message>
            }
            {weights.length > 0 &&
            <Grid columns={2}>
                <Grid.Column>
                    <Segment textAlign="center" inverted={true} color="grey" secondary={true}>
                        Most Important
                    </Segment>
                    <DragAndDropList
                        items={items}
                        onChange={handleChangeOrder}
                        readOnly={props.readOnly}
                    />
                    <Segment textAlign="center" inverted={true} color="grey" secondary={true}>
                        Least Important
                    </Segment>
                </Grid.Column>
                <Grid.Column>
                    <Segment textAlign="center" inverted={true} color="grey" secondary={true}>
                        Settings
                    </Segment>
                    <Form>
                        <Form.Field>
                            <Form.Input
                                fluid={true}
                                onBlur={handleChangeState}
                                onChange={handleLocalChange}
                                name={WeightAssignmentIndex.NAME}
                                type="text"
                                label="Name"
                                readOnly={props.readOnly}
                                value={wa.name}
                            />
                        </Form.Field>
                        <Form.Field>
                            <Form.Select
                                fluid={true}
                                label="Method"
                                onChange={handleChangeSubMethod}
                                options={[
                                    {key: 'sum', text: 'Rank sum weight', value: WARankingSubMethod.SUMMED},
                                    {key: 'rec', text: 'Rank reciprocal weight', value: WARankingSubMethod.RECIPROCAL},
                                    {key: 'exp', text: 'Rank exponent', value: WARankingSubMethod.EXPONENTIAL}
                                ]}
                                name={WeightAssignmentIndex.SUB_METHOD}
                                readOnly={props.readOnly}
                                value={!wa.subMethod || wa.subMethod}
                            />
                        </Form.Field>
                        {wa.subMethod === 'exp' &&
                        <Form.Field>
                            <Form.Input
                                fluid={true}
                                onBlur={handleChangeSubParam}
                                onChange={handleLocalChange}
                                name={WeightAssignmentIndex.SUB_PARAM}
                                type="number"
                                label="Exponent"
                                readOnly={props.readOnly}
                                value={wa.subParam}
                            />
                        </Form.Field>
                        }
                    </Form>
                    <Segment textAlign="center" inverted={true} color="grey" secondary={true}>
                        Resulting Weights
                    </Segment>
                    <Table>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell>Criteria</Table.HeaderCell>
                                <Table.HeaderCell textAlign="center">Sum Weight [%]</Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {weights.all.map((w: IWeight, key: number) =>
                                <Table.Row key={key}>
                                    <Table.Cell>{w.criterion.name}</Table.Cell>
                                    <Table.Cell
                                        textAlign="center"
                                    >
                                        {(w.value * 100).toFixed(2)}
                                    </Table.Cell>
                                </Table.Row>
                            )}
                        </Table.Body>
                    </Table>
                </Grid.Column>
            </Grid>
            }
        </div>
    );
};

export default pure(Ranking);
