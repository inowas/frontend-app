import React from 'react';
import PropTypes from 'prop-types';
import {Grid, Segment} from "semantic-ui-react";

const styles = {
    segment: {
        height: '100%',
    }
};

class ToolGrid extends React.Component {

    renderRow = (numberOfRow) => (
        <Grid.Row key={numberOfRow}>
            <Grid.Column width={6}>
                {this.props.children[numberOfRow * 2] &&
                <Segment style={styles.segment} color={'grey'}>
                    {this.props.children[numberOfRow * 2]}
                </Segment>
                }
            </Grid.Column>
            <Grid.Column width={10}>
                {this.props.children[numberOfRow * 2 + 1] &&
                <Segment style={styles.segment} color={'blue'}>
                    {this.props.children[numberOfRow * 2 + 1]}
                </Segment>
                }
            </Grid.Column>
        </Grid.Row>
    );

    renderRows = () => {
        const rows = [];
        for (let i = 0; i < this.props.rows; i++) {
            rows.push(this.renderRow(i));
        }

        return rows;
    };

    render() {
        return (
            <Grid padded>
                {this.renderRows()}
            </Grid>
        );
    }
}

ToolGrid.propTypes = {
    rows: PropTypes.number.isRequired
};

export default ToolGrid;
