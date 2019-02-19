import React from 'react';

import {groupBy, intersection, union} from 'lodash';
import {Checkbox, Form, Grid, Header, Icon, Item, Breadcrumb, Label} from 'semantic-ui-react';

import {getData} from '../data';
import {AppContainer} from '../../shared';
import {ToolGrid} from '../../shared/simpleTools';

const navigation = [{
    name: 'Documentation',
    path: 'https://inowas.com/tools/t06-mar-method-selection/',
    icon: <Icon name="file"/>
}];

const styles = {
    h2: {
        textAlign: 'center',
        textTransform: 'uppercase'
    },
    h4: {
        color: 'rgba(0,0,0,.85)',
        fontWeight: '700',
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
                                <Header as={'h4'} dividing style={styles.h4}>{category}</Header>
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
        <Breadcrumb size='big'>
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
                <Item key={method.slug}>
                    <Item.Image src={method.image} size='medium'/>
                    <Item.Content>
                        <Item.Header as='h4'>{method.name} <Icon name='checkmark' color='green'/></Item.Header>
                        <Item.Description>{method.description}</Item.Description>
                        <Item.Extra><a href={method.href} target={'_blank'}>Read more</a></Item.Extra>
                        <Item.Extra>
                            <Label>Cost: {method.highCost ? <Icon name='arrow up' fitted/> : <Icon name='arrow down' fitted/>}</Label>
                            <Label>Area: {method.highLandNeed ? <Icon name='arrow up' fitted/> : <Icon name='arrow up' fitted/>}</Label>
                        </Item.Extra>
                    </Item.Content>
                </Item>

            );
        }));
    }

    render() {
        return (
            <AppContainer navbarItems={navigation}>
                <Grid padded>
                    <Grid.Column style={{paddingTop: 0, paddingBottom: 0}}>
                        {this.renderBreadcrumbs()}
                    </Grid.Column>
                </Grid>
                <ToolGrid rows={1}>
                    <div>
                        <Form>
                            {this.conditions()}
                        </Form>
                    </div>
                    <div>
                        <Item.Group divided>
                            {this.methods()}
                        </Item.Group>

                        {/*<Table celled padded>
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
                        </Table>*/}
                    </div>
                </ToolGrid>
            </AppContainer>
        );
    }
}

export default T06;