import React from 'react';
import PropTypes from 'prop-types';
import {withRouter} from 'react-router-dom';
import {Icon, Input, Menu, Segment} from 'semantic-ui-react';
import {MCDA} from 'core/mcda';

class CriteriaNavigation extends React.Component {

    constructor() {
        super();

        this.state = {
            searchTerm: ''
        };
    }

    onSearchCriterion = (e, {name, value}) => this.setState({
        searchTerm: value
    });

    filteredCriteria = () => {
        const {mcda} = this.props;

        if (this.state.searchTerm === '') {
            return mcda.criteriaCollection.all;
        }

        return mcda.criteriaCollection.filterBy('name', this.state.searchTerm);
    };

    render() {
        const items = this.filteredCriteria().map((criterion, key) => (
            <Menu.Item
                active={this.props.activeCriterion && criterion.id === this.props.activeCriterion}
                key={key}
                name={criterion.id}
                onClick={this.props.onClick}
            >
                {criterion.suitability && criterion.suitability.data.length > 0 &&
                <Icon name='check circle' color='green'/>
                }
                {criterion.name}
            </Menu.Item>
        ));

        return (
            <Segment color={'black'} style={this.props.style}>
                <Menu secondary vertical style={{width: '100%'}}>
                    <Menu.Item header>Criteria</Menu.Item>
                    <Menu.Item>
                        <Input
                            icon='search' name='criteriaSearch' value={this.state.searchTerm}
                            onChange={this.onSearchCriterion}
                            placeholder='Search criterion...'
                        />
                    </Menu.Item>
                    {items}
                </Menu>
            </Segment>
        )
    }
}

CriteriaNavigation.proptypes = {
    activeCriterion: PropTypes.string,
    onClick: PropTypes.func.isRequired,
    mcda: PropTypes.instanceOf(MCDA).isRequired
};

export default withRouter(CriteriaNavigation);
