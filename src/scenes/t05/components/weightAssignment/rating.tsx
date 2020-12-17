import {Form, Grid, Input, InputOnChangeData, Message, Segment, Table} from 'semantic-ui-react';
import {IWeightAssignment} from '../../../../core/model/mcda/criteria/WeightAssignment.type';
import {Weight, WeightAssignment, WeightsCollection} from '../../../../core/model/mcda/criteria';
import React, {ChangeEvent, useState} from 'react';

interface IProps {
    handleChange: (wa: WeightAssignment) => any;
    readOnly: boolean;
    weightAssignment: WeightAssignment;
}

// tslint:disable-next-line:variable-name
const Rating = (props: IProps) => {
    const [showInfo, setShowInfo] = useState<boolean>(true);
    const [wa, setWa] = useState<IWeightAssignment>(props.weightAssignment.toObject());

    const [activeInput, setActiveInput] = useState<string | null>(null);
    const [activeValue, setActiveValue] = useState<string>('');

    const handleDismiss = () => setShowInfo(false);

    const handleLocalChange = (e: ChangeEvent<HTMLInputElement>, {name, value}: InputOnChangeData) => {
        if (props.readOnly) {
            return;
        }

        return setWa({
            ...wa,
            [name]: value
        });
    };

    const handleBlurValue = () => {
        if (props.readOnly || !activeInput) {
            return;
        }

        const cWa = WeightAssignment.fromObject(wa);
        const weight = cWa.weightsCollection.findById(activeInput);

        if (weight) {
            weight.initialValue = parseFloat(activeValue);
            cWa.updateWeight(Weight.fromObject(weight));
            cWa.calculateWeights();

            setActiveValue('');
            setActiveInput(null);

            return props.handleChange(cWa);
        }
    };

    const handleChangeValue = (e: ChangeEvent<HTMLInputElement>, {name, value}: InputOnChangeData) => {
        if (props.readOnly) {
            return;
        }

        setActiveInput(name);
        setActiveValue(value);

        const cWa = WeightAssignment.fromObject(wa);
        cWa.weightsCollection = WeightsCollection.fromObject(wa.weights.map((weight) => {
            if (name === weight.id) {
                weight.initialValue = parseFloat(value);
            }
            return weight;
        }));
        return setWa(cWa.toObject());
    };

    return (
        <div>
            {showInfo &&
            <Message onDismiss={handleDismiss}>
                <Message.Header>Weight Assignment: Rating</Message.Header>
                <p>Assign values to each criterion completely free by filling the input fields. The given values are
                    then normalized and calculated to weights between 0 and 1 in relation to the other values.</p>
            </Message>
            }

            {wa.weights.length > 0 &&
            <Grid columns={2}>
                <Grid.Column>
                    <Segment textAlign="center" inverted={true} color="grey" secondary={true}>
                        Editor
                    </Segment>
                    <Segment>
                        <Grid>
                            {wa.weights.map((weight, key) =>
                                <Grid.Row key={key}>
                                    <Grid.Column width={5}>
                                        {weight.criterion.name}
                                    </Grid.Column>
                                    <Grid.Column width={11}>
                                        <Input
                                            type="number"
                                            readOnly={props.readOnly}
                                            name={weight.id}
                                            onBlur={handleBlurValue}
                                            onChange={handleChangeValue}
                                            value={activeInput === weight.id ? activeValue : weight.initialValue}
                                        />
                                    </Grid.Column>
                                </Grid.Row>
                            )}
                        </Grid>
                    </Segment>
                </Grid.Column>
                <Grid.Column>
                    <Segment textAlign="center" inverted={true} color="grey" secondary={true}>
                        Settings
                    </Segment>
                    <Form>
                        <Form.Input
                            fluid={true}
                            onBlur={handleBlurValue}
                            onChange={handleLocalChange}
                            name="name"
                            type="text"
                            label="Name"
                            readOnly={props.readOnly}
                            value={wa.name}
                        />
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
                            {props.weightAssignment.weightsCollection.all.map((w, key) =>
                                <Table.Row key={key}>
                                    <Table.Cell>{w.criterion.name}</Table.Cell>
                                    <Table.Cell
                                        textAlign="center"
                                    >
                                        {(100 * w.value).toFixed(2)}
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

export default Rating;
