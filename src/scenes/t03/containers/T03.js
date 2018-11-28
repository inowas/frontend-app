import React from 'react';
import PropTypes from 'prop-types';
import {withRouter} from 'react-router-dom';
import AppContainer from '../../shared/AppContainer';
import {Grid, Icon} from 'semantic-ui-react';
import ToolNavigation from '../../shared/complexTools/toolNavigation';
import menuItems from '../defaults/menuItems';
import * as Content from '../components/content/index';

const navigation = [{
    name: 'Documentation',
    path: 'https://inowas.hydro.tu-dresden.de/tools/t02-groundwater-mounding-hantush/',
    icon: <Icon name="file"/>
}];

class T03 extends React.Component {

    static renderContent(id, property) {
        if (!id) {
            return (<Content.CreateModel/>)
        }

        switch (property) {
            case 'discretization':
                return (<Content.Discretization/>);
            case 'soilmodel':
                return (<Content.Soilmodel/>);
            case 'boundaries':
                return (<Content.Boundaries/>);
            case 'observations':
                return (<Content.Observations/>);
            case 'run':
                return (<Content.Run/>);
            case 'results':
                return (<Content.Results/>);
            case 'optimization':
                return (<Content.Optimization/>);
            default:
                return (<Content.General/>);
        }
    }

    render() {
        const {id, property} = this.props.match.params;

        return (
            <AppContainer navbarItems={navigation}>
                <Grid padded>
                    <Grid.Column width={3}>
                        <ToolNavigation navigationItems={menuItems} style={id && {marginTop: 50}}/>
                    </Grid.Column>
                    <Grid.Column width={13}>
                        {T03.renderContent(id, property)}
                    </Grid.Column>
                </Grid>
            </AppContainer>
        )
    }
}

T03.proptypes = {
    history: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
};

export default withRouter(T03);
