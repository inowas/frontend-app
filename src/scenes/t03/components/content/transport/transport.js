import React from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';
import PropTypes from 'prop-types';
import {sendCommand} from 'services/api';
import ModflowModelCommand from '../../../commands/modflowModelCommand';

import {Grid, Menu, Segment} from 'semantic-ui-react';
import {ModflowModel, Stressperiods} from 'core/model/modflow';
import {BoundaryCollection} from 'core/model/modflow/boundaries';
import {AbstractMt3dPackage, Mt3dms} from 'core/model/flopy/packages/mt';
import {
    AdvPackageProperties,
    BtnPackageProperties,
    DspPackageProperties,
    GcgPackageProperties,
    MtPackageProperties,
    SsmPackageProperties
} from './mt';
import ContentToolBar from '../../../../shared/ContentToolbar';
import {updatePackages} from '../../../actions/actions';
import FlopyPackages from 'core/model/flopy/packages/FlopyPackages';

const sideBar = [
    {
        id: undefined,
        name: 'Overview (MT-Package)'
    },
    {
        id: 'btn',
        name: 'Basic transport package'
    },
    {
        id: 'adv',
        name: 'Advection package'
    },
    {
        id: 'dsp',
        name: 'Dispersion package'
    },
    {
        id: 'ssm',
        name: 'Source/Sink Package'
    },
    {
        id: 'gcg',
        name: 'Matrix solver package'
    }
];

class Transport extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            mt3dms: this.props.packages.mt.toObject(),
            isError: false,
            isDirty: false,
            isLoading: false,
        }
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            mt3dms: nextProps.packages.mt.toObject()
        });
    }

    handleSave = () => {
        const mt3dms = Mt3dms.fromObject(this.state.mt3dms);
        const packages = FlopyPackages.fromObject(this.props.packages.toObject());
        packages.mt = mt3dms;

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
        if (p instanceof AbstractMt3dPackage) {
            const newMt3dms = Mt3dms.fromObject(this.state.mt3dms);
            newMt3dms.addPackage(p);
            return this.setState({
                mt3dms: newMt3dms.toObject(),
                isDirty: true
            });
        }

        throw new Error('Package has to be instance of AbstractMt3dPackage');
    };

    handleToggleEnabled = () => {
        const changedMt3dms = Mt3dms.fromObject(this.state.mt3dms);
        changedMt3dms.toggleEnabled();
        return this.setState({
            isDirty: true,
            mt3dms: changedMt3dms.toObject()
        });
    };

    onMenuClick = (type) => {
        const path = this.props.match.path;
        const basePath = path.split(':')[0];

        if (!type) {
            return this.props.history.push(basePath + this.props.model.id + '/transport');
        }

        return this.props.history.push(basePath + this.props.model.id + '/transport/' + type);
    };

    renderProperties() {
        if (!this.state.mt3dms || !this.props.model) {
            return null;
        }

        const mt3d = Mt3dms.fromObject(this.state.mt3dms);
        const {boundaries} = this.props;

        const model = this.props.model.toObject();
        if (!model.stressperiods) {
            return null;
        }

        const stressperiods = Stressperiods.fromObject(model.stressperiods);

        if (!boundaries) {
            return null;
        }

        // TODO:
        const readOnly = this.props.model.readOnly;
        const {type} = this.props.match.params;

        switch (type) {
            case 'adv':
                return (
                    <AdvPackageProperties
                        mtPackage={mt3d.getPackage(type)}
                        onChange={this.handleChangePackage}
                        readonly={readOnly}
                    />
                );
            case 'btn':
                return (
                    <BtnPackageProperties
                        mtPackage={mt3d.getPackage(type)}
                        onChange={this.handleChangePackage}
                        readonly={readOnly}
                    />
                );
            case 'dsp':
                return (
                    <DspPackageProperties
                        mtPackage={mt3d.getPackage(type)}
                        onChange={this.handleChangePackage}
                        readonly={readOnly}
                    />
                );
            case 'gcg':
                return (
                    <GcgPackageProperties
                        mtPackage={mt3d.getPackage(type)}
                        onChange={this.handleChangePackage}
                        readonly={readOnly}
                    />
                );
            case 'ssm':
                return (
                    <SsmPackageProperties
                        mtPackage={mt3d.getPackage(type)}
                        boundaries={boundaries}
                        stressperiods={stressperiods}
                        onChange={this.handleChangePackage}
                        readonly={readOnly}
                    />
                );
            default:
                return (
                    <MtPackageProperties
                        mtPackage={mt3d.getPackage('mt')}
                        onChange={this.handleChangePackage}
                        enabled={mt3d.enabled}
                        toggleEnabled={this.handleToggleEnabled}
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
        const {isDirty, isError, isLoading, mt3dms} = this.state;

        if (!mt3dms) {
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
    packages: FlopyPackages.fromObject(state.T03.packages),
});

const mapDispatchToProps = {
    updatePackages
};

Transport.proptypes = {
    history: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    model: PropTypes.instanceOf(ModflowModel).isRequired,
    boundaries: PropTypes.instanceOf(BoundaryCollection).isRequired,
    packages: PropTypes.instanceOf(FlopyPackages).isRequired,
    updatePackages: PropTypes.func.isRequired
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Transport));
