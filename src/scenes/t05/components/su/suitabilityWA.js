import React from 'react';
import PropTypes from 'prop-types';
import {MCDA} from '../../../../core/model/mcda';
import {Button, Message} from 'semantic-ui-react';
import WeightAssignmentTable from './weightAssignmentTable';
import {WeightAssignmentsCollection} from 'core/model/mcda/criteria';

class SuitabilityWeightAssignment extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            showInfo: true
        }
    }

    handleDismiss = () => this.setState({showInfo: false});

    handleChangeWA = (parentId = null) => (e, {name}) => {
        const {mcda} = this.props;

        const wac = mcda.weightAssignmentsCollection.toArray().map(wa => {
            if (!mcda.withAhp) {
                wa.isActive = wa.id === name;
                return wa;
            }
            if (wa.id === name || (wa.isActive && parentId && wa.parent !== parentId)) {
                wa.isActive = true;
            }
            if (wa.isActive && parentId && (wa.parent === parentId || (!wa.parent && parentId === 'main')) && wa.id !== name) {
                wa.isActive = false;
            }
            return wa;
        });

        return this.props.handleChange({
            name: 'weights',
            value: WeightAssignmentsCollection.fromArray(wac)
        });
    };

    handleClickCalculation = () => {
        const mcda = this.props.mcda.calculate();
        return this.props.handleChange({
            name: 'mcda',
            value: mcda
        });
    };

    render() {
        const {mcda} = this.props;
        const {showInfo} = this.state;

        return (
            <div>
                {showInfo &&
                <Message onDismiss={this.handleDismiss}>
                    <Message.Header>Suitability</Message.Header>
                    <p>...</p>
                </Message>
                }

                <WeightAssignmentTable
                    handleChange={this.handleChangeWA}
                    mcda={this.props.mcda}
                />
                <Button
                    disabled={mcda.weightAssignmentsCollection.findBy('isActive', true).length < 1}
                    onClick={this.handleClickCalculation}
                    primary
                    fluid
                >
                    Start Calculation
                </Button>

            </div>
        );
    }
}

SuitabilityWeightAssignment.proptypes = {
    handleChange: PropTypes.func.isRequired,
    mcda: PropTypes.instanceOf(MCDA).isRequired,
};

export default SuitabilityWeightAssignment;