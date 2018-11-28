import React from 'react';
import PropTypes from 'prop-types';
import {Segment, Form} from 'semantic-ui-react';
import {OptimizationToolbar} from "shared";
import {OptimizationParameters} from "core/model/modflow/optimization";
import {
    OPTIMIZATION_EDIT_NOCHANGES,
    OPTIMIZATION_EDIT_SAVED,
    OPTIMIZATION_EDIT_UNSAVED
} from "../../../defaults/optimization";

class OptimizationParametersComponent extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            parameters: props.parameters.toObject,
            editState: OPTIMIZATION_EDIT_NOCHANGES
        };
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            parameters: nextProps.parameters.toObject
        });
    }

    handleSubmit = () => {
        this.setState({
            editState: OPTIMIZATION_EDIT_SAVED
        });

        return this.props.onChange({
            key: 'parameters',
            value: OptimizationParameters.fromObject(this.state.parameters)
        });
    };

    handleChange = (e, {name, value}) => this.setState({
        parameters: {...this.state.parameters, [name]: value},
        editState: OPTIMIZATION_EDIT_UNSAVED
    });

    render() {
        const boolOptions = [
            {
                key: 'true',
                value: true,
                text: 'True'
            },
            {
                key: 'false',
                value: false,
                text: 'False'
            }
        ];
        const {parameters} = this.state;

        return (
            <div>
                <OptimizationToolbar
                    save={{
                        onClick: this.handleSubmit
                    }}
                    editState={this.state.editState}
                />
                <Form>
                    <Form.Field>
                        <label>Method of optimization</label>
                        <Form.Select
                            name="method"
                            value={parameters.method}
                            placeholder="method ="
                            onChange={this.handleChange}
                            options={[
                                {
                                    key: 'ga',
                                    value: 'GA',
                                    text: 'Genetic Algorithm'
                                },
                                {
                                    key: 'simplex',
                                    value: 'Simplex',
                                    text: 'Simplex'
                                }
                            ]}
                        />
                    </Form.Field>
                    {(parameters.method === 'GA' &&
                        <div>
                            <Form.Group widths="equal">
                                <Form.Field>
                                    <label>Number of generations of genetic algorithm</label>
                                    <Form.Input
                                        type="number"
                                        name="ngen"
                                        value={parameters.ngen}
                                        placeholder="ngen ="
                                        onChange={this.handleChange}
                                        disabled={(parameters.method !== 'GA')}
                                    />
                                </Form.Field>
                                <Form.Field>
                                    <label>Population size of genetic algorithm</label>
                                    <Form.Input
                                        type="number"
                                        name="pop_size"
                                        value={parameters.pop_size}
                                        placeholder="pop_size ="
                                        onChange={this.handleChange}
                                    />
                                </Form.Field>
                            </Form.Group>
                            <Form.Group widths="equal">
                                <Form.Field>
                                    <label>Probability of individual to be produced by mutation</label>
                                    <Form.Input
                                        type="number"
                                        name="mutpb"
                                        value={parameters.mutpb}
                                        placeholder="mutpb ="
                                        onChange={this.handleChange}
                                    />
                                </Form.Field>
                                <Form.Field>
                                    <label>Probability of individual to be produced by cross-over</label>
                                    <Form.Input
                                        type="number"
                                        name="cxpb"
                                        value={parameters.cxpb}
                                        placeholder="cxpb ="
                                        onChange={this.handleChange}
                                    />
                                </Form.Field>
                            </Form.Group>
                            <Form.Field>
                                <label>ETA crowding factor</label>
                                <Form.Input
                                    type="number"
                                    name="eta"
                                    value={parameters.eta}
                                    placeholder="eta ="
                                    onChange={this.handleChange}
                                />
                            </Form.Field>
                            <Form.Field>
                                <label>Probability of mutation of a single value of an individual</label>
                                <Form.Input
                                    name="indpb"
                                    type="number"
                                    value={parameters.indpb}
                                    placeholder="indpb ="
                                    onChange={this.handleChange}
                                />
                            </Form.Field>
                            <Segment>
                                <Form.Field>
                                    <label>Flag defining whether or not Diversity preserving module will be
                                        included</label>
                                    <Form.Select
                                        name="diversity_flg"
                                        value={parameters.diversity_flg}
                                        placeholder="diversity_flg ="
                                        onChange={this.handleChange}
                                        options={boolOptions}
                                    />
                                </Form.Field>
                                <Form.Group widths="equal">
                                    <Form.Field>
                                        <label>Boundary value of the Q diversity index.</label>
                                        <Form.Input
                                            type="number"
                                            name="qbound"
                                            value={parameters.qbound}
                                            placeholder="qbound ="
                                            onChange={this.handleChange}
                                            disabled={(parameters.diversity_flg === false)}
                                        />
                                    </Form.Field>
                                    <Form.Field>
                                        <label>Number of classes to be used in the clustering module.</label>
                                        <Form.Input
                                            type="number"
                                            name="ncls"
                                            value={parameters.ncls}
                                            placeholder="ncls ="
                                            onChange={this.handleChange}
                                            disabled={(parameters.diversity_flg === false)}
                                        />
                                    </Form.Field>
                                </Form.Group>
                            </Segment>
                        </div>
                    )}
                    {(parameters.method === 'Simplex' &&
                        <div>
                            <Form.Field>
                                <label>Maximum number of function evaluations during the local
                                    optimization.</label>
                                <Form.Input
                                    type="number"
                                    name="maxf"
                                    value={parameters.maxf}
                                    placeholder="maxf ="
                                    onChange={this.handleChange}
                                    disabled={(parameters.method !== 'Simplex')}
                                />
                            </Form.Field>
                            <Form.Group widths="equal">
                                <Form.Field>
                                    <label>xtol</label>
                                    <Form.Input
                                        type="number"
                                        name="xtol"
                                        value={parameters.xtol}
                                        placeholder="xtol ="
                                        onChange={this.handleChange}
                                        disabled={(parameters.method !== 'Simplex')}
                                    />
                                </Form.Field>
                                <Form.Field>
                                    <label>ftol</label>
                                    <Form.Input
                                        type="number"
                                        name="ftol"
                                        value={parameters.ftol}
                                        placeholder="ftol ="
                                        onChange={this.handleChange}
                                        disabled={(parameters.method !== 'Simplex')}
                                    />
                                </Form.Field>
                            </Form.Group>
                        </div>
                    )}
                    <Form.Field>
                        <label>Report frequency</label>
                        <Form.Input
                            type="number"
                            name="report_frequency"
                            value={parameters.report_frequency}
                            placeholder="report frequency ="
                            onChange={this.handleChange}
                        />
                    </Form.Field>
                </Form>
            </div>
        );
    }
}

OptimizationParametersComponent.propTypes = {
    parameters: PropTypes.instanceOf(OptimizationParameters),
    onChange: PropTypes.func.isRequired
};

export default OptimizationParametersComponent;
