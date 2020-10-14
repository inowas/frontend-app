import moment from 'moment';
import React, {FormEvent, useState} from 'react';
import {
    Form,
    Grid,
    InputOnChangeData,
    Segment
} from 'semantic-ui-react';
import {Rtm} from '../../../core/model/rtm';
import {IDateTimeValue} from '../../../core/model/rtm/Sensor.type';
import {makeHeatTransportRequest} from '../../../services/api';
import {HeatTransportInput, HeatTransportResults} from './index';
import {IHeatTransportRequestOptions, IHeatTransportResults, IHeatTransportRequest} from "../../../core/model/htm/Htm.type";

interface IProps {
    rtm: Rtm;
}

const HeatTransportData = (props: IProps) => {
    const [isFetching, setIsFetching] = useState<boolean>(false);

    const [swData, setSwData] = useState<IDateTimeValue[]>();
    const [gwData, setGwData] = useState<IDateTimeValue[]>();

    const [results, setResults] = useState<IHeatTransportResults>();

    const [activeInput, setActiveInput] = useState<string>();
    const [activeValue, setActiveValue] = useState<string>('');

    const [requestOptions, setRequestOptions] = useState<IHeatTransportRequestOptions>({
        retardation_factor: 1.8,
        sw_monitoring_id: 'TEGsee-mikrosieb',
        gw_monitoring_id: 'TEG343',
        limits: [100, 500],
        tolerance: 0.001,
        debug: false
    });

    const handleBlurInput = () => {
        if (activeInput === 'retardationFactor') {
            const parsedValue = parseFloat(activeValue);
            setRequestOptions({
                ...requestOptions,
                retardation_factor: !isNaN(parsedValue) ? parseFloat(activeValue) : 1.8
            });
        }
        if (activeInput === 'tolerance') {
            const parsedValue = parseFloat(activeValue);
            setRequestOptions({
                ...requestOptions,
                tolerance: !isNaN(parsedValue) ? parseFloat(activeValue) : 1.8
            });
        }
        setActiveInput(undefined);
    };

    const handleChangeInput = (e: FormEvent<HTMLInputElement>, {name, value}: InputOnChangeData) => {
        setActiveInput(name);
        setActiveValue(value);
    };

    const handleCalculate = async () => {
        if (!swData || !gwData) {
            return;
        }

        setIsFetching(true);
        const requestData: IHeatTransportRequest = {
            data_sw_selected: swData.map((row) => ({
                date: moment.unix(row.timeStamp).format('YYYY-MM-DD'),
                value: row.value
            })),
            data_gw_selected: gwData.map((row) => ({
                date: moment.unix(row.timeStamp).format('YYYY-MM-DD'),
                value: row.value
            })),
            ...requestOptions
        };

        makeHeatTransportRequest(requestData).then((r3) => {
            setResults(JSON.parse(r3));
            setIsFetching(false);
        });
    };

    const handleChangeData = (name: string, value: IDateTimeValue[]) => {
        if (name === 'sw') {
            setSwData(value);
        }
        if (name === 'gw') {
            setGwData(value);
        }
    };

    return (
        <React.Fragment>
            <Form>
                <Grid>
                    <Grid.Row>
                        <Grid.Column width={8}>
                            <HeatTransportInput
                                label="Surface water"
                                name="sw"
                                onChange={handleChangeData}
                                readOnly={isFetching}
                                rtm={props.rtm}
                            />
                        </Grid.Column>
                        <Grid.Column width={8}>
                            <HeatTransportInput
                                label="Groundwater"
                                name="gw"
                                onChange={handleChangeData}
                                readOnly={isFetching}
                                rtm={props.rtm}
                            />
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column>
                            <Segment color={'grey'}>
                                <Form.Group>
                                    <Form.Input
                                        disabled={isFetching}
                                        name="retardationFactor"
                                        label="Retardation Factor"
                                        type="number"
                                        onBlur={handleBlurInput}
                                        onChange={handleChangeInput}
                                        value={activeInput === 'retardationFactor' ? activeValue :
                                            requestOptions.retardation_factor}
                                    />
                                    <Form.Input
                                        disabled={isFetching}
                                        name="tolerance"
                                        label="Tolerance"
                                        type="number"
                                        onBlur={handleBlurInput}
                                        onChange={handleChangeInput}
                                        value={activeInput === 'tolerance' ? activeValue : requestOptions.tolerance}
                                    />
                                    <Form.Button
                                        positive={true}
                                        fluid={true}
                                        onClick={handleCalculate}
                                        disabled={!swData || !gwData || isFetching}
                                        label="&nbsp;"
                                        loading={isFetching}
                                    >
                                        Run calculation
                                    </Form.Button>
                                </Form.Group>
                            </Segment>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Form>
            {results && <HeatTransportResults results={results}/>}
        </React.Fragment>
    );
};

export default HeatTransportData;
