import React, {useEffect, useRef, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useHistory, useParams} from 'react-router-dom';
import {Grid, Menu, Segment} from 'semantic-ui-react';
import FlopyPackages from '../../../../../core/model/flopy/packages/FlopyPackages';
import {
    FlopyModflowMf,
    FlopyModflowMfbas,
    FlopyModflowMfchd,
    FlopyModflowMfdis,
    FlopyModflowMfdrn,
    FlopyModflowMfevt,
    FlopyModflowMffhb,
    FlopyModflowMfghb,
    FlopyModflowMfhob,
    FlopyModflowMfoc,
    FlopyModflowMfrch,
    FlopyModflowMfriv,
    FlopyModflowMfwel
} from '../../../../../core/model/flopy/packages/mf';
import FlopyModflow, {flowPackages, packagesMap} from '../../../../../core/model/flopy/packages/mf/FlopyModflow';
import {IFlopyModflow, IFlopyModflowPackage} from '../../../../../core/model/flopy/packages/mf/FlopyModflow.type';
import FlopyModflowPackage from '../../../../../core/model/flopy/packages/mf/FlopyModflowPackage';
import {EMessageState, IMessage} from '../../../../../core/model/messages/Message.type';
import MessagesCollection from '../../../../../core/model/messages/MessagesCollection';
import {ModflowModel, Soilmodel} from '../../../../../core/model/modflow';
import {BoundaryCollection} from '../../../../../core/model/modflow/boundaries';
import {IRootReducer} from '../../../../../reducers';
import {sendCommand} from '../../../../../services/api';
import ContentToolBar from '../../../../shared/ContentToolbar2';
import {addMessage, removeMessage, updateMessage, updatePackages} from '../../../actions/actions';
import ModflowModelCommand from '../../../commands/modflowModelCommand';
import {messageDirty, messageError, messageSaving} from '../../../defaults/messages';
import {
    BasPackageProperties,
    ChdPackageProperties,
    DisPackageProperties,
    DrnPackageProperties,
    EvtPackageProperties,
    FhbPackageProperties,
    FlowPackageProperties,
    GhbPackageProperties,
    HobPackageProperties,
    MfPackageProperties,
    OcPackageProperties,
    RchPackageProperties,
    RivPackageProperties,
    SolverPackageProperties,
    WelPackageProperties
} from './mf';

const sideBar = (boundaries: BoundaryCollection) => ([
    {id: undefined, name: 'Modflow package', enabled: true},
    {id: 'dis', name: 'Discretization package', enabled: true},
    {id: 'bas', name: 'Basic package', enabled: true},
    {id: 'chd', name: 'Constant head package', enabled: boundaries.countByType('chd') > 0},
    {id: 'drn', name: 'Drainage package', enabled: boundaries.countByType('drn') > 0},
    {id: 'evt', name: 'Evapotranspiration package', enabled: boundaries.countByType('evt') > 0},
    {id: 'fhb', name: 'Flow and head package', enabled: boundaries.countByType('fhb') > 0},
    {id: 'ghb', name: 'General head package', enabled: boundaries.countByType('ghb') > 0},
    {id: 'rch', name: 'Recharge package', enabled: boundaries.countByType('rch') > 0},
    {id: 'riv', name: 'River package', enabled: boundaries.countByType('riv') > 0},
    {id: 'wel', name: 'Well package', enabled: boundaries.countByType('wel') > 0},
    {id: 'hob', name: 'Head observation package', enabled: boundaries.countByType('hob') > 0},
    {id: 'flow', name: 'Flow packages', enabled: true},
    {id: 'solver', name: 'Solver package', enabled: true},
    {id: 'oc', name: 'Output control', enabled: true}
]);

const baseUrl = '/tools/T03';

const flow = () => {
    const [mf, setMf] = useState<IFlopyModflow>();
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const T03 = useSelector((state: IRootReducer) => state.T03);
    const model = T03.model ? ModflowModel.fromObject(T03.model) : null;
    const boundaries = T03.boundaries ? BoundaryCollection.fromObject(T03.boundaries) : null;
    const packages = T03.packages.data ? FlopyPackages.fromObject(T03.packages.data) : null;
    const soilmodel = T03.soilmodel ? Soilmodel.fromObject(T03.soilmodel) : null;
    const messages = MessagesCollection.fromObject(T03.messages);

    const mfRef = useRef<IFlopyModflow>();
    const editingState = useRef<{ [key: string]: IMessage | null }>({
        dirty: null,
        saving: null
    });

    if (!boundaries || !model || !packages || !soilmodel) {
        return (
            <Segment color={'grey'} loading={true}/>
        );
    }

    const {property, type} = useParams();

    const dispatch = useDispatch();
    const history = useHistory();

    useEffect(() => {
        setIsLoading(true);
        setMf(packages.mf.toObject());
        recalculate();
        return function cleanup() {
            handleSave();
        };
    }, []);

    useEffect(() => {
        editingState.current = messages.getEditingState(property);
        if (mf) {
            mfRef.current = mf;
        }
    }, [messages, mf]);

    const recalculate = () => {
        const cPackages = FlopyPackages.fromObject(packages.toObject());
        cPackages.mf.recalculate(model, soilmodel, boundaries);
        setIsLoading(false);
        return dispatch(updatePackages(cPackages));
    };

    const handleSave = () => {
        if (!mfRef.current || !editingState.current.dirty) {
            return null;
        }
        const message = messageSaving(property);
        dispatch(addMessage(message));
        packages.modelId = model.id;
        packages.mf = FlopyModflow.fromObject(mfRef.current);
        sendCommand(
            ModflowModelCommand.updateFlopyPackages(model.id, packages),
            () => {
                dispatch(updatePackages(packages));
                if (editingState.current.dirty) {
                    dispatch(removeMessage(editingState.current.dirty));
                }
                return dispatch(updateMessage({...message, state: EMessageState.SUCCESS}));
            }, (e) => dispatch(addMessage(messageError(property, e)))
        );
    };

    const handleUndo = () => {
        if (!editingState.current.dirty) {
            return;
        }
        dispatch(removeMessage(editingState.current.dirty));
        setMf(packages.mf.toObject());
    };

    const handleClickEdit = (layerId: string, set: string, parameter: string) => history.push(
        `${baseUrl}/${model.id}/soilmodel/layers/${layerId}?type=${set}&param=${parameter}`
    );

    const handleChangePackage = (p: FlopyModflowPackage<IFlopyModflowPackage>) => {
        if (!mf) {
            return null;
        }
        const cMf = FlopyModflow.fromObject(mf);
        cMf.setPackage(p);
        setMf(cMf.toObject());
        if (!editingState.current.dirty) {
            dispatch(addMessage(messageDirty(property)));
        }
    };

    const handleChangeFlowPackageType = (cType: string) => {
        if (!mf) {
            return null;
        }
        if (flowPackages.indexOf(cType) < 0) {
            throw Error('Type ' + cType + 'is not a registered FlowPackage type');
        }
        const fp = packagesMap[cType].create(soilmodel);

        const mfPackages = FlopyModflow.fromObject(mf);
        mfPackages.setPackage(fp);

        setMf(mfPackages.toObject());
        if (!editingState.current.dirty) {
            dispatch(addMessage(messageDirty(property)));
        }
    };

    const handleMenuClick = (cType: string | undefined) => () => {
        handleSave();
        if (!cType) {
            return history.push(`${baseUrl}/${model.id}/modflow`);
        }
        return history.push(`${baseUrl}/${model.id}/modflow/${cType}`);
    };

    const renderProperties = () => {
        if (!mf) {
            return null;
        }
        const iMf = FlopyModflow.fromObject(mf);
        const readOnly = model.readOnly;

        if (type && !['flow', 'solver'].includes(type) && !iMf.getPackage(type)) {
            return <div>Package not found!</div>;
        }

        switch (type) {
            case 'bas':
                return (
                    <BasPackageProperties
                        mfPackage={iMf.getPackage(type) as FlopyModflowMfbas}
                        onChange={handleChangePackage}
                        onClickEdit={handleClickEdit}
                        readonly={readOnly}
                        gridSize={model.gridSize}
                        soilmodel={soilmodel}
                    />
                );
            case 'chd':
                return (
                    <ChdPackageProperties
                        mfPackage={iMf.getPackage(type) as FlopyModflowMfchd}
                        mfPackages={iMf}
                        onChange={handleChangePackage}
                        readonly={readOnly}
                    />
                );
            case 'dis':
                return (
                    <DisPackageProperties
                        mfPackage={iMf.getPackage(type) as FlopyModflowMfdis}
                        onChange={handleChangePackage}
                        readonly={readOnly}
                    />
                );
            case 'drn':
                return (
                    <DrnPackageProperties
                        mfPackage={iMf.getPackage(type) as FlopyModflowMfdrn}
                        mfPackages={iMf}
                        onChange={handleChangePackage}
                        readonly={readOnly}
                    />
                );
            case 'evt':
                return (
                    <EvtPackageProperties
                        mfPackage={iMf.getPackage(type) as FlopyModflowMfevt}
                        mfPackages={iMf}
                        onChange={handleChangePackage}
                        readonly={readOnly}
                    />
                );
            case 'fhb':
                return (
                    <FhbPackageProperties
                        mfPackage={iMf.getPackage(type) as FlopyModflowMffhb}
                        mfPackages={iMf}
                        onChange={handleChangePackage}
                        readonly={readOnly}
                    />
                );
            case 'flow':
                return (
                    <FlowPackageProperties
                        mfPackages={iMf}
                        onChange={handleChangePackage}
                        onChangeFlowPackageType={handleChangeFlowPackageType}
                        readonly={readOnly}
                    />
                );
            case 'ghb':
                return (
                    <GhbPackageProperties
                        mfPackage={iMf.getPackage(type) as FlopyModflowMfghb}
                        mfPackages={iMf}
                        onChange={handleChangePackage}
                        readonly={readOnly}
                    />
                );
            case 'hob':
                return (
                    <HobPackageProperties
                        mfPackage={iMf.getPackage(type) as FlopyModflowMfhob}
                        mfPackages={iMf}
                        onChange={handleChangePackage}
                        readonly={readOnly}
                    />
                );
            case 'mf':
                return (
                    <MfPackageProperties
                        mfPackage={iMf.getPackage(type) as FlopyModflowMf}
                        mfPackages={iMf}
                        onChange={handleChangePackage}
                        readonly={readOnly}
                    />
                );
            case 'oc':
                return (
                    <OcPackageProperties
                        mfPackage={iMf.getPackage(type) as FlopyModflowMfoc}
                        mfPackages={iMf}
                        onChange={handleChangePackage}
                        readonly={readOnly}
                    />
                );
            case 'rch':
                return (
                    <RchPackageProperties
                        mfPackage={iMf.getPackage(type) as FlopyModflowMfrch}
                        mfPackages={iMf}
                        onChange={handleChangePackage}
                        readonly={readOnly}
                    />
                );
            case 'riv':
                return (
                    <RivPackageProperties
                        mfPackage={iMf.getPackage(type) as FlopyModflowMfriv}
                        mfPackages={iMf}
                        onChange={handleChangePackage}
                        readonly={readOnly}
                    />
                );
            case 'solver':
                return (
                    <SolverPackageProperties
                        mfPackages={iMf}
                        onChange={handleChangePackage}
                        readonly={readOnly}
                    />
                );
            case 'wel':
                return (
                    <WelPackageProperties
                        mfPackage={iMf.getPackage(type) as FlopyModflowMfwel}
                        mfPackages={iMf}
                        onChange={handleChangePackage}
                        readonly={readOnly}
                    />
                );

            default:
                return (
                    <MfPackageProperties
                        mfPackage={iMf.getPackage('mf') as FlopyModflowMf}
                        mfPackages={iMf}
                        onChange={handleChangePackage}
                        readonly={readOnly}
                    />
                );
        }
    };

    const renderSidebar = () => {
        return (
            <div>
                <Menu fluid={true} vertical={true} tabular={true}>
                    {sideBar(boundaries).map((item, key) => {
                        if (item.enabled) {
                            return (
                                <Menu.Item
                                    key={key}
                                    name={item.name}
                                    active={type === item.id || (!item.id && !type)}
                                    onClick={handleMenuClick(item.id)}
                                />
                            );
                        }
                        return null;
                    })}
                </Menu>
            </div>
        );
    };

    if (!mf) {
        return null;
    }

    return (
        <div>
            <Segment color={'grey'} loading={isLoading}>
                <Grid>
                    <Grid.Row>
                        <Grid.Column width={4}/>
                        <Grid.Column width={12}>
                            <ContentToolBar buttonSave={true} onUndo={handleUndo} onSave={handleSave}/>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column width={4}>
                            {renderSidebar()}
                        </Grid.Column>
                        <Grid.Column width={12}>
                            {renderProperties()}
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Segment>
        </div>
    );
};

export default (flow);
