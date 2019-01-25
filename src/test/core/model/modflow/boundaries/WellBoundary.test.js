import Moment from  'moment';
import Uuid from 'uuid';
import {WellBoundary} from 'core/model/modflow/boundaries';

test('WellBoundary createWithStartDate', () => {
    const id = Uuid.v4();
    const name = 'NameOfWell';
    const geometry = {type: 'Point', coordinates: [[3, 4]]};
    const startDateTime = new Moment.utc('2015-01-02').toISOString();

    const wellBoundary = WellBoundary.createWithStartDate({
        id,
        name,
        geometry,
        utcIsoStartDateTime: startDateTime
    });

    expect(wellBoundary).toBeInstanceOf(WellBoundary);
    expect(wellBoundary.id).toEqual(id);
    expect(wellBoundary.name).toEqual(name);
    expect(wellBoundary.geometry).toEqual(geometry);
    expect(wellBoundary.affectedLayers).toEqual([0]);
    expect(wellBoundary.metadata).toEqual({well_type: 'puw'});
    expect(wellBoundary.getDateTimeValues()).toEqual([{date_time: startDateTime, values: [0]}]);
    expect(wellBoundary.activeCells).toBeNull();
});
