import {DataSourceCollection, Rtm} from '../../../core/model/rtm/monitoring';
import {EMethodType, RTModellingObservationPoint} from '../../../core/model/rtm/modelling/RTModelling.type';
import {IDateTimeValue} from '../../../core/model/rtm/monitoring/Sensor.type';
import {ProcessingCollection} from '../../../core/model/rtm/processing';
import {fetchApiWithToken, makeTimeProcessingRequest} from '../../../services/api';
import RTModelling from '../../../core/model/rtm/modelling/RTModelling';

interface IMetaData {
    bId: string;
    opId?: string;
    propertyKey: number;
    monitoringId: string;
    sensorId: string;
    parameterId: string;
}

export const fetchData = (
    mId: string,
    sId: string,
    pId: string,
    startDate: Date,
    onFinish: (d: number[]) => any
) => {
    const fetchRtm = async (id: string) => {
        try {
            const res = await fetchApiWithToken(`tools/T10/${id}`);
            const rtm = Rtm.fromObject(res.data);
            const sensor = rtm.sensors.findById(sId);
            if (sensor) {
                const parameter = sensor.parameters.findById(pId);
                if (parameter) {
                    const dataSourceCollection = DataSourceCollection.fromObject(parameter.dataSources);
                    const mergedData = await dataSourceCollection.mergedData();
                    const processings = ProcessingCollection.fromObject(parameter.processings);
                    const processedData = await processings.apply(mergedData);
                    const uniqueData = processedData.filter((value, index, self) =>
                        self.findIndex((v) => v.timeStamp === value.timeStamp) === index);
                    const timeProcessedData = await makeTimeProcessingRequest(uniqueData, '1d', 'cubic');
                    if (timeProcessedData.length > 0) {
                        const sDate = startDate.getTime() / 1000;
                        onFinish(timeProcessedData.filter((r: IDateTimeValue) => r.timeStamp > sDate).map((r: IDateTimeValue) => r.value));
                    }
                }
            }
        } catch (err) {
            console.log(err);
        }
    };

    fetchRtm(mId);
}

const workOnTasks = (
    rtm: RTModelling,
    fetchNeeded: Array<IMetaData>,
    onEachStep: (m: string) => any,
    onSuccess: (result: RTModelling) => any
) => {
    if (fetchNeeded.length === 0) {
        onSuccess(rtm);
        return;
    }

    const f = fetchNeeded.shift();

    if (f) {
        onEachStep(`Parameter ${f.parameterId} of Sensor ${f.sensorId}`);
        fetchData(
            f.monitoringId,
            f.sensorId,
            f.parameterId,
            rtm.startDate,
            (res) => {
                const oRtm = rtm.toObject();
                const cRtm = {
                    ...oRtm,
                    data: {
                        ...oRtm.data,
                        head: oRtm.data.head ? oRtm.data.head.map((b) => {
                            if (b.boundary_id === f.bId) {
                                if (Array.isArray(b.data)) {
                                    b.data = b.data.map((m, k) => {
                                        if (k === f.propertyKey) {
                                            m.values = res;
                                        }
                                        return m;
                                    });
                                } else {
                                    const d: RTModellingObservationPoint = b.data;
                                    if (f.opId) {
                                        d[f.opId] = d[f.opId].map((m, k) => {
                                            if (k === f.propertyKey) {
                                                m.values = res;
                                            }
                                            return m;
                                        });
                                    }
                                    b.data = d;
                                }
                            }
                            return b;
                        }) : undefined
                    }
                };
                workOnTasks(RTModelling.fromObject(cRtm), fetchNeeded, onEachStep, onSuccess);
            }
        );
    }
};

export const rtModellingFetcher = (
    rtm: RTModelling,
    onEachStep: (m: string) => any,
    onSuccess: (result: RTModelling) => any
) => {
    const fetchNeeded: Array<IMetaData> = [];

    if (rtm.data.head !== undefined) {
        rtm.data.head.forEach((b) => {
            if (Array.isArray(b.data)) {
                b.data.forEach((m, k) => {
                    if (m.method === EMethodType.SENSOR && !m.values) {
                        fetchNeeded.push({
                            bId: b.boundary_id,
                            propertyKey: k,
                            monitoringId: m.monitoring_id,
                            sensorId: m.sensor_id,
                            parameterId: m.parameter_id
                        });
                    }
                });
            } else {
                const keys = Object.keys(b.data);
                const d: RTModellingObservationPoint = b.data;
                keys.forEach((key) => {
                    d[key].forEach((m, k) => {
                        if (m.method === EMethodType.SENSOR && !m.values) {
                            fetchNeeded.push({
                                bId: b.boundary_id,
                                opId: key,
                                propertyKey: k,
                                monitoringId: m.monitoring_id,
                                sensorId: m.sensor_id,
                                parameterId: m.parameter_id
                            });
                        }
                    })
                })
            }
        });
    }

    console.log({fetchNeeded});

    workOnTasks(rtm, fetchNeeded, onEachStep, onSuccess);
};
