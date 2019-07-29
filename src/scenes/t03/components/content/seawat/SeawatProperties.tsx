import React from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';
import {FlopySeawat, FlopySeawatPackage} from '../../../../../core/model/flopy/packages/swt';
import {sendCommand} from '../../../../../services/api';
import ModflowModelCommand from '../../../commands/modflowModelCommand';

import {Grid, Menu, Segment} from 'semantic-ui-react';
import FlopyPackages from '../../../../../core/model/flopy/packages/FlopyPackages';
import {ModflowModel, Transport, VariableDensity} from '../../../../../core/model/modflow';
import {BoundaryCollection} from '../../../../../core/model/modflow/boundaries';
import ContentToolBar from '../../../../shared/ContentToolbar';
import {updatePackages} from '../../../actions/actions';
import {SeawatPackageProperties, VdfPackageProperties, VscPackageProperties} from './packages';

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
    transport: Transport;
    variableDensity: VariableDensity;
}

interface IDispatchProps {
    updatePackages: (packages: FlopyPackages) => any;
}

type Props = IStateProps & IDispatchProps & IOwnProps;

interface ISeawatPropertiesState {
    swt: object;
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

class SeawatProperties extends React.Component<Props, ISeawatPropertiesState> {
    constructor(props: Props) {
        super(props);

        this.state = {
            swt: this.props.packages.swt.toObject(),
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

    public componentWillReceiveProps(nextProps: Props) {
        return this.setState({
            swt: nextProps.packages.swt.toObject()
        });
    }

    public handleSave = () => {
        const packages = this.props.packages;
        packages.swt = FlopySeawat.fromObject(this.state.swt);

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

    public handleChangePackage = (p: FlopySeawatPackage | { [index: string]: any }) => {
        const swt = FlopySeawat.fromObject(this.state.swt);
        swt.setPackage(p);

        return this.setState({
            swt: swt.toObject(),
            isDirty: true
        });
    };

    public onMenuClick = (type: packageTypes) => () => {
        const path = this.props.match.path;
        const basePath = path.split(':')[0];

        if (!type) {
            return this.props.history.push(basePath + this.props.model.id + '/seawat');
        }

        return this.props.history.push(basePath + this.props.model.id + '/seawat/' + type);
    };

    public renderProperties() {
        if (!this.state.swt || !this.props.model || !this.props.transport) {
            return null;
        }

        const seawat = FlopySeawat.fromObject(this.state.swt);
        const readOnly = this.props.model.readOnly || false;
        const {type} = this.props.match.params;

        switch (type) {
            case 'vdf':
                return (
                    <VdfPackageProperties
                        onChange={this.handleChangePackage}
                        readOnly={readOnly}
                        swtPackage={seawat.getPackage('vdf')}
                        transport={this.props.transport}
                    />
                );
            case 'vsc':
                return (
                    <VscPackageProperties
                        onChange={this.handleChangePackage}
                        readOnly={readOnly}
                        swtPackage={seawat.getPackage('vsc')}
                        transport={this.props.transport}
                    />
                );
            default:
                return (
                    <SeawatPackageProperties
                        onChange={this.handleChangePackage}
                        readOnly={readOnly}
                        swtPackage={seawat.getPackage('swt')}
                        transport={this.props.transport}
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
                            disabled={item.id === 'vsc' && !this.props.variableDensity.vscEnabled}
                            active={type === item.id}
                            onClick={this.onMenuClick(item.id)}
                        />
                    ))}
                </Menu>
            </div>
        );
    };

    public render() {
        const {isDirty, isError, isLoading, swt} = this.state;

        if (!swt) {
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

const mapDispatchToProps = (dispatch: any): IDispatchProps => ({
    updatePackages: (packages: FlopyPackages) => dispatch(updatePackages(packages))
});

export default withRouter(connect<IStateProps, IDispatchProps, IOwnProps>(
    mapStateToProps,
    mapDispatchToProps)
(SeawatProperties));
