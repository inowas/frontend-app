import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import {ModflowModel} from 'core/model/modflow';
import {Grid, Header, Segment} from 'semantic-ui-react';
import Terminal from '../../../../shared/complexTools/Terminal';

class Log extends React.Component {

    render() {
        const {model} = this.props;
        const {calculation} = model;

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
        model: ModflowModel.fromObject(state.T03.model)
    };
};

Log.proptypes = {
    model: PropTypes.instanceOf(ModflowModel).isRequired
};

export default connect(mapStateToProps)(Log);
