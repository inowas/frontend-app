import {GeoJson} from '../../geometry/Geometry.type';
import {ICells} from '../../geometry/Cells.type';

export interface IZone {
    id: string;
    name: string;
    geometry: GeoJson | null;
    cells: ICells;
    isDefault: boolean;
}
