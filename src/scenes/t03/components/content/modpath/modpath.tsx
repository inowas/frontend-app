import React, {MouseEvent, useEffect, useState} from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';
import {Button, Grid, Menu, MenuItemProps, Segment} from 'semantic-ui-react';
import FlopyPackages from '../../../../../core/model/flopy/packages/FlopyPackages';
import FlopyModpath from '../../../../../core/model/flopy/packages/modpath/FlopyModpath';
import FlopyModpathPackage from '../../../../../core/model/flopy/packages/modpath/FlopyModpathPackage';
import {ModflowModel, Soilmodel} from '../../../../../core/model/modflow';
import {BoundaryCollection} from '../../../../../core/model/modflow/boundaries';
import ContentToolBar from '../../../../shared/ContentToolbar';
import {updatePackages} from '../../../actions/actions';
import {ModpathSetup} from './index';

const baseUrl = '/tools/T03/';

interface IOwnProps {
    history: any;
    location: any;
    match: any;
    readOnly: boolean;
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

type NavigationItem = 'setup' | 'particles' | 'results';

type Props = IStateProps & IDispatchProps & IOwnProps;

const isNavigationItem = (arg: any): arg is NavigationItem => {
    return arg;
};

const modpath: React.FC<Props> = (props: Props) => {
    const {boundaries, match, model, packages, readOnly, soilmodel} = props;
    const [activeItem, setActiveItem] = useState<NavigationItem>('setup');
    const [isDirty, setIsDirty] = useState<boolean>(false);
    const [isError, setIsError] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [mp, setMp] = useState<FlopyModpathPackage | null>(null);

    useEffect(() => {
        if (boundaries && model && packages && packages.modpath && soilmodel) {
            setIsLoading(false);
            setMp(packages.modpath.toObject());
        }
    }, [boundaries, model, packages, soilmodel]);

    useEffect(() => {
        const {type} = match.params || 'setup';
        setActiveItem(type);
    }, [match.params]);

    const handleMenuClick = (event: MouseEvent<HTMLAnchorElement>, data: MenuItemProps) => {
        if (isNavigationItem(data.name)) {
            props.history.push(baseUrl + model.id + '/modpath/' + data.name);
        }
    };

    const handleSave = () => {
        setIsDirty(false);
    };

    const handleToggleEnabled = () => {
        const cMpPackage = FlopyPackages.fromObject(packages.toObject()).modpath;
        cMpPackage.enabled = !cMpPackage.enabled;

        const cPackages = FlopyPackages.fromObject(packages.toObject());
        cPackages.modpath = cMpPackage;

        props.updatePackages(cPackages);
    };

    const renderProperties = () => {
        if (mp) {
            const modpathInstance = FlopyModpath.fromObject(mp);

            const {type} = props.match.params;

            switch (type) {
                default:
                    return (
                        <ModpathSetup
                            mfPackage={modpathInstance.getPackage('mp7')}
                            readOnly={readOnly}
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
                                    negative={!packages.modpath.enabled}
                                    positive={packages.modpath.enabled}
                                    icon={packages.modpath.enabled ? 'toggle on' : 'toggle off'}
                                    labelPosition="left"
                                    onClick={handleToggleEnabled}
                                    content={packages.modpath.enabled ? 'Enabled' : 'Disabled'}
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
    packages: FlopyPackages.fromObject(state.T03.packages),
    soilmodel: Soilmodel.fromObject(state.T03.soilmodel)
});

export default withRouter(connect<IStateProps, IDispatchProps, IOwnProps>(
    mapStateToProps,
    mapDispatchToProps)
(modpath));
