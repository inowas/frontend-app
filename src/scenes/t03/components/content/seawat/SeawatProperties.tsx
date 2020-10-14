import React, {useEffect, useRef, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useHistory, useRouteMatch} from 'react-router-dom';
import {Grid, Menu, Segment} from 'semantic-ui-react';
import FlopyPackages from '../../../../../core/model/flopy/packages/FlopyPackages';
import {
    FlopySeawat,
    FlopySeawatPackage,
    FlopySeawatSwtvdf,
    FlopySeawatSwtvsc
} from '../../../../../core/model/flopy/packages/swt';
import {IFlopySeawat} from '../../../../../core/model/flopy/packages/swt/FlopySeawat';
import FlopySeawatSwt from '../../../../../core/model/flopy/packages/swt/FlopySeawatSwt';
import {EMessageState, IMessage} from '../../../../../core/model/messages/Message.type';
import MessagesCollection from '../../../../../core/model/messages/MessagesCollection';
import {ModflowModel, Transport, VariableDensity} from '../../../../../core/model/modflow';
import {BoundaryCollection} from '../../../../../core/model/modflow/boundaries';
import {IRootReducer} from '../../../../../reducers';
import {sendCommand} from '../../../../../services/api';
import ContentToolBar from '../../../../shared/ContentToolbar2';
import {addMessage, removeMessage, updateMessage, updatePackages} from '../../../actions/actions';
import ModflowModelCommand from '../../../commands/modflowModelCommand';
import {messageDirty, messageError, messageSaving} from '../../../defaults/messages';
import {SeawatPackageProperties, VdfPackageProperties, VscPackageProperties} from './packages';

interface IProps {
    boundaries: BoundaryCollection;
    model: ModflowModel;
    packages: FlopyPackages;
    transport: Transport;
    variableDensity: VariableDensity;
}

const SeawatProperties = (props: IProps) => {
    const [swt, setSwt] = useState<IFlopySeawat>(props.packages.swt.toObject());

    const dispatch = useDispatch();
    const history = useHistory();
    const match = useRouteMatch();

    const T03 = useSelector((state: IRootReducer) => state.T03);
    const messages = MessagesCollection.fromObject(T03.messages);

    const swtRef = useRef<IFlopySeawat>();
    const editingState = useRef<{ [key: string]: IMessage | null }>({
        dirty: null,
        saving: null
    });

    useEffect(() => {
        return function cleanup() {
            handleSave();
        };
    }, []);

    useEffect(() => {
        editingState.current = messages.getEditingState('seawat');
    }, [messages]);

    useEffect(() => {
        if (swt) {
            swtRef.current = swt;
        }
    }, [swt]);

    const handleSave = () => {
        if (!editingState.current.dirty || !swtRef.current) {
            return null;
        }
        const packages = props.packages;
        packages.modelId = props.model.id;
        packages.swt = FlopySeawat.fromObject(swtRef.current);
        const message = messageSaving('seawat');
        dispatch(addMessage(message));
        sendCommand(
            ModflowModelCommand.updateFlopyPackages(props.model.id, packages),
            () => {
                if (editingState.current.dirty) {
                    dispatch(removeMessage(editingState.current.dirty));
                }
                dispatch(updatePackages(packages));
                return dispatch(updateMessage({...message, state: EMessageState.SUCCESS}));
            },
            (e) => dispatch(addMessage(messageError('seawat', e)))
        );
    };

    const handleUndo = () => {
        if (!editingState.current.dirty) {
            return null;
        }
        setSwt(props.packages.swt.toObject());
        dispatch(removeMessage(editingState.current.dirty));
    };

    const handleChangePackage = (p: FlopySeawatPackage<any>) => {
        let cSwt = FlopySeawat.fromObject(swt);
        cSwt = cSwt.setPackage(p);
        setSwt(cSwt.toObject());
        if (!editingState.current.dirty) {
            dispatch(addMessage(messageDirty('seawat')));
        }
    };

    const handleMenuClick = (type: string | undefined) => () => {
        const path = match.path;
        const basePath = path.split(':')[0];

        handleSave();

        if (!type) {
            return history.push(basePath + props.model.id + '/seawat');
        }

        return history.push(basePath + props.model.id + '/seawat/' + type);
    };

    const renderProperties = () => {
        const seawat = FlopySeawat.fromObject(swt);
        const readOnly = props.model.readOnly;
        const transport = props.transport;
        const {type} = match.params;

        switch (type) {
            case 'vdf':
                return (
                    <VdfPackageProperties
                        onChange={handleChangePackage}
                        readOnly={readOnly}
                        swtPackage={seawat.getPackage('vdf') as FlopySeawatSwtvdf}
                        transport={transport}
                    />
                );
            case 'vsc':
                return (
                    <VscPackageProperties
                        onChange={handleChangePackage}
                        readOnly={readOnly}
                        swtPackage={seawat.getPackage('vsc') as FlopySeawatSwtvsc}
                        transport={transport}
                    />
                );
            default:
                return (
                    <SeawatPackageProperties
                        swtPackage={seawat.getPackage('swt') as FlopySeawatSwt}
                    />
                );
        }
    };

    const renderSidebar = () => {
        const {type} = match.params;

        const sideBar = [
            {id: undefined, name: 'Overview (SEAWAT)', disabled: false},
            {id: 'vdf', name: 'Variable-density flow package', disabled: !props.variableDensity.vdfEnabled},
            {id: 'vsc', name: 'Viscosity package', disabled: !props.variableDensity.vscEnabled}
        ];

        return (
            <Menu fluid={true} vertical={true} tabular={true}>
                {sideBar.map((item, key) => (
                    <Menu.Item
                        key={key}
                        disabled={item.disabled}
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
                        <ContentToolBar buttonSave={true} onSave={handleSave} onUndo={handleUndo}/>
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

export default SeawatProperties;
