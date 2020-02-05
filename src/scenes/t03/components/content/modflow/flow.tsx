import React, {useEffect, useState} from 'react';
import {connect} from 'react-redux';
import {RouteComponentProps, withRouter} from 'react-router-dom';
import {Grid, Menu, Segment} from 'semantic-ui-react';
import FlopyPackages from '../../../../../core/model/flopy/packages/FlopyPackages';
import {
    FlopyModflowMfchd,
    FlopyModflowMfdis,
    FlopyModflowMffhb,
    FlopyModflowMfghb,
    FlopyModflowMfhob,
    FlopyModflowMfrch,
    FlopyModflowMfriv,
    FlopyModflowMfwel
} from '../../../../../core/model/flopy/packages/mf';
import FlopyModflow, {flowPackages, packagesMap} from '../../../../../core/model/flopy/packages/mf/FlopyModflow';
import {IFlopyModflow, IFlopyModflowPackage} from '../../../../../core/model/flopy/packages/mf/FlopyModflow.type';
import FlopyModflowPackage from '../../../../../core/model/flopy/packages/mf/FlopyModflowPackage';
import {ModflowModel, Soilmodel} from '../../../../../core/model/modflow';
import {BoundaryCollection} from '../../../../../core/model/modflow/boundaries';
import {sendCommand} from '../../../../../services/api';
import ContentToolBar from '../../../../shared/ContentToolbar';
import {updatePackages} from '../../../actions/actions';
import ModflowModelCommand from '../../../commands/modflowModelCommand';
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

interface IStateProps {
    boundaries: BoundaryCollection | null;
    model: ModflowModel | null;
    packages: FlopyPackages | null;
    soilmodel: Soilmodel | null;
}

interface IDispatchProps {
    updatePackages: (packages: FlopyPackages) => any;
}

type IProps = IStateProps & IDispatchProps & RouteComponentProps<{
    id: string;
    property?: string;
    type?: string;
}>;

const flow = (props: IProps) => {
    const [mf, setMf] = useState<IFlopyModflow | null>(
        props.packages ? props.packages.mf.toObject() : null
    );
    const [isDirty, setIsDirty] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        setIsLoading(true);
        return recalculate();
    }, []);

    useEffect(() => {
        if (!props.packages) {
            setIsLoading(true);
            return recalculate();
        }
        return setMf(props.packages.mf.toObject());
    }, [props.packages]);

    const recalculate = () => {
        const {boundaries, model, soilmodel, packages} = props;

        if (!boundaries || !model || !packages || !soilmodel) {
            return;
        }

        const cPackages = FlopyPackages.fromObject(packages.toObject());
        cPackages.mf.recalculate(model, soilmodel, boundaries);
        setIsLoading(false);
        return props.updatePackages(cPackages);
    };

    const handleSave = () => {
        if (!mf || !props.model || !props.packages) {
            return null;
        }
        const packages = props.packages;
        packages.modelId = props.model.id;
        packages.mf = FlopyModflow.fromObject(mf);
        setIsLoading(true);
        sendCommand(
            ModflowModelCommand.updateFlopyPackages(props.model.id, packages),
            () => {
                props.updatePackages(packages);
                setIsLoading(false);
                setIsDirty(false);
            }
        );
    };

    const handleClickEdit = (layerId: string, set: string, parameter: string) => {
        if (!props.model) {
            return null;
        }
        const path = props.match.path;
        const basePath = path.split(':')[0];
        return props.history.push(
            `${basePath}${props.model.id}/soilmodel/layers/${layerId}?type=${set}&param=${parameter}`
        );
    };

    const handleChangePackage = (p: FlopyModflowPackage<IFlopyModflowPackage>) => {
        if (!mf) {
            return null;
        }
        const cMf = FlopyModflow.fromObject(mf);
        cMf.setPackage(p);
        setMf(cMf.toObject());
        setIsDirty(true);
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
        setIsDirty(true);
        const packages = props.packages;
        packages.mf = mfPackages;
        props.updatePackages(packages);
    };

    const handleMenuClick = (type: string | undefined) => () => {
        if (!props.model) {
            return null;
        }
        const path = props.match.path;
        const basePath = path.split(':')[0];

        if (!type) {
            return props.history.push(basePath + props.model.id + '/modflow');
        }

        return props.history.push(basePath + props.model.id + '/modflow/' + type);
    };

    const renderProperties = () => {
        if (!mf || !props.model) {
            return null;
        }
        const iMf = FlopyModflow.fromObject(mf);

        const readOnly = props.model.readOnly;
        const {type} = props.match.params;

        if (type && !['flow', 'solver'].includes(type) && !iMf.getPackage(type)) {
            return <div>Package not found!</div>;
        }

        switch (type) {
            case 'bas':
                return (
                    <BasPackageProperties
                        mfPackage={iMf.getPackage(type)}
                        mfPackages={iMf}
                        onChange={handleChangePackage}
                        onClickEdit={handleClickEdit}
                        readonly={readOnly}
                        soilmodel={props.soilmodel}
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
                        mfPackage={iMf.getPackage(type)}
                        mfPackages={iMf}
                        onChange={handleChangePackage}
                        readonly={readOnly}
                    />
                );
            case 'evt':
                return (
                    <EvtPackageProperties
                        mfPackage={iMf.getPackage(type)}
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
                        mfPackage={iMf.getPackage(type)}
                        mfPackages={iMf}
                        onChange={handleChangePackage}
                        readonly={readOnly}
                    />
                );
            case 'oc':
                return (
                    <OcPackageProperties
                        mfPackage={iMf.getPackage(type)}
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
                        mfPackage={iMf.getPackage('mf')}
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
        const {type} = props.match.params;
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
                            <ContentToolBar isDirty={isDirty} isError={false} save={true} onSave={handleSave}/>
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

const mapStateToProps = (state: any) => ({
    boundaries: state.T03.boundaries ? BoundaryCollection.fromObject(state.T03.boundaries) : null,
    model: state.T03.model ? ModflowModel.fromObject(state.T03.model) : null,
    packages: state.T03.packages.data ? FlopyPackages.fromObject(state.T03.packages.data) : null,
    soilmodel: state.T03.soilmodel ? Soilmodel.fromObject(state.T03.soilmodel) : null,
});

const mapDispatchToProps = (dispatch: any): IDispatchProps => ({
    updatePackages: (p) => dispatch(updatePackages(p))
});

export default withRouter(connect<IStateProps, IDispatchProps>(mapStateToProps, mapDispatchToProps)(flow));
