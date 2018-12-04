import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {Grid, Menu, Segment} from 'semantic-ui-react';
import StressperiodsEditor from './stressperiodsEditor';
import {ModflowModel} from 'core/model/modflow';
import GridEditor from './gridEditor';

const menuItems = [
    {id: 'stressperiods', name: 'Time discretization'},
    {id: 'grid', name: 'Spatial discretization'},
];

class Discretization extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            model: null,
            selected: menuItems[0].id,
            isLoading: false,
            isDirty: false,
            error: false
        }
    }

    handleMenuClick = (selected) => {
        this.setState({selected});
    };

    render() {
        const {model} = this.props;
        if (!(model instanceof ModflowModel)) {
            return null;
        }

        return (
            <Segment color={'grey'} loading={this.state.isLoading}>
                <Grid padded>
                    <Grid.Row>
                        <Grid.Column width={4}>
                            <Menu fluid vertical tabular>
                                {menuItems.map(i => (
                                    <Menu.Item
                                        name={i.name}
                                        key={i.id}
                                        active={i.id === this.state.selected}
                                        onClick={() => this.handleMenuClick(i.id)}
                                    />
                                ))}
                            </Menu>
                        </Grid.Column>
                        <Grid.Column width={12}>
                            {this.state.selected === 'stressperiods' &&
                            <StressperiodsEditor stressperiods={model.stressperiods} onChange={() => (1 + 1)}/>
                            }
                            {this.state.selected === 'grid' &&
                            <GridEditor stressperiods={model.stressperiods} onChange={() => (1 + 1)}/>
                            }
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Segment>

        )
    }
}

const mapStateToProps = state => {
    return {
        model: ModflowModel.fromObject(state.T03.model),
    };
};

Discretization.proptypes = {
    model: PropTypes.instanceOf(ModflowModel).isRequired,
};

export default connect(mapStateToProps)(Discretization);
