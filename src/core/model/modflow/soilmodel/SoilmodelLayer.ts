import {cloneDeep} from 'lodash';
import uuidv4 from 'uuid/v4';
import {defaultSoilmodelLayerParameters} from '../../../../scenes/t03/defaults/soilmodel';
import {Array2D} from '../../geometry/Array2D.type';
import {Layer} from '../../gis';
import {IRasterParameter} from '../../gis/RasterParameter.type';
import {ISoilmodelLayer} from './SoilmodelLayer.type';

class SoilmodelLayer extends Layer {

    public static fromDefault() {
        return new SoilmodelLayer({
            description: '',
            id: uuidv4(),
            layavg: 0,
            laytyp: 0,
            laywet: 0,
            name: 'Top Layer',
            number: 0,
            parameters: defaultSoilmodelLayerParameters
        });
    }

    public static fromObject(obj: ISoilmodelLayer) {
        return new SoilmodelLayer(obj);
    }

    protected _props: ISoilmodelLayer;

    constructor(props: ISoilmodelLayer) {
        super(props);
        this._props = cloneDeep(props);
    }

    public toObject(): ISoilmodelLayer {
        return this._props;
    }

    public calculateTransmissivity(top: IRasterParameter): number | Array2D<number> {
        /*const parameters = {
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
*/
        return 0;
    }
}

export default SoilmodelLayer;
