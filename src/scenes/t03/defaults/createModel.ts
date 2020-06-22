import uuid from 'uuid';
import {GridSize, Stressperiods, TimeUnit} from '../../../core/model/modflow';

const createModelDefaults = {
    id: uuid(),
    name: 'New numerical groundwater model',
    description: 'Here you can say a bit more about the project',
    gridSize: GridSize.fromNxNy(100, 100),
    lengthUnit: 2,
    timeUnit: 4,
    intersection: 0,
    rotation: 0,
    isPublic: true,
    stressperiods: Stressperiods.fromObject({
        start_date_time: '2000-01-01T00:00:00.000Z',
        end_date_time: '2019-12-31T00:00:00.000Z',
        time_unit: TimeUnit.days().toInt(),
        stressperiods: [{
            start_date_time: '2000-01-01T00:00:00.000Z',
            nstp: 1,
            tsmult: 1,
            steady: true
        }]
    })
};

export default createModelDefaults;
