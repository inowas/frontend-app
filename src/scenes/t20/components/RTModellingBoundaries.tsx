import {BoundaryCollection, BoundaryFactory, LineBoundary} from '../../../core/model/modflow/boundaries';
import {Button, Dropdown, DropdownProps, Grid, Icon, Loader, Message, Segment, Table} from 'semantic-ui-react';
import {
    EMethodType,
    IMethod,
    IMethodFunction,
    IMethodSensor,
    IRTModellingHead
} from '../../../core/model/rtm/modelling/RTModelling.type';
import {IBoundary} from '../../../core/model/modflow/boundaries/Boundary.type';
import {IRootReducer} from '../../../reducers';
import {Line, LineChart, YAxis} from 'recharts';
import {ModflowModel} from '../../../core/model/modflow';
import {fetchApiWithToken} from '../../../services/api';
import {updateBoundaries} from '../actions/actions';
import {useDispatch, useSelector} from 'react-redux';
import {useHistory} from 'react-router-dom';
import MethodModal from './MethodModal';
import RTModelling from '../../../core/model/rtm/modelling/RTModelling';
import RTModellingMethod from '../../../core/model/rtm/modelling/RTModellingMethod';
import React, {SyntheticEvent, useEffect, useState} from 'react';
import uuid from 'uuid';

interface IProps {
    onChange: (rtm: RTModelling) => void;
}

const RTModellingBoundaries = (props: IProps) => {
    const [errors, setErrors] = useState<Array<{ id: string; message: string; }>>([]);
    const [heads, setHeads] = useState<IRTModellingHead[]>();
    const [isDirty, setIsDirty] = useState<boolean>(false);
    const [isFetching, setIsFetching] = useState<boolean>(false);
    const [activeRow, setActiveRow] = useState<{
        method: IMethod | IMethodSensor | IMethodFunction, bId: string, propertyKey: number, opId?: string
    } | null>(null);

    const T20 = useSelector((state: IRootReducer) => state.T20);
    const boundaries = BoundaryCollection.fromObject(T20.boundaries);
    const model = T20.model ? ModflowModel.fromObject(T20.model) : null;
    const rtm = T20.rtmodelling ? RTModelling.fromObject(T20.rtmodelling) : null;
    const t10Instances = T20.t10instances;

    const dispatch = useDispatch();
    const history = useHistory();

    const fetchBoundaries = async () => {
        if (!model || !rtm) {
            return;
        }
        try {
            const b = (await fetchApiWithToken(`modflowmodels/${model.id}/boundaries`)).data;
            const bc = BoundaryCollection.fromQuery(b);
            const r = rtm.updateHeadsFromBoundaries(bc);
            const h = r.toObject().data.head;
            if (bc.length === 0 || !h || h.length === 0) {
                setErrors(errors.concat([{id: uuid.v4(), message: 'No boundaries found.'}]));
            } else {
                dispatch(updateBoundaries(bc));
                setHeads(r.toObject().data.head);
            }
        } catch (err) {
            setErrors(errors.concat([{id: uuid.v4(), message: 'Fetching Modflow model failed.'}]));
        }
    };

    useEffect(() => {
        if (T20.model && boundaries.length === 0) {
            setIsFetching(true);
            fetchBoundaries().then(() => setIsFetching(false));
        }
        if (rtm && boundaries.length > 0) {
            const r = rtm.updateHeadsFromBoundaries(boundaries);
            setHeads(r.toObject().data.head);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [T20.model]);

    if (!rtm || !model) {
        return null;
    }

    const handleChangeMethod = (value: EMethodType, bid: string, propertyKey: number, opId?: string) => {
        if (!heads) {
            return null;
        }

        let data: IMethod | IMethodFunction | IMethodSensor = {
            method: value as EMethodType,
            values: null
        };

        if (value === EMethodType.FUNCTION) {
            data = {
                ...data,
                function: ''
            };
        }

        if (value === EMethodType.SENSOR) {
            data = {
                ...data,
                monitoring_id: '',
                sensor_id: '',
                parameter_id: ''
            }
        }

        setHeads(heads.map((r) => {
            if (r.boundary_id === bid) {
                if (!Array.isArray(r.data) && opId) {
                    r.data[opId][propertyKey] = data;
                }
                if (Array.isArray(r.data)) {
                    r.data[propertyKey] = data;
                }
            }
            return r;
        }));
        setIsDirty(true);
    };

    const handleChangeModal = (v: RTModellingMethod) => {
        if (!heads || !activeRow) {
            return null;
        }

        setHeads(heads.map((r) => {
            if (r.boundary_id === activeRow.bId) {
                if (!Array.isArray(r.data) && activeRow.opId) {
                    r.data[activeRow.opId][activeRow.propertyKey] = v.toObject();
                }
                if (Array.isArray(r.data)) {
                    r.data[activeRow.propertyKey] = v.toObject();
                }
            }
            return r;
        }));
        setActiveRow(null);
        setIsDirty(true);
        setIsFetching(false);
    };

    const handleChangeSelect = (bId: string, propertyKey: number, opId?: string) =>
        (e: SyntheticEvent<HTMLElement>, {value}: DropdownProps) => {
            handleChangeMethod(value as EMethodType, bId, propertyKey, opId);
        };

    const handleClickEdit = (
        method: IMethod | IMethodSensor | IMethodFunction, bId: string, propertyKey: number, opId?: string
    ) => () => {
        setActiveRow({method, bId, propertyKey, opId});
    };

    const handleClickPreview = (bId: string) => () => history.push(`boundaries/${bId}`);

    const handleSave = () => {
        const cRtm = rtm.toObject();
        cRtm.data.head = heads;
        props.onChange(RTModelling.fromObject(cRtm));
        setIsDirty(false);
    };

    const renderMethodButton = (
        method: IMethod | IMethodSensor | IMethodFunction, bid: string, propertyKey: number, opId?: string
    ) => {
        const bc = boundaries ? boundaries.all : [];

        if (!model || bc.length < 1) {
            return null;
        }

        const f = bc.filter((b) => b.id === bid);

        if (f.length < 1) {
            return null;
        }

        return (
            <Button.Group>
                <Button
                    disabled={method.method === EMethodType.CONSTANT}
                    floated="right"
                    onClick={handleClickEdit(method, bid, propertyKey, opId)}
                    icon={true}
                >
                    <Icon name='pencil'/>
                </Button>
                <Button
                    floated="right"
                    onClick={handleClickPreview(bid)}
                    icon={true}
                >
                    <Icon name='eye' />
                </Button>
            </Button.Group>
        );
    };

    const renderMethodDetails = (method: IMethod | IMethodSensor | IMethodFunction) => {
        if (method.method === EMethodType.FUNCTION) {
            return method.function;
        }
        if (method.method === EMethodType.SENSOR) {
            if (method.values) {
                return (
                    <LineChart width={100} height={30} data={method.values.map((y: number, x: number) => ({x, y}))} key={Math.random()}>
                        <YAxis
                            dataKey={'y'}
                            domain={['auto', 'auto']}
                            hide={true}
                        />
                        <Line type="monotone" dataKey="y" dot={false} stroke="blue"/>
                    </LineChart>
                );
            }
            const f1 = t10Instances.filter((i) => i.id === method.monitoring_id);
            if (f1.length > 0) {
                return `${f1[0].name} (${f1[0].user_name})`;
            }
        }
        return '';
    };

    const renderMethodSelect = (value: EMethodType, bId: string, propertyKey: number, opId?: string) => {
        return (
            <Dropdown
                fluid={true}
                selection={true}
                options={[
                    {key: EMethodType.CONSTANT, value: EMethodType.CONSTANT, text: 'Constant'},
                    {key: EMethodType.SENSOR, value: EMethodType.SENSOR, text: 'Sensor'}
                ]}
                onChange={handleChangeSelect(bId, propertyKey, opId)}
                value={value}
            />
        );
    };

    const renderBoundary = (b: IBoundary) => {
        if (!heads) {
            return null;
        }
        const boundary = BoundaryFactory.fromObject(b);
        const f = heads.filter((h) => h.boundary_id === boundary.id);

        if (!f || f.length === 0) {
            return null;
        }

        if (boundary instanceof LineBoundary) {
            return renderLineBoundary(boundary, f[0]);
        }

        const head = f[0];

        if (!Array.isArray(head.data)) {
            return null;
        }

        return (
            <React.Fragment key={boundary.id}>
                <Table.Row>
                    <Table.Cell rowSpan={head.data.length}>{boundary.name}</Table.Cell>
                    <Table.Cell/>
                    <Table.Cell>{boundary.valueProperties[0].name}</Table.Cell>
                    <Table.Cell>{renderMethodSelect(head.data[0].method, boundary.id, 0)}</Table.Cell>
                    <Table.Cell textAlign="center">{renderMethodDetails(head.data[0])}</Table.Cell>
                    <Table.Cell>{renderMethodButton(head.data[0], boundary.id, 0)}</Table.Cell>
                </Table.Row>
                {head.data.length > 1 && head.data.filter((r, k) => k > 0).map((r, k) => (
                    <Table.Row key={k}>
                        <Table.Cell/>
                        <Table.Cell>{boundary.valueProperties[k + 1].name}</Table.Cell>
                        <Table.Cell>{renderMethodSelect(r.method, boundary.id, k + 1)}</Table.Cell>
                        <Table.Cell textAlign="center">{renderMethodDetails(r)}</Table.Cell>
                        <Table.Cell>{renderMethodButton(r, boundary.id, k + 1)}</Table.Cell>
                    </Table.Row>
                ))}
            </React.Fragment>
        );
    };

    const renderLineBoundary = (b: LineBoundary, h: IRTModellingHead) => {
        const ops = b.observationPoints.map((op) => op.toObject());
        const rowSpan = b.valueProperties.length * ops.length;

        if (Array.isArray(h.data)) {
            return null;
        }

        return (
            <React.Fragment key={b.id}>
                <Table.Row>
                    <Table.Cell rowSpan={rowSpan}>{b.name}</Table.Cell>
                    <Table.Cell rowSpan={b.valueProperties.length}>{ops[0].properties.name}</Table.Cell>
                    <Table.Cell>{b.valueProperties[0].name}</Table.Cell>
                    <Table.Cell>{renderMethodSelect(h.data[ops[0].id][0].method, b.id, 0, ops[0].id)}</Table.Cell>
                    <Table.Cell>{renderMethodDetails(h.data[ops[0].id][0])}</Table.Cell>
                    <Table.Cell>{renderMethodButton(h.data[ops[0].id][0], b.id, 0, ops[0].id)}</Table.Cell>
                </Table.Row>
                {b.valueProperties.length > 1 && h.data[ops[0].id].filter((r, k) => k > 0).map((r, k) => (
                    <Table.Row key={k}>
                        <Table.Cell>{b.valueProperties[k + 1].name}</Table.Cell>
                        <Table.Cell>{renderMethodSelect(r.method, b.id, k + 1, ops[0].id)}</Table.Cell>
                        <Table.Cell textAlign="center">{renderMethodDetails(r)}</Table.Cell>
                        <Table.Cell>{renderMethodButton(r, b.id, k + 1, ops[0].id)}</Table.Cell>
                    </Table.Row>
                ))}
                {ops.length > 1 && ops.filter((op, k) => k > 0).map((op) => (
                    <React.Fragment key={op.id}>
                        <Table.Row>
                            <Table.Cell rowSpan={b.valueProperties.length}>{op.properties.name}</Table.Cell>
                            <Table.Cell>{b.valueProperties[0].name}</Table.Cell>
                            <Table.Cell>{!Array.isArray(h.data) ? renderMethodSelect(h.data[op.id][0].method, b.id, 0, op.id) : 'ERROR'}</Table.Cell>
                            <Table.Cell>{!Array.isArray(h.data) ? renderMethodDetails(h.data[op.id][0]) : 'ERROR'}</Table.Cell>
                            <Table.Cell>{!Array.isArray(h.data) ? renderMethodButton(h.data[op.id][0], b.id, 0, op.id) : 'ERROR'}</Table.Cell>
                        </Table.Row>
                        {b.valueProperties.length > 1 && !Array.isArray(h.data) && h.data[op.id].filter((r, k) => k > 0).map((r, k) => (
                            <Table.Row key={`${op}_${k}`}>
                                <Table.Cell>{b.valueProperties[k + 1].name}</Table.Cell>
                                <Table.Cell>{renderMethodSelect(r.method, b.id, k + 1, op.id)}</Table.Cell>
                                <Table.Cell textAlign="center">{renderMethodDetails(r)}</Table.Cell>
                                <Table.Cell>{renderMethodButton(r, b.id, k + 1, op.id)}</Table.Cell>
                            </Table.Row>
                        ))}
                    </React.Fragment>
                ))}
            </React.Fragment>
        );
    };

    return (
        <Segment color={'grey'}>
            {activeRow &&
            <MethodModal
                method={RTModellingMethod.fromObject(activeRow.method)}
                onClose={() => setActiveRow(null)}
                onSave={handleChangeModal}
            />
            }
            <Grid padded={true}>
                <Grid.Row>
                    <Button
                        disabled={!isDirty}
                        floated="right"
                        onClick={handleSave}
                    >
                        Save
                    </Button>
                </Grid.Row>
                <Grid.Row stretched={true}>
                    <Grid.Column width={16}>
                        {isFetching &&
                        <Loader active={true} inline='centered'/>
                        }
                        {boundaries && boundaries.length > 0 && heads && heads.length > 0 &&
                        <Table celled={true}>
                            <Table.Header>
                                <Table.Row>
                                    <Table.HeaderCell>Boundary</Table.HeaderCell>
                                    <Table.HeaderCell>OP</Table.HeaderCell>
                                    <Table.HeaderCell>Parameter</Table.HeaderCell>
                                    <Table.HeaderCell>Method</Table.HeaderCell>
                                    <Table.HeaderCell>Details</Table.HeaderCell>
                                    <Table.HeaderCell/>
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
                                {boundaries.all.map((b) => renderBoundary(b.toObject()))}
                            </Table.Body>
                        </Table>
                        }
                    </Grid.Column>
                </Grid.Row>
                {errors.length > 0 &&
                <Grid.Row>
                    <Grid.Column width={16}>
                        {errors.map((error) => (
                            <Message negative={true} key={error.id}>
                                <Message.Header>Error</Message.Header>
                                <p>{error.message}</p>
                            </Message>
                        ))}
                    </Grid.Column>
                </Grid.Row>
                }
            </Grid>
        </Segment>
    );
};

export default RTModellingBoundaries;
