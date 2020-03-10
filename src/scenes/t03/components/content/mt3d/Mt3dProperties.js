import React from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';
import PropTypes from 'prop-types';
import {sendCommand} from '../../../../../services/api';
import ModflowModelCommand from '../../../commands/modflowModelCommand';

import {Grid, Menu, Segment} from 'semantic-ui-react';
import {ModflowModel, Soilmodel, Stressperiods, Transport} from '../../../../../core/model/modflow';
import {BoundaryCollection} from '../../../../../core/model/modflow/boundaries';
import {FlopyMt3d} from '../../../../../core/model/flopy/packages/mt';
import {
    AdvPackageProperties,
    BtnPackageProperties,
    DspPackageProperties,
    GcgPackageProperties,
    MtPackageProperties,
    RctPackageProperties,
    SsmPackageProperties
} from './mt';
import ContentToolBar from '../../../../shared/ContentToolbar';
import {updatePackages} from '../../../actions/actions';
import FlopyPackages from '../../../../../core/model/flopy/packages/FlopyPackages';
import FlopyMt3dPackage from '../../../../../core/model/flopy/packages/mt/FlopyMt3dPackage';

const sideBar = [
    {id: undefined, name: 'Overview Transport'},
    {id: 'btn', name: 'Basic package'},
    {id: 'adv', name: 'Advection package'},
    {id: 'dsp', name: 'Dispersion package'},
    {id: 'rct', name: 'Reaction package'},
    {id: 'ssm', name: 'Source/Sink Package'},
    {id: 'gcg', name: 'Matrix solver package'}
];

class Mt3dProperties extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            mt: this.props.packages.mt.toObject(),
            isError: false,
            isDirty: false,
            isLoading: false,
        }
    }

    componentDidMount() {
        const packages = FlopyPackages.fromObject(this.props.packages.toObject());
        this.props.updatePackages(packages);
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            mt: nextProps.packages.mt.toObject()
        });
    }

    handleSave = () => {
        const packages = this.props.packages;
        packages.mt = FlopyMt3d.fromObject(this.state.mt);

        this.setState({loading: true}, () =>
            sendCommand(
                ModflowModelCommand.updateFlopyPackages(this.props.model.id, packages),
                () => {
                    this.props.updatePackages(packages);
                    return this.setState({isDirty: false, loading: false});
                }
            )
        );
    };

    handleChangePackage = (p) => {
        if (p instanceof FlopyMt3dPackage) {
            const mt = FlopyMt3d.fromObject(this.state.mt);
            mt.setPackage(p);
            return this.setState({
                mt: mt.toObject(),
                isDirty: true
            });
        }

        throw new Error('Package has to be instance of FlopyMt3dPackage');
    };

    onMenuClick = (type) => {
        const path = this.props.match.path;
        const basePath = path.split(':')[0];

        if (!type) {
            return this.props.history.push(basePath + this.props.model.id + '/mt3d');
        }

        return this.props.history.push(basePath + this.props.model.id + '/mt3d/' + type);
    };

    renderProperties() {
        if (!this.state.mt || !this.props.model) {
            return null;
        }

        const mt3d = FlopyMt3d.fromObject(this.state.mt);
        const {boundaries, packages} = this.props;

        if (!(this.props.model.stressperiods instanceof Stressperiods)) {
            return null;
        }

        if (!boundaries) {
            return null;
        }

        const readOnly = this.props.model.readOnly;
        const {type} = this.props.match.params;

        switch (type) {
            case 'adv':
                return (
                    <AdvPackageProperties
                        mtPackage={mt3d.getPackage(type)}
                        onChange={this.handleChangePackage}
                        readOnly={readOnly}
                    />
                );
            case 'btn':
                return (
                    <BtnPackageProperties
                        mtPackage={mt3d.getPackage(type)}
                        onChange={this.handleChangePackage}
                        readOnly={readOnly}
                    />
                );
            case 'dsp':
                return (
                    <DspPackageProperties
                        mtPackage={mt3d.getPackage(type)}
                        onChange={this.handleChangePackage}
                        readOnly={readOnly}
                    />
                );
            case 'gcg':
                return (
                    <GcgPackageProperties
                        mtPackage={mt3d.getPackage(type)}
                        onChange={this.handleChangePackage}
                        readOnly={readOnly}
                    />
                );
            case 'rct':
                return (
                    <RctPackageProperties
                        mtPackage={mt3d.getPackage(type)}
                        onChange={this.handleChangePackage}
                        readOnly={readOnly}
                    />
                );
            case 'ssm':
                return (
                    <SsmPackageProperties
                        mtPackage={mt3d.getPackage(type)}
                        mfPackages={packages.mf}
                        onChange={this.handleChangePackage}
                        readOnly={readOnly}
                    />
                );
            default:
                return (
                    <MtPackageProperties
                        mtPackage={mt3d.getPackage('mt')}
                        onChange={this.handleChangePackage}
                        readOnly={readOnly}
                    />
                );
        }
    }

    renderSidebar = () => {
        const {type} = this.props.match.params;

        return (
            <div>
                <Menu fluid vertical tabular>
                    {sideBar.map((item, key) => (
                        <Menu.Item
                            key={key}
                            name={item.name}
                            active={type === item.id}
                            onClick={() => this.onMenuClick(item.id)}
                        />
                    ))}
                </Menu>
            </div>
        );
    };

    render() {
        const {isDirty, isError, isLoading, mt} = this.state;

        if (!mt) {
            return null;
        }

        return (
            <div>
                <Segment color={'grey'} loading={isLoading}>
                    <Grid>
                        <Grid.Row>
                            <Grid.Column width={4}/>
                            <Grid.Column width={12}>
                                <ContentToolBar isDirty={isDirty} isError={isError} save onSave={this.handleSave}/>
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

const mapStateToProps = (state) => ({
    boundaries: BoundaryCollection.fromObject(state.T03.boundaries),
    model: ModflowModel.fromObject(state.T03.model),
    packages: FlopyPackages.fromObject(state.T03.packages.data),
    soilmodel: Soilmodel.fromObject(state.T03.soilmodel),
    transport: Transport.fromObject(state.T03.transport),
});

const mapDispatchToProps = {
    updatePackages
};

Mt3dProperties.propTypes = {
    history: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    model: PropTypes.instanceOf(ModflowModel).isRequired,
    boundaries: PropTypes.instanceOf(BoundaryCollection).isRequired,
    packages: PropTypes.instanceOf(FlopyPackages).isRequired,
    transport: PropTypes.instanceOf(Transport).isRequired,
    updatePackages: PropTypes.func.isRequired
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Mt3dProperties));
