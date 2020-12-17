import {Form} from 'semantic-ui-react';
import PropTypes from 'prop-types';
import React from 'react';

class InputRange extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            from: props.from,
            to: props.to,
            errorFrom: false,
            errorTo: false
        };
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    UNSAFE_componentWillReceiveProps(nextProps, nextContext) {
        this.setState({
            from: nextProps.from,
            to: nextProps.to
        });
    }

    handleChange = (e, {name, value}) => {
        let from = this.state.from;
        let to = this.state.to;
        let errorFrom = false;
        let errorTo = false;

        if (name === 'from') {
            errorFrom = value > this.state.to;
            from = parseFloat(value);
        } else if (name === 'to') {
            errorTo = value < this.state.from;
            to = parseFloat(value);
        }

        return this.setState({
            from: from,
            to: to,
            errorFrom: errorFrom,
            errorTo: errorTo
        });
    };

    handleSubmit = () => this.props.onChange({
        name: this.props.name,
        from: parseFloat(this.state.from),
        to: parseFloat(this.state.to)
    });

    render() {
        const styles = {
            inputFix: {
                padding: '0'
            }
        };

        return (
            <Form.Group widths="equal">
                <Form.Field>
                    {this.props.label || this.props.label_from ?
                        <label>
                            {this.props.label ? this.props.label : ''} {this.props.label_from ? this.props.label_from : ''}
                        </label>
                        :
                        ''
                    }
                    <Form.Input
                        disabled={this.props.disabled}
                        type="number"
                        name="from"
                        value={this.state.from.toFixed(this.props.decimals ? this.props.decimals : 0)}
                        placeholder="from ="
                        style={styles.inputFix}
                        onChange={this.handleChange}
                        onBlur={this.handleSubmit}
                        error={this.state.errorFrom}
                    />
                </Form.Field>
                <Form.Field>
                    {this.props.label_to ? <label>{this.props.label_to}</label> : ''}
                    <Form.Input
                        disabled={this.props.disabled}
                        type="number"
                        name="to"
                        value={this.state.to.toFixed(this.props.decimals ? this.props.decimals : 0)}
                        placeholder="to ="
                        style={styles.inputFix}
                        onChange={this.handleChange}
                        onBlur={this.handleSubmit}
                        error={this.state.errorTo}
                    />
                </Form.Field>
            </Form.Group>
        );
    }
}

InputRange.propTypes = {
    name: PropTypes.string.isRequired,
    from: PropTypes.number.isRequired,
    to: PropTypes.number.isRequired,
    min: PropTypes.number,
    max: PropTypes.number,
    decimals: PropTypes.number,
    label: PropTypes.string,
    label_from: PropTypes.string,
    label_to: PropTypes.string,
    disabled: PropTypes.bool,
    onChange: PropTypes.func.isRequired
};

export default InputRange;
