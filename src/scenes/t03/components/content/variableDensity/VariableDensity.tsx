import * as React from 'react';
import {useEffect, useState} from 'react';
import {connect} from 'react-redux';
import {Button, Checkbox, CheckboxProps, Form, Grid, Menu, Message, Segment} from 'semantic-ui-react';
import FlopyPackages from '../../../../../core/model/flopy/packages/FlopyPackages';
import {ModflowModel, Transport, VariableDensity} from '../../../../../core/model/modflow';
import {sendCommand} from '../../../../../services/api';
import ContentToolBar from '../../../../shared/ContentToolbar';
import {updatePackages, updateVariableDensity} from '../../../actions/actions';
import Command from '../../../commands/modflowModelCommand';

interface IOwnProps {
    readOnly: boolean;
}

interface IStateProps {
    model: ModflowModel;
    packages: FlopyPackages;
    transport: Transport;
    variableDensity: VariableDensity;
}

interface IDispatchProps {
    updatePackages: (packages: FlopyPackages) => any;
    updateVariableDensity: (variableDensity: VariableDensity) => any;
}

type IProps = IStateProps & IDispatchProps & IOwnProps;

const variableDensityProperties = (props: IProps) => {
    const [isDirty, setIsDirty] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        const {variableDensity} = props;
        const packages = FlopyPackages.fromObject(props.packages.toObject());
        packages.swt.recalculate(variableDensity);
        props.updatePackages(packages);
    }, []);

    const handleSave = () => {
        const {packages, variableDensity} = props;
        setIsLoading(true);
        return sendCommand(
            Command.updateVariableDensity({
                id: props.model.id,
                variableDensity: variableDensity.toObject(),
            }), () => {
                props.updateVariableDensity(variableDensity);
                setIsDirty(false);
                setIsLoading(false);

                const swt = packages.swt;
                swt.recalculate(variableDensity);
                packages.swt = swt;

                props.updatePackages(packages);
                sendCommand(Command.updateFlopyPackages(props.model.id, packages));
            }
        );
    };

    const handleChangeViscosity = (e: React.FormEvent<HTMLInputElement>, {name}: CheckboxProps) => {
        const variableDensityObj = props.variableDensity.toObject();

        if (name) {
            const variableDensity = VariableDensity.fromObject({
                ...variableDensityObj,
                vscEnabled: !variableDensityObj.vscEnabled
            });
            props.updateVariableDensity(variableDensity);
            setIsDirty(true);
        }
    };

    const handleToggleEnabled = () => {
        const variableDensity = props.variableDensity;
        variableDensity.vdfEnabled = !variableDensity.vdfEnabled;
        props.updateVariableDensity(variableDensity);
        setIsDirty(true);
    };

    return (
        <Segment color={'grey'} loading={isLoading}>
            <Grid>
                <Grid.Row>
                    <Grid.Column width={4}>
                        <Menu fluid={true} vertical={true} tabular={true}>
                            <Menu.Item>
                                <Button
                                    disabled={props.model.readOnly || !props.transport.enabled}
                                    negative={!props.variableDensity.vdfEnabled}
                                    positive={props.variableDensity.vdfEnabled}
                                    icon={props.variableDensity.vdfEnabled ? 'toggle on' : 'toggle off'}
                                    labelPosition="left"
                                    onClick={handleToggleEnabled}
                                    content={props.variableDensity.vdfEnabled ? 'Enabled' : 'Disabled'}
                                    style={{marginLeft: '-20px', width: '200px'}}
                                />
                            </Menu.Item>
                        </Menu>
                    </Grid.Column>
                    <Grid.Column width={12}>
                        <div>
                            <ContentToolBar
                                isDirty={isDirty}
                                isError={false}
                                visible={!props.model.readOnly}
                                save={true}
                                onSave={handleSave}
                            />
                            <Form style={{marginTop: '1rem'}}>
                                {!props.transport.enabled &&
                                <Message negative={true}>
                                    <Message.Header>Transport has to be active, to activate SEAWAT.</Message.Header>
                                    <p>Navigate to Model Setup > Transport, to enable Transport and add a
                                        substance.</p>
                                </Message>
                                }
                                <Form.Field>
                                    <label>Viscosity</label>
                                    <Checkbox
                                        checked={props.variableDensity.vscEnabled}
                                        onChange={handleChangeViscosity}
                                        name="vscEnabled"
                                        disabled={props.model.readOnly || !props.packages.mf.hasPackage('lpf') ||
                                        !props.transport.enabled || !props.variableDensity.vdfEnabled}
                                    />
                                </Form.Field>
                                {!props.packages.mf.hasPackage('lpf') &&
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
};

const mapDispatchToProps = (dispatch: any): IDispatchProps => ({
    updatePackages: (packages: FlopyPackages) => dispatch(updatePackages(packages)),
    updateVariableDensity: (variableDensity: VariableDensity) => dispatch(updateVariableDensity(variableDensity)),
});

const mapStateToProps = (state: any) => ({
    model: ModflowModel.fromObject(state.T03.model),
    packages: FlopyPackages.fromObject(state.T03.packages),
    transport: Transport.fromObject(state.T03.transport),
    variableDensity: VariableDensity.fromObject(state.T03.variableDensity)
});

export default connect<IStateProps, IDispatchProps, IOwnProps>(
    mapStateToProps,
    mapDispatchToProps)
(variableDensityProperties);
