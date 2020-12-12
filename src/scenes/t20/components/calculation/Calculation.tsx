import {BoundaryCollection, ModflowModel} from '../../../../core/model/modflow';
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
    
    return (
        <Segment color={'grey'}>
            <Button
                onClick={() => appendBoundaryData(boundaries, model, rtm)}
            >
                <Icon name='line graph'/>
            </Button>
        </Segment>
    );
};

export default Calculation;
