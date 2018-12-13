import React from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';
import PropTypes from 'prop-types';
import {sendCommand} from 'services/api';
import ModflowModelCommand from '../../../commands/modflowModelCommand';

import {Grid, Menu, Segment} from 'semantic-ui-react';
import {ModflowModel, Stressperiods} from 'core/model/modflow';
import {AbstractMt3dPackage, Mt3dms} from 'core/model/modflow/mt3d';
import {
    AdvPackageProperties,
    BtnPackageProperties,
    DspPackageProperties,
    GcgPackageProperties,
    MtPackageProperties,
    SsmPackageProperties
} from './mt';
import {fetchUrl} from "../../../../../services/api";

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
            mt3dms: this.props.model.mt3dms || Mt3dms.fromDefaults().toObject,
            isError: false,
            isDirty: false,
            isLoading: true,
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.model.mt3dms) {
            this.setState({
                mt3dms: nextProps.model.mt3dms
            });
        }
    }

    componentDidMount() {
        fetchUrl(
            `modflowmodels/${this.props.match.params.id}/boundaries`,
            boundaries => this.setState({
                boundaries,
                isLoading: false
            }),
            error => this.setState({error, isLoading: false})
        );
    }

    handleSave = () => {
        this.setState({loading: true});
        return sendCommand(
            ModflowModelCommand.updateMt3dms({
                id: this.props.model.id,
                input: this.state.mt3dms
            }), () => this.setState({
                isDirty: false,
                loading: false
            })
        );
    };

    handleChangePackage = (p) => {
        if (p instanceof AbstractMt3dPackage) {
            const newMt3dms = Mt3dms.fromObject(this.state.mt3dms);
            newMt3dms.addPackage(p);
            return this.setState({
                mt3dms: newMt3dms.toObject
            });
        }

        throw new Error('Package hat to be instance of AbstractMt3dPackage');
    };

    loadBoundaryDetails = (boundaryId) => {
        const {model, getBoundary} = this.props;
        return getBoundary(model.id, boundaryId);
    };

    handleToggleEnabled = () => {
        const changedMt3dms = Mt3dms.fromObject(this.state.mt3dms);
        changedMt3dms.toggleEnabled();
        return this.setState({
            mt3dms: changedMt3dms.toObject
        });
    };

    onMenuClick = (type) => {
        const path = this.props.match.path;
        const basePath = path.split(':')[0];

        this.props.history.push(basePath + this.props.model.id + '/transport/' + type);
    };

    renderProperties() {
        if (!this.state.mt3dms || !this.props.model) {
            return null;
        }

        const mt3d = Mt3dms.fromObject(this.state.mt3dms);

        const {model} = this.props;
        if (!model.stress_periods) {
            return null;
        }

        const stressPeriods = Stressperiods.fromObject(model.stress_periods);

        if (!model.boundaries) {
            return null;
        }

        const boundaries = model.boundaries;
        const readOnly = true;
        const {type} = this.props.params;

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
                        stressPeriods={stressPeriods}
                        onChange={this.handleChangePackage}
                        onSelectBoundary={this.loadBoundaryDetails}
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
        const {isLoading, mt3dms} = this.state;

        if (!mt3dms) {
            return null;
        }

        return (
            <div>
                <Segment color={'grey'} loading={isLoading}>
                    <Grid>
                        <Grid.Column width={4}>
                            {this.renderSidebar()}
                        </Grid.Column>
                        <Grid.Column width={12}>
                            {this.renderProperties()}
                        </Grid.Column>
                    </Grid>
                </Segment>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    model: ModflowModel.fromObject(state.T03.model)
});

Transport.proptypes = {
    history: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    model: PropTypes.instanceOf(ModflowModel).isRequired,
};

export default withRouter(connect(mapStateToProps)(Transport));
