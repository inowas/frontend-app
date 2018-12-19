import MCDA from 'core/mcda/MCDA';

const getMenuItems = (mcda) => {

    if (!(mcda instanceof MCDA)) {
        throw new Error('T05 ToolNavigation expects parameter of type MCDA.');
    }

    return [
        {
            name: 'Criteria',
            property: 'criteria',
            status: mcda.criteriaCollection.all.length > 0 ? 'success' : ''
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
