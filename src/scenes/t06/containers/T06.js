import React from 'react';

import {groupBy, intersection, union} from 'lodash';
import {Checkbox, Container, Form, Grid, Header, Icon, Image, Table} from "semantic-ui-react";

import {getData} from '../data';
import AppContainer from "../../shared/AppContainer";
import Background from "../../t01/components/background";

const styles = {
    columnContainer: {
        background: '#fff',
        boxShadow: '0 0 2px 0 rgba(76, 76, 76, 0.3)',
        height: '100%',
        padding: '12px'
    }
};

const navigation = [{
    name: 'Documentation',
    path: 'https://inowas.hydro.tu-dresden.de/tools/t06-mar-method-selection/',
    icon: <Icon name="file"/>
}];

class T06 extends React.Component {

    constructor(props) {
        super(props);
        this.state = getData();
    }

    replaceAll = (target, search, replacement) => {
        return target.split(search).join(replacement);
    };

    changeCondition = (changeCondition) => {
        const newState = this.state.conditions.map((c) => {
            if (c.name === changeCondition.name) {
                c.selected = changeCondition.selected;
            }

            return c;
        });

        this.setState({...newState});
    };

    handleChange = (e, {name, checked}) => {
        this.changeCondition({name: name, selected: checked});
    };

    conditions() {
        const conditions = this.state.conditions;
        const groupedConditions = groupBy(conditions, 'category');
        const groupedConditionsList = [];

        for (const category in groupedConditions) {
            if (groupedConditions.hasOwnProperty(category)) {
                const conditionsList = groupedConditions[category].map((c) => {
                    return (
                        <Form.Field
                            key={this.replaceAll(c.name, ' ', '_')}
                            control={Checkbox}
                            label={<label>{c.name}</label>}
                            onChange={this.handleChange}
                            value={c.name}
                            checked={c.selected}
                            name={c.name}
                        />
                    );
                });

                groupedConditionsList.push(
                    <Grid key={this.replaceAll(category, ' ', '_')}>
                        <Grid.Row>
                            <Grid.Column width={6}>
                                <Header as={'h4'}>{category}</Header>
                            </Grid.Column>
                            <Grid.Column width={10}>
                                {conditionsList}
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                );
            }
        }

        return groupedConditionsList;
    }

    methods() {
        const selectedConditions = this.state.conditions.filter((c) => {
            return c.selected;
        });

        const groupSelectedConditions = groupBy(selectedConditions, 'category');
        const groupSelectedMethods = [];
        for (const category in groupSelectedConditions) {
            let selectedMethods = [];
            for (let i = 0; i < groupSelectedConditions[category].length; i++) {
                selectedMethods = union(selectedMethods, groupSelectedConditions[category][i].applicable_methods);
            }
            groupSelectedMethods.push({
                category: category,
                selectedMethod: selectedMethods
            });
        }

        // get first
        let applicableMethods = (groupSelectedMethods.length > 0)
            ? groupSelectedMethods[0].selectedMethod
            : [];

        for (let i = 0; i < groupSelectedMethods.length; i++) {
            applicableMethods = intersection(applicableMethods, groupSelectedMethods[i].selectedMethod);
        }

        return (applicableMethods.map((am) => {
            const method = this.state.methods.find((m) => {
                return (m.slug === am);
            });
            return (
                <Table.Row key={method.slug}>
                    <Table.Cell>{method.name}</Table.Cell>
                    <Table.Cell>{method.highCost ? 'high' : 'low'}</Table.Cell>
                    <Table.Cell>{method.highLandNeed ? 'high' : 'low'}</Table.Cell>
                    <Table.Cell>
                        <a href={method.href} target={'_blank'}>
                            <Image src={method.image} size='small'/>
                        </a>
                    </Table.Cell>
                </Table.Row>
            );
        }));
    }

    render() {
        return (
            <AppContainer navbarItems={navigation}>
                <Grid columns={2}>
                    <Grid.Row>
                        <Grid.Column width={6}>
                            <Container style={styles.columnContainer}>
                                <Background title={'T06. MAR method selection'}/>
                            </Container>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column width={6}>
                            <Container style={styles.columnContainer}>
                                <Header as={'h3'} textAlign={'center'}>INPUT CONDITIONS</Header>
                                <Form>
                                    {this.conditions()}
                                </Form>
                            </Container>
                        </Grid.Column>
                        <Grid.Column width={10}>
                            <Container style={styles.columnContainer}>
                                <Header as={'h3'} textAlign={'center'}>METHODS SUGGESTED</Header>
                                <Table celled padded>
                                    <Table.Header>
                                        <Table.Row>
                                            <Table.HeaderCell singleLine>MAR methods</Table.HeaderCell>
                                            <Table.HeaderCell>Unit costs</Table.HeaderCell>
                                            <Table.HeaderCell>Area required</Table.HeaderCell>
                                            <Table.HeaderCell>More information</Table.HeaderCell>
                                        </Table.Row>
                                    </Table.Header>
                                    <Table.Body>
                                        {this.methods()}
                                    </Table.Body>
                                </Table>
                            </Container>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </AppContainer>
        );
    }
}

export default T06;
