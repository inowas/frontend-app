import Moment from  'moment';
import Uuid from 'uuid';
import {HeadObservation} from 'core/model/modflow/boundaries';

test('HeadObservation createWithStartDate', () => {
    const id = Uuid.v4();
    const name = 'NameOfHeadObservation';
    const geometry = {type: 'Point', coordinates: [[3, 4]]};
    const startDateTime = new Moment.utc('2015-01-02').toISOString();

    const headObservation = HeadObservation.createWithStartDate({
        id,
        name,
        geometry,
        utcIsoStartDateTime: startDateTime
    });

    expect(headObservation).toBeInstanceOf(HeadObservation);
    expect(headObservation.id).toEqual(id);
    expect(headObservation.name).toEqual(name);
    expect(headObservation.geometry).toEqual(geometry);
    expect(headObservation.affectedLayers).toEqual([0]);
    expect(headObservation.metadata).toEqual({});
    expect(headObservation.getDateTimeValues()).toEqual([{date_time: startDateTime, values: [0]}]);
    expect(headObservation.activeCells).toBeNull();
});
