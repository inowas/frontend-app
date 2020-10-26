import {
    Form,
    Grid,
    InputOnChangeData,
    Segment
} from 'semantic-ui-react';
import {HeatTransportInput, HeatTransportResults} from './index';
import {IHeatTransportRequest, IHeatTransportRequestOptions, IHtm} from '../../../core/model/htm/Htm.type';
import {includes} from 'lodash';
import {makeHeatTransportRequest} from '../../../services/api';
import Htm from '../../../core/model/htm/Htm';
import HtmInput from '../../../core/model/htm/HtmInput';
import React, {FormEvent, useEffect, useState} from 'react';
import moment from 'moment';

interface IProps {
    htm: Htm;
    onChange: (htm: Htm) => void;
    onSave: (htm: IHtm) => void;
}

const HeatTransportController = (props: IProps) => {
    const [isFetching, setIsFetching] = useState<boolean>(false);
    const [activeInput, setActiveInput] = useState<string>();
    const [activeValue, setActiveValue] = useState<string>('');
    const [requestOptions, setRequestOptions] = useState<IHeatTransportRequestOptions>(props.htm.options);

    useEffect(() => {
        setRequestOptions(props.htm.options);
    }, [props.htm]);

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

    const handleCalculateAndSave = async () => {
        const sw = props.htm.inputSw.toObject();
        const gw = props.htm.inputGw.toObject();

        if (!sw.data || !gw.data) {
            return;
        }

        setIsFetching(true);
        const requestData: IHeatTransportRequest = {
            data_sw_selected: sw.data.map((row) => ({
                date: moment.unix(row.timeStamp).format('YYYY-MM-DD'),
                value: row.value
            })),
            data_gw_selected: gw.data.map((row) => ({
                date: moment.unix(row.timeStamp).format('YYYY-MM-DD'),
                value: row.value
            })),
            ...requestOptions
        };

        makeHeatTransportRequest(requestData).then((r3) => {
            const cHtm = props.htm.toObject();
            cHtm.data.results = JSON.parse(r3);
            cHtm.data.options = requestOptions;
            props.onChange(Htm.fromObject(cHtm));
            props.onSave(cHtm);
            setIsFetching(false);
        });
    };

    const handleChangeData = (value: HtmInput) => {
        const htm = props.htm.getClone();
        props.onChange(htm.updateInput(value));
    };

    const readOnly = !includes(props.htm.permissions, 'w');
    return (
        <React.Fragment>
            <Form>
                <Grid>
                    <Grid.Row>
                        <Grid.Column width={8}>
                            <HeatTransportInput
                                input={props.htm.inputSw}
                                label="Surface water"
                                name="sw"
                                onChange={handleChangeData}
                                readOnly={isFetching || readOnly}
                            />
                        </Grid.Column>
                        <Grid.Column width={8}>
                            <HeatTransportInput
                                input={props.htm.inputGw}
                                label="Groundwater"
                                name="gw"
                                onChange={handleChangeData}
                                readOnly={isFetching || readOnly}
                            />
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column>
                            <Segment color={'grey'}>
                                <Form.Group>
                                    <Form.Input
                                        disabled={isFetching || readOnly}
                                        name="retardationFactor"
                                        label="Thermal retardation factor"
                                        type="number"
                                        onBlur={handleBlurInput}
                                        onChange={handleChangeInput}
                                        value={activeInput === 'retardationFactor' ? activeValue :
                                            requestOptions.retardation_factor}
                                    />
                                    <Form.Input
                                        disabled={isFetching || readOnly}
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
                                        onClick={handleCalculateAndSave}
                                        disabled={!props.htm.inputSw.data || !props.htm.inputGw.data || isFetching || readOnly}
                                        label="&nbsp;"
                                        loading={isFetching}
                                    >
                                        Run calculation and save
                                    </Form.Button>
                                </Form.Group>
                            </Segment>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Form>
            {props.htm.results && <HeatTransportResults results={props.htm.results}/>}
        </React.Fragment>
    );
};

export default HeatTransportController;
