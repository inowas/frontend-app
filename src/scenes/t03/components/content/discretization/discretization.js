import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {Grid, Menu, Segment} from 'semantic-ui-react';
import StressperiodsEditor from './stressperiodsEditor';
import {ModflowModel, Soilmodel} from 'core/model/modflow';
import GridEditor from './gridEditor';
import {updateModel, updateSoilmodel} from '../../../actions/actions';

const menuItems = [
    {id: 'stressperiods', name: 'Time discretization'},
    {id: 'grid', name: 'Spatial discretization'},
];

class Discretization extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            model: null,
            soilmodel: null,
            selected: menuItems[0].id,
            isLoading: false,
            isDirty: false,
            error: false
        }
    }

    handleMenuClick = (selected) => {
        this.setState({selected});
    };

    onSave = (element) => {
        if (element instanceof Soilmodel) {
            this.props.onChangeSoilmodel(element);
        }

        if (element instanceof ModflowModel) {
            this.props.onChangeModel(element);
        }
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
                        <Grid.Column width={3}>
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
                        <Grid.Column width={13}>
                            {this.state.selected === 'grid' &&
                            <GridEditor stressperiods={model.stressperiods} onChange={() => (1 + 1)}/>
                            }
                            {this.state.selected === 'stressperiods' && <StressperiodsEditor/>}
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
        soilmodel: Soilmodel.fromObject(state.T03.soilmodel)
    };
};

const mapDispatchToProps = {
    onChangeModel: updateModel,
    onChangeSoilmodel: updateSoilmodel
};

Discretization.proptypes = {
    model: PropTypes.instanceOf(ModflowModel).isRequired,
    soilmodel: PropTypes.instanceOf(Soilmodel).isRequired,
    onChangeModel: PropTypes.func.isRequired,
    onChangeSoilmodel: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(Discretization);
