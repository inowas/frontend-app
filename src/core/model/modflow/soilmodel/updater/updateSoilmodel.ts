import {ISoilmodel, ISoilmodel1v0, ISoilmodel2v0} from '../Soilmodel.type';
import {ModflowModel} from '../../index';
import {SoilmodelTypes} from './defaults';
import {ZonesCollection} from '../index';
import {fixDefaultZone, fixLayerParameters, fixMissingRelations, update1v0to2v1, update2v0to2v1} from './index';

/**
 * Checks incoming soilmodel, fixes bugs and updates to newest version if necessary. The function can be used
 * independently, outside of the ./updater.ts file
 *
 * @param {SoilmodelTypes} soilmodel
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
    let isDirty = false;
    let sm: SoilmodelTypes = soilmodel;

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
        sm = update1v0to2v1(soilmodel as ISoilmodel1v0, model);
        isDirty = true;
    } else if (soilmodel.properties.version === 2) {
        if (debug) {
            // tslint:disable-next-line:no-console
            console.log('%c Updating soilmodel from 2v0 to 2v1', 'background: #222; color: #bada55');
        }
        sm = update2v0to2v1(soilmodel as ISoilmodel2v0);
        isDirty = true;
    }

    if (
        'properties' in sm && sm.properties && sm.properties.version === '2.1' && !('relations' in sm.layers[0])
    ) {
        if (debug) {
            // tslint:disable-next-line:no-console
            console.log('%c Fix: no-relations bug', 'background: #222; color: #bada55');
        }
        isDirty = true;
        sm = fixMissingRelations(sm as ISoilmodel);
    }

    if (
        'properties' in sm && sm.properties && sm.properties.version === '2.1' &&
        !ZonesCollection.fromObject(sm.properties.zones).findFirstBy('isDefault', true)
    ) {
        if (debug) {
            // tslint:disable-next-line:no-console
            console.log('%c Fix: default zone', 'background: #222; color: #bada55');
        }
        isDirty = true;
        sm = fixDefaultZone(sm as ISoilmodel);
    }

    if (
        'properties' in sm && sm.properties && sm.properties.version === '2.1' && (sm as ISoilmodel).layers.filter(
        (l) => l.parameters.filter((p) => !p.value && !p.data.file).length > 0).length > 0
    ) {
        if (debug) {
            // tslint:disable-next-line:no-console
            console.log('%c Fix: no layer parameter values', 'background: #222; color: #bada55');
        }
        isDirty = true;
        sm = fixLayerParameters(sm as ISoilmodel);
    }

    return {
        soilmodel: sm as ISoilmodel,
        isDirty
    };
};

export default updateSoilmodel;
