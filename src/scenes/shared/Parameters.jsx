import React from 'react';
import {pure} from 'recompose';
import PropTypes from 'prop-types';
import {inputType} from 'scenes/shared/simpleTools/parameterSlider/inputType';
import ParameterSlider from 'scenes/shared/simpleTools/parameterSlider';
import {Button, Grid, Input} from 'semantic-ui-react';

class Parameters extends React.Component {

    renderParam = param => {
        switch (param.inputType) {
            case inputType.NUMBER:
                return this.renderNumber(param);
            case inputType.RADIO_SELECT:
                return this.renderRadioSelect(param);
            case inputType.SLIDER:
                return (<ParameterSlider key={param.id} handleChange={this.props.handleChange} param={param}/>);
            default:
                return (<ParameterSlider key={param.id} handleChange={this.props.handleChange} param={param}/>);
        }
    };

    renderNumber = param => {
        return (
            <Grid.Row key={param.id}>
                <Grid.Column>{param.label}</Grid.Column>
                <Grid.Column>
                    <Input name={'parameter_' + param.id + '_value'} type="number" min={param.min} max={param.max}
                           step={param.stepSize} value={Number(param.value).toFixed(param.decimals)}
                           onChange={this.props.handleChange}/>
                </Grid.Column>
            </Grid.Row>
        );
    };


    renderRadioOption = (param, option) => {
        return (
            <Input name={'parameter_' + param.id + '_value'} value={option.value} type="radio"
                   checked={param.value === option.value} onChange={this.props.handleChange} label={option.label}/>
        );
    };

    renderRadioSelect = (param) => {
        const options = param
            .options
            .map(option => {
                return this.renderRadioOption(param, option);
            });

        return (
            <Grid.Row key={param.id}>
                <Grid.Column>{param.label}</Grid.Column>
                <Grid.Column>{options}</Grid.Column>
            </Grid.Row>
        );
    };

    render() {
        const sortedParameters = this.props.parameters.sort((a, b) => {
            if (a.order > b.order) {
                return 1;
            }
            return -1;
        });

        const params = sortedParameters.map(param => {
            return this.renderParam(param, this.props.handleChange);
        });

        return (
            <Grid verticalAlign='middle'>
                <Grid.Row>
                    <Grid.Column textAlign='right'>
                        <Button onClick={this.props.handleReset}>Default</Button>
                    </Grid.Column>
                </Grid.Row>
                {params}
            </Grid>

        );
    };
}

Parameters.propTypes = {
    handleChange: PropTypes.func.isRequired,
    handleReset: PropTypes.func.isRequired,
    parameters: PropTypes.array.isRequired
};

export default pure(Parameters);
