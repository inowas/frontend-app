import {DATADROPPER_URL} from '../../../services/api';
import {dropData, retrieveData} from '../../../services/dataDropper';

const data = {abc: 123, xyz: 456};

test('Test if DropData works', async () => {
    const dropDataObj = await dropData(data);
    expect(dropDataObj).toEqual({
        filename: '6e651abf72935f9c39c1cd9aa6ab64d685635e75.json',
        server: DATADROPPER_URL
    });
});

test('Test if data can be retrieved', async () => {
    const dataDropperObj = {
        filename: '6e651abf72935f9c39c1cd9aa6ab64d685635e75.json',
        server: DATADROPPER_URL
    };

    expect(await retrieveData(dataDropperObj)).toEqual(data);
});
