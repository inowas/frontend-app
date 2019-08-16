import { Array2D } from '../geometry/Array2D.type';

export interface ILayerParameterZone {
    id: string;
    layerId: string;
    zoneId: string;
    parameter: string;
    value: number | Array2D<number>;
    priority: number;
}
