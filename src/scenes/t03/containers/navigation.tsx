import React, {useEffect} from 'react';
import {connect, useDispatch, useSelector} from 'react-redux';
import {RouteComponentProps, withRouter} from 'react-router';
import {EMessageState} from '../../../core/model/messages/Message.type';
import {Calculation, ModflowModel, Transport, VariableDensity} from '../../../core/model/modflow';
import {IRootReducer} from '../../../reducers';
import {ToolNavigation} from '../../shared/complexTools';
import {removeMessage} from '../actions/actions';
import {CALCULATION_STATE_CALCULATION_FINISHED} from '../components/content/calculation/CalculationProgress';
import {IMenu, menuItems} from '../defaults/menuItems';

interface IStateProps {
    calculation: Calculation | null;
    model: ModflowModel;
    transport: Transport | null;
    variableDensity: VariableDensity | null;
}

type IProps = IStateProps & RouteComponentProps<any>;

const t03Navigation = (props: IProps) => {
    useEffect(() => {
        return;
    }, [props.match.params.property]);

    const dispatch = useDispatch();
    const T03 = useSelector((state: IRootReducer) => state.T03);
    const messages = T03.messages;

    useEffect(() => {
        messages.filter((m) => m.name === 'saving' && m.state === EMessageState.SUCCESS).forEach((m) => {
            setTimeout(() => {
                dispatch(removeMessage(m));
            }, 1000);
        });
    }, [messages]);

    const calculationState = props.calculation ? props.calculation.state : null;
    const calculationResults: string[] = props.calculation ? props.calculation.layer_values[0] : [];
    const totalTimes = props.calculation && props.calculation.times ? props.calculation.times.total_times : [];

    const mappedMenuItems: IMenu = menuItems.map((mi) => {
        mi.items = mi.items.map((i) => {
            const saving = messages.filter((m) => m.origin === i.property && m.name === 'saving');
            i.state = saving.length > 0 ? saving[0].state : undefined;

            if (i.property === 'mt3d') {
                i.disabled = props.transport ? !props.transport.enabled : true;
                return i;
            }

            if (i.property === 'seawat') {
                i.disabled = !props.transport || (props.transport && !props.transport.enabled) || !props.variableDensity
                    || (props.variableDensity && !props.variableDensity.vdfEnabled);
                return i;
            }

            if (i.property === 'soilmodel') {
                return i;
            }

            if (i.property === 'flow') {
                i.disabled = calculationState !== CALCULATION_STATE_CALCULATION_FINISHED ||
                    !calculationResults.includes('head') ||
                    totalTimes.length === 0;
                return i;
            }

            if (i.property === 'budget') {
                i.disabled = calculationState !== CALCULATION_STATE_CALCULATION_FINISHED ||
                    !calculationResults.includes('budget') ||
                    totalTimes.length === 0;
                return i;
            }

            if (i.property === 'concentration') {
                i.disabled = calculationState !== CALCULATION_STATE_CALCULATION_FINISHED ||
                    !calculationResults.includes('concentration') ||
                    totalTimes.length === 0;
                return i;
            }

            if (i.property === 'observations') {
                i.disabled = props.calculation ? props.calculation.files.filter(
                    (f) => f.endsWith('.hob.stat')
                ).length === 0 : true;
                return i;
            }

            return i;
        });

        return mi;
    });

    return (
        <ToolNavigation
            navigationItems={mappedMenuItems}
        />
    );
};

const mapStateToProps = (state: any) => {
    return ({
        calculation: state.T03.calculation ? Calculation.fromObject(state.T03.calculation) : null,
        model: ModflowModel.fromObject(state.T03.model),
        transport: state.T03.transport ? Transport.fromObject(state.T03.transport) : null,
        variableDensity: state.T03.variableDensity ? VariableDensity.fromObject(state.T03.variableDensity) : null
    });
};

export default withRouter(connect<IStateProps>(mapStateToProps)(t03Navigation));
