import MCDA from 'core/mcda/MCDA';

const getMenuItems = (mcda) => {

    if (!(mcda instanceof MCDA)) {
        throw new Error('T05 ToolNavigation expects parameter of type MCDA.');
    }

    return [
        {
            name: 'Criteria',
            property: 'criteria',
            status: mcda.criteria.all.length > 0 ? 'success' : ''
        },
        {
            name: 'Weight Assignment',
            property: 'wa',
            subItems: [
                {
                    name: 'Method 1: Ranking',
                    type: 'ranking'
                },
                {
                    name: 'Method 2: Multi-influence',
                    type: 'mif'
                },
                {
                    name: 'Method 3: Pairwise',
                    type: 'pwc'
                },
                {
                    name: 'Method 4: Analytical Hierarchy',
                    type: 'analytical-hierarchy'
                },
                {
                    name: 'Results',
                    type: 'results'
                }
            ],
            status: mcda.criteria.all.length < 2 ? 'warning' : '',
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
