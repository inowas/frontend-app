import React, {SyntheticEvent, useEffect, useState} from 'react';
import {
    Dropdown,
    Grid,
    Segment
} from 'semantic-ui-react';
import {Rtm} from '../../../../core/model/rtm';
import {ISensorParameter} from '../../../../core/model/rtm/Sensor.type';
import {heatMapColors} from '../../../t05/defaults/gis';
import {ToggleableSensorList, VisualizationParameter} from './index';
import {IParameterWithMetaData} from './types';

interface IProps {
    rtm: Rtm;
}

const visualization = (props: IProps) => {
    const [dropdownData, setDropdownData] = useState<Array<{
        key: string, text: string, value: string
    }>>([]);
    const [selectedParameter, setSelectedParameter] = useState<string | null>(null);
    const [parameters, setParameters] = useState<IParameterWithMetaData[]>([]);

    useEffect(() => {
        if (selectedParameter) {
            const cParameters: IParameterWithMetaData[] = [];
            props.rtm.sensors.all.forEach((s, sIdx) => {
                s.parameters.findBy('type', selectedParameter).forEach((p, pIdx) => {
                    cParameters.push({
                        data: [],
                        parameter: p,
                        sensor: s.toObject(),
                        meta: {
                            active: true,
                            color: (heatMapColors.discrete.length >= 4 * sIdx + pIdx) ?
                                heatMapColors.discrete[4 * sIdx + pIdx] : '#000000'
                        }
                    });
                });
            });
            return setParameters(cParameters);
        }
    }, [selectedParameter]);

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
            setSelectedParameter(cParameters[0].type);
        }
        return setDropdownData(
            cParameters.map((p) => {
                return {key: p.type, text: p.type, value: p.type};
            })
        );
    }, []);

    const handleChangeDropdown = (e: SyntheticEvent<HTMLElement, Event>, {value}: any) => {
        return setSelectedParameter(value);
    };

    const handleChangeParameters = (cParameters: IParameterWithMetaData[]) => {
        return setParameters(cParameters);
    };

    const renderContent = () => {
        if (selectedParameter) {
            return (
                <VisualizationParameter
                    parameters={parameters}
                    rtm={props.rtm}
                />
            );
        }
        return null;
    };

    return (
        <Segment color={'grey'}>
            <Grid>
                <Grid.Row>
                    <Grid.Column width={4}>
                        <Dropdown
                            fluid={true}
                            search={true}
                            selection={true}
                            onChange={handleChangeDropdown}
                            options={dropdownData}
                            value={selectedParameter ? selectedParameter : undefined}
                        />
                        {selectedParameter &&
                        <ToggleableSensorList
                            onChange={handleChangeParameters}
                            parameters={parameters}
                        />
                        }
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
