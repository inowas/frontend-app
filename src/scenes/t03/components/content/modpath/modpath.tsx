import React, {MouseEvent, useEffect, useState} from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';
import {Button, Grid, Menu, MenuItemProps, Segment} from 'semantic-ui-react';
import FlopyPackages from '../../../../../core/model/flopy/packages/FlopyPackages';
import FlopyModpath from '../../../../../core/model/flopy/packages/mp/FlopyModpath';
import FlopyModpathPackage from '../../../../../core/model/flopy/packages/mp/FlopyModpathPackage';
import {ModflowModel, Soilmodel} from '../../../../../core/model/modflow';
import {BoundaryCollection} from '../../../../../core/model/modflow/boundaries';
import {IPropertyValueObject} from '../../../../../core/model/types';
import {sendCommand} from '../../../../../services/api';
import ContentToolBar from '../../../../shared/ContentToolbar';
import {updatePackages} from '../../../actions/actions';
import ModflowModelCommand from '../../../commands/modflowModelCommand';
import {Mp7basPackageProperties, Mp7PackageProperties} from './index';

const baseUrl = '/tools/T03/';

interface IOwnProps {
    history: any;
    location: any;
    match: any;
}

interface IStateProps {
    boundaries: BoundaryCollection;
    model: ModflowModel;
    packages: FlopyPackages;
    soilmodel: Soilmodel;
}

interface IDispatchProps {
    updatePackages: (packages: FlopyPackages) => any;
}

enum NavigationItem {
    BAS = 'bas',
    SETUP = 'setup',
    PARTICLES = 'particles',
    RESULTS = 'results'
}

type Props = IStateProps & IDispatchProps & IOwnProps;

const isNavigationItem = (arg: any): arg is NavigationItem => {
    return true;
};

const modpath: React.FC<Props> = (props: Props) => {
    const {boundaries, match, model, packages, soilmodel} = props;
    const [activeItem, setActiveItem] = useState<NavigationItem>(NavigationItem.SETUP);
    const [isDirty, setIsDirty] = useState<boolean>(false);
    const [isError, setIsError] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [mp, setMp] = useState<IPropertyValueObject | null>(null);

    useEffect(() => {
        if (boundaries && model && packages && packages.mp && soilmodel) {
            const nMp: FlopyModpath = packages.mp;
            nMp.recalculate();

            setIsLoading(false);
            setMp(nMp.toObject());
        }
    }, [boundaries, model, packages, soilmodel]);

    useEffect(() => {
        const {type} = match.params || 'setup';
        setActiveItem(type);
    }, [match.params]);

    const handleChange = (cMp: FlopyModpath) => {
        packages.mp = cMp;
        return props.updatePackages(packages);
    };

    const handleChangePackage = (p: FlopyModpathPackage) => {
        if (mp) {
            const cMp = FlopyModpath.fromObject(mp);
            cMp.setPackage(p);
            setIsDirty(true);
            return setMp(cMp.toObject());
        }
    };

    const handleMenuClick = (event: MouseEvent<HTMLAnchorElement>, data: MenuItemProps) => {
        if (isNavigationItem(data.name)) {
            props.history.push(baseUrl + model.id + '/modpath/' + data.name);
        }
    };

    const handleSave = () => {
        if (mp) {
            const cPackages = props.packages;
            cPackages.modelId = props.model.id;
            cPackages.mp = FlopyModpath.fromObject(mp);

            setIsLoading(true);

            sendCommand(
                ModflowModelCommand.updateFlopyPackages(props.model.id, packages),
                () => {
                    props.updatePackages(packages);
                    setIsLoading(false);
                    setIsDirty(false);
                },
                () => setIsError(true)
            );
        }
    };

    const handleToggleEnabled = () => {
        const cMpPackage = FlopyPackages.fromObject(packages.toObject()).mp;
        cMpPackage.enabled = !cMpPackage.enabled;

        const cPackages = FlopyPackages.fromObject(packages.toObject());
        cPackages.mp = cMpPackage;

        props.updatePackages(cPackages);
        setIsDirty(true);
    };

    const renderProperties = () => {
        if (mp) {
            const modpathInstance = FlopyModpath.fromObject(mp);

            const {type} = props.match.params;

            switch (type) {
                case NavigationItem.BAS:
                    return (
                        <Mp7basPackageProperties
                            mpPackage={modpathInstance.getPackage('mp7bas')}
                            onChange={handleChangePackage}
                            readOnly={model.readOnly}
                        />
                    );
                default:
                    return (
                        <Mp7PackageProperties
                            mfPackage={modpathInstance.getPackage('mp7')}
                            readOnly={model.readOnly}
                        />
                    );
            }
        }
    };

    return (
        <Segment
            color={'grey'}
            loading={isLoading}
        >
            <Grid>
                <Grid.Row>
                    <Grid.Column width={4}>
                        <Menu
                            fluid={true}
                            vertical={true}
                            tabular={true}
                        >
                            <Menu.Item>
                                <Button
                                    negative={!packages.mp.enabled}
                                    positive={packages.mp.enabled}
                                    icon={packages.mp.enabled ? 'toggle on' : 'toggle off'}
                                    labelPosition="left"
                                    onClick={handleToggleEnabled}
                                    content={packages.mp.enabled ? 'Enabled' : 'Disabled'}
                                    style={{marginLeft: '-20px', width: '200px'}}
                                />
                            </Menu.Item>
                            <Menu.Item
                                name="setup"
                                active={activeItem === 'setup'}
                                onClick={handleMenuClick}
                                content="Setup"
                            />
                            <Menu.Item
                                name="bas"
                                active={activeItem === 'bas'}
                                onClick={handleMenuClick}
                                content="Basic package"
                            />
                            <Menu.Item
                                name="particles"
                                active={activeItem === 'particles'}
                                onClick={handleMenuClick}
                                content="Particles"
                            />
                            <Menu.Item
                                name="results"
                                active={activeItem === 'results'}
                                onClick={handleMenuClick}
                                content="Results"
                            />
                        </Menu>
                    </Grid.Column>
                    <Grid.Column width={12}>
                        <ContentToolBar
                            isDirty={isDirty}
                            isError={isError}
                            save={true}
                            onSave={handleSave}
                        />
                        {mp &&
                        renderProperties()
                        }
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </Segment>
    );
};

const mapDispatchToProps = (dispatch: any): IDispatchProps => ({
    updatePackages: (packages: FlopyPackages) => dispatch(updatePackages(packages))
});

const mapStateToProps = (state: any) => ({
    boundaries: BoundaryCollection.fromObject(state.T03.boundaries),
    model: ModflowModel.fromObject(state.T03.model),
    packages: FlopyPackages.fromObject(state.T03.packages.data),
    soilmodel: Soilmodel.fromObject(state.T03.soilmodel)
});

export default withRouter(connect<IStateProps, IDispatchProps, IOwnProps>(
    mapStateToProps,
    mapDispatchToProps)
(modpath));
