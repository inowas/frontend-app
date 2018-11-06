import ASTR from '../images/ASTR.png';
import ASR from '../images/ASR.png';
import IDF from '../images/dune_filtration.png';
import SAT from '../images/soil_aquifer_treatment.png';
import Rooftop from '../images/rooftop_rainwater_harvesting.png';
import IBF from '../images/river_bank_filtration.png';
import RD from '../images/recharge_dam.png';
import SSDam from '../images/subsurface_dam.png';
import Ponds from '../images/infiltration_ponds.png';
import Sanddam from '../images/sand_dam.png';
import Bounds from '../images/barriers-and_bunds.png';
import EI from '../images/excess_irrigation.png';
import Ditches from '../images/ditches_and_furrows.png';
import Trenches from '../images/trenches.png';
import WSB from '../images/shallow_well_injection.png';
import CS from '../images/channel_spreading.png';
import Flooding from '../images/flooding.png';

export const getData = () => {
    return {
        conditions: [{
            name: 'Ephemeral Rivers',
            category: 'Source of water',
            selected: true,
            applicable_methods: ['Ponds', 'Flooding', 'Ditches', 'SS Dam', 'RD', 'Sand dam']
        }, {
            name: 'Perennial Rivers',
            category: 'Source of water',
            selected: true,
            applicable_methods: ['Ponds', 'Flooding', 'Ditches', 'EI', 'IBF', 'ASR', 'ASTR', 'W-S-B', 'SS Dam', 'RD', 'Sand dam', 'CS']
        }, {
            name: 'Storage Dams/ Reservoir',
            category: 'Source of water',
            selected: false,
            applicable_methods: ['Ponds', 'Flooding', 'Ditches', 'EI', 'ASR', 'ASTR', 'W-S-B']
        }, {
            name: 'Floods/ Runoff/ Rain water',
            category: 'Source of water',
            selected: false,
            applicable_methods: ['Ponds', 'Ditches', 'IDF', 'ASR', 'ASTR', 'W-S-B', 'SS Dam', 'RD', 'Sand dam', 'Bund', 'Trenches', 'Rooftop']
        }, {
            name: 'Urban Storm Water',
            category: 'Source of water',
            selected: false,
            applicable_methods: ['Ponds', 'Ditches', 'IDF', 'ASR', 'ASTR', 'W-S-B', 'SS Dam', 'RD', 'Sand dam', 'Bund', 'Trenches', 'Rooftop']
        }, {
            name: 'Ground Water',
            category: 'Source of water',
            selected: false,
            applicable_methods: ['Ponds', 'Ditches', 'EI', 'ASR', 'ASTR', 'W-S-B', 'SS Dam']
        }, {
            name: 'Treated Waste Water (Industrial/ Domestic/ Desalination)',
            category: 'Source of water',
            selected: false,
            applicable_methods: ['Ponds', 'Flooding', 'SAT', 'EI', 'IDF', 'ASR', 'ASTR', 'W-S-B']
        }, {
            name: 'Sandy loams, silt loams',
            category: 'Soil type',
            selected: true,
            applicable_methods: ['Ponds', 'Flooding', 'Ditches', 'SAT', 'EI', 'IBF', 'IDF', 'SS Dam', 'RD', 'Bund', 'Trenches', 'Rooftop', 'CS']
        }, {
            name: 'Deep sands, well aggregated soils',
            category: 'Soil type',
            selected: true,
            applicable_methods: ['Ponds', 'Flooding', 'Ditches', 'SAT', 'EI', 'IBF', 'IDF', 'SS Dam', 'RD', 'Bund', 'Trenches', 'Rooftop']
        }, {
            name: 'Highly clayey soils',
            category: 'Soil type',
            selected: false,
            applicable_methods: ['ASR', 'ASTR', 'W-S-B', 'Sand dam']
        }, {
            name: 'Shallow soils, clay soils, soils low in organic matter',
            category: 'Soil type',
            selected: false,
            applicable_methods: ['ASR', 'ASTR', 'W-S-B', 'Sand dam']
        }, {
            name: 'Residential',
            category: 'Land Use',
            selected: false,
            applicable_methods: ['IBF', 'ASR', 'ASTR', 'W-S-B', 'Rooftop']
        }, {
            name: 'Industrial',
            category: 'Land Use',
            selected: false,
            applicable_methods: ['IBF', 'ASR', 'ASTR', 'W-S-B', 'Rooftop']
        }, {
            name: 'Recreational Lands/ Parks',
            category: 'Land Use',
            selected: false,
            applicable_methods: ['Ponds', 'Ditches', 'SAT', 'EI', 'IBF', 'IDF', 'ASR', 'ASTR', 'W-S-B', 'Bund', 'Trenches']
        }, {
            name: 'Agricultural Land',
            category: 'Land Use',
            selected: false,
            applicable_methods: ['Ponds', 'Flooding', 'Ditches', 'SAT', 'EI', 'IBF', 'ASR', 'ASTR', 'W-S-B', 'Bund', 'Trenches']
        }, {
            name: 'Streambed',
            category: 'Land Use',
            selected: false,
            applicable_methods: ['SS Dam', 'RD', 'Sand dam', 'CS']
        }, {
            name: 'Barren Lands/ Range Land',
            category: 'Land Use',
            selected: false,
            applicable_methods: ['Ponds', 'Flooding', 'Ditches', 'SAT', 'EI', 'IBF', 'IDF', 'ASR', 'ASTR', 'W-S-B', 'Bund', 'Trenches']
        }, {
            name: 'Max Natural Storage Capacity',
            category: 'Purpose',
            selected: false,
            applicable_methods: ['Ponds', 'Flooding', 'Ditches', 'SAT', 'EI', 'ASR', 'ASTR', 'W-S-B', 'SS Dam', 'RD', 'Sand dam', 'Bund', 'Trenches', 'Rooftop', 'CS']
        }, {
            name: 'Prevent Salt Water Intruesion',
            category: 'Purpose',
            selected: false,
            applicable_methods: ['Ponds', 'Ditches', 'EI', 'ASR', 'W-S-B', 'SS Dam']
        }, {
            name: 'Restoration of Ground Water',
            category: 'Purpose',
            selected: false,
            applicable_methods: ['Ponds', 'Flooding', 'Ditches', 'SAT', 'EI', 'ASR', 'W-S-B', 'SS Dam', 'Bund', 'Trenches']
        }, {
            name: 'Water Quality Improvement',
            category: 'Purpose',
            selected: false,
            applicable_methods: ['Ponds', 'Flooding', 'SAT', 'EI', 'IBF', 'IDF', 'ASR', 'ASTR', 'W-S-B', 'Bund', 'Trenches', 'Rooftop']
        }, {
            name: 'Agricultural Uses/ Irrigation',
            category: 'Purpose',
            selected: false,
            applicable_methods: ['Ponds', 'Flooding', 'Ditches', 'SAT', 'EI', 'IBF', 'IDF', 'ASR', 'ASTR', 'W-S-B', 'SS Dam', 'RD', 'Sand dam', 'Bund', 'Trenches', 'Rooftop']
        }, {
            name: 'Domestic',
            category: 'Purpose',
            selected: false,
            applicable_methods: ['Ponds', 'Flooding', 'Ditches', 'SAT', 'EI', 'IBF', 'ASR', 'ASTR', 'W-S-B', 'SS Dam', 'RD', 'Sand dam', 'Bund', 'Trenches', 'Rooftop']
        }, {
            name: 'Ecological Benefit',
            category: 'Purpose',
            selected: false,
            applicable_methods: ['Flooding', 'Ditches', 'IDF', 'EI', 'ASR', 'W-S-B', 'Bund', 'Trenches', 'Rooftop']
        }, {
            name: 'Small (Household)',
            category: 'Typical Scale',
            selected: false,
            applicable_methods: ['EI', 'Sand dam', 'Bund', 'Trenches', 'Rooftop']
        }, {
            name: 'Medium (Village)',
            category: 'Typical Scale',
            selected: true,
            applicable_methods: ['Ponds', 'Flooding', 'Ditches', 'SAT', 'EI', 'IBF', 'IDF', 'ASR', 'ASTR', 'W-S-B', 'SS Dam', 'RD', 'Sand dam', 'Bund', 'Trenches', 'Rooftop', 'CS']
        }, {
            name: 'Large (Town)',
            category: 'Typical Scale',
            selected: false,
            applicable_methods: ['Ponds', 'SAT', 'IBF', 'IDF', 'ASR', 'ASTR', 'SS Dam', 'RD']
        }],
        methods: [{
            slug: 'Ponds',
            name: 'Infiltration ponds',
            highCost: false,
            highLandNeed: true,
            image: Ponds,
            href: 'https://inowas.hydro.tu-dresden.de/mar-methods/infiltration-ponds-and-basins/'
        }, {
            slug: 'Flooding',
            name: 'Flooding',
            highCost: false,
            highLandNeed: true,
            image: Flooding,
            href: 'https://inowas.hydro.tu-dresden.de/mar-methods/flooding/'
        }, {
            slug: 'Ditches',
            name: 'Ditches and furrows ',
            highCost: false,
            highLandNeed: true,
            image: Ditches,
            href: 'https://inowas.hydro.tu-dresden.de/mar-methods/ditches-and-furrows/'
        }, {
            slug: 'SAT',
            name: 'Soil Aquifer Treatment',
            highCost: true,
            highLandNeed: true,
            image: SAT,
            href: 'https://inowas.hydro.tu-dresden.de/mar-methods/soil-aquifer-treatment-sat/'
        }, {
            slug: 'EI',
            name: ' Excess irrigation',
            highCost: false,
            highLandNeed: false,
            image: EI,
            href: 'https://inowas.hydro.tu-dresden.de/mar-methods/excess-irrigation/'
        }, {
            slug: 'IBF',
            name: 'Induced bank filtration',
            highCost: false,
            highLandNeed: false,
            image: IBF,
            href: 'https://inowas.hydro.tu-dresden.de/mar-methods/induced-bank-filtration/'
        }, {
            slug: 'IDF',
            name: 'Dune filtration',
            highCost: false,
            highLandNeed: true,
            image: IDF,
            href: 'https://inowas.hydro.tu-dresden.de/mar-methods/dune-filtration/'
        }, {
            slug: 'ASR',
            name: 'ASR',
            highCost: true,
            highLandNeed: false,
            image: ASR,
            href: 'https://inowas.hydro.tu-dresden.de/tools/aquifer-storage-and-recovery-asr/'
        }, {
            slug: 'ASTR',
            name: 'ASTR',
            highCost: true,
            highLandNeed: false,
            image: ASTR,
            href: 'https://inowas.hydro.tu-dresden.de/mar-methods/aquifer-storage-transfer-and-recovery-astr/'
        }, {
            slug: 'W-S-B',
            name: 'Shallow wells, shafts and pits infiltration',
            highCost: true,
            highLandNeed: false,
            image: WSB,
            href: 'https://inowas.hydro.tu-dresden.de/mar-methods/shallow-wells-shafts-and-pits-infiltration/'
        }, {
            slug: 'SS Dam',
            name: 'Subsurface dams',
            highCost: true,
            highLandNeed: false,
            image: SSDam,
            href: 'https://inowas.hydro.tu-dresden.de/mar-methods/subsurface-dams/'
        }, {
            slug: 'RD',
            name: 'Recharge dams',
            highCost: false,
            highLandNeed: false,
            image: RD,
            href: 'https://inowas.hydro.tu-dresden.de/mar-methods/recharge-dams/'
        }, {
            slug: 'Sand dam',
            name: 'Sand dams',
            highCost: false,
            highLandNeed: false,
            image: Sanddam,
            href: 'https://inowas.hydro.tu-dresden.de/mar-methods/sand-dams/'
        }, {
            slug: 'Bund',
            name: 'Barrier and bunds',
            highCost: false,
            highLandNeed: true,
            image: Bounds,
            href: 'https://inowas.hydro.tu-dresden.de/mar-methods/barriers-and-bunds/'
        }, {
            slug: 'Trenches',
            name: 'Trenches',
            highCost: false,
            highLandNeed: true,
            image: Trenches,
            href: 'https://inowas.hydro.tu-dresden.de/mar-methods/trenches/'
        }, {
            slug: 'Rooftop',
            name: 'Rooftop rainwater harvesting',
            highCost: false,
            highLandNeed: false,
            image: Rooftop,
            href: 'https://inowas.hydro.tu-dresden.de/mar-methods/rooftop-rainwater-harvesting/'
        }, {
            slug: 'CS',
            name: 'Channel spreading',
            highCost: false,
            highLandNeed: true,
            image: CS,
            href: 'https://inowas.hydro.tu-dresden.de/mar-methods/channel-spreading/'
        }]
    };
};
