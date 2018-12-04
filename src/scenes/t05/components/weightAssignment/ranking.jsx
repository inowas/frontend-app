import React from "react";
import PropTypes from "prop-types";
import {Grid, Header, Message, Segment} from "semantic-ui-react";
import DragAndDropList from "../shared/DragAndDropList";
import MCDA from "../../../../core/mcda/MCDA";
import Criteria from "../../../../core/mcda/criteria/Criteria";

const WAMETHOD = 'ranking';

class Ranking extends React.Component {
    constructor(props) {
        super();

        this.state = {
            criteria: props.mcda.updateWeightAssignment(WAMETHOD).criteria.map(c => c.toObject)
        };
    }

    componentWillReceiveProps(nextProps) {
        console.log('NEXT PROPS');
        this.setState({
            criteria: nextProps.mcda.updateWeightAssignment(WAMETHOD).criteria.map(c => c.toObject)
        });
    }

    onDragEnd = (items) => {
        const criteria = this.state.criteria.map(c => {
            const criteriaInstance = Criteria.fromObject(c);
            const weight = criteriaInstance.getWeightByMethod(WAMETHOD);
            const updated = items.filter(item => item.id === c.id)[0];

            if (!updated || !weight) {
                return null;
            }

            weight.rank = updated.rank;

            return criteriaInstance.updateWeight(weight).toObject;
        });

        return this.setState({
            criteria: criteria
        });
    };

    render() {
        const {readOnly} = this.props;

        const items = this.state.criteria.map(criteria => {
            return {
                id: criteria.id,
                data: criteria.name,
                rank: Criteria.fromObject(criteria).getWeightByMethod(WAMETHOD).rank
            };
        });

        console.log('ORDERED ITEMS', items);

        return (
            <Segment>
                <Header as='h3'>Weight Assignment</Header>

                <Message>
                    <Message.Header>Method 1: Ranking</Message.Header>
                    <p>You can perform more of the weight assignment methods and compare the results in the end.</p>
                    <p>Ranking: place the criteria in your preferred order by drag and drop or using the arrow buttons
                        on the right.</p>
                </Message>

                {this.state.criteria.length > 0 &&
                <Grid columns={2}>
                    <Grid.Column>
                    <Segment textAlign='center' inverted color='grey' secondary>
                        Most Important
                    </Segment>
                    <DragAndDropList
                        items={items}
                        onDragEnd={this.onDragEnd}
                    />
                    <Segment textAlign='center' inverted color='grey' secondary>
                        Least Important
                    </Segment>
                    </Grid.Column>
                    <Grid.Column>
                        <Segment textAlign='center' inverted color='grey' secondary>
                            Weight Assignment
                        </Segment>
                    </Grid.Column>
                </Grid>
                }
            </Segment>
        );
    }

}

Ranking.propTypes = {
    mcda: PropTypes.instanceOf(MCDA).isRequired,
    handleChange: PropTypes.func,
    readOnly: PropTypes.bool,
    routeTo: PropTypes.func
};

export default Ranking;