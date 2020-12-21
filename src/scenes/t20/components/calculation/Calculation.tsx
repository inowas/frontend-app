import {BoundaryCollection, ModflowModel, Stressperiods} from '../../../../core/model/modflow';
import {IRootReducer} from '../../../../reducers';
import {PackageActualizationWrapper} from '../../../modflow/components/content';
import {Segment} from 'semantic-ui-react';
import {appendBoundaryData} from '../appendBoundaryData';
import {startCalculation, updatePackages, updateRTModelling} from '../../actions/actions';
import {useDispatch, useSelector} from 'react-redux';
import RTModelling from '../../../../core/model/rtm/modelling/RTModelling';
import React, {useEffect} from 'react';

interface IProps {
    onChange: (rtm: RTModelling) => void;
}

const Calculation = (props: IProps) => {
    const dispatch = useDispatch();

    const T20 = useSelector((state: IRootReducer) => state.T20);
    const model = T20.model ? ModflowModel.fromObject(T20.model) : null;
    const boundaries = T20.boundaries ? BoundaryCollection.fromObject(T20.boundaries) : null;
    const rtm = T20.rtmodelling ? RTModelling.fromObject(T20.rtmodelling) : null;

    useEffect(() => {
        if (rtm && !rtm.results) {
            handleCalculate();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [rtm, model, boundaries])

    useEffect(() => {
        if (rtm && T20.calculation && T20.calculation.calculation_id
            && T20.calculation.calculation_id !== rtm.calculationId) {
            const cRtm = rtm.toObject();
            cRtm.data.calculation_id = T20.calculation.calculation_id;
            dispatch(updateRTModelling(RTModelling.fromObject(cRtm)));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [T20.calculation]);

    if (!rtm || !model || !boundaries) {
        return null;
    }

    const handleCalculate = () => {
        const results = appendBoundaryData(boundaries, model, rtm);

        if (!results || !results.stressperiods || !results.boundaries) {
            return null;
        }

        model.stressperiods = Stressperiods.fromObject(results.stressperiods);

        const cRtm = rtm.toObject();
        cRtm.data.results = {boundaries: results.boundaries, model: model.toObject()};
        props.onChange(RTModelling.fromObject(cRtm));
    };

    if (rtm && rtm.results) {
        return (
            <PackageActualizationWrapper
                boundaries={BoundaryCollection.fromObject(rtm.results.boundaries)}
                model={ModflowModel.fromObject(rtm.results.model)}
                property="calculation"
                reducer={T20}
                updatePackages={updatePackages}
                startCalculation={startCalculation}
            />
        );
    }

    return (
        <Segment color={'grey'} loading={true}>
        </Segment>
    );
};

export default Calculation;
