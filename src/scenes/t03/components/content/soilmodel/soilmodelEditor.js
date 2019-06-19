import React from 'react';
import PropTypes from 'prop-types';
import Uuid from 'uuid';
import {connect} from 'react-redux';
import {Redirect, withRouter} from 'react-router-dom';
import {fetchUrl} from '../../../../../services/api';
import {Grid, Segment} from 'semantic-ui-react';

import {ModflowModel} from '../../../../../core/model/modflow';
import {DefaultZone, Soilmodel, SoilmodelLayer} from '../../../../../core/model/modflow/soilmodel';

import LayerDetails from './layerDetails';
import LayersList from './layersList';
import {addLayer, cloneLayer, removeLayer, updateSoilmodel, updateLayer} from '../../../actions/actions';
import Command from '../../../commands/modflowModelCommand';
import ContentToolBar from '../../../../shared/ContentToolbar';
import {sendCommand} from '../../../../../services/api';
import LayersImport from './layersImport';

const baseUrl = '/tools/T03';

class SoilmodelEditor extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            activeTab: 0,
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

        if (!pid) {return}

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

    handleTabChange = (e, {activeIndex}) => this.setState({activeTab: activeIndex});

    handleAddLayer = () => {
        const {id, property, type} = this.props.match.params;
        const lc = this.props.soilmodel.layersCollection;

        const layer = new SoilmodelLayer();
        layer.number = lc.length > 0 ? lc.orderBy('number', 'desc').first.number + 1 : 1;

        const base = DefaultZone.fromDefault();
        layer.zonesCollection.add(base);

        this.setState({isLoading: true});

        return sendCommand(
            Command.addLayer(this.props.model.id, layer), () => {
                this.props.addLayer(layer);
                this.setState({
                    isLoading: false
                }, this.props.history.push(`${baseUrl}/${id}/${property}/${type || '!'}/${layer.id}`))
            }
        );
    };

    handleCloneLayer = (layer) => {
        const {id, property, type} = this.props.match.params;
        this.setState({isLoading: true});

        fetchUrl(`modflowmodels/${id}/soilmodel/${layer.id}`,
            layer => {
                const newLayer = SoilmodelLayer.fromObject(layer);
                newLayer.id = Uuid.v4();
                newLayer.name = layer.name + ' (clone)';

                return sendCommand(
                    Command.addLayer(this.props.model.id, newLayer), () => {
                        this.props.addLayer(newLayer);
                        this.setState({
                            isLoading: false
                        }, this.props.history.push(`${baseUrl}/${id}/${property}/${type || '!'}/${newLayer.id}`))
                    }
                );
            }
        );
    };

    handleRemoveLayer = (layerId) => {
        const {id, property} = this.props.match.params;

        this.setState({isLoading: true});
        return sendCommand(
            Command.removeLayer({
                id,
                layer_id: layerId
            }), () => {
                this.props.removeLayer(layerId);
                this.setState({isLoading: false},
                    () => this.props.history.push(`${baseUrl}/${id}/${property}`))
            }
        );
    };

    onSave = () => {
        const layer = SoilmodelLayer.fromObject(this.state.selectedLayer);
        this.setState({isLoading: true});
        return sendCommand(
            Command.updateLayer({
                id: this.props.model.id,
                layer_id: layer.id,
                layer: layer.toObject()
            }), () => {
                this.props.updateLayer(layer);
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

        if (pid && !this.props.soilmodel.layersCollection.findBy('id', pid, {first: true})) {
            return <Redirect to={`${baseUrl}/${id}/${property}`}/>;
        }

        const {readOnly} = this.props.model;

        return (
            <Segment color={'grey'} loading={isLoading}>
                <Grid>
                    <Grid.Row>
                        <Grid.Column width={4}>
                            <LayersList
                                addLayer={this.handleAddLayer}
                                onClick={this.handleLayerListClick}
                                onClone={this.handleCloneLayer}
                                onRemove={this.handleRemoveLayer}
                                soilmodel={this.props.soilmodel}
                                selected={lid}
                            />
                        </Grid.Column>
                        <Grid.Column width={12}>
                            {!isLoading && selectedLayer &&
                            <div>
                                <ContentToolBar
                                    isDirty={isDirty}
                                    isError={isError}
                                    visible={!readOnly}
                                    save
                                    onSave={this.onSave}
                                    importButton={this.props.readOnly ||
                                        <LayersImport
                                            onChange={this.handleChange}
                                        />
                                    }
                                />
                                <LayerDetails
                                    activeIndex={this.state.activeTab}
                                    layer={SoilmodelLayer.fromObject(selectedLayer)}
                                    model={model}
                                    onChange={this.onChangeLayer}
                                    onChangeTab={this.handleTabChange}
                                    readOnly={model.readOnly}
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
        readOnly: ModflowModel.fromObject(state.T03.model).readOnly,
        model: ModflowModel.fromObject(state.T03.model),
        soilmodel: state.T03.soilmodel ? Soilmodel.fromObject(state.T03.soilmodel) : null
    };
};

const mapDispatchToProps = {
    addLayer, cloneLayer, removeLayer, updateSoilmodel, updateLayer
};


SoilmodelEditor.propTypes = {
    history: PropTypes.object.isRequired,
    readOnly: PropTypes.bool.isRequired,
    location: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    model: PropTypes.instanceOf(ModflowModel).isRequired,
    soilmodel: PropTypes.instanceOf(Soilmodel).isRequired,
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(SoilmodelEditor));