import {BoundaryCollection, ModflowModel, Stressperiods} from '../../../../core/model/modflow';
import {Button, Icon, Segment} from 'semantic-ui-react';
import {IRootReducer} from '../../../../reducers';
import {appendBoundaryData} from '../appendBoundaryData';
import {useSelector} from 'react-redux';
import RTModelling from '../../../../core/model/rtm/modelling/RTModelling';
import React from 'react';

const Calculation = () => {
    const T20 = useSelector((state: IRootReducer) => state.T20);
    const model = T20.model ? ModflowModel.fromObject(T20.model) : null;
    const boundaries = T20.boundaries ? BoundaryCollection.fromObject(T20.boundaries) : null;
    const rtm = T20.rtmodelling ? RTModelling.fromObject(T20.rtmodelling) : null;

    if (!rtm || !model || !boundaries) {
        return null;
    }

    const handleClickCalculate = () => {
        const results = appendBoundaryData(boundaries, model, rtm);

        if (!results || results.stressperiods || results.boundaries) {
            return null;
        }

        model.stressperiods = Stressperiods.fromObject(results.stressperiods);
    };

    return (
        <Segment color={'grey'}>
            <Button
                onClick={handleClickCalculate}
            >
                <Icon name='line graph'/>
            </Button>
        </Segment>
    );
};

export default Calculation;
