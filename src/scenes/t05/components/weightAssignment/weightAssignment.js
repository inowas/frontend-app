import React from 'react';
import PropTypes from 'prop-types';
import {MCDA} from 'core/model/mcda';
import {pure} from 'recompose';
import {Button, Dropdown, Grid, Icon, Menu, Message, Table} from 'semantic-ui-react';
import {WeightAssignment} from 'core/model/mcda/criteria';
import Ranking from './ranking';
import MultiInfluence from './multiInfluence';
import PairwiseComparison from './pairwise';
import SimpleWeightAssignment from './spl';
import AbstractCollection from 'core/model/collection/AbstractCollection';

class WeightAssignmentEditor extends React.Component {
    handleClickDelete = (id) => {
        const wac = this.props.mcda.weightAssignmentsCollection;
        this.props.handleChange({
            name: 'weights',
            value: wac.remove(id)
        });
    };

    handleClickNew = criteriaCollection => (e, {name}) => {
        if(!(criteriaCollection instanceof AbstractCollection)) {
            throw new Error('CriteriaCollection expected to be instance of AbstractCollection');
        }

        const wa = WeightAssignment.fromMethodAndCriteria(name, criteriaCollection);

        this.props.handleChange({
            name: 'weights',
            value: wa
        });

        return this.props.routeTo(wa.id);
    };

    renderContent() {
        const selectedWeightAssignment = this.props.selectedWeightAssignment || null;

        if (selectedWeightAssignment) {
            switch (selectedWeightAssignment.method) {
                case 'spl':
                    return (
                        <SimpleWeightAssignment
                            weightAssignment={this.props.selectedWeightAssignment}
                            handleChange={this.props.handleChange}
                            readOnly={this.props.readOnly}
                        />
                    );
                case 'mif':
                    return (
                        <MultiInfluence
                            criteriaCollection={this.props.mcda.criteriaCollection}
                            weightAssignment={this.props.selectedWeightAssignment}
                            handleChange={this.props.handleChange}
                            readOnly={this.props.readOnly}
                        />
                    );

                case 'pwc':
                    return (
                        <PairwiseComparison
                            criteriaCollection={this.props.mcda.criteriaCollection}
                            weightAssignment={this.props.selectedWeightAssignment}
                            handleChange={this.props.handleChange}
                            readOnly={this.props.readOnly}
                        />
                    );

                default:
                    return (
                        <Ranking
                            weightAssignment={this.props.selectedWeightAssignment}
                            handleChange={this.props.handleChange}
                            readOnly={this.props.readOnly}
                        />
                    );
            }
        }
    }

    renderMethods(name, criterion = null, key = null) {
        const {mcda} = this.props;
        const subCriteria = !criterion ? mcda.criteriaCollection.findBy('parentId', null, {returnCollection: true}) : mcda.criteriaCollection.findBy('parentId', criterion.id, {returnCollection: true});

        return (
            <Dropdown item text={`${name} (${subCriteria.length})`} key={key}>
                <Dropdown.Menu>
                    <Dropdown.Item name='spl' icon='write' onClick={this.handleClickNew(subCriteria)} text='Simple Weights' />
                    <Dropdown.Item name='rnk' icon='ordered list' onClick={this.handleClickNew(subCriteria)} text='Ranking' />
                    <Dropdown.Item name='mif' icon='fork' onClick={this.handleClickNew(subCriteria)} text='Multi-Influence' />
                    <Dropdown.Item name='pwc' icon='sliders horizontal' onClick={this.handleClickNew(subCriteria)} text='Pairwise Comparison' />
                </Dropdown.Menu>
            </Dropdown>
        );
    }

    render() {
        const {mcda} = this.props;
        const mainCriteria = mcda.withAhp ? mcda.criteriaCollection.findBy('parentId', null, {returnCollection: true}) : mcda.criteriaCollection;

        if (this.props.selectedWeightAssignment) {
            return this.renderContent();
        }

        return (
            <Grid>
                <Grid.Row>
                    <Grid.Column width={5}>
                        {!mcda.withAhp &&
                            <Menu icon='labeled' fluid vertical>
                                <Menu.Item
                                    name='spl'
                                    onClick={this.handleClickNew(mainCriteria)}>
                                    <Icon name='write'/>
                                    Simple Weights
                                </Menu.Item>
                                <Menu.Item
                                    name='rnk'
                                    onClick={this.handleClickNew(mainCriteria)}
                                >
                                    <Icon name='ordered list'/>
                                    Ranking
                                </Menu.Item>
                                <Menu.Item
                                    name='mif'
                                    onClick={this.handleClickNew(mainCriteria)}
                                >
                                    <Icon name='fork'/>
                                    Multi-Influence
                                </Menu.Item>
                                <Menu.Item
                                    name='pwc'
                                    onClick={this.handleClickNew(mainCriteria)}
                                >
                                    <Icon name='sliders horizontal'/>
                                    Pairwise Comparison
                                </Menu.Item>
                            </Menu>
                        }
                        {mcda.withAhp &&
                            <Menu fluid vertical>
                                {this.renderMethods('Main Criteria')}
                                {mainCriteria.all.map((c, key) =>
                                    this.renderMethods(`Sub Criteria of ${c.name}`, c, key)
                                )}
                            </Menu>
                        }
                    </Grid.Column>
                    <Grid.Column width={11}>
                        {mcda.weightAssignmentsCollection.length < 1 &&
                        <Message
                            icon='arrow left'
                            header='Adding new weight assignment methods'
                            content='You can do more than one weight assignment and compare your results and choose
                            which you want to use for the mcda in the end. Click on the appropriate icon on the left,
                            to add a new weight assignment.'
                        />
                        }
                        {mcda.weightAssignmentsCollection.length > 0 &&
                        <Table>
                            <Table.Header>
                                <Table.Row>
                                    <Table.HeaderCell>Name</Table.HeaderCell>
                                    <Table.HeaderCell>Method</Table.HeaderCell>
                                    <Table.HeaderCell/>
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
                                {mcda.weightAssignmentsCollection.all.map(wa => (
                                    <Table.Row key={wa.id}>
                                        <Table.Cell width={9}>
                                            <Button basic size='small'
                                                    onClick={() => this.props.routeTo(wa.id)}>{wa.name}</Button>
                                        </Table.Cell>
                                        <Table.Cell width={5}>{wa.method}</Table.Cell>
                                        <Table.Cell width={2} textAlign='right'>
                                            <Button
                                                icon
                                                negative
                                                onClick={() => this.handleClickDelete(wa.id)}
                                                size='small'
                                            >
                                                <Icon name="trash"/>
                                            </Button>
                                        </Table.Cell>
                                    </Table.Row>
                                ))}
                            </Table.Body>
                        </Table>
                        }
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        );
    }

}

WeightAssignmentEditor.propTypes = {
    mcda: PropTypes.instanceOf(MCDA).isRequired,
    selectedWeightAssignment: PropTypes.instanceOf(WeightAssignment),
    handleChange: PropTypes.func.isRequired,
    readOnly: PropTypes.bool,
    routeTo: PropTypes.func
};

export default pure(WeightAssignmentEditor);