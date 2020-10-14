import React, {useEffect, useRef, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useHistory, useRouteMatch} from 'react-router-dom';
import {Grid, Menu, Segment} from 'semantic-ui-react';
import FlopyPackages from '../../../../../core/model/flopy/packages/FlopyPackages';
import {FlopyMt3d} from '../../../../../core/model/flopy/packages/mt';
import {IFlopyMt3d} from '../../../../../core/model/flopy/packages/mt/FlopyMt3d';
import FlopyMt3dMt from '../../../../../core/model/flopy/packages/mt/FlopyMt3dMt';
import FlopyMt3dMtadv from '../../../../../core/model/flopy/packages/mt/FlopyMt3dMtadv';
import FlopyMt3dMtbtn from '../../../../../core/model/flopy/packages/mt/FlopyMt3dMtbtn';
import FlopyMt3dMtdsp from '../../../../../core/model/flopy/packages/mt/FlopyMt3dMtdsp';
import FlopyMt3dMtgcg from '../../../../../core/model/flopy/packages/mt/FlopyMt3dMtgcg';
import FlopyMt3dMtrct from '../../../../../core/model/flopy/packages/mt/FlopyMt3dMtrct';
import FlopyMt3dMtssm from '../../../../../core/model/flopy/packages/mt/FlopyMt3dMtssm';
import FlopyMt3dPackage from '../../../../../core/model/flopy/packages/mt/FlopyMt3dPackage';
import {EMessageState} from '../../../../../core/model/messages/Message.type';
import MessagesCollection from '../../../../../core/model/messages/MessagesCollection';
import {ModflowModel, Soilmodel, Transport as TransportAlias} from '../../../../../core/model/modflow';
import {IRootReducer} from '../../../../../reducers';
import {sendCommand} from '../../../../../services/api';
import ContentToolBar from '../../../../shared/ContentToolbar2';
import {addMessage, removeMessage, updateMessage, updatePackages} from '../../../actions/actions';
import ModflowModelCommand from '../../../commands/modflowModelCommand';
import {IEditingState, initialEditingState, messageDirty, messageSaving} from '../../../defaults/messages';
import {
    AdvPackageProperties,
    BtnPackageProperties,
    DspPackageProperties,
    GcgPackageProperties,
    MtPackageProperties,
    RctPackageProperties,
    SsmPackageProperties
} from './mt';

const sideBar = [
    {id: undefined, name: 'Overview Transport'},
    {id: 'btn', name: 'Basic package'},
    {id: 'adv', name: 'Advection package'},
    {id: 'dsp', name: 'Dispersion package'},
    {id: 'rct', name: 'Reaction package'},
    {id: 'ssm', name: 'Source/Sink Package'},
    {id: 'gcg', name: 'Matrix solver package'}
];

interface IProps {
    model: ModflowModel;
    packages: FlopyPackages;
    soilmodel: Soilmodel;
    transport: TransportAlias;
}

const Transport = (props: IProps) => {
    const [mt, setMt] = useState<IFlopyMt3d>(props.packages.mt.toObject());

    const mtRef = useRef<IFlopyMt3d>();
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
        editingState.current = messages.getEditingState('mt3d');
    }, [messages]);

    useEffect(() => {
        if (mt) {
            mtRef.current = mt;
        }
    }, [mt]);

    const handleSave = () => {
        if (!editingState.current.dirty || !mtRef.current) {
            return null;
        }
        const message = messageSaving('mt3d');
        dispatch(addMessage(message));
        const packages = props.packages;
        packages.modelId = props.model.id;
        packages.mt = FlopyMt3d.fromObject(mt);
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
        setMt(props.packages.mt.toObject());
        dispatch(removeMessage(editingState.current.dirty));
    };

    const handleChangePackage = (p: FlopyMt3dPackage<any>) => {
        const cMt = FlopyMt3d.fromObject(mt);
        cMt.setPackage(p);
        setMt(cMt.toObject());
        if (!editingState.current.dirty) {
            dispatch(addMessage(messageDirty('mt3d')));
        }
    };

    const handleMenuClick = (type: string | undefined) => () => {
        const path = match.path;
        const basePath = path.split(':')[0];
        handleSave();

        if (!type) {
            return history.push(basePath + props.model.id + '/mt3d');
        }

        return history.push(basePath + props.model.id + '/mt3d/' + type);
    };

    const renderProperties = () => {
        const mt3d = FlopyMt3d.fromObject(mt);
        const readOnly = props.model.readOnly;
        const {type} = match.params;
        const {packages} = props;

        switch (type) {
            case 'adv':
                return (
                    <AdvPackageProperties
                        mtPackage={mt3d.getPackage(type) as FlopyMt3dMtadv}
                        onChange={handleChangePackage}
                        readOnly={readOnly}
                    />
                );
            case 'btn':
                return (
                    <BtnPackageProperties
                        mtPackage={mt3d.getPackage(type) as FlopyMt3dMtbtn}
                        onChange={handleChangePackage}
                        readOnly={readOnly}
                    />
                );
            case 'dsp':
                return (
                    <DspPackageProperties
                        mtPackage={mt3d.getPackage(type) as FlopyMt3dMtdsp}
                        onChange={handleChangePackage}
                        readOnly={readOnly}
                    />
                );
            case 'gcg':
                return (
                    <GcgPackageProperties
                        mtPackage={mt3d.getPackage(type) as FlopyMt3dMtgcg}
                        onChange={handleChangePackage}
                        readOnly={readOnly}
                    />
                );
            case 'rct':
                return (
                    <RctPackageProperties
                        mtPackage={mt3d.getPackage(type) as FlopyMt3dMtrct}
                        onChange={handleChangePackage}
                        readOnly={readOnly}
                    />
                );
            case 'ssm':
                return (
                    <SsmPackageProperties
                        mtPackage={mt3d.getPackage(type) as FlopyMt3dMtssm}
                        mfPackages={packages.mf}
                        onChange={handleChangePackage}
                        readOnly={readOnly}
                    />
                );
            default:
                return (
                    <MtPackageProperties
                        mtPackage={mt3d.getPackage('mt') as FlopyMt3dMt}
                        onChange={handleChangePackage}
                        readOnly={readOnly}
                    />
                );
        }
    };

    const renderSidebar = () => {
        const {type} = match.params;

        return (
            <Menu fluid={true} vertical={true} tabular={true}>
                {sideBar.map((item, key) => (
                    <Menu.Item
                        key={key}
                        name={item.name}
                        active={type === item.id}
                        onClick={handleMenuClick(item.id)}
                    />
                ))}
            </Menu>
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

export default Transport;
