import React from 'react';
import {pure} from 'recompose';
import PropTypes from 'prop-types';
import ParameterSlider from 'scenes/shared/simpleTools/parameterSlider';
import {Button, Grid} from 'semantic-ui-react';
import SliderParameter from './simpleTools/parameterSlider/SliderParameter';

const styles = {
    row: {
        paddingBottom: '0',
    },
    column: {
        height: '55px',
        paddingRight: '1.8rem',
        verticalAlign: 'top'
    },
    defaultButton: {
        width: '100px'
    }
};

class Parameters extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            parameters: props.parameters.map(p => p.toObject)
        };
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            parameters: nextProps.parameters.map(p => p.toObject)
        });
    }

    handleChange = (parameter) => this.props.handleChange(
        this.props.parameters.map(p => {
            if (p.id === parameter.id) {
                return parameter;
            }
            return p;
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
                <Grid.Row style={styles.row}>
                    <Grid.Column textAlign='right' style={styles.column}>
                        <Button onClick={this.props.handleReset} style={styles.defaultButton}>Default</Button>
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
