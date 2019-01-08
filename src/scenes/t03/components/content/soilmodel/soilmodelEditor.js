import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {Redirect, withRouter} from 'react-router-dom';
import {fetchUrl} from 'services/api';
import {Grid, Segment} from 'semantic-ui-react';

import {ModflowModel} from 'core/model/modflow';
import {Soilmodel, SoilmodelLayer, SoilmodelZone} from 'core/model/modflow/soilmodel';

import LayerDetails from './layerDetails';
import LayersList from './layersList';
import {addSoilmodelLayer, removeSoilmodelLayer, updateSoilmodel, updateSoilmodelLayer} from '../../../actions/actions';
import Command from '../../../commands/modflowModelCommand';
import ContentToolBar from '../../../../shared/ContentToolbar';
import {sendCommand} from 'services/api';

const baseUrl = '/tools/T03';

class SoilmodelEditor extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            selectedLayer: null,
            isLoading: false,
            isDirty: false,
            isError: false
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
        this.setState({isLoading: true});
        return (
            fetchUrl(`modflowmodels/${modelId}/soilmodel/${layerId}`,
                (layer) => this.setState({
                    isLoading: false,
                    selectedLayer: layer
                })
            )
        )
    };

    onChangeLayer = layer => {
        this.setState({
            isDirty: true,
            selectedLayer: layer.toObject()
        });
    };

    handleAddLayer = () => {
        const {id, property, type} = this.props.match.params;
        const lc = this.props.soilmodel.layersCollection;

        const layer = new SoilmodelLayer();
        layer.number = lc.length > 0 ? lc.orderBy('number', 'desc').first.number + 1 : 1;

        const base = SoilmodelZone.fromDefault();
        base.geometry = this.props.model.geometry;
        base.activeCells = this.props.model.activeCells;
        layer.zonesCollection.add(base);

        this.setState({isLoading: true});

        return sendCommand(
            Command.addSoilmodelLayer(this.props.model.id, layer), () => {
                this.props.addSoilmodelLayer(layer);
                this.setState({
                    isLoading: false
                }, this.props.history.push(`${baseUrl}/${id}/${property}/${type || '!'}/${layer.id}`))
            }
        );
    };

    handleRemoveLayer = (layerId) => {
        this.setState({isLoading: true});

        return sendCommand(
            Command.removeSoilmodelLayer({
                id: this.props.model.id,
                layer_id: layerId
            }), () => {
                this.props.removeSoilmodelLayer(layerId);
                this.setState({
                    selectedLayer: null,
                    isLoading: false
                });
            }
        );
    };

    onSave = () => {
        const layer = SoilmodelLayer.fromObject(this.state.selectedLayer);

        this.setState({isLoading: true});

        return sendCommand(
            Command.updateSoilmodelLayer({
                id: this.props.model.id,
                layer_id: layer.id,
                layer: layer.toObject()
            }), () => {
                this.props.updateSoilmodelLayer(layer);
                this.setState({
                    isDirty: false,
                    isLoading: false
                })
            }
        );
    };

    handleLayerListClick = (lid) => {
        const {id, property, type} = this.props.match.params;
        this.props.history.push(`${baseUrl}/${id}/${property}/${type || '!'}/${lid}`);
    };

    render() {
        const {model, soilmodel} = this.props;
        if (!(soilmodel instanceof Soilmodel)) {
            return null;
        }
        const {id, pid, property, type} = this.props.match.params;
        const {isDirty, isError, isLoading, selectedLayer} = this.state;
        let lid = selectedLayer ? selectedLayer.id : '';

        // If no layer is selected, redirect to the first.
        if (!pid && this.props.soilmodel.layersCollection.length > 0) {
            lid = this.props.soilmodel.layersCollection.first.id;
            return <Redirect to={`${baseUrl}/${id}/${property}/${type || '!'}/${lid}`}/>;
        }

        if (pid && !this.props.soilmodel.layersCollection.findBy('id', pid, true)) {
            return <Redirect to={`${baseUrl}/${id}/${property}`}/>;
        }

        return (
            <Segment color={'grey'} loading={isLoading}>
                <Grid>
                    <Grid.Row>
                        <Grid.Column width={4}>
                            <LayersList addLayer={this.handleAddLayer} onChange={this.handleLayerListClick}
                                        soilmodel={this.props.soilmodel} selected={lid}/>
                        </Grid.Column>
                        <Grid.Column width={12}>
                            {!isLoading && selectedLayer &&
                            <div>
                                <ContentToolBar isDirty={isDirty} isError={isError} save onSave={this.onSave}/>
                                <LayerDetails
                                    layer={SoilmodelLayer.fromObject(selectedLayer)}
                                    model={model}
                                    onChange={this.onChangeLayer}
                                    onRemove={this.handleRemoveLayer}
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
        model: ModflowModel.fromObject(state.T03.model),
        soilmodel: state.T03.soilmodel ? Soilmodel.fromObject(state.T03.soilmodel) : null
    };
};

const mapDispatchToProps = {
    addSoilmodelLayer, removeSoilmodelLayer, updateSoilmodel, updateSoilmodelLayer
};


SoilmodelEditor.proptypes = {
    history: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    model: PropTypes.instanceOf(ModflowModel).isRequired,
    soilmodel: PropTypes.instanceOf(Soilmodel).isRequired,
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(SoilmodelEditor));