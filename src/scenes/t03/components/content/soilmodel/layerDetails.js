import React from 'react';
import PropTypes from 'prop-types';
import {Button, Form, Grid, Tab} from 'semantic-ui-react';
import {ModflowModel} from 'core/model/modflow';
import {SoilmodelLayer} from 'core/model/modflow/soilmodel';

import layerParameters from '../../../defaults/soilmodel';
import LayerParameter from './layerParameter';

class LayerDetails extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            layer: props.layer.toObject()
        };
    }

    componentWillReceiveProps(nextProps) {
        this.setState(() => ({
            layer: nextProps.layer.toObject()
        }));
    }

    handleChange = () => {
        this.props.onChange(SoilmodelLayer.fromObject(this.state.layer));
    };

    handleLocalChange = (e, {name, value}) => {
        const layer = this.state.layer;
        layer[name] = value;

        this.setState({
            layer: layer
        });
    };

    handleZonesChange = (layer) => this.props.onChange(layer);

    handleSelect = (e, {name, value}) => {
        const layer = this.state.layer;
        layer[name] = value;

        this.props.onChange(SoilmodelLayer.fromObject(layer));
    };

    render() {
        const {model, readOnly} = this.props;
        const {layer} = this.state;
        if (!layer || !layer) {
            return null;
        }

        const panes = [{
            menuItem: 'Properties', render: () =>
                <Tab.Pane>
                    <Grid>
                        <Grid.Row>
                            <Grid.Column width={10}>
                                <Form.Input
                                    disabled={readOnly}
                                    name='name'
                                    value={layer.name}
                                    label={'Layer name'}
                                    onBlur={this.handleChange}
                                    onChange={this.handleLocalChange}
                                />
                                <Form.TextArea
                                    disabled={readOnly}
                                    name='description'
                                    value={layer.description}
                                    label={'Layer description'}
                                    onBlur={this.handleChange}
                                    onChange={this.handleLocalChange}
                                />
                            </Grid.Column>
                            <Grid.Column width={6}>
                                <Form.Select
                                    disabled={readOnly}
                                    label={'Layer type'}
                                    value={layer.laytyp}
                                    name='laytyp'
                                    onChange={this.handleSelect}
                                    options={[
                                        {
                                            value: 0,
                                            text: 'confined',
                                        },
                                        {
                                            value: 1,
                                            text: 'convertible',
                                        },
                                        {
                                            value: -1,
                                            text: 'convertible (unless THICKSTRT)',
                                        }
                                    ]}
                                />
                                <Form.Select
                                    disabled={readOnly}
                                    label={'Layer average calculation'}
                                    value={layer.layavg}
                                    name='layavg'
                                    onChange={this.handleSelect}
                                    options={[
                                        {
                                            value: 0,
                                            text: 'harmonic mean'
                                        },
                                        {
                                            value: 1,
                                            text: 'logarithmic mean'
                                        },
                                        {
                                            value: 2,
                                            text: 'arithmetic mean (saturated thickness) and logarithmic mean (hydraulic conductivity)'
                                        }
                                    ]}
                                />
                                <Form.Select
                                    disabled={readOnly}
                                    label={'Rewetting capability'}
                                    value={layer.laywet}
                                    name='laywet'
                                    onChange={this.handleSelect}
                                    options={[
                                        {
                                            value: 0,
                                            text: 'No'
                                        },
                                        {
                                            value: 1,
                                            text: 'Yes'
                                        },
                                    ]}
                                />
                                <Button negative icon='trash' labelPosition='left' floated={'right'}
                                        onClick={() => this.props.onRemove(layer.id)}
                                        content={'Delete'}
                                >
                                </Button>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Tab.Pane>
        }];

        layerParameters.forEach(p => {
            panes.push({
                menuItem: p.name, render: () =>
                    <Tab.Pane>
                        <LayerParameter
                            model={model}
                            onChange={this.handleZonesChange}
                            parameter={p}
                            readOnly={readOnly}
                            layer={SoilmodelLayer.fromObject(layer)}
                        />
                    </Tab.Pane>
            });
        });

        return (
            <Form>
                <Tab menu={{secondary: true, pointing: true}} panes={panes}/>
            </Form>
        )
    }
}

LayerDetails.proptypes = {
    layer: PropTypes.instanceOf(SoilmodelLayer).isRequired,
    model: PropTypes.instanceOf(ModflowModel).isRequired,
    onChange: PropTypes.func.isRequired,
    onRemove: PropTypes.func.isRequired,
    readOnly: PropTypes.bool
};

export default LayerDetails;
