import Moment from  'moment';
import Uuid from 'uuid';

import {RechargeBoundary} from 'core/model/modflow/boundaries';

test('RchBoundary createWithStartDate', () => {
    const id = Uuid.v4();
    const name = 'NameOfBoundary';
    const geometry = {type: 'Polygon', coordinates: [[0, 0], [0, 10], [10, 10], [10, 0], [0, 0]]};
    const utcIsoStartDateTime = new Moment.utc('2015-01-02').toISOString();

    const boundary = RechargeBoundary.createWithStartDate({
        id,
        name,
        geometry,
        utcIsoStartDateTime
    });

    expect(boundary).toBeInstanceOf(RechargeBoundary);
    expect(boundary.id).toEqual(id);
    expect(boundary.name).toEqual(name);
    expect(boundary.geometry).toEqual(geometry);
    expect(boundary.affectedLayers).toEqual([0]);
    expect(boundary.metadata).toEqual({});
    expect(boundary.getDateTimeValues()).toEqual([{date_time: utcIsoStartDateTime, values: [0]}]);
    expect(boundary.activeCells).toBeNull();
});
