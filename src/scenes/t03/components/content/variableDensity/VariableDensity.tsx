import * as React from 'react';
import {connect} from 'react-redux';
import {Checkbox, CheckboxProps, Form, Grid, Message, Segment} from 'semantic-ui-react';
import FlopyPackages from '../../../../../core/model/flopy/packages/FlopyPackages';
import {BoundaryCollection, ModflowModel} from '../../../../../core/model/modflow';
import {Transport} from '../../../../../core/model/modflow/transport';
import {VariableDensity} from '../../../../../core/model/modflow/variableDensity';
import {sendCommand} from '../../../../../services/api';
import ContentToolBar from '../../../../shared/ContentToolbar';
import Command from '../../../commands/modflowModelCommand';

interface IVariableDensityProps {
    model: ModflowModel;
    packages: FlopyPackages;
    readOnly: boolean;
    updateVariableDensity: (vd: VariableDensity) => any;
    variableDensity: VariableDensity;
    transport: Transport;
}

interface IVariableDensityState {
    isDirty: boolean;
    isError: boolean;
    isLoading: boolean;
}

class VariableDensityProperties extends React.Component<IVariableDensityProps, IVariableDensityState> {

    constructor(props: IVariableDensityProps) {
        super(props);
        this.state = {
            isDirty: false,
            isError: false,
            isLoading: false
        };
    }

    public onSave = () => {
        const {variableDensity} = this.props;
        this.setState({isLoading: true});
        return sendCommand(
            Command.updateVariableDensity({
                id: this.props.model.id,
                variableDensity: variableDensity.toObject(),
            }), () => {
                this.props.updateVariableDensity(variableDensity);
                this.setState({
                    isDirty: false,
                    isLoading: false
                });
            }
        );
    };

    public handleChange = (e: React.FormEvent<HTMLInputElement>, data: CheckboxProps) => {
        const variableDensity = this.props.variableDensity;
        variableDensity[data.name] = !variableDensity[data.name];
        this.props.updateVariableDensity(variableDensity);
        return this.setState({isDirty: true});
    };

    public render() {
        const {packages, readOnly, transport, variableDensity} = this.props;
        const {isDirty, isError, isLoading} = this.state;

        return (
            <Segment color={'grey'}>
                <Grid>
                    <Grid.Row>
                        <Grid.Column width={4}/>
                        <Grid.Column width={12}>
                            <div>
                                <ContentToolBar
                                    isDirty={isDirty}
                                    isError={isError}
                                    visible={!readOnly}
                                    save={true}
                                    onSave={this.onSave}
                                />
                                <Form style={{marginTop: '1rem'}}>
                                    <Form.Field>
                                        <label>Variable density flow (SEAWAT)</label>
                                        <Checkbox
                                            checked={variableDensity.vdfEnabled}
                                            onChange={this.handleChange}
                                            name="vdfEnabled"
                                            disabled={readOnly || !transport.enabled}
                                        />
                                    </Form.Field>
                                    {!transport.enabled &&
                                    <Message negative={true}>
                                        <Message.Header>Transport has to be active, to activate SEAWAT.</Message.Header>
                                        <p>Navigate to Model Setup > Transport, to enable Transport and add a
                                            substance.</p>
                                    </Message>
                                    }
                                    <Form.Field>
                                        <label>Viscosity</label>
                                        <Checkbox
                                            checked={variableDensity.vscEnabled}
                                            onChange={this.handleChange}
                                            name="vscEnabled"
                                            disabled={readOnly || !packages.mf.packages.lpf || !transport.enabled}
                                        />
                                    </Form.Field>
                                    {!packages.mf.packages.lpf &&
                                    <Message negative={true}>
                                        <Message.Header>LPF package has to be active, to activate
                                            viscosity.</Message.Header>
                                        <p>To change the package, navigate to Calculation > Mf packages > Flow
                                            packages.</p>
                                    </Message>
                                    }
                                </Form>
                            </div>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Segment>
        );
    }
}

const mapStateToProps = (state: any) => {
    return {
        model: ModflowModel.fromObject(state.T03.model),
        packages: FlopyPackages.fromObject(state.T03.packages),
        transport: Transport.fromObject(state.T03.transport),
        variableDensity: VariableDensity.fromObject(state.t03.variableDensity)
    };
};

export default connect(mapStateToProps)(VariableDensityProperties);
