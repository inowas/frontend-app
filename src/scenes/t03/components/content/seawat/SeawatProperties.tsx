import React, {useState} from 'react';
import {useDispatch} from 'react-redux';
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
import {ModflowModel, Transport, VariableDensity} from '../../../../../core/model/modflow';
import {BoundaryCollection} from '../../../../../core/model/modflow/boundaries';
import {sendCommand} from '../../../../../services/api';
import ContentToolBar from '../../../../shared/ContentToolbar';
import {updatePackages} from '../../../actions/actions';
import ModflowModelCommand from '../../../commands/modflowModelCommand';
import {SeawatPackageProperties, VdfPackageProperties, VscPackageProperties} from './packages';

const sideBar = [
    {id: undefined, name: 'Overview (SEAWAT)'},
    {id: 'vdf', name: 'Variable-density flow package'},
    {id: 'vsc', name: 'Viscosity package'}
];

interface IProps {
    boundaries: BoundaryCollection;
    model: ModflowModel;
    packages: FlopyPackages;
    transport: Transport;
    variableDensity: VariableDensity;
}

const seawatProperties = (props: IProps) => {

    const [swt, setSwt] = useState<IFlopySeawat>(props.packages.swt.toObject());
    const [isDirty, setIsDirty] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const dispatch = useDispatch();
    const history = useHistory();
    const match = useRouteMatch();

    const handleSave = () => {
        const packages = props.packages;
        packages.modelId = props.model.id;
        packages.swt = FlopySeawat.fromObject(swt);
        setIsLoading(true);
        sendCommand(
            ModflowModelCommand.updateFlopyPackages(props.model.id, packages),
            () => {
                dispatch(updatePackages(packages));
                setIsLoading(false);
                setIsDirty(false);
            }
        );
    };

    const handleChangePackage = (p: FlopySeawatPackage<any>) => {
        const cSwt = FlopySeawat.fromObject(swt);
        cSwt.setPackage(p);
        setIsDirty(true);
        setSwt(cSwt.toObject());
    };

    const handleMenuClick = (type: string | undefined) => () => {
        const path = match.path;
        const basePath = path.split(':')[0];

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
        <Segment color={'grey'} loading={isLoading}>
            <Grid>
                <Grid.Row>
                    <Grid.Column width={4}/>
                    <Grid.Column width={12}>
                        <ContentToolBar isDirty={isDirty} isError={false} buttonSave={true} onSave={handleSave}/>
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

export default seawatProperties;
