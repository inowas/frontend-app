import React, {useEffect, useRef, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useHistory, useRouteMatch} from 'react-router-dom';
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
import {EMessageState} from '../../../../../core/model/messages/Message.type';
import MessagesCollection from '../../../../../core/model/messages/MessagesCollection';
import {ModflowModel, Soilmodel} from '../../../../../core/model/modflow';
import {BoundaryCollection} from '../../../../../core/model/modflow/boundaries';
import {IRootReducer} from '../../../../../reducers';
import {sendCommand} from '../../../../../services/api';
import ContentToolBar from '../../../../shared/ContentToolbar2';
import {addMessage, removeMessage, updateMessage, updatePackages} from '../../../actions/actions';
import ModflowModelCommand from '../../../commands/modflowModelCommand';
import {IEditingState, initialEditingState, messageDirty, messageSaving} from '../../../defaults/messages';
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

interface IProps {
    boundaries: BoundaryCollection;
    model: ModflowModel;
    soilmodel: Soilmodel;
    packages: FlopyPackages;
}

const flow = (props: IProps) => {
    const [mf, setMf] = useState<IFlopyModflow>(props.packages.mf.toObject());

    const mfRef = useRef<IFlopyModflow>();
    const packagesRef = useRef<FlopyPackages>();
    const editingState = useRef<IEditingState>(initialEditingState);

    const T03 = useSelector((state: IRootReducer) => state.T03);
    const messages = MessagesCollection.fromObject(T03.messages);

    const dispatch = useDispatch();
    const history = useHistory();
    const match = useRouteMatch();

    useEffect(() => {
        return function cleanup() {
            handleSave();
        };
    }, []);

    useEffect(() => {
        editingState.current = messages.getEditingState('modflow');
    }, [messages]);

    useEffect(() => {
        if (mf) {
            mfRef.current = mf;
        }
    }, [mf]);

    useEffect(() => {
        setMf(props.packages.mf.toObject());
        packagesRef.current = props.packages;
    }, [props.packages]);

    const handleSave = () => {
        if (!editingState.current.dirty || !mfRef.current || !packagesRef.current) {
            return null;
        }
        const message = messageSaving('modflow');
        dispatch(addMessage(message));
        const packages = packagesRef.current;
        packages.modelId = props.model.id;
        packages.mf = FlopyModflow.fromObject(mfRef.current);
        sendCommand(
            ModflowModelCommand.updateFlopyPackages(props.model.id, packages),
            () => {
                if (editingState.current.dirty) {
                    dispatch(removeMessage(editingState.current.dirty));
                }
                dispatch(updatePackages(packages));
                dispatch(updateMessage({...message, state: EMessageState.SUCCESS}));
            }
        );
    };

    const handleUndo = () => {
        if (!editingState.current.dirty) {
            return null;
        }
        dispatch(removeMessage(editingState.current.dirty));
        setMf(props.packages.mf.toObject());
    };

    const handleClickEdit = (layerId: string, set: string, parameter: string) => {
        const path = match.path;
        const basePath = path.split(':')[0];
        return history.push(
            `${basePath}${props.model.id}/soilmodel/layers/${layerId}?type=${set}&param=${parameter}`
        );
    };

    const handleChangePackage = (p: FlopyModflowPackage<IFlopyModflowPackage>) => {
        const cMf = FlopyModflow.fromObject(mf);
        cMf.setPackage(p);
        setMf(cMf.toObject());
        if (!editingState.current.dirty) {
            dispatch(addMessage(messageDirty('modflow')));
        }
    };

    const handleChangeFlowPackageType = (type: string) => {
        if (!mf || !props.packages) {
            return null;
        }
        if (flowPackages.indexOf(type) < 0) {
            throw Error('Type ' + type + 'is not a registered FlowPackage type');
        }
        const fp = packagesMap[type].create(props.soilmodel);

        const mfPackages = FlopyModflow.fromObject(mf);
        mfPackages.setPackage(fp);

        setMf(mfPackages.toObject());
        if (!editingState.current.dirty) {
            dispatch(addMessage(messageDirty('modflow')));
        }
        const packages = props.packages;
        packages.mf = mfPackages;
        dispatch(updatePackages(packages));
    };

    const handleMenuClick = (type: string | undefined) => () => {
        if (!props.model) {
            return null;
        }
        const path = match.path;
        const basePath = path.split(':')[0];
        handleSave();

        if (!type) {
            return history.push(basePath + props.model.id + '/modflow');
        }

        return history.push(basePath + props.model.id + '/modflow/' + type);
    };

    const renderProperties = () => {
        if (!mf || !props.model) {
            return null;
        }
        const iMf = FlopyModflow.fromObject(mf);

        const readOnly = props.model.readOnly;
        const {type} = match.params;
        const soilmodel = props.soilmodel;

        if (type && !['flow', 'solver'].includes(type) && !iMf.getPackage(type)) {
            return <div>Package not found!</div>;
        }

        if (!soilmodel) {
            return <div>Soilmodel not found!</div>;
        }

        switch (type) {
            case 'bas':
                return (
                    <BasPackageProperties
                        mfPackage={iMf.getPackage(type) as FlopyModflowMfbas}
                        onChange={handleChangePackage}
                        onClickEdit={handleClickEdit}
                        readonly={readOnly}
                        gridSize={props.model.gridSize}
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
        if (!props.boundaries) {
            return null;
        }
        const {type} = match.params;
        return (
            <div>
                <Menu fluid={true} vertical={true} tabular={true}>
                    {sideBar(props.boundaries).map((item, key) => {
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

    return (
        <Segment color={'grey'}>
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
    );
};

export default flow;
