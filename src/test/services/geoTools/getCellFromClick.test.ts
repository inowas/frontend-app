import {BoundingBox, GridSize} from '../../../core/model/geometry';
import { getCellFromClick, rotateCoordinateAroundPoint } from '../../../services/geoTools/getCellFromClick';

test('Rotate point around other point', () => {
    const p1 = {lat: 50.607, lng: 22.023};
    const p2 = {lat: 50.439, lng: 19.364};
    const rotation = 45;
    const result = rotateCoordinateAroundPoint(p1, p2, rotation);

    expect(result[0].toFixed(3)).toEqual('52.790');
    expect(result[1].toFixed(3)).toEqual('20.618');
});

test('Get cell from click in rotated model', () => {
    const click1 = {lng: 19.600909614022655, lat: 50.5311069756891};
    const click2 = {lng: 22.023168603016384, lat: 50.60684951775521};
    const boundingBox = BoundingBox.fromObject(
        [[17.720160758370753, 49.18100598536719], [21.007514220416624, 51.698832640702285]]
    );
    const gridSize = GridSize.fromObject({n_x: 3, n_y: 3});
    const rotation = 45;
    const center = boundingBox.centerOfMass;

    expect(getCellFromClick(boundingBox, gridSize, click1, center, rotation)).toEqual([1, 1]);
    expect(getCellFromClick(boundingBox, gridSize, click2, center, rotation)).toEqual([0, 2]);
});
