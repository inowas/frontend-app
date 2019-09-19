import MCDA from '../../../core/model/mcda/MCDA';

export interface IMenuItem {
    name: string;
    property: string;
    status: {
        val: string;
        msg: string | null;
    } | null;
}

export const getMenuItems = (mcda: MCDA): IMenuItem[] => {
    const criteriaStatus = () => {
        if (mcda.weightAssignmentsCollection.length > 0) {
            return {
                val: 'locked',
                msg: null
            };
        }
        if (mcda.criteriaCollection.length > 0) {
            return {
                val: 'success',
                msg: null
            };
        }
        return null;
    };

    const weightAssignmentStatus = () => {
        if (mcda.criteriaCollection.length < 2) {
            return {
                val: 'warning',
                msg: 'At least two criteria are needed for weight assignment.'
            };
        }
        if (mcda.weightAssignmentsCollection.isFinished()) {
            return {
                val: 'success',
                msg: null
            };
        }
        return null;
    };

    const criteriaAreFinished = mcda.criteriaCollection.isFinished(mcda.withAhp);

    const criteriaDataStatus = () => {
        if (mcda.criteriaCollection.length < 1) {
            return {
                val: 'warning',
                msg: 'At least one criteria is needed for data.'
            };
        }
        if (criteriaAreFinished) {
            return {
                val: 'success',
                msg: null
            };
        }
        return null;
    };

    const constraintsStatus = () => {
        if (!criteriaAreFinished) {
            return {
                val: 'warning',
                msg: 'Criteria data is needed first.'
            };
        }
        if (mcda.constraints && mcda.constraints.raster && mcda.constraints.raster.data.length > 0) {
            return {
                val: 'success',
                msg: null
            };
        }
        return null;
    };

    const suitabilityDataStatus = () => {
        if (!criteriaAreFinished) {
            return {
                val: 'warning',
                msg: 'Criteria data is needed first.'
            };
        }
        if (mcda.suitability.raster && mcda.suitability.raster.data.length > 0) {
            return {
                val: 'success',
                msg: null
            };
        }
        return null;
    };

    return [
        {
            name: 'Criteria',
            property: 'criteria',
            status: criteriaStatus()
        },
        {
            name: 'Weight Assignment',
            property: 'wa',
            status: weightAssignmentStatus()
        },
        {
            name: 'Criteria Data',
            property: 'cd',
            status: criteriaDataStatus()
        },
        {
            name: 'Global Constraints',
            property: 'cm',
            status: constraintsStatus()
        },
        {
            name: 'Suitability',
            property: 'su',
            status: suitabilityDataStatus()
        }
    ];
};
