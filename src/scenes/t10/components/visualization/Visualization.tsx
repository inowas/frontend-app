import _ from 'lodash';
import React, {SyntheticEvent, useEffect, useState} from 'react';
import {
    Button,
    Form,
    Grid,
    Icon, Segment
} from 'semantic-ui-react';
import {Rtm} from '../../../../core/model/rtm';
import {ISensorParameter} from '../../../../core/model/rtm/Sensor.type';
import {heatMapColors} from '../../../t05/defaults/gis';
import {ToggleableSensorList, VisualizationParameter} from './index';
import {IParameterWithMetaData} from './types';

interface IProps {
    rtm: Rtm;
}

interface ISelectedParameter {
    type: string;
    axis: 'left' | 'right';
}

const visualization = (props: IProps) => {
    const [dropdownData, setDropdownData] = useState<Array<{
        key: string, text: string, value: string
    }>>([]);
    const [selectedParameters, setSelectedParameters] = useState<ISelectedParameter[]>([]);
    const [parameters, setParameters] = useState<IParameterWithMetaData[]>([]);

    useEffect(() => {
        if (selectedParameters.length > 0) {
            const cParameters: IParameterWithMetaData[] = [];
            selectedParameters.forEach((selectedParameter) => {
                props.rtm.sensors.all.forEach((s, sIdx) => {
                    s.parameters.findBy('type', selectedParameter.type).forEach((p, pIdx) => {
                        cParameters.push({
                            data: [],
                            parameter: p,
                            sensor: s.toObject(),
                            meta: {
                                active: true,
                                color: (heatMapColors.discrete.length >= 4 * sIdx + pIdx) ?
                                    heatMapColors.discrete[4 * sIdx + pIdx] : '#000000',
                                axis: selectedParameter.axis
                            }
                        });
                    });
                });
            });
            return setParameters(cParameters);
        }
    }, [selectedParameters]);

    useEffect(() => {
        const cParameters: ISensorParameter[] = [];
        props.rtm.sensors.all.forEach((s) => {
            s.parameters.all.forEach((p) => {
                if (cParameters.filter((sp) => sp.type === p.type).length === 0) {
                    cParameters.push(p);
                }
            });
        });
        if (cParameters.length > 0) {
            setSelectedParameters([{
                axis: 'left',
                type: cParameters[0].type
            }]);
        }
        return setDropdownData(
            props.rtm.parameterTypes.map((p) => {
                return {key: p, text: p, value: p};
            })
        );
    }, []);

    const handleChangeAxis = (type: string) => (e: SyntheticEvent<HTMLElement, Event>, {value}: any) => {
        return setSelectedParameters(selectedParameters.map((p) => {
            if (p.type === type) {
                p.axis = value;
            }
            return p;
        }));
    };

    const handleChangeParameter = (type: string) => (e: SyntheticEvent<HTMLElement, Event>, {value}: any) => {
        return setSelectedParameters(selectedParameters.map((p) => {
            if (p.type === type) {
                p.type = value;
            }
            return p;
        }));
    };

    const handleRemoveParameter = (type: string) => () => {
        return setSelectedParameters(selectedParameters.filter((p) => p.type !== type));
    };

    const handleChangeParameters = (result: IParameterWithMetaData[]) => {
        const cParameters: IParameterWithMetaData[] = result;
        parameters.forEach((p) => {
            if (cParameters.filter((cp) => cp.parameter.type === p.parameter.type).length === 0) {
                cParameters.push(p);
            }
        });
        return setParameters(cParameters);
    };

    const handleAddParameter = () => {
        const nextParameter = dropdownData.filter(
            (r) => selectedParameters.filter(
                (p) => p.type === r.value
            ).length === 0
        );
        if (nextParameter.length > 0) {
            const cParameters = _.cloneDeep(selectedParameters);
            cParameters.push({
                type: nextParameter[0].value,
                axis: 'left'
            });
            return setSelectedParameters(cParameters);
        }
    };

    const renderContent = () => {
        if (selectedParameters.length > 0) {
            return (
                <VisualizationParameter
                    parameters={parameters}
                    rtm={props.rtm}
                />
            );
        }
        return null;
    };

    const renderParameter = (parameter: ISelectedParameter, key: number) => {
        return (
            <Segment color={'blue'} key={key}>
                <Button
                    onClick={handleRemoveParameter(parameter.type)}
                    icon="close"
                    compact={true}
                    basic={true}
                    style={{
                        position: 'absolute',
                        top: '0',
                        right: '0',
                    }}
                    size="tiny"
                />
                <Form>
                    <Form.Select
                        label="Parameter"
                        fluid={true}
                        search={true}
                        selection={true}
                        onChange={handleChangeParameter(parameter.type)}
                        options={dropdownData.filter(
                            (r) => parameter.type === r.value || selectedParameters.filter(
                                (p) => p.type === r.value
                            ).length === 0
                        )}
                        value={parameter.type}
                    />
                    <Form.Select
                        label="Y-Axis"
                        fluid={true}
                        selection={true}
                        onChange={handleChangeAxis(parameter.type)}
                        options={[
                            {key: 'left', value: 'left', text: 'Left'},
                            {key: 'right', value: 'right', text: 'Right'}
                        ]}
                        value={parameter.axis}
                    />
                </Form>
                <ToggleableSensorList
                    onChange={handleChangeParameters}
                    parameters={parameters.filter((p) => p.parameter.type === parameter.type)}
                />
            </Segment>
        );
    };

    return (
        <Segment color={'grey'}>
            <Grid>
                <Grid.Row>
                    <Grid.Column width={4}>
                        <Button
                            disabled={selectedParameters.length >= dropdownData.length}
                            labelPosition="left"
                            onClick={handleAddParameter}
                            primary={true}
                            icon={true}
                            fluid={true}
                        >
                            <Icon name="plus"/>
                            Add Parameter
                        </Button>
                        {selectedParameters.map((p, key) => renderParameter(p, key))}
                    </Grid.Column>
                    <Grid.Column width={12}>
                        <Grid>
                            <Grid.Row>
                                <Grid.Column width={16}>
                                    {renderContent()}
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </Segment>
    );
};

export default visualization;