import {DataSourceCollection, Rtm} from '../../../core/model/rtm';
import {
    DropdownProps,
    Form,
    Message,
    Segment
} from 'semantic-ui-react';
import {HeatTransportInputChart} from '.';
import {IDateTimeValue, ISensor, ISensorParameter} from '../../../core/model/rtm/Sensor.type';
import {IHeatTransportInput} from '../../../core/model/htm/Htm.type';
import {IRtm} from '../../../core/model/rtm/Rtm.type';
import {IToolInstance} from '../../dashboard/defaults/tools';
import {ProcessingCollection} from '../../../core/model/rtm/processing';
import {fetchApiWithToken, makeTimeProcessingRequest} from '../../../services/api';
import {uniqBy} from 'lodash';
import HtmInput from '../../../core/model/htm/HtmInput';
import React, {SyntheticEvent, useEffect, useState} from 'react';
import uuid from 'uuid';

interface IProps {
    input: HtmInput;
    label: string;
    name: string;
    onChange: (input: HtmInput) => void;
    readOnly: boolean;
}

interface IError {
    id: string;
    message: string;
}

const HeatTransportInput = (props: IProps) => {

    const [isFetching, setIsFetching] = useState<boolean>(true);

    const [errors, setErrors] = useState<IError[]>([]);

    const [input, setInput] = useState<IHeatTransportInput>(props.input.toObject());
    const [data, setData] = useState<IHeatTransportInput['data']>(undefined);

    const [t10Instances, setT10Instances] = useState<IToolInstance[]>([]);
    const [rtm, setRtm] = useState<IRtm>();

    const [sensor, setSensor] = useState<ISensor>();
    const [parameter, setParameter] = useState<ISensorParameter>();

    const [recalculate, setRecalculate] = useState<boolean>(false);

    const [tempTime, setTempTime] = useState<[number, number]>();       // KEY
    const [timesteps, setTimesteps] = useState<number[]>();             // UNIX[]

    useEffect(() => {
        const fetchInstances = async () => {
            try {
                setIsFetching(true);
                const privateT10Tools = (await fetchApiWithToken('tools/T10?public=false')).data;
                const publicT10Tools = (await fetchApiWithToken('tools/T10?public=true')).data;

                // Lets show an ordered List with the private projects first
                const tools = uniqBy(privateT10Tools.concat(publicT10Tools), (t: IToolInstance) => t.id);
                setT10Instances(tools);
            } catch (err) {
                setErrors([{id: uuid.v4(), message: 'Fetching t10 instances failed.'}]);
            } finally {
                setIsFetching(false);
            }
        };

        fetchInstances();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        setInput(props.input.toObject());
    }, [props.input]);

    useEffect(() => {
        if (!input.rtmId) {
            return;
        }

        const fetchRtm = async (id: string) => {
            try {
                setIsFetching(true);
                const res = await fetchApiWithToken(`tools/T10/${id}`);
                setRtm(res.data);
            } catch (err) {
                setErrors([{id: uuid.v4(), message: `Fetching t10 instance ${id} failed.`}]);
            } finally {
                setIsFetching(false);
            }
        };

        fetchRtm(input.rtmId);

    }, [input.rtmId]);

    useEffect(() => {
        if (!(rtm && input.sensorId)) {
            return;
        }

        const fetchSensor = (id: string) => {
            if (!rtm) {
                return;
            }

            const sensors = sensorsWithTemperature(rtm).filter((swt) => swt.id === id);
            if (sensors.length > 0) {
                const param = sensors[0].parameters.all.filter((p) => p.type === 't');
                if (param.length > 0) {
                    setSensor(sensors[0].toObject());
                    setParameter(param[0]);
                }
            }
        };

        fetchSensor(input.sensorId);
    }, [input.sensorId, rtm]);

    useEffect(() => {
        if (timesteps && input.timePeriod) {
            const startIndex = timesteps.indexOf(input.timePeriod[0]);
            const endIndex = timesteps.indexOf(input.timePeriod[1]);
            setTempTime([startIndex < 0 ? 0 : startIndex, endIndex < 0 ? timesteps.length - 1 : endIndex]);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [input.timePeriod]);

    useEffect(() => {
        if (input.data) {
            const ts = input.data.map((t) => t.timeStamp);
            setTimesteps(ts);
        }

        if (!data && input.data) {
            setData(input.data);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [input.data]);

    useEffect(() => {
        if (!parameter || !recalculate) {
            return;
        }

        const fetchData = async () => {
            try {
                setIsFetching(true);
                setData(undefined);
                const dataSourceCollection = DataSourceCollection.fromObject(parameter.dataSources);
                const mergedData = await dataSourceCollection.mergedData();
                const processings = ProcessingCollection.fromObject(parameter.processings);
                const processedData = await processings.apply(mergedData);
                const uniqueData = processedData.filter((value, index, self) => self.findIndex((v) => v.timeStamp === value.timeStamp) === index);
                const timeProcessedData = await makeTimeProcessingRequest(uniqueData, '1d', 'cubic');
                if (timeProcessedData.length > 0) {
                    const ts: number[] = timeProcessedData.map((t: IDateTimeValue) => t.timeStamp);
                    setTimesteps(ts);
                    setTempTime([0, ts.length - 1]);

                    const htmInput = {
                        ...input,
                        data: timeProcessedData,
                        timePeriod: [ts[0], ts[ts.length - 1]] as [number, number]
                    };

                    setData(timeProcessedData);
                    setInput(htmInput);
                    props.onChange(HtmInput.fromObject(htmInput));
                }
            } catch (err) {
                setErrors([{id: uuid.v4(), message: 'Data processing failed.'}]);
            } finally {
                setIsFetching(false);
                setRecalculate(false);
            }
        };

        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [parameter, recalculate]);

    const sensorsWithTemperature = (rtm: IRtm) => Rtm.fromObject(rtm).sensors.all.filter((s) =>
        s.parameters.filterBy('type', 't').length > 0
    );

    const getSensorOptions = () => {
        if (!rtm) {
            return [];
        }

        return sensorsWithTemperature(rtm).map((s) => {
            return {
                key: s.id,
                text: s.name,
                value: s.id
            };
        });
    };

    const handleChangeRtm = (e: SyntheticEvent<HTMLElement, Event>, {value}: DropdownProps) => {
        if (typeof value !== 'string') {
            return null;
        }

        setInput({
            ...input,
            rtmId: value,
            data: undefined
        });
    };

    const handleChangeSensor = (e: SyntheticEvent<HTMLElement, Event>, {value}: DropdownProps) => {
        if (typeof value !== 'string' || !rtm) {
            return null;
        }

        setInput({...input, sensorId: value});
        setRecalculate(true);
    };

    const handleDismissError = (id: string) => () => setErrors(errors.filter((e) => e.id !== id));

    return (
        <div>
            <Segment color="grey">
                <h4>{props.label}</h4>
                <Form.Select
                    disabled={props.readOnly}
                    label="T10 Instance"
                    placeholder="Select instance"
                    fluid={true}
                    selection={true}
                    value={rtm ? rtm.id : undefined}
                    options={t10Instances.map((i) => ({
                        key: i.id,
                        text: `${i.name} (${i.user_name})`,
                        value: i.id
                    }))}
                    onChange={handleChangeRtm}
                />
                <Form.Select
                    disabled={props.readOnly || !rtm || rtm.data.sensors.length === 0}
                    label="Sensor"
                    placeholder="Select sensor"
                    fluid={true}
                    selection={true}
                    value={sensor ? sensor.id : undefined}
                    options={getSensorOptions()}
                    onChange={handleChangeSensor}
                />
                <HeatTransportInputChart
                    data={data}
                    tempTime={tempTime}
                    timesteps={timesteps}
                    isLoading={isFetching}
                />
            </Segment>
            {errors.map((error, key) => (
                <Message key={key} negative={true} onDismiss={handleDismissError(error.id)}>
                    <Message.Header>Error</Message.Header>
                    <p>{error.message}</p>
                </Message>
            ))}
        </div>
    );
};

export default React.memo(HeatTransportInput);
