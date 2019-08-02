import uuidv4 from 'uuid/v4';
import {defaultParameters} from '../../../scenes/t03/defaults/layer';
import {Array2D} from '../geometry/Array2D.type';
import GridSize from '../geometry/GridSize';
import Layer from './Layer';
import {IRasterParameter} from './RasterParameter.type';
import {IZone} from './Zone.type';

class SoilmodelLayer extends Layer {
    public static fromDefault(geometry: IGeometry, cells: ICells) {
        const defaultZone: IZone = {
            id: uuidv4(),
            name: 'Default Zone',
            geometry,
            cells,
            parameters: defaultParameters,
            priority: 0
        };

        return new Layer({
            description: '',
            id: uuidv4(),
            layavg: 0,
            laytyp: 0,
            laywet: 0,
            _meta: {
                zones: [defaultZone]
            },
            name: 'Top Layer',
            number: 0,
            parameters: defaultParameters
        });
    }

    public calculateTransmissivity(top: IRasterParameter): number | Array2D<number> {
        const parameters = {
            hk: this.parameters.filter((p) => p.name === 'hk'),
            botm: this.parameters.filter((p) => p.name === 'botm')
        };

        if (parameters.hk.length > 0 && parameters.botm.length > 0) {
            const hk = parameters.hk[0];
            const botm = parameters.botm[0];

            let gridSize = null;

            if (Array.isArray(top.value)) {
                gridSize = GridSize.fromData(top.value);
            }

            if (Array.isArray(hk.value)) {
                gridSize = GridSize.fromData(hk.value);
            }

            if (Array.isArray(botm.value)) {
                gridSize = GridSize.fromData(botm.value);
            }

            // We have scalar values;
            if (gridSize === null) {
                if ((top.value instanceof Array) || (hk.value instanceof Array) || (botm.value instanceof Array)) {
                    return 0;
                }

                return (top.value - botm.value) * hk.value;
            }

            const result: number[][] = [];
            for (let row = 0; row < gridSize.nY; row++) {
                result[row] = [];
                for (let col = 0; col < gridSize.nX; col++) {
                    const hkCell = Array.isArray(hk) ? hk[row][col] : hk;
                    const topCell = Array.isArray(top) ? top[row][col] : top;
                    const botmCell = Array.isArray(botm) ? botm[row][col] : botm;
                    result[row][col] = (topCell - botmCell) * hkCell;
                }
            }
            return result as Array2D<number>;
        }

        return 0;
    }
}
