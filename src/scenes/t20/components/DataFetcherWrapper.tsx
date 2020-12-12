import {BoundaryCollection} from '../../../core/model/modflow/boundaries';
import {IRootReducer} from '../../../reducers';
import {IRtModelling} from '../../../core/model/rtm/modelling/RTModelling.type';
import {IToolInstance} from '../../dashboard/defaults/tools';
import {List, Modal} from 'semantic-ui-react';
import {ModflowModel} from '../../../core/model/modflow';
import {clear} from '../../t03/actions/actions';
import {fetchApiWithToken} from '../../../services/api';
import {rtModellingFetcher} from '../services/rtmFetcher';
import {uniqBy} from 'lodash';
import {updateBoundaries, updateModel, updateRTModelling, updateT10Instances} from '../actions/actions';
import {useDispatch, useSelector} from 'react-redux';
import {useParams} from 'react-router-dom';
import RTModelling from '../../../core/model/rtm/modelling/RTModelling';
import React, {ReactNode, useEffect, useState} from 'react';

interface IProps {
    children: ReactNode;
}

const DataFetcherWrapper = (props: IProps) => {
    const [rtmId, setRtmId] = useState<string | null>(null);

    const [fetchingBoundaries, setFetchingBoundaries] = useState<boolean>(true);
    const [fetchingBoundariesSuccess, setFetchingBoundariesSuccess] = useState<boolean | null>(null);

    const [fetchingInstances, setFetchingInstances] = useState<boolean>(true);
    const [fetchingInstancesSuccess, setFetchingInstancesSuccess] = useState<boolean | null>(null);

    const [fetchingModel, setFetchingModel] = useState<boolean>(true);
    const [fetchingModelSuccess, setFetchingModelSuccess] = useState<boolean | null>(null);

    const [fetchingRtm, setFetchingRtm] = useState<boolean>(true);
    const [fetchingRtmSuccess, setFetchingRtmSuccess] = useState<boolean | null>(null);

    const [showModal, setShowModal] = useState<boolean>(true);

    const [rtmFetcher, setRtmFetcher] = useState<{
        message: string;
        fetching: boolean;
    }>({
        message: 'Start Fetching RTM ...',
        fetching: true
    });

    const dispatch = useDispatch();
    const {id} = useParams();

    const T20 = useSelector((state: IRootReducer) => state.T20);
    const {model, boundaries, rtmodelling, t10instances} = T20;

    useEffect(() => {
        dispatch(clear());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (rtmId !== id) {
            setRtmId(id);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    useEffect(() => {
        if (rtmId) {
            fetchInstances();
            fetchRTModelling(rtmId);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [rtmId]);

    const fetchBoundaries = async (mId: string) => {
        setFetchingBoundaries(true);
        try {
            const b = (await fetchApiWithToken(`modflowmodels/${mId}/boundaries`)).data;
            const bc = BoundaryCollection.fromQuery(b);
            dispatch(updateBoundaries(bc));
            setFetchingBoundariesSuccess(true);
        } catch (err) {
            setFetchingBoundariesSuccess(false);
        } finally {
            setFetchingBoundaries(false);
        }
    };

    const fetchInstances = async () => {
        setFetchingInstances(true);
        try {
            const privateT10Tools = (await fetchApiWithToken('tools/T10?public=false')).data;
            const publicT10Tools = (await fetchApiWithToken('tools/T10?public=true')).data;
            const tools = uniqBy(privateT10Tools.concat(publicT10Tools), (t: IToolInstance) => t.id);
            dispatch(updateT10Instances(tools));
            setFetchingInstancesSuccess(true);
        } catch (err) {
            setFetchingInstancesSuccess(false);
        } finally {
            setFetchingInstances(false);
        }
    };

    const fetchModflowModel = async (r: IRtModelling) => {
        setFetchingModel(true);
        try {
            const m = (await fetchApiWithToken(`modflowmodels/${r.data.model_id}`)).data
            dispatch(updateModel(ModflowModel.fromObject(m)));
            fetchBoundaries(m.id);
            setFetchingModelSuccess(true);
        } catch (err) {
            setFetchingModelSuccess(false);
        } finally {
            setFetchingModel(false);
        }
    };

    const fetchRTModelling = async (i: string) => {
        setFetchingRtm(true);
        try {
            const r = (await fetchApiWithToken(`tools/t20/${i}`)).data
            const ri = RTModelling.fromObject(r);

            rtModellingFetcher(
                ri,
                (message) => {
                    setRtmFetcher({message, fetching: true});
                },
                (result) => {
                    dispatch(updateRTModelling(result));
                    fetchModflowModel(r);
                    setFetchingRtmSuccess(true);
                    setRtmFetcher({message: 'Done', fetching: false});
                }
            );
        } catch (err) {
            setFetchingRtmSuccess(false);
        }
    };

    const renderList = (listItems: Array<{ name: string, loading: boolean, success: boolean | null }>) => (
        listItems.map((item, idx) => (
            <List.Item key={idx}>
                <List.Icon
                    name={item.loading ? 'circle notched' : item.success ? 'check circle' : 'remove circle'}
                    size={'large'}
                    verticalAlign={'middle'}
                    loading={item.loading}
                />
                <List.Content>
                    <List.Header>{item.name}</List.Header>
                </List.Content>
            </List.Item>
        ))
    );

    const renderRtm = () => rtmFetcher.fetching ? `Real time modelling ... ${rtmFetcher.message}` : 'Real time modelling';

    const everythingIsLoaded = () => {
        const eil: boolean = !!model && boundaries.length > 0 && !!rtmodelling && t10instances.length > 0;
        if (eil) {
            setTimeout(() => setShowModal(false), 1000);
        }
        return eil;
    };

    return (
        <div>
            {everythingIsLoaded() && props.children}
            <Modal size={'small'} closeIcon={false} open={showModal} dimmer={'inverted'}>
                <Modal.Header>Loading Data</Modal.Header>
                <Modal.Content>
                    <List>
                        {renderList([
                            {name: 'Main model', loading: fetchingModel, success: fetchingModelSuccess},
                            {name: 'Boundaries', loading: fetchingBoundaries, success: fetchingBoundariesSuccess},
                            {name: 'T10 instances', loading: fetchingInstances, success: fetchingInstancesSuccess},
                            {name: renderRtm(), loading: fetchingRtm, success: fetchingRtmSuccess},
                        ])}
                    </List>
                </Modal.Content>
            </Modal>
        </div>
    );
}

export default DataFetcherWrapper;
