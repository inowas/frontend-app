import React from 'react';

import {groupBy, intersection, union} from 'lodash';
import {Checkbox, Form, Grid, Header, Icon, Image, Table, Breadcrumb} from 'semantic-ui-react';

import {getData} from '../data';
import AppContainer from '../../shared/AppContainer';
import ToolGrid from '../../shared/simpleTools/ToolGrid';

const navigation = [{
    name: 'Documentation',
    path: 'https://inowas.hydro.tu-dresden.de/tools/t06-mar-method-selection/',
    icon: <Icon name="file"/>
}];

const styles = {
    h2: {
        textAlign: 'center',
        textTransform: 'uppercase'
    }
};

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
                            <Grid.Column>
                                <Header as={'h4'} dividing>{category}</Header>
                                {conditionsList}
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                );
            }
        }

        return groupedConditionsList;
    }

    renderBreadcrumbs = () => (
        <Breadcrumb>
            <Breadcrumb.Section link>Tools</Breadcrumb.Section>
            <Breadcrumb.Divider icon='right angle'/>
            <Breadcrumb.Section>T06. MAR method selection</Breadcrumb.Section>
        </Breadcrumb>
    );

    methods() {
        const selectedConditions = this.state.conditions.filter((c) => {
            return c.selected;
        });

        const groupSelectedConditions = groupBy(selectedConditions, 'category');
        const groupSelectedMethods = [];
        for (const category in groupSelectedConditions) {
            let selectedMethods = [];
            // noinspection JSUnfilteredForInLoop
            for (let i = 0; i < groupSelectedConditions[category].length; i++) {
                // noinspection JSUnfilteredForInLoop
                selectedMethods = union(selectedMethods, groupSelectedConditions[category][i].applicable_methods);
            }
            // noinspection JSUnfilteredForInLoop
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
                            <Image src={method.image} size='medium'/>
                        </a>
                    </Table.Cell>
                </Table.Row>
            );
        }));
    }

    render() {
        return (
            <AppContainer navbarItems={navigation}>
                <div style={{margin: '0 0 0 1em' }}>
                <Header as={'h1'} size={'large'}>T06. MAR method selection</Header>
                {this.renderBreadcrumbs()}
                </div>
                <ToolGrid rows={1}>
                    <div>
                        <Header as={'h2'} style={styles.h2}>Input Conditions</Header>
                        <Form>
                            {this.conditions()}
                        </Form>
                    </div>
                    <div>
                        <Header as={'h2'} style={styles.h2}>Methods Suggested</Header>
                        <Table celled padded>
                            <Table.Header>
                                <Table.Row>
                                    <Table.HeaderCell width={4} singleLine>MAR methods</Table.HeaderCell>
                                    <Table.HeaderCell>Unit costs</Table.HeaderCell>
                                    <Table.HeaderCell>Area required</Table.HeaderCell>
                                    <Table.HeaderCell>More information</Table.HeaderCell>
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
                                {this.methods()}
                            </Table.Body>
                        </Table>
                    </div>
                </ToolGrid>
            </AppContainer>
        );
    }
}

export default T06;
