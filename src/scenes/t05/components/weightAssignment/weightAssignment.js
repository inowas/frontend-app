import React from 'react';
import PropTypes from 'prop-types';
import {MCDA} from 'core/mcda';
import {Grid, Menu, Message, Segment} from 'semantic-ui-react';

class WeightAssignment extends React.Component {
    constructor(props) {
        super();

        this.state = {
            criteriaCollection: props.mcda.criteria
        };
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            criteriaCollection: nextProps.mcda.criteria
        });
    }

    renderContent() {

    }

    render() {
        const {mcda} = this.props;

        return (
            <Segment color={'grey'} loading={this.state.isLoading}>
                <Grid>
                    <Grid.Row>
                        <Grid.Column width={4}>
                            {mcda.weightAssignments.length > 0 ?
                                <Menu fluid vertical tabular>
                                    {mcda.weightAssignments.map(wa => (
                                        <Menu.Item
                                            name={wa.name}
                                            key={wa.id}
                                            active={wa.id === this.props.selected}
                                            onClick={() => this.props.routeTo(wa.id)}
                                        />
                                    ))}
                                </Menu>
                                :
                                <Message>
                                    No weight assignments so far!
                                </Message>
                            }
                        </Grid.Column>
                        <Grid.Column width={12}>
                            {this.renderContent()}
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Segment>
        );
    }

}

WeightAssignment.propTypes = {
    mcda: PropTypes.instanceOf(MCDA).isRequired,
    handleChange: PropTypes.func.isRequired,
    readOnly: PropTypes.bool,
    routeTo: PropTypes.func
};

export default WeightAssignment;