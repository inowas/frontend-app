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

    renderContent() {
        const {id, property} = this.props.match.params;
        if (!id) {
            return (
                <Content.CreateModel history={this.props.history}/>
            )
        }

        switch (property) {
            case 'discretization':
                return (<Content.Discretization params={this.props.match.params}/>);
            case 'soilmodel':
                return (<Content.Soilmodel params={this.props.match.params}/>);
            case 'boundaries':
                return (<Content.Boundaries params={this.props.match.params}/>);
            case 'observations':
                return (<Content.Observations params={this.props.match.params}/>);
            case 'run':
                return (<Content.Run params={this.props.match.params}/>);
            case 'results':
                return (<Content.Results params={this.props.match.params}/>);
            case 'optimization':
                return (<Content.OptimizationContainer/>);
            default:
                return (<Content.General/>);
        }
    }

    render() {
        return (
            <AppContainer navbarItems={navigation}>
                <Grid padded>
                    <Grid.Column width={3}>
                        <ToolNavigation navigationItems={menuItems}/>
                    </Grid.Column>
                    <Grid.Column width={13}>
                        {this.renderContent()}
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
