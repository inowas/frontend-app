import MCDA from 'core/mcda/MCDA';

const getMenuItems = (mcda) => {

    if (!(mcda instanceof MCDA)) {
        throw new Error('T05 ToolNavigation expects parameter of type MCDA.');
    }

    const criteriaStatus = () => {
        if (mcda.weightAssignmentsCollection.length > 0) {
            return 'locked';
        }
        if (mcda.criteriaCollection.length > 0) {
            return 'success';
        }
        return '';
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
            status: mcda.criteriaCollection.all.length < 2 ? 'warning' : '',
            msg: 'At least two criteria are needed for weight assignment.'
        },
        {
            name: 'Raster Editor',
            property: 'editor'
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
