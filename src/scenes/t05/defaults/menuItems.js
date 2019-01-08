import MCDA from 'core/mcda/MCDA';

const getMenuItems = (mcda) => {

    if (!(mcda instanceof MCDA)) {
        throw new Error('T05 ToolNavigation expects parameter of type MCDA.');
    }

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
        if (mcda.weightAssignmentsCollection.length >= 1) {
            return {
                val: 'success',
                msg: null
            };
        }
        return null;
    };

    const criteriaDataStatus = () => {
        if (mcda.criteriaCollection.length < 1) {
            return {
                val: 'warning',
                msg: 'At least one criteria is needed for data.'
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
            name: 'Constraint Mapping',
            property: 'cm'
        },
        {
            name: 'Criteria Data',
            property: 'cd',
            status: criteriaDataStatus()
        },
        {
            name: 'Suitability',
            property: 'suitability'
        },
        {
            name: 'Results',
            property: 'results'
        }
    ];
};

export default getMenuItems;
