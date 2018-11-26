import uuid from 'uuid';
import {GridSize} from 'core/model/modflow';

const createModelDefaults = {
    id: uuid(),
    name: 'New numerical groundwater model',
    description: 'Here you can say a bit more about the project',
    gridSize: GridSize.fromNxNy(100, 100),
    lengthUnit: 2,
    timeUnit: 4,
    isPublic: true
};

export default createModelDefaults;
