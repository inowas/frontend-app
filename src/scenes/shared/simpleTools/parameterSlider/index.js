import React from 'react';
import PropTypes from 'prop-types';
import {Grid, Input} from "semantic-ui-react";

import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import SliderParameter from "./SliderParameter";

const styles = {
    extraMini: {
        width: '100px'
    }
};

class ParameterSlider extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            param: props.param.toObject
        };
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            ...this.state,
            param: nextProps.param.toObject
        });
    }

    handleLocalChange = ({target}) => {
        const {value, name} = target;
        const param = SliderParameter.fromObject(this.state.param);
        param[name] = value;
        this.setState({
            param: param.toObject
        });
    };

    handleSlider = value => {
        const param = SliderParameter.fromObject(this.state.param);
        param.value = value;

        return this.setState({
            param: param
        });
    };

    handleChange = () => this.props.handleChange(SliderParameter.fromObject(this.state.param));

    render() {
        const {param} = this.state;

        return (
            <Grid.Row columns={3}>
                <Grid.Column width={4}>
                    <div dangerouslySetInnerHTML={{__html: param.name}}/>
                </Grid.Column>
                <Grid.Column width={8}>
                    <Grid columns={2} padded>
                        <Grid.Column width={5} floated='left'>
                            <Input name='min'
                                   type="number"
                                   size='mini'
                                   style={styles.extraMini}
                                   value={param.min} onBlur={this.handleChange} onChange={this.handleLocalChange}
                            />
                        </Grid.Column>
                        <Grid.Column width={5} floated='right'>
                            <Input name='max'
                                   type="number"
                                   size='mini'
                                   style={styles.extraMini}
                                   value={param.max} onBlur={this.handleChange} onChange={this.handleLocalChange}
                            />
                        </Grid.Column>
                    </Grid>
                    <Grid padded>
                        <Grid.Row>
                            <Slider
                                min={param.min}
                                max={param.max}
                                step={param.stepSize}
                                defaultValue={param.value}
                                value={param.value}
                                onChange={this.handleSlider}
                                onAfterChange={this.handleChange}
                            />
                        </Grid.Row>
                    </Grid>
                </Grid.Column>
                <Grid.Column width={4}>
                    <Input name='value'
                           type="number"
                           size='mini'
                           value={param.value} onChange={this.handleLocalChange}
                           onBlur={this.handleChange}
                    />
                </Grid.Column>
            </Grid.Row>
        );
    }
}

ParameterSlider.propTypes = {
    param: PropTypes.object.isRequired,
    handleChange: PropTypes.func.isRequired
};

export default ParameterSlider;
