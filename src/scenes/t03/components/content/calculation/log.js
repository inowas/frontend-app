import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import {Calculation} from 'core/model/modflow';
import {Grid, Header, Segment} from 'semantic-ui-react';
import Terminal from '../../../../shared/complexTools/Terminal';

class Log extends React.Component {

    render() {
        const {calculation} = this.props;

        return (
            <Grid padded>
                <Grid.Row>
                    <Grid.Column>
                        <Header as={'h3'}>Calculation logs</Header>
                        <Segment color={'grey'}>
                            {calculation && <Terminal content={calculation.message}/>}
                        </Segment>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        )
    }
}

const mapStateToProps = state => {
    return {
        calculation: state.T03.calculation ? Calculation.fromObject(state.T03.calculation) : null
    };
};

Log.propTypes = {
    calculation: PropTypes.instanceOf(Calculation),
};

export default connect(mapStateToProps)(Log);
