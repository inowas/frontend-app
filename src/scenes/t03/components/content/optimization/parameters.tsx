import React, {ChangeEvent, SyntheticEvent, useEffect, useState} from 'react';
import {DropdownProps, Form, InputOnChangeData, Segment} from 'semantic-ui-react';
import OptimizationInput from '../../../../../core/model/modflow/optimization/OptimizationInput';
import {IOptimizationInput} from '../../../../../core/model/modflow/optimization/OptimizationInput.type';
import {EOptimizationMethod} from '../../../../../core/model/modflow/optimization/OptimizationParameters.type';
import ContentToolBar from '../../../../shared/ContentToolbar';

interface IProps {
    isDirty: boolean;
    optimizationInput: OptimizationInput;
    onChange: (optimizationInput: OptimizationInput) => any;
    onSave: () => any;
}

const optimizationParametersComponent = (props: IProps) => {
    const [activeInput, setActiveInput] = useState<string | null>(null);
    const [activeValue, setActiveValue] = useState<string>('');
    const [optimizationInput, setOptimizationInput] = useState<IOptimizationInput>(props.optimizationInput.toObject());

    useEffect(() => {
        setOptimizationInput(props.optimizationInput.toObject());
    }, [props.optimizationInput]);

    const handleLocalChange = (e: ChangeEvent, {name, value}: InputOnChangeData) => {
        setActiveInput(name);
        setActiveValue(value);
    };

    const handleBlur = () => {
        setActiveInput(null);
        setActiveValue('');
    };

    const handleSelect = (e: SyntheticEvent, {name, value}: DropdownProps) => {
        const input = optimizationInput;
        if (name in input.parameters) {
            input.parameters[name] = value;
        }
        return props.onChange(OptimizationInput.fromObject(input));
    };

    const handleChange = () => props.onChange(OptimizationInput.fromObject(optimizationInput));

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
    const {parameters} = optimizationInput;

    return (
        <div>
            <ContentToolBar
                isError={false}
                isDirty={props.isDirty}
                onSave={() => props.onSave()}
            />
            <Form>
                <Form.Field>
                    <label>Method of optimization</label>
                    <Form.Select
                        name="method"
                        value={parameters.method}
                        placeholder="method ="
                        onChange={handleSelect}
                        options={[
                            {
                                key: 'ga',
                                value: EOptimizationMethod.GA,
                                text: 'Genetic Algorithm'
                            },
                            {
                                key: 'simplex',
                                value: EOptimizationMethod.SIMPLEX,
                                text: 'Simplex'
                            }
                        ]}
                    />
                </Form.Field>
                {(parameters.method === EOptimizationMethod.GA &&
                    <Segment>
                        <Form.Group widths="equal">
                            <Form.Field>
                                <label>Number of generations of genetic algorithm</label>
                                <Form.Input
                                    type="number"
                                    name="ngen"
                                    value={activeInput === 'ngen' ? activeValue : parameters.ngen}
                                    placeholder="ngen ="
                                    onBlur={handleBlur}
                                    onChange={handleLocalChange}
                                    disabled={(parameters.method !== EOptimizationMethod.GA)}
                                />
                            </Form.Field>
                            <Form.Field>
                                <label>Population size of genetic algorithm</label>
                                <Form.Input
                                    type="number"
                                    name="popSize"
                                    value={activeInput === 'pop_size' ? activeValue : parameters.popSize}
                                    placeholder="pop_size ="
                                    onBlur={handleBlur}
                                    onChange={handleLocalChange}
                                />
                            </Form.Field>
                        </Form.Group>
                        <Form.Group widths="equal">
                            <Form.Field>
                                <label>Probability of individual to be produced by mutation</label>
                                <Form.Input
                                    type="number"
                                    name="mutpb"
                                    value={activeInput === 'mutpb' ? activeValue : parameters.mutpb}
                                    placeholder="mutpb ="
                                    onBlur={handleBlur}
                                    onChange={handleLocalChange}
                                />
                            </Form.Field>
                            <Form.Field>
                                <label>Probability of individual to be produced by cross-over</label>
                                <Form.Input
                                    type="number"
                                    name="cxpb"
                                    value={activeInput === 'cxpb' ? activeValue : parameters.cxpb}
                                    placeholder="cxpb ="
                                    onBlur={handleBlur}
                                    onChange={handleLocalChange}
                                />
                            </Form.Field>
                        </Form.Group>
                        <Form.Group widths="equal">
                            <Form.Field>
                                <label>ETA crowding factor</label>
                                <Form.Input
                                    type="number"
                                    name="eta"
                                    value={activeInput === 'eta' ? activeValue : parameters.eta}
                                    placeholder="eta ="
                                    onBlur={handleBlur}
                                    onChange={handleLocalChange}
                                />
                            </Form.Field>
                            <Form.Field>
                                <label>Probability of mutation of a single value of an individual</label>
                                <Form.Input
                                    name="indpb"
                                    type="number"
                                    value={activeInput === 'indpb' ? activeValue : parameters.indpb}
                                    placeholder="indpb ="
                                    onBlur={handleBlur}
                                    onChange={handleLocalChange}
                                />
                            </Form.Field>
                        </Form.Group>
                        <Form.Field>
                            <label>Flag defining whether or not Diversity preserving module will be
                                included</label>
                            <Form.Select
                                name="diversity_flg"
                                value={parameters.diversityFlg}
                                placeholder="diversity_flg ="
                                onChange={handleSelect}
                                options={boolOptions}
                            />
                        </Form.Field>
                        <Form.Group widths="equal">
                            <Form.Field>
                                <label>Boundary value of the Q diversity index.</label>
                                <Form.Input
                                    type="number"
                                    name="qbound"
                                    value={activeInput === 'qbound' ? activeValue : parameters.qbound}
                                    placeholder="qbound ="
                                    onBlur={handleBlur}
                                    onChange={handleLocalChange}
                                    disabled={!parameters.diversityFlg}
                                />
                            </Form.Field>
                            <Form.Field>
                                <label>Number of classes to be used in the clustering module</label>
                                <Form.Input
                                    type="number"
                                    name="ncls"
                                    value={activeInput === 'ncls' ? activeValue : parameters.ncls}
                                    placeholder="ncls ="
                                    onBlur={handleBlur}
                                    onChange={handleLocalChange}
                                    disabled={!parameters.diversityFlg}
                                />
                            </Form.Field>
                        </Form.Group>
                    </Segment>
                )}
                {(parameters.method === EOptimizationMethod.SIMPLEX &&
                    <Segment>
                        <Form.Field>
                            <label>Maximum number of function evaluations during the local
                                optimization</label>
                            <Form.Input
                                type="number"
                                name="maxf"
                                value={activeInput === 'maxf' ? activeValue : parameters.maxf}
                                placeholder="maxf ="
                                onBlur={handleBlur}
                                onChange={handleLocalChange}
                            />
                        </Form.Field>
                        <Form.Group widths="equal">
                            <Form.Field>
                                <label>xtol</label>
                                <Form.Input
                                    type="number"
                                    name="xtol"
                                    value={activeInput === 'xtol' ? activeValue : parameters.xtol}
                                    placeholder="xtol ="
                                    onBlur={handleBlur}
                                    onChange={handleLocalChange}
                                />
                            </Form.Field>
                            <Form.Field>
                                <label>ftol</label>
                                <Form.Input
                                    type="number"
                                    name="ftol"
                                    value={activeInput === 'ftol' ? activeValue : parameters.ftol}
                                    placeholder="ftol ="
                                    onBlur={handleBlur}
                                    onChange={handleLocalChange}
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
                            value={activeInput === 'report_frequency' ? activeValue : parameters.reportFrequency}
                            placeholder="report frequency ="
                            onBlur={handleBlur}
                            onChange={handleLocalChange}
                        />
                    </Form.Field>
                </Segment>
            </Form>
        </div>
    );
};

export default optimizationParametersComponent;
