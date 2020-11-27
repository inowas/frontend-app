import {
    Form,
    Grid,
    InputOnChangeData,
    Segment
} from 'semantic-ui-react';
import {HeatTransportInput, HeatTransportResults} from './index';
import {IHeatTransportRequest, IHeatTransportRequestOptions} from '../../../core/model/htm/Htm.type';
import {IRootReducer} from '../../../reducers';
import {includes} from 'lodash';
import {makeHeatTransportRequest, sendCommand} from '../../../services/api';
import {updateHtm} from '../actions/actions';
import {useDispatch, useSelector} from 'react-redux';
import Htm from '../../../core/model/htm/Htm';
import React, {FormEvent, useEffect, useState} from 'react';
import SimpleToolsCommand from '../../shared/simpleTools/commands/SimpleToolsCommand';
import moment from 'moment';

interface IProps {
    htm: Htm;
}

const HeatTransportController = (props: IProps) => {
    const [isFetching, setIsFetching] = useState<boolean>(false);
    const [activeInput, setActiveInput] = useState<string>();
    const [activeValue, setActiveValue] = useState<string>('');
    const [requestOptions, setRequestOptions] = useState<IHeatTransportRequestOptions>(props.htm.options);

    const user = useSelector((state: IRootReducer) => state.user);
    const dispatch = useDispatch();

    const T19 = useSelector((state: IRootReducer) => state.T19);
    const data = T19.data;

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
        if (!data.sw || !data.gw) {
            return;
        }

        setIsFetching(true);
        const requestData: IHeatTransportRequest = {
            data_sw_selected: data.sw.map((row) => ({
                date: moment.unix(row.timeStamp).format('YYYY-MM-DD'),
                value: row.value
            })),
            data_gw_selected: data.gw.map((row) => ({
                date: moment.unix(row.timeStamp).format('YYYY-MM-DD'),
                value: row.value
            })),
            ...requestOptions
        };

        makeHeatTransportRequest(requestData).then((r3) => {
            const cHtm = props.htm.toObject();
            cHtm.data.results = JSON.parse(r3);
            cHtm.data.options = requestOptions;
            const iHtm = Htm.fromObject(cHtm);
            sendCommand(
                SimpleToolsCommand.updateToolInstance(iHtm.toObject()),
                () => {
                    dispatch(updateHtm(iHtm));
                    setIsFetching(false);
                }
            );
            setIsFetching(false);
        });
    };
    
    const readOnly = !includes(props.htm.permissions, 'w');

    return (
        <React.Fragment>
            <Form>
                <Grid>
                    <Grid.Row>
                        <Grid.Column width={8}>
                            <HeatTransportInput
                                dateTimeFormat={user.settings.dateFormat}
                                input={props.htm.inputSw}
                                label="Surface water"
                                name="sw"
                                readOnly={isFetching || readOnly}
                            />
                        </Grid.Column>
                        <Grid.Column width={8}>
                            <HeatTransportInput
                                dateTimeFormat={user.settings.dateFormat}
                                input={props.htm.inputGw}
                                label="Groundwater"
                                name="gw"
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
                                        disabled={!data.sw || !data.gw || isFetching || readOnly}
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
            {props.htm.results && <HeatTransportResults dateTimeFormat={user.settings.dateFormat} results={props.htm.results}/>}
        </React.Fragment>
    );
};

export default HeatTransportController;
