import {IBoundingBox} from '../geometry/BoundingBox.type';
import {ICells} from '../geometry/Cells.type';
import {GeoJson} from '../geometry/Geometry.type';
import {IGridSize} from '../geometry/GridSize.type';
import {ILengthUnit} from './LengthUnit.type';
import {IStressPeriods} from './Stressperiods.type';
import {ITimeUnit} from './TimeUnit.type';

export interface IModflowModel {
    id: string;
    name: string;
    description: string;
    permissions: string;
    public: boolean;
    discretization: {
        geometry: GeoJson;
        bounding_box: IBoundingBox;
        grid_size: IGridSize;
        cells: ICells;
        stressperiods: IStressPeriods;
        length_unit: ILengthUnit;
        time_unit: ITimeUnit;
    };
    calculationId: string;
}
