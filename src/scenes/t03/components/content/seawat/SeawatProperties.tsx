import React from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';
import {FlopyMt3d} from '../../../../../core/model/flopy/packages/mt';
import {FlopySeawat} from '../../../../../core/model/flopy/packages/swt';
import {sendCommand} from '../../../../../services/api';
import ModflowModelCommand from '../../../commands/modflowModelCommand';

import {Grid, Menu, Segment} from 'semantic-ui-react';
import FlopyPackages from '../../../../../core/model/flopy/packages/FlopyPackages';
import {ModflowModel, Transport, VariableDensity} from '../../../../../core/model/modflow';
import {BoundaryCollection} from '../../../../../core/model/modflow/boundaries';
import ContentToolBar from '../../../../shared/ContentToolbar';
import {updatePackages} from '../../../actions/actions';
import {SeawatPackageProperties, VdfPackageProperties, VscPackageProperties} from './packages';

interface ISeawatPropertiesProps {
    history: any;
    location: any;
    match: any;
    model: ModflowModel;
    boundaries: BoundaryCollection;
    packages: FlopyPackages;
    transport: Transport;
    variableDensity: VariableDensity;
    updatePackages: (packages: FlopyPackages) => any;
}

interface ISeawatPropertiesState {
    seawat: object;
    isError: boolean;
    isDirty: boolean;
    isLoading: boolean;
}

type packageTypes = 'vdf' | 'vsc' | undefined;

type sideBarItems = Array<{ id: packageTypes, name: string }>;

const sideBar: sideBarItems = [
    {id: undefined, name: 'Overview (SEAWAT)'},
    {id: 'vdf', name: 'Variable-density flow package'},
    {id: 'vsc', name: 'Viscosity package'}
];

class SeawatProperties extends React.Component<ISeawatPropertiesProps, ISeawatPropertiesState> {
    constructor(props: ISeawatPropertiesProps) {
        super(props);

        this.state = {
            seawat: {},
            isError: false,
            isDirty: false,
            isLoading: false,
        };
    }

    public componentDidMount() {
        const {variableDensity} = this.props;
        const packages = FlopyPackages.fromObject(this.props.packages.toObject());
        packages.swt.recalculate(variableDensity);
        this.props.updatePackages(packages);
    }

    public componentWillReceiveProps(nextProps: ISeawatPropertiesProps) {
        return this.setState({
            seawat: {}
        });
    }

    public handleSave = () => {
        const packages = this.props.packages;

        this.setState({isLoading: true}, () =>
            sendCommand(
                ModflowModelCommand.updateFlopyPackages(this.props.model.id, packages),
                () => {
                    this.props.updatePackages(packages);
                    return this.setState({isDirty: false, isLoading: false});
                }
            )
        );
    };

    public handleChangePackage = () => {
        return this.setState({
            seawat: {},
            isDirty: true
        });
    };

    public onMenuClick = (type: packageTypes) => () => {
        const path = this.props.match.path;
        const basePath = path.split(':')[0];

        if (!type) {
            return this.props.history.push(basePath + this.props.model.id + '/mt3d');
        }

        return this.props.history.push(basePath + this.props.model.id + '/mt3d/' + type);
    };

    public renderProperties() {
        if (!this.state.seawat || !this.props.model) {
            return null;
        }

        const seawat = FlopySeawat.fromObject(this.state.seawat);
        const {boundaries, packages} = this.props;

        const model = this.props.model.toObject();
        if (!model.stressperiods) {
            return null;
        }

        if (!boundaries) {
            return null;
        }

        const readOnly = this.props.model.readOnly;
        const {type} = this.props.match.params;

        switch (type) {
            case 'vdf':
                return (
                    <VdfPackageProperties
                        onChange={this.handleChangePackage}
                        readOnly={readOnly}
                        swtPackage={seawat.getPackage('vdf')}
                    />
                );
            case 'vsc':
                return (
                    <VscPackageProperties
                        onChange={this.handleChangePackage}
                        readOnly={readOnly}
                        swtPackage={seawat.getPackage('vsc')}
                    />
                );
            default:
                return (
                    <SeawatPackageProperties
                        onChange={this.handleChangePackage}
                        readOnly={readOnly}
                        swtPackage={seawat.getPackage('swt')}
                    />
                );
        }
    }

    public renderSidebar = () => {
        const {type} = this.props.match.params;

        return (
            <div>
                <Menu fluid={true} vertical={true} tabular={true}>
                    {sideBar.map((item, key) => (
                        <Menu.Item
                            key={key}
                            name={item.name}
                            active={type === item.id}
                            onClick={this.onMenuClick(item.id)}
                        />
                    ))}
                </Menu>
            </div>
        );
    };

    public render() {
        const {isDirty, isError, isLoading, seawat} = this.state;

        if (!seawat) {
            return null;
        }

        return (
            <div>
                <Segment color={'grey'} loading={isLoading}>
                    <Grid>
                        <Grid.Row>
                            <Grid.Column width={4}/>
                            <Grid.Column width={12}>
                                <ContentToolBar
                                    isDirty={isDirty}
                                    isError={isError}
                                    save={true}
                                    onSave={this.handleSave}
                                />
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row>
                            <Grid.Column width={4}>
                                {this.renderSidebar()}
                            </Grid.Column>
                            <Grid.Column width={12}>
                                {this.renderProperties()}
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Segment>
            </div>
        );
    }
}

const mapStateToProps = (state: any) => ({
    boundaries: BoundaryCollection.fromObject(state.T03.boundaries),
    model: ModflowModel.fromObject(state.T03.model),
    packages: FlopyPackages.fromObject(state.T03.packages),
    transport: Transport.fromObject(state.T03.transport),
    variableDensity: VariableDensity.fromObject(state.T03.variableDensity)
});

const mapDispatchToProps = {
    updatePackages
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(SeawatProperties));
