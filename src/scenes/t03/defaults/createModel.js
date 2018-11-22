import uuid from 'uuid';

const createModelDefaults = {
    id: uuid(),
    name: 'New numerical groundwater model',
    description: 'Here you can say a bit more about the project',
    geometry: null,
    bounding_box: null,
    active_cells: null,
    grid_size: {
        n_x: 100,
        n_y: 100
    },
    length_unit: 2,
    time_unit: 4,
    public: true
};

export default createModelDefaults;