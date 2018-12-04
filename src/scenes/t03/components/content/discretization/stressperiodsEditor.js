import React from 'react';
import PropTypes from 'prop-types';
import Stressperiods from 'core/model/modflow/Stressperiods';
import {Header} from 'semantic-ui-react';

class StressperiodsEditor extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            stressperiods: props.stressperiods.toObject()
        }
    }

    render() {
        return(
            <Header as={'h2'}>StressperiodsEditor</Header>
        )
    }
}

StressperiodsEditor.proptypes = {
    stressperiods: PropTypes.instanceOf(Stressperiods).isRequired,
    onChange: PropTypes.func.isRequired
};

export default StressperiodsEditor;
