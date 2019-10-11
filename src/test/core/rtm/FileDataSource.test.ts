import Uuid from 'uuid';
import FileDataSource from '../../../core/model/rtm/FileDataSource';

import {IFileDataSource} from '../../../core/model/rtm/Sensor.type';

test('Test FileDataSource, loading pre-loaded data', () => {
    const obj: IFileDataSource = {
        id: Uuid.v4(),
        filename: ''
    };

    const ds = new FileDataSource(obj);

    // @ts-ignore
    ds._props.data = [{timeStamp: 1, value: 1.2}];
    expect(ds.getData().then((data) => {
        expect(data).toEqual(ds.toObject().data);
    }));
});

test('Test FileDataSource, loading from http-resource', () => {
    const obj: IFileDataSource = {
        id: Uuid.v4(),
        filename: '4483fd26048475aec17476b8450ee9ee8851112c.json'
    };

    const ds = new FileDataSource(obj);
    expect(ds.getData().then((data) => {
        expect(data.length).toEqual(15305);
    }));
});

// async/await can be used.
test('Test FileDataSource from data', async () => {
    const data = {
        a: 123,
        b: 234,
        c: ['abc', 'def']
    };

    const ds = await FileDataSource.fromData(data);
    expect(ds).toBeInstanceOf(FileDataSource);
    expect(await ds.getData()).toEqual(data);
    expect(ds.filename).toEqual('365f22fd8f75257d0403e03a2da3ff49a91fbd9d.json');
});

// async/await can be used.
test('Test FileDataSource from filename', async () => {
    const filename = '365f22fd8f75257d0403e03a2da3ff49a91fbd9d.json';
    const ds = await FileDataSource.fromFilename(filename);
    expect(ds).toBeInstanceOf(FileDataSource);
    expect(await ds.getData()).toEqual({a: 123, b: 234, c: ['abc', 'def']});
});
