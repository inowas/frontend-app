import React from 'react';
import PropTypes from 'prop-types';
import {Segment, Form} from 'semantic-ui-react';
import {OptimizationInput} from '../../../../../core/model/modflow/optimization';
import ContentToolBar from '../../../../shared/ContentToolbar';

class OptimizationParametersComponent extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            optimizationInput: props.optimizationInput.toObject()
        };
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            optimizationInput: nextProps.optimizationInput.toObject(),
        });
    }

    handleLocalChange = (e, {name, value}) => {
        const input = this.state.optimizationInput;
        input.parameters[name] = value;

        return this.setState({
            optimizationInput: input
        });
    };

    handleSelect = (e, {name, value}) => {
        const input = this.state.optimizationInput;
        input.parameters[name] = value;

        this.props.onChange(OptimizationInput.fromObject(input));
    };

    handleChange = () => this.props.onChange(OptimizationInput.fromObject(this.state.optimizationInput));

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
        const {parameters} = this.state.optimizationInput;

        return (
            <div>
                <ContentToolBar
                    isError={false}
                    isDirty={this.props.isDirty}
                    onSave={() => this.props.onSave()}
                />
                <Form>
                    <Form.Field>
                        <label>Method of optimization</label>
                        <Form.Select
                            name="method"
                            value={parameters.method}
                            placeholder="method ="
                            onChange={this.handleSelect}
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
                        <Segment>
                            <Form.Group widths="equal">
                                <Form.Field>
                                    <label>Number of generations of genetic algorithm</label>
                                    <Form.Input
                                        type="number"
                                        name="ngen"
                                        value={parameters.ngen}
                                        placeholder="ngen ="
                                        onBlur={this.handleChange}
                                        onChange={this.handleLocalChange}
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
                                        onBlur={this.handleChange}
                                        onChange={this.handleLocalChange}
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
                                        onBlur={this.handleChange}
                                        onChange={this.handleLocalChange}
                                    />
                                </Form.Field>
                                <Form.Field>
                                    <label>Probability of individual to be produced by cross-over</label>
                                    <Form.Input
                                        type="number"
                                        name="cxpb"
                                        value={parameters.cxpb}
                                        placeholder="cxpb ="
                                        onBlur={this.handleChange}
                                        onChange={this.handleLocalChange}
                                    />
                                </Form.Field>
                            </Form.Group>
                            <Form.Group widths="equal">
                            <Form.Field>
                                <label>ETA crowding factor</label>
                                <Form.Input
                                    type="number"
                                    name="eta"
                                    value={parameters.eta}
                                    placeholder="eta ="
                                    onBlur={this.handleChange}
                                    onChange={this.handleLocalChange}
                                />
                            </Form.Field>
                            <Form.Field>
                                <label>Probability of mutation of a single value of an individual</label>
                                <Form.Input
                                    name="indpb"
                                    type="number"
                                    value={parameters.indpb}
                                    placeholder="indpb ="
                                    onBlur={this.handleChange}
                                    onChange={this.handleLocalChange}
                                />
                            </Form.Field>
                            </Form.Group>
                            <Form.Field>
                                <label>Flag defining whether or not Diversity preserving module will be
                                    included</label>
                                <Form.Select
                                    name="diversity_flg"
                                    value={parameters.diversity_flg}
                                    placeholder="diversity_flg ="
                                    onChange={this.handleSelect}
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
                                        onBlur={this.handleChange}
                                        onChange={this.handleLocalChange}
                                        disabled={(parameters.diversity_flg === false)}
                                    />
                                </Form.Field>
                                <Form.Field>
                                    <label>Number of classes to be used in the clustering module</label>
                                    <Form.Input
                                        type="number"
                                        name="ncls"
                                        value={parameters.ncls}
                                        placeholder="ncls ="
                                        onBlur={this.handleChange}
                                        onChange={this.handleLocalChange}
                                        disabled={(parameters.diversity_flg === false)}
                                    />
                                </Form.Field>
                            </Form.Group>
                        </Segment>
                    )}
                    {(parameters.method === 'Simplex' &&
                        <Segment>
                            <Form.Field>
                                <label>Maximum number of function evaluations during the local
                                    optimization</label>
                                <Form.Input
                                    type="number"
                                    name="maxf"
                                    value={parameters.maxf}
                                    placeholder="maxf ="
                                    onBlur={this.handleChange}
                                    onChange={this.handleLocalChange}
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
                                        onBlur={this.handleChange}
                                        onChange={this.handleLocalChange}
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
                                        onBlur={this.handleChange}
                                        onChange={this.handleLocalChange}
                                        disabled={(parameters.method !== 'Simplex')}
                                    />
                                </Form.Field>
                            </Form.Group>
                        </Segment>
                    )}
                    <Segment>
                    <Form.Field>
                        <label>Report frequency</label>
                        <Form.Input
                            type="number"
                            name="report_frequency"
                            value={parameters.report_frequency}
                            placeholder="report frequency ="
                            onBlur={this.handleChange}
                            onChange={this.handleLocalChange}
                        />
                    </Form.Field>
                    </Segment>
                </Form>
            </div>
        );
    }
}

OptimizationParametersComponent.propTypes = {
    isDirty: PropTypes.bool,
    optimizationInput: PropTypes.instanceOf(OptimizationInput).isRequired,
    onChange: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired
};

export default OptimizationParametersComponent;
