import ASR from '../images/ASR.png';
import ASTR from '../images/ASTR.png';
import Bounds from '../images/barriers-and_bunds.png';
import CS from '../images/channel_spreading.png';
import Ditches from '../images/ditches_and_furrows.png';
import IDF from '../images/dune_filtration.png';
import EI from '../images/excess_irrigation.png';
import Flooding from '../images/flooding.png';
import Ponds from '../images/infiltration_ponds.png';
import RD from '../images/recharge_dam.png';
import IBF from '../images/river_bank_filtration.png';
import Rooftop from '../images/rooftop_rainwater_harvesting.png';
import Sanddam from '../images/sand_dam.png';
import WSB from '../images/shallow_well_injection.png';
import SAT from '../images/soil_aquifer_treatment.png';
import SSDam from '../images/subsurface_dam.png';
import Trenches from '../images/trenches.png';

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
            description: 'Surface spreading and specifically infiltration ponds are among the most applied MAR techniques around the world. They are based on the retention and spreading of water over a mostly flat area in order to enhance infiltration. Infiltration to the unconfined aquifer is enhanced by the construction of excavations, dikes or levees. Surface spreading and infiltration ponds are used when site surface and subsurface characteristics allow the aquifer to be recharged from ground level.',
            highCost: false,
            highLandNeed: true,
            image: Ponds,
            href: 'https://inowas.com/mar-methods/infiltration-ponds-and-basins/'
        }, {
            slug: 'Flooding',
            name: 'Flooding',
            description: 'Flooding as a MAR technique is used on when excess river water is available during high modflow season or when flood events need to be managed. The system uses passive infiltration delivers and spreads the recharge water whichthen infiltrate through the vadose zone to the underlying aquifer. These systems can combine many benefits such as flood protection, drought preparedness, aquifer remediation, and ecosystem restoration.',
            highCost: false,
            highLandNeed: true,
            image: Flooding,
            href: 'https://inowas.com/mar-methods/flooding/'
        }, {
            slug: 'Ditches',
            name: 'Ditches and furrows ',
            description: 'Ditches, furrows or drains are point or linear structures that allow for the recharge water to infiltrate to the aquifer underneath. They are usually shallow, flat-bottomed and closely spaced structures that are excavated. This spreading methods is used mainly on irregular terrains to collect and allocate the water or in areas where an impermeable layer is present in the upper soil profile. These methods also include reverse drainage, which means that the recharge water flows into a network of perforated drainage pipes from which it infiltrates into the soil.',
            highCost: false,
            highLandNeed: true,
            image: Ditches,
            href: 'https://inowas.com/mar-methods/ditches-and-furrows/'
        }, {
            slug: 'SAT',
            name: 'Soil Aquifer Treatment (SAT)',
            description: 'Soil Aquifer Treatment is a technology where water is recharged into the groundwater through soil percolation under controlled conditions. During percolation, natural soil filtration processes occur improving the source water quality by removing nutrients and pathogens. This technique requires unsaturated soil conditions which are achieved by intermittent surface spreading. Focus of this method is on the improvement of quality of the recharged water.',
            highCost: true,
            highLandNeed: true,
            image: SAT,
            href: 'https://inowas.com/mar-methods/soil-aquifer-treatment-sat/'
        }, {
            slug: 'EI',
            name: ' Excess irrigation',
            description: 'Excess irrigation as a MAR technique is used on irrigated farmland where excess water is available and is spread over the area during dormant or non-irrigated seasons to allow for aquifer recharge. Excess irrigation has possible benefits over other traditional MAR techniques. Irrigated agricultural areas are available worldwide and already have the required infrastructure to connect these areas to water sources. It further does not compete with other land uses and gives farmland a second beneficial purpose. ',
            highCost: false,
            highLandNeed: false,
            image: EI,
            href: 'https://inowas.com/mar-methods/excess-irrigation/'
        }, {
            slug: 'IBF',
            name: 'Induced bank filtration',
            description: 'For river/lake bank filtration surface water from a river or lake is induced to infiltrate by pumping on a well gallery or line of wells parallel to the bank of the water source. Pumping at the gallery of wells lowers the water table adjacent to the river or lake, inducing water to infiltrate into the aquifer system. This process serves as a principal treatment step improving the water quality of the surface water. The passage of water through the river or lake bed and the aquifer removes dissolved and suspended pollutants and pathogens by chemical, physical and biological processes.',
            highCost: false,
            highLandNeed: false,
            image: IBF,
            href: 'https://inowas.com/mar-methods/induced-bank-filtration/'
        }, {
            slug: 'IDF',
            name: 'Dune filtration',
            description: 'For dune filtration surface water is infiltrated into the dune system and after soil passage retrived by pumping on a well gallery or lower lying ponds. This process serves as an additional treatment step improving the water quality of the infiltrated water. The passage of water through the dune system removes dissolved and suspended pollutants and pathogens by chemical, physical and biological processes.',
            highCost: false,
            highLandNeed: true,
            image: IDF,
            href: 'https://inowas.com/mar-methods/dune-filtration/'
        }, {
            slug: 'ASR',
            name: 'Aquifer storage and recovery (ASR)',
            description: 'For Aquifer Storage and Recovery (ASR) a constructed deep well is connected to the targeted aquifer and is used for both water extraction and injection. This type of MAR is mainly used where thick and low permeability strata is present above the targeted aquifer. Most currently operating ASR systems store drinking water in the aquifer for recovery in during peak demand or to transfer it from times of high to low availability (e.g. rainy to dry season).',
            highCost: true,
            highLandNeed: false,
            image: ASR,
            href: 'https://inowas.com/tools/aquifer-storage-and-recovery-asr/'
        }, {
            slug: 'ASTR',
            name: 'Aquifer storage, transfer, and recovery (ASTR)',
            description: 'For Aquifer Storage, Transfer, and Recovery (ASTR) water is injected into the aquifer through one well and is extracted by another well located some distance away. The underground passage facilitates physical and chemical processes that improve the quality of the injected water. This type of MAR is mainly used where thick and low permeability strata is present above the targeted aquifer. Well injection techniques demand a high water quality as the recharged water is injected directly into the aquifer.',
            highCost: true,
            highLandNeed: false,
            image: ASTR,
            href: 'https://inowas.com/mar-methods/aquifer-storage-transfer-and-recovery-astr/'
        }, {
            slug: 'W-S-B',
            name: 'Shallow wells, shafts and pits infiltration',
            description: 'The infiltration through shallow wells, shafts or pits is usually practiced to recharge a phreatic aquifer where spreading methods cannot be applied because of the existence of a low permeability surface layers. Often abandoned wells or pits are used that had previously fallen dry. The water fed into the structure will slowly replenish the aquifer. It is a cost effective method because recharge is governed by gravity modflow only.',
            highCost: true,
            highLandNeed: false,
            image: WSB,
            href: 'https://inowas.com/mar-methods/shallow-wells-shafts-and-pits-infiltration/'
        }, {
            slug: 'SS Dam',
            name: 'Subsurface dams',
            description: 'Subsurface dams are barriers of low permeability that are constructed underground. These structures reduce or stop the lateral modflow of groundwater in order to store water below ground and elevate the groundwater table. To construct a subsurface dams, a trench is built across a stream or valley until the depth of the bedrock or a layer of clay is reached. Within the trench, an impervious or low permeability wall is constructed and the trench is afterwards filled with the excavated material.',
            highCost: true,
            highLandNeed: false,
            image: SSDam,
            href: 'https://inowas.com/mar-methods/subsurface-dams/'
        }, {
            slug: 'RD',
            name: 'Recharge dams',
            description: 'Recharge dams are impermeable structures built into stream channels that store stream runoff water by creating surface reservoirs upstream of the dam. They can be either designed to recharge the groundwater by enhancing surface water infiltration behind the recharge dam (as picture above) or by controlled release of water through the dam and downstream infiltration through the river bed.',
            highCost: false,
            highLandNeed: false,
            image: RD,
            href: 'https://inowas.com/mar-methods/recharge-dams/'
        }, {
            slug: 'Sand dam',
            name: 'Sand dams',
            description: 'Sand dams are impounding structures constructed above ground within intermittent river channels. During rainfall events, storm water runoff will accumulate sands and gravels behind the dam structure. This creates an artificial aquifer upstream of the dam that can store the storm water runoff. The reservoirs will fill during rainfall events and store the water instead of loosing it to the catchment. Sand dams can increase water availability during dry seasons, prevent water evaporation, and protect water from contamination.',
            highCost: false,
            highLandNeed: false,
            image: Sanddam,
            href: 'https://inowas.com/mar-methods/sand-dams/'
        }, {
            slug: 'Bund',
            name: 'Barrier and bunds',
            description: 'Rainwater harvesting is being increasingly used to collect precipitation water. The ideas of barriers is to obstruct surface runoff from catchments and prohibit modflow of the water to be infiltrated. The collected rainwater of rainwater can be achieved by building bunds, barriers or contour ridges. These structures are easy to built and maintain and very adaptable. They can also be used in combination with trenches.',
            highCost: false,
            highLandNeed: true,
            image: Bounds,
            href: 'https://inowas.com/mar-methods/barriers-and-bunds/'
        }, {
            slug: 'Trenches',
            name: 'Trenches',
            description: 'Rainwater harvesting is being increasingly used to collect precipitation water. The ideas of trenches is to obstruct surface runoff from catchments and concentrate the water to be infiltrated. The collected rainwater can be reacharged thorugh trenches, ditches and pits. These structures are easy to built and maintain and very adaptable.',
            highCost: false,
            highLandNeed: true,
            image: Trenches,
            href: 'https://inowas.com/mar-methods/trenches/'
        }, {
            slug: 'Rooftop',
            name: 'Rooftop rainwater harvesting',
            description: 'Rooftop rainwater harvesting is being increasingly used in urban areas to collect precipitation water. Uses are manifold and include surface storage in tanks, usage for irrigation and groundwater recharge. The collected rainwater can be reached thorugh trenches, reverse drainage or any other methods with small area requirements. As urban areas are characterized by sealed surfaces, harvesting and recharge can help to sustain groundwater levels.',
            highCost: false,
            highLandNeed: false,
            image: Rooftop,
            href: 'https://inowas.com/mar-methods/rooftop-rainwater-harvesting/'
        }, {
            slug: 'CS',
            name: 'Channel spreading',
            description: 'Channel spreading is grouping technologies by which the wetted area of a drainage channel or river bed is artificially increased in order to enhance water infiltration to the aquifer. The drainage channel can be widened, leveled, scarified or dredged. The river modflow can also be modified by installing L shaped levees (pcitures above). Recharge is enhanced by inceasing the potential infiltration area and slowing down the modflow velocity.',
            highCost: false,
            highLandNeed: true,
            image: CS,
            href: 'https://inowas.com/mar-methods/channel-spreading/'
        }]
    };
};
