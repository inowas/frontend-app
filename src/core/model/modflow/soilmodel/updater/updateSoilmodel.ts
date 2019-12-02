import {ModflowModel} from '../../index';
import {ZonesCollection} from '../index';
import {ISoilmodel, ISoilmodel1v0, ISoilmodel2v0, ISoilmodelExport} from '../Soilmodel.type';
import {SoilmodelTypes} from './defaults';
import {fixDefaultZone, fixMissingRelations, update1v0to2v1, update2v0to2v1} from './index';

/**
 * Checks incoming soilmodel and updates to newest version if necessary. The function can be used independently,
 * outside of the ./updater.ts file
 *
 * @param {ISoilmodelExport | ISoilmodel | ISoilmodel1v0 | ISoilmodel2v0} soilmodel
 * @param {ModflowModel} model
 *
 * @return {{soilmodel: ISoilmodel, isDirty: boolean}} object containing updated soilmodel and a flag, which tells, if
 * model has been updated or not
 */

const debug = false;

const updateSoilmodel = (
    soilmodel: SoilmodelTypes,
    model: ModflowModel
): {
    soilmodel: ISoilmodel,
    isDirty: boolean
} => {
    if (
        !soilmodel.properties || !soilmodel.properties.version ||
        (
            soilmodel.properties && soilmodel.properties.version && soilmodel.properties.version === 1
        )
    ) {
        if (debug) {
            // tslint:disable-next-line:no-console
            console.log('%c Updating soilmodel from 1v0 to 2v1', 'background: #222; color: #bada55');
        }
        return {
            soilmodel: update1v0to2v1(soilmodel as ISoilmodel1v0, model),
            isDirty: true
        };
    } else if (soilmodel.properties.version === 2) {
        if (debug) {
            // tslint:disable-next-line:no-console
            console.log('%c Updating soilmodel from 2v0 to 2v1', 'background: #222; color: #bada55');
        }
        return {
            soilmodel: update2v0to2v1(soilmodel as ISoilmodel2v0),
            isDirty: true
        };
    } else if (soilmodel.properties.version === '2.1' && !('relations' in soilmodel.layers[0])) {
        if (debug) {
            // tslint:disable-next-line:no-console
            console.log('%c Fix no-relations bug', 'background: #222; color: #bada55');
        }
        return {
            soilmodel: fixMissingRelations(soilmodel as ISoilmodel),
            isDirty: true
        };
    } else if ('properties' in soilmodel &&
        !ZonesCollection.fromObject(soilmodel.properties.zones).findFirstBy('isDefault', true)) {
        if (debug) {
            // tslint:disable-next-line:no-console
            console.log('%c Fix default zone', 'background: #222; color: #bada55');
        }
        return {
            soilmodel: fixDefaultZone(soilmodel as ISoilmodel),
            isDirty: true
        };
    }
    return {
        soilmodel: soilmodel as ISoilmodel,
        isDirty: false
    };
};

export default updateSoilmodel;
