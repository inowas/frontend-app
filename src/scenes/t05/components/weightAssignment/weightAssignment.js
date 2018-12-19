import React from 'react';
import PropTypes from 'prop-types';
import {MCDA} from 'core/mcda';
import {Dropdown, Grid, Menu} from 'semantic-ui-react';
import {Weight, WeightAssignment} from 'core/mcda/criteria';
import Ranking from './ranking';

const methods = [
    {key: 0, value: 'ranking', text: 'Ranking'},
    {key: 1, value: 'pairwise', text: 'Pairwise'}
];

class WeightAssignmentEditor extends React.Component {
    constructor(props) {
        super();
    }

    handleClickNew = (e, {name, value}) => {
        const wac = this.props.mcda.weightAssignmentsCollection;
        const wa = new WeightAssignment();
        wa.method = value;

        this.props.mcda.criteriaCollection.all.forEach(criterion => {
            const weight = new Weight();
            weight.criterion = criterion;
            wa.weightsCollection.add(weight);
        });

        this.props.handleChange({
            name: 'weights',
            value: wac.add(wa)
        });

        return this.props.routeTo(wa.id);
    };

    renderContent() {
        const selectedWeightAssignment = this.props.selectedWeightAssignment || null;

        if (selectedWeightAssignment) {
            switch (selectedWeightAssignment.method) {
                default:
                    return (
                        <Ranking
                            weightAssignment={this.props.selectedWeightAssignment}
                            handleChange={this.props.handleChange}
                            readOnly={this.props.readOnly}
                            routeTo={this.props.routeTo}
                        />
                    );
            }
        }
    }

    render() {
        const {mcda} = this.props;

        return (
            <Grid>
                <Grid.Row>
                    <Grid.Column width={4}>
                        <Dropdown
                            button fluid floating labeled
                            className='icon'
                            icon='add'
                            disabled={this.props.readOnly}
                            options={methods}
                            onChange={this.handleClickNew}
                            name='method'
                            text='Add New'
                        />
                        {mcda.weightAssignmentsCollection.length > 0 &&
                        <Menu fluid vertical tabular>
                            {mcda.weightAssignmentsCollection.all.map(wa => (
                                <Menu.Item
                                    name={wa.name}
                                    key={wa.id}
                                    active={this.props.selectedWeightAssignment && wa.id === this.props.selectedWeightAssignment.id}
                                    onClick={() => this.props.routeTo(wa.id)}
                                />
                            ))}
                        </Menu>
                        }
                    </Grid.Column>
                    <Grid.Column width={12}>
                        {this.renderContent()}
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

export default WeightAssignmentEditor;