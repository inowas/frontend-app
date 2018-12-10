import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {Redirect, withRouter} from 'react-router-dom';
import {fetchUrl} from 'services/api';
import {Grid, Segment} from 'semantic-ui-react';

import {ModflowModel} from 'core/model/modflow';
import {Soilmodel, SoilmodelLayer} from 'core/model/modflow/soilmodel';

import LayersList from './layersList';
import {addSoilmodelLayer, updateSoilmodel} from '../../../actions/actions';
import Command from '../../../commands/command';
import ContentToolBar from '../../../../shared/ContentToolbar';
import {sendCommand} from '../../../../../services/api';

const baseUrl = '/tools/T03';

class SoilmodelEditor extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            selectedLayer: null,
            isLoading: false,
            isDirty: false,
            error: false,
            state: null
        }
    }

    componentDidMount() {
        const {id, pid} = this.props.match.params;

        if (pid) {
            this.fetchLayer(id, pid);
        }
    }

    componentWillReceiveProps(nextProps, nextContext) {
        const {id, pid} = nextProps.match.params;
        if ((this.props.match.params.id !== id) || (this.props.match.params.pid !== pid)) {
            this.fetchLayer(id, pid);
        }
    }

    fetchLayer = (modelId, layerId) => {
        return (
            fetchUrl(`modflowmodels/${modelId}/soilmodel/${layerId}`,
                (layer) => this.setState({selectedLayer: layer})
            )
        )
    };

    onChangeLayer = layer => this.setState({selectedLayer: layer.toObject()});

    handleAddLayer = () => {

        const layer = new SoilmodelLayer();

        this.setState({
            isLoading: true
        });

        return sendCommand(
            Command.addSoilmodelLayer({
                id: this.props.model.id,
                layer: layer.toObject()
            }), () => {
                this.props.addSoilmodelLayer(layer);
                this.setState({
                    isLoading: false
                });
            }
        );
    };

    handleLayerListClick = (lid) => {
        const {id, property, type} = this.props.match.params;
        this.props.history.push(`${baseUrl}/${id}/${property}/${type || '!'}/${lid}`);
    };

    onSave = () => {
        this.setState({state: 'notSaved'})
    };

    render() {
        const model = this.props.model;
        const lid = '';
        const {id, pid, property, type} = this.props.match.params;

        // If no boundary is selected, redirect to the first.
        if (!pid && this.props.soilmodel.layers.length > 0) {
            const lid = this.props.soilmodel.layers.first.id;
            return <Redirect to={`${baseUrl}/${id}/${property}/${type || '!'}/${lid}`}/>
        }

        return (
            <Segment color={'grey'} loading={this.state.isLoading}>
                <Grid>
                    <Grid.Row>
                        <Grid.Column width={4}>
                            <LayersList addLayer={this.handleAddLayer} onChange={this.handleLayerListClick} layers={this.props.soilmodel.layers} selected={lid}/>
                        </Grid.Column>
                        <Grid.Column width={12}>
                            <ContentToolBar state={this.state.state} save onSave={this.onSave}/>
                            {!this.state.isLoading &&
                            <div/>
                            }
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Segment>
        )
    }
}

const mapStateToProps = state => {
    console.log('MAP STATE TO PROPS', state);
    return {
        model: ModflowModel.fromObject(state.T03.model),
        soilmodel: Soilmodel.fromObject(state.T03.soilmodel)
    };
};

const mapDispatchToProps = {
    addSoilmodelLayer, updateSoilmodel
};


SoilmodelEditor.proptypes = {
    history: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    model: PropTypes.instanceOf(ModflowModel).isRequired,
    soilmodel: PropTypes.instanceOf(Soilmodel).isRequired,
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(SoilmodelEditor));