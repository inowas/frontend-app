import React from 'react';
import PropTypes from 'prop-types';
import {Form, Grid, Tab, Popup, Menu} from 'semantic-ui-react';
import {ModflowModel} from '../../../../../core/model/modflow';
import {SoilmodelLayer} from '../../../../../core/model/modflow/soilmodel';

import {layerParameters} from '../../../defaults/soilmodel';
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
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Tab.Pane>
        }];

        layerParameters.forEach((p, idx) => {
            if (p.name === 'top' && layer.number > 1) {
                return;
            }
            panes.push({
                menuItem: (
                    <Menu.Item key={idx}>
                        <Popup
                            trigger={<span>{p.name}</span>}
                            content={p.description}
                            size='tiny'
                        />

                    </Menu.Item>
                )
                /*{content: p.name, 'data-tooltip': p.description, className: 'parameter'}*/,
                render: () =>
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
                <Tab menu={{secondary: true, pointing: true}} activeIndex={this.props.activeIndex || 0}
                     onTabChange={this.props.onChangeTab} panes={panes}/>
            </Form>
        )
    }
}

LayerDetails.propTypes = {
    activeIndex: PropTypes.number,
    layer: PropTypes.instanceOf(SoilmodelLayer).isRequired,
    model: PropTypes.instanceOf(ModflowModel).isRequired,
    onChange: PropTypes.func.isRequired,
    onChangeTab: PropTypes.func.isRequired,
    readOnly: PropTypes.bool
};

export default LayerDetails;
