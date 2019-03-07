import React from 'react';
import PropTypes from 'prop-types';
import {withRouter} from 'react-router-dom';
import {Form, Icon, Input, Menu, Segment} from 'semantic-ui-react';
import {MCDA} from 'core/model/mcda';
import {GisMap} from 'core/model/mcda/gis';

const styles = {
    noPaddingBottom: {
        paddingBottom: 0,
        paddingTop: 5
    }
};

class CriteriaNavigation extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            searchTerm: '',
            constraints: props.mcda.constraints.toObject()
        };
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            constraints: nextProps.mcda.constraints.toObject()
        });
    }

    onBlur = () => {
        const mcda = this.props.mcda;
        mcda.constraints = GisMap.fromObject(this.state.constraints);
        return this.props.handleChange(mcda);
    };

    onChangeGridSize = (e, {name, value}) => this.setState(prevState => ({
        constraints: {
            ...prevState.constraints,
            gridSize: {
                ...prevState.constraints.gridSize,
                [name]: value
            }
        }
    }));

    onSearchCriterion = (e, {name, value}) => this.setState({
        searchTerm: value
    });

    filteredCriteria = () => {
        const {mcda} = this.props;
        let criteria = mcda.criteriaCollection;

        if (mcda.withAhp) {
            criteria = mcda.criteriaCollection.findBy('parentId', null, {equal: false, returnCollection: true});
        }

        if (this.state.searchTerm === '') {
            return criteria.all;
        }

        return criteria.filterBy('name', this.state.searchTerm);
    };

    render() {
        const items = this.filteredCriteria().map((criterion, key) => (
            <Menu.Item
                active={this.props.activeCriterion && criterion.id === this.props.activeCriterion}
                key={key}
                name={criterion.id}
                onClick={this.props.onClick}
            >
                {criterion.suitability && criterion.suitability.url !== '' &&
                <Icon name='check circle' color='green'/>
                }
                {criterion.name}
            </Menu.Item>
        ));

        const gridSizeEditable = this.props.mcda.criteriaCollection.all.filter(c => c.raster.data.length > 0).length === 0;

        return (
            <Segment color={'black'} style={this.props.style}>
                <Menu secondary vertical style={{width: '100%'}}>
                    <Menu.Item header style={styles.noPaddingBottom}>Grid Size</Menu.Item>
                    <Menu.Item style={styles.noPaddingBottom}>
                        <Form>
                            <Form.Group widths='equal'>
                                <Form.Input
                                    fluid
                                    disabled={!gridSizeEditable}
                                    type='number'
                                    label='Columns'
                                    name='n_x'
                                    value={this.state.constraints.gridSize.n_x}
                                    onBlur={this.onBlur}
                                    onChange={this.onChangeGridSize}
                                />
                                <Form.Input
                                    fluid
                                    disabled={!gridSizeEditable}
                                    type='number'
                                    label='Rows'
                                    name='n_y'
                                    value={this.state.constraints.gridSize.n_y}
                                    onBlur={this.onBlur}
                                    onChange={this.onChangeGridSize}
                                />
                            </Form.Group>
                        </Form>
                    </Menu.Item>
                    <Menu.Item header style={styles.noPaddingBottom}>Criteria</Menu.Item>
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
    mcda: PropTypes.instanceOf(MCDA).isRequired,
    handleChange: PropTypes.func.isRequired
};

export default withRouter(CriteriaNavigation);
