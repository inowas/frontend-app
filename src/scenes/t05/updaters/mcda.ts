import {Criterion, WeightAssignmentsCollection} from '../../../core/model/mcda/criteria';
import {Gis} from '../../../core/model/mcda/gis';
import {IMCDA1v0, IMCDAPayload} from '../../../core/model/mcda/MCDA.type';
import Suitability from '../../../core/model/mcda/Suitability';
import {LATEST_VERSION} from '../defaults/defaults';

export const updater = (mcda: IMCDAPayload | IMCDA1v0): IMCDAPayload => {
    if (!mcda.version || mcda.version !== LATEST_VERSION) {
        return update1v0to1v1(mcda as IMCDA1v0);
    }
    return mcda as IMCDAPayload;
};

const update1v0to1v1 = (mcda: IMCDA1v0): IMCDAPayload => {
    return {
        criteria: mcda.criteria.map((c) => Criterion.update1v0to1v1(c)),
        constraints: Gis.update1v0to1v1(mcda.constraints),
        grid_size: mcda.constraints.gridSize,
        suitability: Suitability.update1v0to1v1(mcda.suitability),
        version: '1.1',
        weight_assignments: WeightAssignmentsCollection.update1v0to1v1(mcda.weight_assignments),
        with_ahp: mcda.with_ahp
    };
};
