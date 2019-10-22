import Rainbow from '../../../services/rainbowvis/Rainbowvis';

test('Generate rainbow from array', () => {
    const rb = new Rainbow();
    rb.setSpectrumByArray(['#31a354', '#addd8e', '#d8b365']);
    rb.setNumberRange(-10, 10);
    expect(rb.colorAt(3)).toBe('bad082');
});
