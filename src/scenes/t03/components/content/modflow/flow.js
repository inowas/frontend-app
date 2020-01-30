import React from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';
import PropTypes from 'prop-types';

import {Grid, Menu, Segment} from 'semantic-ui-react';
import {ModflowModel, Soilmodel} from '../../../../../core/model/modflow';
import {BoundaryCollection} from '../../../../../core/model/modflow/boundaries';

import ContentToolBar from '../../../../shared/ContentToolbar';
import {updatePackages} from '../../../actions/actions';

import FlopyPackages from '../../../../../core/model/flopy/packages/FlopyPackages';

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
import {sendCommand} from '../../../../../services/api';
import ModflowModelCommand from '../../../commands/modflowModelCommand';
import FlopyModflowPackage from '../../../../../core/model/flopy/packages/mf/FlopyModflowPackage';
import FlopyModflow, {flowPackages, packagesMap} from '../../../../../core/model/flopy/packages/mf/FlopyModflow';

const sideBar = (boundaries) => ([
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

class Flow extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            mf: props.packages.mf ? props.packages.mf.toObject() : null,
            isError: false,
            isDirty: false,
            isLoading: true
        }
    }

    componentDidMount() {

        this.recalculate(this.props);
    }

    componentWillReceiveProps(nextProps) {
        if (!nextProps.packages) {
            return this.recalculate(nextProps);
        }
        return this.setState({
            mf: nextProps.packages.mf.toObject()
        })
    }

    recalculate(props) {
        const {boundaries, model, soilmodel} = props;

        if (!boundaries || !model || !soilmodel) {
            return;
        }

        const packages = FlopyPackages.fromObject(this.props.packages.toObject());
        packages.mf.recalculate(model, soilmodel, boundaries);
        this.setState({
            isLoading: false
        }, this.props.updatePackages(packages));
    }

    handleSave = () => {
        const packages = this.props.packages;
        packages.model_id = this.props.model.id;
        packages.mf = FlopyModflow.fromObject(this.state.mf);

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

    handleClickEdit = (layerId, set, parameter) => {
        const path = this.props.match.path;
        const basePath = path.split(':')[0];
        return this.props.history.push(
            `${basePath}${this.props.model.id}/soilmodel/layers/${layerId}?type=${set}&param=${parameter}`
        );
    };

    handleChangePackage = (p) => {
        if (p instanceof FlopyModflowPackage) {
            const mf = FlopyModflow.fromObject(this.state.mf);
            mf.setPackage(p);
            return this.setState({mf: mf.toObject(), isDirty: true});
        }

        throw new Error('Package has to be instance of FlopyModflowPackage');
    };

    handleChangeFlowPackageType = type => {

        if (flowPackages.indexOf(type) < 0) {
            throw Error('Type ' + type + 'is not a registered FlowPackage type')
        }

        const fp = packagesMap[type].create(this.props.soilmodel);

        const mfPackages = FlopyModflow.fromObject(this.state.mf);
        mfPackages.setPackage(fp);

        return this.setState({mf: mfPackages.toObject(), isDirty: true}, () => {
            const packages = this.props.packages;
            packages.mf = mfPackages;
            this.props.updatePackages(packages);
        });
    };

    onMenuClick = (type) => {
        const path = this.props.match.path;
        const basePath = path.split(':')[0];

        if (!type) {
            return this.props.history.push(basePath + this.props.model.id + '/modflow');
        }

        return this.props.history.push(basePath + this.props.model.id + '/modflow/' + type);
    };

    renderProperties() {

        const mf = FlopyModflow.fromObject(this.state.mf);

        const readOnly = this.props.model.readOnly;
        const {type} = this.props.match.params;

        switch (type) {
            case 'bas':
                return (
                    <BasPackageProperties
                        mfPackage={mf.getPackage(type)}
                        mfPackages={mf}
                        onChange={this.handleChangePackage}
                        onClickEdit={this.handleClickEdit}
                        readonly={readOnly}
                        soilmodel={this.props.soilmodel}
                    />
                );
            case 'chd':
                return (
                    <ChdPackageProperties
                        mfPackage={mf.getPackage(type)}
                        mfPackages={mf}
                        onChange={this.handleChangePackage}
                        readonly={readOnly}
                    />
                );
            case 'dis':
                return (
                    <DisPackageProperties
                        mfPackage={mf.getPackage(type)}
                        onChange={this.handleChangePackage}
                        readonly={readOnly}
                    />
                );
            case 'drn':
                return (
                    <DrnPackageProperties
                        mfPackage={mf.getPackage(type)}
                        mfPackages={mf}
                        onChange={this.handleChangePackage}
                        readonly={readOnly}
                    />
                );
            case 'evt':
                return (
                    <EvtPackageProperties
                        mfPackage={mf.getPackage(type)}
                        mfPackages={mf}
                        onChange={this.handleChangePackage}
                        readonly={readOnly}
                    />
                );
            case 'fhb':
                return (
                    <FhbPackageProperties
                        mfPackage={mf.getPackage(type)}
                        mfPackages={mf}
                        onChange={this.handleChangePackage}
                        readonly={readOnly}
                    />
                );
            case 'flow':
                return (
                    <FlowPackageProperties
                        mfPackages={mf}
                        onChange={this.handleChangePackage}
                        onChangeFlowPackageType={this.handleChangeFlowPackageType}
                        readonly={readOnly}
                    />
                );
            case 'ghb':
                return (
                    <GhbPackageProperties
                        mfPackage={mf.getPackage(type)}
                        mfPackages={mf}
                        onChange={this.handleChangePackage}
                        readonly={readOnly}
                    />
                );
            case 'hob':
                return (
                    <HobPackageProperties
                        mfPackage={mf.getPackage(type)}
                        mfPackages={mf}
                        onChange={this.handleChangePackage}
                        readonly={readOnly}
                    />
                );
            case 'mf':
                return (
                    <MfPackageProperties
                        mfPackage={mf.getPackage(type)}
                        mfPackages={mf}
                        onChange={this.handleChangePackage}
                        readonly={readOnly}
                    />
                );
            case 'oc':
                return (
                    <OcPackageProperties
                        mfPackage={mf.getPackage(type)}
                        mfPackages={mf}
                        onChange={this.handleChangePackage}
                        readonly={readOnly}
                    />
                );
            case 'rch':
                return (
                    <RchPackageProperties
                        mfPackage={mf.getPackage(type)}
                        mfPackages={mf}
                        onChange={this.handleChangePackage}
                        readonly={readOnly}
                    />
                );
            case 'riv':
                return (
                    <RivPackageProperties
                        mfPackage={mf.getPackage(type)}
                        mfPackages={mf}
                        onChange={this.handleChangePackage}
                        readonly={readOnly}
                    />
                );
            case 'solver':
                return (
                    <SolverPackageProperties
                        mfPackages={mf}
                        onChange={this.handleChangePackage}
                        readonly={readOnly}
                    />
                );
            case 'wel':
                return (
                    <WelPackageProperties
                        mfPackage={mf.getPackage(type)}
                        mfPackages={mf}
                        onChange={this.handleChangePackage}
                        readonly={readOnly}
                    />
                );

            default:
                return (
                    <MfPackageProperties
                        mfPackage={mf.getPackage('mf')}
                        mfPackages={mf}
                        onChange={this.handleChangePackage}
                        readonly={readOnly}
                    />
                );
        }
    }

    renderSidebar = () => {
        const {type} = this.props.match.params;
        return (
            <div>
                <Menu fluid vertical tabular>
                    {sideBar(this.props.boundaries).map((item, key) => {
                        if (item.enabled) {
                            return (
                                <Menu.Item
                                    key={key}
                                    name={item.name}
                                    active={type === item.id}
                                    onClick={() => this.onMenuClick(item.id)}
                                />
                            )
                        }
                        return null;
                    })}
                </Menu>
            </div>
        );
    };

    render() {
        const {isDirty, isError, isLoading, mf} = this.state;
        if (!mf || isLoading) {
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
    boundaries: state.T03.boundaries ? BoundaryCollection.fromObject(state.T03.boundaries) : null,
    model: state.T03.model ? ModflowModel.fromObject(state.T03.model) : null,
    packages: state.T03.packages.data ? FlopyPackages.fromObject(state.T03.packages.data) : null,
    soilmodel: state.T03.soilmodel ? Soilmodel.fromObject(state.T03.soilmodel) : null,
});

const mapDispatchToProps = {updatePackages};

Flow.propTypes = {
    boundaries: PropTypes.instanceOf(BoundaryCollection).isRequired,
    history: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    model: PropTypes.instanceOf(ModflowModel).isRequired,
    packages: PropTypes.instanceOf(FlopyPackages).isRequired,
    soilmodel: PropTypes.instanceOf(Soilmodel).isRequired,
    updatePackages: PropTypes.func.isRequired,
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Flow));
