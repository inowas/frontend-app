import React from 'react';
import {BoundaryCollection, ModflowModel} from 'core/model/modflow';
import {updateTransport} from '../../../actions/actions';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import {Substance, Transport} from 'core/model/modflow/transport';
import PropTypes from 'prop-types';
import {Grid, Segment} from 'semantic-ui-react';
import SubstanceList from './SubstanceList';
import ContentToolBar from '../../../../shared/ContentToolbar';
import SubstanceDetails from './SubstanceDetails';

class TransportUi extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isDirty: false,
            isError: false,
            isLoading: false,
            selectedSubstanceId: null
        }
    }

    handleAddSubstance = () => {
        const substance = Substance.create('new substance');
        const transport = this.props.transport;
        transport.addSubstance(substance);
        this.props.updateTransport(transport);
        return this.setState({selectedSubstanceId: substance.id});
    };


    handleSubstanceListClick = selectedSubstanceId => {
        return this.setState({selectedSubstanceId: selectedSubstanceId})
    };

    handleRemoveSubstance = substanceId => {
        const transport = this.props.transport;
        transport.removeSubstanceById(substanceId);
        this.props.updateTransport(transport);

        if (transport.length === 0) {
            return this.setState({selectedSubstanceId: null});
        }

        return this.setState({selectedSubstanceId: transport.first.id});
    };

    handleChangeSubstance = substance => {
        const transport = this.props.transport;
        transport.update(substance, false);
        this.props.updateTransport(transport);
        return this.setState({selectedSubstanceId: substance.id, isDirty: true});
    };

    render() {
        const {boundaries, model} = this.props;
        const {readOnly} = model;

        const {selectedSubstanceId, isDirty, isError} = this.state;
        const selectedSubstance = this.props.transport.findById(selectedSubstanceId);

        return (
            <Segment color={'grey'}>
                <Grid>
                    <Grid.Row>
                        <Grid.Column width={4}>
                            <SubstanceList
                                addSubstance={this.handleAddSubstance}
                                onClick={this.handleSubstanceListClick}
                                onRemove={this.handleRemoveSubstance}
                                selected={this.state.selectedSubstanceId}
                                transport={this.props.transport}
                            />
                        </Grid.Column>
                        <Grid.Column width={12}>
                            {selectedSubstance &&
                            <div>
                                <ContentToolBar isDirty={isDirty} isError={isError} save onSave={this.onSave}/>
                                <SubstanceDetails
                                    substance={selectedSubstance}
                                    boundaries={boundaries}
                                    onChange={this.handleChangeSubstance}
                                    readOnly={readOnly}
                                />
                            </div>
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
        boundaries: BoundaryCollection.fromObject(state.T03.boundaries),
        model: ModflowModel.fromObject(state.T03.model),
        transport: Transport.fromObject(state.T03.transport),
    };
};

const mapDispatchToProps = {
    updateTransport
};

Transport.proptypes = {
    boundaries: PropTypes.instanceOf(BoundaryCollection).isRequired,
    history: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    model: PropTypes.instanceOf(ModflowModel).isRequired,
    transport: PropTypes.instanceOf(Transport).isRequired,
    updateTransport: PropTypes.func.isRequired
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(TransportUi));
