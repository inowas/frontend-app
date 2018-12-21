import React from 'react';
import PropTypes from 'prop-types';
import {MCDA} from 'core/mcda';
import {pure} from 'recompose';
import {Button, Grid, Icon, Menu, Message, Table} from 'semantic-ui-react';
import {WeightAssignment} from 'core/mcda/criteria';
import Ranking from './ranking';
import MultiInfluence from './multiInfluence';
import PairwiseComparison from './pairwise';

class WeightAssignmentEditor extends React.Component {
    handleClickDelete = (id) => {
        const wac = this.props.mcda.weightAssignmentsCollection;
        this.props.handleChange({
            name: 'weights',
            value: wac.remove(id)
        });
    };

    handleClickNew = (e, {name}) => {
        const wa = WeightAssignment.fromMethodAndCriteria(name, this.props.mcda.criteriaCollection);

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

    render() {
        const {mcda} = this.props;

        if (this.props.selectedWeightAssignment) {
            return this.renderContent();
        }

        return (
            <Grid>
                <Grid.Row>
                    <Grid.Column width={3}>
                        <Menu icon='labeled' fluid vertical>
                            <Menu.Item
                                name='spl'
                                onClick={this.handleClickNew}>
                                <Icon name='write'/>
                                Simple Weights
                            </Menu.Item>
                            <Menu.Item
                                name='rnk'
                                onClick={this.handleClickNew}
                            >
                                <Icon name='ordered list'/>
                                Ranking
                            </Menu.Item>
                            <Menu.Item
                                name='mif'
                                onClick={this.handleClickNew}
                            >
                                <Icon name='fork'/>
                                Multi-Influence
                            </Menu.Item>
                            <Menu.Item
                                name='pwc'
                                onClick={this.handleClickNew}
                            >
                                <Icon name='sliders horizontal'/>
                                Pairwise Comparison
                            </Menu.Item>
                            <Menu.Item
                                disabled
                                name='ahp'
                                onClick={this.handleClickNew}
                            >
                                <Icon name='sitemap'/>
                                Analytical Hierarchy
                            </Menu.Item>
                        </Menu>
                    </Grid.Column>
                    <Grid.Column width={13}>
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