import ColourGradient from '../../../services/rainbowvis/ColorGradient';

test('GetHexColor', () => {
    const colorGradient = new ColourGradient();

    expect(colorGradient.getHexColor('#123456')).toEqual('123456');
    expect(colorGradient.getHexColor('beige')).toEqual('F5F5DC');
    expect(() => colorGradient.getHexColor('ddahjzz')).toThrow();
});
