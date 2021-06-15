interface IProcessDefault {
  TreatmentName: string;
  TreatmentGroup: string;
  TreatmentDescription: string;
}

const processes: IProcessDefault[] = [
  {
    'TreatmentName': 'UV disinfection 40 mJ/cm2, drinking',
    'TreatmentGroup': 'Primary disinfection',
    'TreatmentDescription': 'UV-light is mostly effective at 254 nm where it affects DNA or RNA thus preventing reproduction of the organism (inactivation). Log reduction for drinking water UV is based on closed UV-reactors wich have been validated according to appropriate standards (e.g. USEPA or DVGW). Effectiveness of disinfection depends on delivered fluence (dose in mJ/cm2), which varies with lamp intensity, exposure time (flow rate) and UV-absorption by the water (organics). Excessive turbidity and certain dissolved species inhibit this process; hence, turbidity should be kept below 1 NTU to support effective disinfection.'
  },
  {
    'TreatmentName': 'Conventional clarification',
    'TreatmentGroup': 'Coagulation, flocculation and sedimentation',
    'TreatmentDescription': 'Consists of coagulant and/or flocculant aid (e.g. polymer) dosing, rapid mixing, slow mixing and sedimentation. Log removal depends on process optimisation. Rapid changes in source water quality such as turbidity increase due to monsoon rainfall or algeal blooms may decrease treatment effect and require adjustment of process settings.'
  },
  {
    'TreatmentName': 'Dissolved air flotation',
    'TreatmentGroup': 'Coagulation, flocculation and sedimentation',
    'TreatmentDescription': 'Compressed air is injected in the water such that air bubbles bring suspended solids to the water surface where they are skimmed off. Coagulant may be dosed.  Log removal depends on process optimisation. Rapid changes in source water quality such as turbidity increase due to monsoon rainfall or algeal blooms may decrease treatment effect and require adjustment of process settings.'
  },
  {
    'TreatmentName': 'High-rate clarification',
    'TreatmentGroup': 'Coagulation, flocculation and sedimentation',
    'TreatmentDescription': 'Consists of coagulant and/or flocculant aid (e.g. polymer) dosing, mixing and enhanced sedimentation by flock blankets, lamellae- or tube settlers. Log removal depends on process optimisation. Rapid changes in source water quality such as turbidity increase due to monsoon rainfall or algeal blooms may decrease treatment effect and require adjustment of process settings.'
  },
  {
    'TreatmentName': 'Lime softening',
    'TreatmentGroup': 'Coagulation, flocculation and sedimentation',
    'TreatmentDescription': 'Lime is dosed to the water to reduce hardness. When flocks are formed, they can entrap pathogens. Note that the technical design of the softening process affects the log reduction. e.g. pellet-softening has no effect on pathogens.'
  },
  {
    'TreatmentName': 'Granular high-rate filtration',
    'TreatmentGroup': 'Filtration',
    'TreatmentDescription': 'Water is filtered through a fixed bed of granular media (e.g. sand) generally operatied down flow with rates of 5 to 20 m/h and contact times of 4 to 15 minutes. They are regularly backwashed to remove built up solids in the filter. Log removal depends on filter media and coagulation pretreatment;consistent low filtered water turbidity of ? 0.3 NTU (none to exceed 1 NTU)\n are associated higher log removal of pathogens'
  },
  {
    'TreatmentName': 'Precoat filtration',
    'TreatmentGroup': 'Filtration',
    'TreatmentDescription': 'Consist of a fine filter (e.g. candle filter or drum filter) that is precoated by dosing fine granular material (often diatomaceous earth). This material forms a fine filter cake that removes solids from the water. The log removal can only be achieved if the filter cake is present and depends on precoat media grade and filtratin \nrate.'
  },
  {
    'TreatmentName': 'Slow sand filtration',
    'TreatmentGroup': 'Filtration',
    'TreatmentDescription': "Water is filtered through a fixed bed sand operatied down flow with rates of 0.1 to 1 m/h and contact times of 3 to 6 hours. The filter is not backwashed. In weeks to months a 'schmutzdecke' will develop on the filter which enhances log removal. Grain size, flow rate and temperature also affect log removal. Consistent low filtered water turbidity of ? 0.3 NTU (none to exceed 1 NTU) are associated higher log removal of pathogens\n\nassociated with 1 - 2 log reduction of viruses and 2.5 - 3 log reduction of Cryptosporidiuma"
  },
  {
    'TreatmentName': 'Bank filtration',
    'TreatmentGroup': 'Natural Attenuation',
    'TreatmentDescription': 'Bank filtration systems are typically installed near perennial streams or lakes that are in hydraulic contact to the adjacent aquifer. Water is abstracted through wells located close to the surface water. Log removal depends on travel distance and flow velocity, grain size distribution, and geochemical conditions (redox, pH)'
  },
  {
    'TreatmentName': 'Roughing filters',
    'TreatmentGroup': 'Pretreatment',
    'TreatmentDescription': 'Water is filtered through a fixed bed of coarse granular media (e.g. rocks 5-20 mm) operated at high rates. They are not backwashed. Log removal depends on filter media and coagulation pretreatment.'
  },
  {
    'TreatmentName': 'Storage reservoirs',
    'TreatmentGroup': 'Natural Attenuation',
    'TreatmentDescription': 'Water is protected from human recontamination in reservoirs, however wildlife and waterfoul may introduce pathogens. Log reduction occurs due to sedimentation, UV radiation from sunlight and die-off in time,  depending on construction (mixing) and temperature. Reporded reduction based on residence time > 40 days (bacteria), 160 days (protozoa)'
  },
  {
    'TreatmentName': 'Chlorination, wastewater',
    'TreatmentGroup': 'Primary disinfection',
    'TreatmentDescription': 'Log inactivation depends on free chlorine concentration and contact time (CT); not effective against Cryptosporidium oocysts, reported protozoan log reduction is mostly for Giardia. Turbidity and chlorine-demanding solutes inhibit this process; hence, effect in wastewater is limited since free chlorine will rapidly decay. \n\nEffective disinfection. Where this is not practical, turbidities should be kept below 5 NTU with higher chlorine doses or contact times. In addition to initial disinfection, the benefits of maintaining free chlorine residuals throughout distribution systems at or above 0.2 mg/l should be considered'
  },
  {
    'TreatmentName': 'Chlorine dioxide',
    'TreatmentGroup': 'Primary disinfection',
    'TreatmentDescription': "Log inactivation depends on chlorine dioxide concentration and contact time (CT); Turbidity and organics inhibit this process; hence, turbidity should be kept below 1 NTU to support\n effective disinfection Chlorine dioxide degrades rapidly and doesn't leave a disinfectand residual for distribution."
  },
  {
    'TreatmentName': 'Ozonation, drinking water',
    'TreatmentGroup': 'Primary disinfection',
    'TreatmentDescription': "Log inactivation depends on dissolved ozone concentration and contact time (CT); Turbidity and organics inhibit this process; hence, turbidity should be kept below 1 NTU to support\n\n effective disinfection. Ozone degrades rapidly and doesn't leave a disinfectand residual for distribution. Effective mixing and consistent contact time are crucial for disinfection due to the rapid degradation of ozone.\n\nCryptosporidium varies widely"
  },
  {
    'TreatmentName': 'UV disinfection 20 mJ/cm2, drinking',
    'TreatmentGroup': 'Primary disinfection',
    'TreatmentDescription': 'UV-light is mostly effective at 254 nm where it affects DNA or RNA thus preventing reproduction of the organism (inactivation). Log reduction for drinking water UV is based on closed UV-reactors wich have been validated according to appropriate standards (e.g. USEPA or DVGW). Effectiveness of disinfection depends on delivered fluence (dose in mJ/cm2), which varies with lamp intensity, exposure time (flow rate) and UV-absorption by the water (organics). Excessive turbidity and certain dissolved species inhibit this process; hence, turbidity should be kept below 1 NTU to support effective disinfection.'
  },
  {
    'TreatmentName': 'Primary treatment',
    'TreatmentGroup': 'Quiescent basin',
    'TreatmentDescription': 'Primary treatment consists of temporarily holding the sewage in a quiescent basin where heavy solids can settle to the bottom while oil, grease and lighter solids float to the surface. The settled and floating materials are removed and the remaining liquid may be discharged or subjected to secondary treatment'
  },
  {
    'TreatmentName': 'Secondary treatment',
    'TreatmentGroup': 'Activated sludge',
    'TreatmentDescription': 'Secondary treatment consists of an activated sludge process to break down organics in the wastewater and a settling stage to separate the biologiscal sludge from the water.'
  },
  {
    'TreatmentName': 'Soil-Aquifer passage',
    'TreatmentGroup': 'Natural Attenuation',
    'TreatmentDescription': 'The Soil-Aquifer passage refers to infiltration through the vadose (unsaturated) zone to recharge the underlying aquifer. Microbial treatment performance of the soil-aquifer passage is site-specific and depends on thickness of the unsaturated zone, travel distance, flow velocity, grain size distribution, and geochemical conditions (redox, pH)'
  },
  {
    'TreatmentName': 'Dual media filtration',
    'TreatmentGroup': 'Filtration',
    'TreatmentDescription': 'Water is filtered through a fixed bed consisting of two layers of granular media (e.g. antracite and sand) generally operatied down flow with rates of 5 to 20 m/h and contact times of 4 to 15 minutes. They are regularly backwashed to remove built up solids in the filter. Log removal depends on filter media and coagulation pretreatment;consistent low filtered water turbidity of ? 0.3 NTU (none to exceed 1 NTU)\n are associated higher log removal of pathogens'
  },
  {
    'TreatmentName': 'Membrane filtration',
    'TreatmentGroup': 'Filtration',
    'TreatmentDescription': 'A membrane is a thin sheet with small openings that removes solids and depending on membrane type, solutes from the water when this is led through the membrane.'
  },
  {
    'TreatmentName': 'Chlorine',
    'TreatmentGroup': 'Primary disinfection',
    'TreatmentDescription': 'Log inactivation depends on free chlorine concentration and contact time (CT); not effective against Cryptosporidium oocysts, reported log reduction is mostly for Giardia. Turbidity and chlorine-demanding solutes inhibit this process; hence, turbidity should be kept below 1 NTU to support\n effective disinfection. Where this is not practical, turbidities should be kept below 5 NTU with higher chlorine doses or contact times. In addition to initial disinfection, the benefits of maintaining free chlorine residuals throughout distribution systems at or above 0.2 mg/l should be considered'
  },
  {
    'TreatmentName': 'Reverse osmosis',
    'TreatmentGroup': 'Filtration',
    'TreatmentDescription': 'A reverse osmosis membrane is a thin sheet with small openings that removes solids and most soluble molecules, including salts (< 0,004 µm depending on selected membrane) from the water when this is led through the membrane. It can take the form of spiral wound membranes, hollow fibers or sheets. Actual log reduction depends on the selected membrane and is determined by challenge testing.'
  },
  {
    'TreatmentName': 'Ozonation, wastewater',
    'TreatmentGroup': 'Primary disinfection',
    'TreatmentDescription': 'Log inactivation depends on dissolved ozone concentration and contact time (CT); Turbidity and organics inhibit this process; Since wastewater is often turbidity and contains high organics that consume ozone, the actual CT cannot be determined accurately and therefore inactivation cannot be determined accurately. Still, effective mixing and consistent contact time are crucial for disinfection due to the rapid degradation of ozone.'
  },
  {
    'TreatmentName': 'Wetlands, surface flow',
    'TreatmentGroup': 'Natural Attenuation',
    'TreatmentDescription': 'An artificial wetland to treat municipal or industrial wastewater, greywater or stormwater runoff by a combination of sedimentation and biological processes including plants. Effect depends on design and climate, especially les log reduction at lower temperatures.'
  },
  {
    'TreatmentName': 'Wetlands, subsurface flow',
    'TreatmentGroup': 'Natural Attenuation',
    'TreatmentDescription': 'An artificial wetland to treat municipal or industrial wastewater, greywater or stormwater runoff by a combination of sedimentation, filtration and biological processes including plants. Effect depends on design, soil/filter media and climate, especially les log reduction at lower temperatures.'
  },
  {
    'TreatmentName': 'UV disinfection, wastewater',
    'TreatmentGroup': 'Primary disinfection',
    'TreatmentDescription': 'UV-light is mostly effective at 254 nm where it affects DNA or RNA thus preventing reproduction of the organism (inactivation). Effectiveness of disinfection depends on delivered fluence (dose in mJ/cm2), which varies with lamp intensity, exposure time (flow rate) and UV-absorption by the water (organics). Wastewater UV-reactors are generally open-channel reactors in which UV lamps are placed. Excessive turbidity and certain dissolved species inhibit this process; hence the effect in wastewater highly depends on the water quality an is generally lower than in drinking water at the same dose.'
  },
  {
    'TreatmentName': 'Microfiltration',
    'TreatmentGroup': 'Filtration',
    'TreatmentDescription': 'A microfiltration membrane is a thin sheet with small openings that removes solids (0.1-10 µm depending on selected membrane) from the water when this is led through the membrane. It can take the form of capilary tubes, hollow fibers or sheet membranes. Actual log reduction depends on the selected membrane and is determined by challenge testing.'
  },
  {
    'TreatmentName': 'Ultrafiltration',
    'TreatmentGroup': 'Filtration',
    'TreatmentDescription': 'An ultrafiltration membrane is a thin sheet with small openings that removes solids (0.005-0,2 µm depending on selected membrane) from the water when this is led through the membrane. It can take the form of capilary tubes, hollow fibers, spiral wound or sheet membranes. Actual log reduction depends on the selected membrane and is determined by challenge testing.'
  },
  {
    'TreatmentName': 'Nanofiltration',
    'TreatmentGroup': 'Filtration',
    'TreatmentDescription': 'An nanofiltration membrane is a thin sheet with small openings that removes solids and larger soluble molecules (0.001-0,03 µm depending on selected membrane) from the water when this is led through the membrane. It can take the form of spiral wound or hollow fiber membranes. Actual log reduction depends on the selected membrane and is determined by challenge testing.'
  }
];

export default processes;
