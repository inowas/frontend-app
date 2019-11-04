import FileData from '../../../services/dataDropper/FileData';

const data = {abc: 123, xyz: 456};

test('Test fileData from Data with automatic drop', async () => {
    const fd = await FileData.fromData(data);
    expect(fd.data).toEqual(data);
    expect(fd.file).toEqual({
        filename: '6e651abf72935f9c39c1cd9aa6ab64d685635e75.json',
        server: 'https://datadropper.inowas.com'
    });
});

test('Test fileData from Data with automatic drop false', async () => {
    const fd = await FileData.fromData(data, false);
    expect(fd.data).toEqual(data);
    expect(fd.file).toEqual(null);
    await fd.drop();
    expect(fd.file).toEqual({
        filename: '6e651abf72935f9c39c1cd9aa6ab64d685635e75.json',
        server: 'https://datadropper.inowas.com'
    });

});

test('Test if data loads', async () => {
    const fd = await FileData.fromFile({
        filename: '6e651abf72935f9c39c1cd9aa6ab64d685635e75.json',
        server: 'https://datadropper.inowas.com'
    });

    expect(fd.data).toEqual({abc: 123, xyz: 456});
});
