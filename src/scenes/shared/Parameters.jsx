import React from 'react';
import {pure} from 'recompose';
import PropTypes from 'prop-types';
import ParameterSlider from 'scenes/shared/simpleTools/parameterSlider';
import {Button, Grid} from 'semantic-ui-react';
import SliderParameter from "./simpleTools/parameterSlider/SliderParameter";

class Parameters extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            parameters: props.parameters.map(p => p.toArray)
        };
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            parameters: nextProps.parameters.map(p => p.toArray)
        });
    }

    handleChange = (parameter) => this.props.handleChange(
        this.props.parameters.map(p => {
            if (p.id === parameter.id) {
                return SliderParameter.fromObject(parameter);
            }
            return SliderParameter.fromObject(p);
        })
    );

    render() {
        const sortedParameters = this.state.parameters.sort((a, b) => {
            if (a.order > b.order) {
                return 1;
            }
            return -1;
        });

        const params = sortedParameters.map(parameter => (
            <ParameterSlider
                key={parameter.id}
                handleChange={this.handleChange}
                param={SliderParameter.fromObject(parameter)}
            />
        ));

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
