interface ITreatmentRemoval {
  TreatmentGroup: string;
  TreatmentName: string;
  PathogenGroup: string;
  Min: number;
  Max: number;
  ReferenceName: string;
  ReferenceLink: string;
}

export const treatmentRemovals: ITreatmentRemoval[] = [
  {
    'TreatmentGroup': 'Coagulation, flocculation and sedimentation',
    'TreatmentName': 'Conventional clarification',
    'PathogenGroup': 'Bacteria',
    'Min': 0.2,
    'Max': 2,
    'ReferenceName': 'WHO (2011): Drinking water guideline, Table 7.7',
    'ReferenceLink': 'http://apps.who.int/iris/bitstream/10665/44584/1/9789241548151_eng.pdf#page=162'
  },
  {
    'TreatmentGroup': 'Coagulation, flocculation and sedimentation',
    'TreatmentName': 'Conventional clarification',
    'PathogenGroup': 'Viruses',
    'Min': 0.1,
    'Max': 3.4,
    'ReferenceName': 'WHO (2011): Drinking water guideline, Table 7.7',
    'ReferenceLink': 'http://apps.who.int/iris/bitstream/10665/44584/1/9789241548151_eng.pdf#page=162'
  },
  {
    'TreatmentGroup': 'Coagulation, flocculation and sedimentation',
    'TreatmentName': 'Conventional clarification',
    'PathogenGroup': 'Protozoa',
    'Min': 1,
    'Max': 2,
    'ReferenceName': 'WHO (2011): Drinking water guideline, Table 7.7',
    'ReferenceLink': 'http://apps.who.int/iris/bitstream/10665/44584/1/9789241548151_eng.pdf#page=162'
  },
  {
    'TreatmentGroup': 'Coagulation, flocculation and sedimentation',
    'TreatmentName': 'Dissolved air flotation',
    'PathogenGroup': 'Protozoa',
    'Min': 0.6,
    'Max': 2.6,
    'ReferenceName': 'WHO (2011): Drinking water guideline, Table 7.7',
    'ReferenceLink': 'http://apps.who.int/iris/bitstream/10665/44584/1/9789241548151_eng.pdf#page=162'
  },
  {
    'TreatmentGroup': 'Coagulation, flocculation and sedimentation',
    'TreatmentName': 'High-rate clarification',
    'PathogenGroup': 'Protozoa',
    'Min': 2,
    'Max': 2.8,
    'ReferenceName': 'WHO (2011): Drinking water guideline, Table 7.7',
    'ReferenceLink': 'http://apps.who.int/iris/bitstream/10665/44584/1/9789241548151_eng.pdf#page=162'
  },
  {
    'TreatmentGroup': 'Coagulation, flocculation and sedimentation',
    'TreatmentName': 'Lime softening',
    'PathogenGroup': 'Bacteria',
    'Min': 1,
    'Max': 4,
    'ReferenceName': 'WHO (2011): Drinking water guideline, Table 7.7',
    'ReferenceLink': 'http://apps.who.int/iris/bitstream/10665/44584/1/9789241548151_eng.pdf#page=162'
  },
  {
    'TreatmentGroup': 'Coagulation, flocculation and sedimentation',
    'TreatmentName': 'Lime softening',
    'PathogenGroup': 'Viruses',
    'Min': 2,
    'Max': 4,
    'ReferenceName': 'WHO (2011): Drinking water guideline, Table 7.7',
    'ReferenceLink': 'http://apps.who.int/iris/bitstream/10665/44584/1/9789241548151_eng.pdf#page=162'
  },
  {
    'TreatmentGroup': 'Coagulation, flocculation and sedimentation',
    'TreatmentName': 'Lime softening',
    'PathogenGroup': 'Protozoa',
    'Min': 0,
    'Max': 2,
    'ReferenceName': 'WHO (2011): Drinking water guideline, Table 7.7',
    'ReferenceLink': 'http://apps.who.int/iris/bitstream/10665/44584/1/9789241548151_eng.pdf#page=162'
  },
  {
    'TreatmentGroup': 'Filtration',
    'TreatmentName': 'Granular high-rate filtration',
    'PathogenGroup': 'Bacteria',
    'Min': 0.2,
    'Max': 4.4,
    'ReferenceName': 'WHO (2011): Drinking water guideline, Table 7.7',
    'ReferenceLink': 'http://apps.who.int/iris/bitstream/10665/44584/1/9789241548151_eng.pdf#page=162'
  },
  {
    'TreatmentGroup': 'Filtration',
    'TreatmentName': 'Granular high-rate filtration',
    'PathogenGroup': 'Viruses',
    'Min': 0,
    'Max': 3.5,
    'ReferenceName': 'WHO (2011): Drinking water guideline, Table 7.7',
    'ReferenceLink': 'http://apps.who.int/iris/bitstream/10665/44584/1/9789241548151_eng.pdf#page=162'
  },
  {
    'TreatmentGroup': 'Filtration',
    'TreatmentName': 'Granular high-rate filtration',
    'PathogenGroup': 'Protozoa',
    'Min': 0.4,
    'Max': 3.3,
    'ReferenceName': 'WHO (2011): Drinking water guideline, Table 7.7',
    'ReferenceLink': 'http://apps.who.int/iris/bitstream/10665/44584/1/9789241548151_eng.pdf#page=162'
  },
  {
    'TreatmentGroup': 'Filtration',
    'TreatmentName': 'Precoat filtration',
    'PathogenGroup': 'Bacteria',
    'Min': 0.2,
    'Max': 2.3,
    'ReferenceName': 'WHO (2011): Drinking water guideline, Table 7.7',
    'ReferenceLink': 'http://apps.who.int/iris/bitstream/10665/44584/1/9789241548151_eng.pdf#page=162'
  },
  {
    'TreatmentGroup': 'Filtration',
    'TreatmentName': 'Precoat filtration',
    'PathogenGroup': 'Viruses',
    'Min': 1,
    'Max': 1.7,
    'ReferenceName': 'WHO (2011): Drinking water guideline, Table 7.7',
    'ReferenceLink': 'http://apps.who.int/iris/bitstream/10665/44584/1/9789241548151_eng.pdf#page=162'
  },
  {
    'TreatmentGroup': 'Filtration',
    'TreatmentName': 'Precoat filtration',
    'PathogenGroup': 'Protozoa',
    'Min': 3,
    'Max': 6.7,
    'ReferenceName': 'WHO (2011): Drinking water guideline, Table 7.7',
    'ReferenceLink': 'http://apps.who.int/iris/bitstream/10665/44584/1/9789241548151_eng.pdf#page=162'
  },
  {
    'TreatmentGroup': 'Filtration',
    'TreatmentName': 'Slow sand filtration',
    'PathogenGroup': 'Bacteria',
    'Min': 2,
    'Max': 6,
    'ReferenceName': 'WHO (2011): Drinking water guideline, Table 7.7',
    'ReferenceLink': 'http://apps.who.int/iris/bitstream/10665/44584/1/9789241548151_eng.pdf#page=162'
  },
  {
    'TreatmentGroup': 'Filtration',
    'TreatmentName': 'Slow sand filtration',
    'PathogenGroup': 'Viruses',
    'Min': 0.25,
    'Max': 4,
    'ReferenceName': 'WHO (2011): Drinking water guideline, Table 7.7',
    'ReferenceLink': 'http://apps.who.int/iris/bitstream/10665/44584/1/9789241548151_eng.pdf#page=162'
  },
  {
    'TreatmentGroup': 'Filtration',
    'TreatmentName': 'Slow sand filtration',
    'PathogenGroup': 'Protozoa',
    'Min': 0.3,
    'Max': 5,
    'ReferenceName': 'WHO (2011): Drinking water guideline, Table 7.7',
    'ReferenceLink': 'http://apps.who.int/iris/bitstream/10665/44584/1/9789241548151_eng.pdf#page=162'
  },
  {
    'TreatmentGroup': 'Natural Attenuation',
    'TreatmentName': 'Bank filtration',
    'PathogenGroup': 'Bacteria',
    'Min': 2,
    'Max': 6,
    'ReferenceName': 'WHO (2011): Drinking water guideline, Table 7.7',
    'ReferenceLink': 'http://apps.who.int/iris/bitstream/10665/44584/1/9789241548151_eng.pdf#page=162'
  },
  {
    'TreatmentGroup': 'Natural Attenuation',
    'TreatmentName': 'Bank filtration',
    'PathogenGroup': 'Viruses',
    'Min': 2.1,
    'Max': 8.3,
    'ReferenceName': 'WHO (2011): Drinking water guideline, Table 7.7',
    'ReferenceLink': 'http://apps.who.int/iris/bitstream/10665/44584/1/9789241548151_eng.pdf#page=162'
  },
  {
    'TreatmentGroup': 'Natural Attenuation',
    'TreatmentName': 'Bank filtration',
    'PathogenGroup': 'Protozoa',
    'Min': 1,
    'Max': 2,
    'ReferenceName': 'WHO (2011): Drinking water guideline, Table 7.7',
    'ReferenceLink': 'http://apps.who.int/iris/bitstream/10665/44584/1/9789241548151_eng.pdf#page=162'
  },
  {
    'TreatmentGroup': 'Pretreatment',
    'TreatmentName': 'Roughing filters',
    'PathogenGroup': 'Bacteria',
    'Min': 0.2,
    'Max': 2.3,
    'ReferenceName': 'WHO (2011): Drinking water guideline, Table 7.7',
    'ReferenceLink': 'http://apps.who.int/iris/bitstream/10665/44584/1/9789241548151_eng.pdf#page=162'
  },
  {
    'TreatmentGroup': 'Pretreatment',
    'TreatmentName': 'Storage reservoirs',
    'PathogenGroup': 'Bacteria',
    'Min': 0.7,
    'Max': 2.2,
    'ReferenceName': 'WHO (2011): Drinking water guideline, Table 7.7',
    'ReferenceLink': 'http://apps.who.int/iris/bitstream/10665/44584/1/9789241548151_eng.pdf#page=162'
  },
  {
    'TreatmentGroup': 'Pretreatment',
    'TreatmentName': 'Storage reservoirs',
    'PathogenGroup': 'Protozoa',
    'Min': 1.4,
    'Max': 2.3,
    'ReferenceName': 'WHO (2011): Drinking water guideline, Table 7.7',
    'ReferenceLink': 'http://apps.who.int/iris/bitstream/10665/44584/1/9789241548151_eng.pdf#page=162'
  },
  {
    'TreatmentGroup': 'Primary disinfection',
    'TreatmentName': 'Chlorination, wastewater',
    'PathogenGroup': 'Bacteria',
    'Min': 2,
    'Max': 2,
    'ReferenceName': 'WHO (2011): Drinking water guideline, Table 7.7',
    'ReferenceLink': 'http://apps.who.int/iris/bitstream/10665/44584/1/9789241548151_eng.pdf#page=162'
  },
  {
    'TreatmentGroup': 'Primary disinfection',
    'TreatmentName': 'Chlorination, wastewater',
    'PathogenGroup': 'Viruses',
    'Min': 2,
    'Max': 2,
    'ReferenceName': 'WHO (2011): Drinking water guideline, Table 7.7',
    'ReferenceLink': 'http://apps.who.int/iris/bitstream/10665/44584/1/9789241548151_eng.pdf#page=162'
  },
  {
    'TreatmentGroup': 'Primary disinfection',
    'TreatmentName': 'Chlorination, wastewater',
    'PathogenGroup': 'Protozoa',
    'Min': 2,
    'Max': 2,
    'ReferenceName': 'WHO (2011): Drinking water guideline, Table 7.7',
    'ReferenceLink': 'http://apps.who.int/iris/bitstream/10665/44584/1/9789241548151_eng.pdf#page=162'
  },
  {
    'TreatmentGroup': 'Primary disinfection',
    'TreatmentName': 'Chlorine dioxide',
    'PathogenGroup': 'Bacteria',
    'Min': 2,
    'Max': 2,
    'ReferenceName': 'WHO (2011): Drinking water guideline, Table 7.7',
    'ReferenceLink': 'http://apps.who.int/iris/bitstream/10665/44584/1/9789241548151_eng.pdf#page=162'
  },
  {
    'TreatmentGroup': 'Primary disinfection',
    'TreatmentName': 'Chlorine dioxide',
    'PathogenGroup': 'Viruses',
    'Min': 2,
    'Max': 2,
    'ReferenceName': 'WHO (2011): Drinking water guideline, Table 7.7',
    'ReferenceLink': 'http://apps.who.int/iris/bitstream/10665/44584/1/9789241548151_eng.pdf#page=162'
  },
  {
    'TreatmentGroup': 'Primary disinfection',
    'TreatmentName': 'Chlorine dioxide',
    'PathogenGroup': 'Protozoa',
    'Min': 2,
    'Max': 2,
    'ReferenceName': 'WHO (2011): Drinking water guideline, Table 7.7',
    'ReferenceLink': 'http://apps.who.int/iris/bitstream/10665/44584/1/9789241548151_eng.pdf#page=162'
  },
  {
    'TreatmentGroup': 'Primary disinfection',
    'TreatmentName': 'Ozonation, drinking water',
    'PathogenGroup': 'Bacteria',
    'Min': 2,
    'Max': 2,
    'ReferenceName': 'WHO (2011): Drinking water guideline, Table 7.7',
    'ReferenceLink': 'http://apps.who.int/iris/bitstream/10665/44584/1/9789241548151_eng.pdf#page=162'
  },
  {
    'TreatmentGroup': 'Primary disinfection',
    'TreatmentName': 'Ozonation, drinking water',
    'PathogenGroup': 'Viruses',
    'Min': 2,
    'Max': 2,
    'ReferenceName': 'WHO (2011): Drinking water guideline, Table 7.7',
    'ReferenceLink': 'http://apps.who.int/iris/bitstream/10665/44584/1/9789241548151_eng.pdf#page=162'
  },
  {
    'TreatmentGroup': 'Primary disinfection',
    'TreatmentName': 'Ozonation, drinking water',
    'PathogenGroup': 'Protozoa',
    'Min': 2,
    'Max': 2,
    'ReferenceName': 'WHO (2011): Drinking water guideline, Table 7.7',
    'ReferenceLink': 'http://apps.who.int/iris/bitstream/10665/44584/1/9789241548151_eng.pdf#page=162'
  },
  {
    'TreatmentGroup': 'Primary disinfection',
    'TreatmentName': 'UV disinfection 20 mJ/cm2, drinking',
    'PathogenGroup': 'Bacteria',
    'Min': 4.6,
    'Max': 6,
    'ReferenceName': 'Hijnen et al. (2006)',
    'ReferenceLink': 'https://doi.org/10.1016/j.watres.2005.10.030'
  },
  {
    'TreatmentGroup': 'Primary disinfection',
    'TreatmentName': 'UV disinfection 20 mJ/cm2, drinking',
    'PathogenGroup': 'Viruses',
    'Min': 2,
    'Max': 3.1,
    'ReferenceName': 'Hijnen et al. (2006)',
    'ReferenceLink': 'https://doi.org/10.1016/j.watres.2005.10.030'
  },
  {
    'TreatmentGroup': 'Primary disinfection',
    'TreatmentName': 'UV disinfection 20 mJ/cm2, drinking',
    'PathogenGroup': 'Protozoa',
    'Min': 2.4,
    'Max': 3,
    'ReferenceName': 'Hijnen et al. (2006)',
    'ReferenceLink': 'https://doi.org/10.1016/j.watres.2005.10.030'
  },
  {
    'TreatmentGroup': 'Pretreatment',
    'TreatmentName': 'Primary treatment',
    'PathogenGroup': 'Bacteria',
    'Min': 0,
    'Max': 0.5,
    'ReferenceName': 'DEMEAUWARE Deliverable 3.1 (p.18-19): NRMMC-EPHC-AHMC (2006), WHO 2006)',
    'ReferenceLink': 'http://demoware.eu/en/results/deliverables/deliverable-d3-1-appropiate-and-user-friendly-methodologies-for-ra_lca_wfp.pdf/@@download/file/Deliverable%20D3.1%20-%20Appropiate%20and%20user%20friendly%20methodologies%20for%20RA_LCA_WFP.pdf'
  },
  {
    'TreatmentGroup': 'Pretreatment',
    'TreatmentName': 'Primary treatment',
    'PathogenGroup': 'Viruses',
    'Min': 0,
    'Max': 0.1,
    'ReferenceName': 'DEMEAUWARE Deliverable 3.1 (p.18-19): NRMMC-EPHC-AHMC (2006), WHO 2006)',
    'ReferenceLink': 'http://demoware.eu/en/results/deliverables/deliverable-d3-1-appropiate-and-user-friendly-methodologies-for-ra_lca_wfp.pdf/@@download/file/Deliverable%20D3.1%20-%20Appropiate%20and%20user%20friendly%20methodologies%20for%20RA_LCA_WFP.pdf'
  },
  {
    'TreatmentGroup': 'Pretreatment',
    'TreatmentName': 'Primary treatment',
    'PathogenGroup': 'Protozoa',
    'Min': 0,
    'Max': 1,
    'ReferenceName': 'DEMEAUWARE Deliverable 3.1 (p.18-19): NRMMC-EPHC-AHMC (2006), WHO 2006)',
    'ReferenceLink': 'http://demoware.eu/en/results/deliverables/deliverable-d3-1-appropiate-and-user-friendly-methodologies-for-ra_lca_wfp.pdf/@@download/file/Deliverable%20D3.1%20-%20Appropiate%20and%20user%20friendly%20methodologies%20for%20RA_LCA_WFP.pdf'
  },
  {
    'TreatmentGroup': 'Pretreatment',
    'TreatmentName': 'Secondary treatment',
    'PathogenGroup': 'Bacteria',
    'Min': 1,
    'Max': 3,
    'ReferenceName': 'DEMEAUWARE Deliverable 3.1 (p.18-19): NRMMC-EPHC-AHMC (2006), WHO 2006)',
    'ReferenceLink': 'http://demoware.eu/en/results/deliverables/deliverable-d3-1-appropiate-and-user-friendly-methodologies-for-ra_lca_wfp.pdf/@@download/file/Deliverable%20D3.1%20-%20Appropiate%20and%20user%20friendly%20methodologies%20for%20RA_LCA_WFP.pdf'
  },
  {
    'TreatmentGroup': 'Pretreatment',
    'TreatmentName': 'Secondary treatment',
    'PathogenGroup': 'Viruses',
    'Min': 0.5,
    'Max': 2,
    'ReferenceName': 'DEMEAUWARE Deliverable 3.1 (p.18-19): NRMMC-EPHC-AHMC (2006), WHO 2006)',
    'ReferenceLink': 'http://demoware.eu/en/results/deliverables/deliverable-d3-1-appropiate-and-user-friendly-methodologies-for-ra_lca_wfp.pdf/@@download/file/Deliverable%20D3.1%20-%20Appropiate%20and%20user%20friendly%20methodologies%20for%20RA_LCA_WFP.pdf'
  },
  {
    'TreatmentGroup': 'Pretreatment',
    'TreatmentName': 'Secondary treatment',
    'PathogenGroup': 'Protozoa',
    'Min': 0.5,
    'Max': 1.5,
    'ReferenceName': 'DEMEAUWARE Deliverable 3.1 (p.18-19): NRMMC-EPHC-AHMC (2006), WHO 2006)',
    'ReferenceLink': 'http://demoware.eu/en/results/deliverables/deliverable-d3-1-appropiate-and-user-friendly-methodologies-for-ra_lca_wfp.pdf/@@download/file/Deliverable%20D3.1%20-%20Appropiate%20and%20user%20friendly%20methodologies%20for%20RA_LCA_WFP.pdf'
  },
  {
    'TreatmentGroup': 'Filtration',
    'TreatmentName': 'Dual media filtration',
    'PathogenGroup': 'Bacteria',
    'Min': 0,
    'Max': 1,
    'ReferenceName': 'DEMEAUWARE Deliverable 3.1 (p.18-19): NRMMC-EPHC-AHMC (2006), WHO 2006)',
    'ReferenceLink': 'http://demoware.eu/en/results/deliverables/deliverable-d3-1-appropiate-and-user-friendly-methodologies-for-ra_lca_wfp.pdf/@@download/file/Deliverable%20D3.1%20-%20Appropiate%20and%20user%20friendly%20methodologies%20for%20RA_LCA_WFP.pdf'
  },
  {
    'TreatmentGroup': 'Filtration',
    'TreatmentName': 'Dual media filtration',
    'PathogenGroup': 'Viruses',
    'Min': 0.5,
    'Max': 3,
    'ReferenceName': 'DEMEAUWARE Deliverable 3.1 (p.18-19): NRMMC-EPHC-AHMC (2006), WHO 2006)',
    'ReferenceLink': 'http://demoware.eu/en/results/deliverables/deliverable-d3-1-appropiate-and-user-friendly-methodologies-for-ra_lca_wfp.pdf/@@download/file/Deliverable%20D3.1%20-%20Appropiate%20and%20user%20friendly%20methodologies%20for%20RA_LCA_WFP.pdf'
  },
  {
    'TreatmentGroup': 'Filtration',
    'TreatmentName': 'Dual media filtration',
    'PathogenGroup': 'Protozoa',
    'Min': 1.5,
    'Max': 2.5,
    'ReferenceName': 'DEMEAUWARE Deliverable 3.1 (p.18-19): NRMMC-EPHC-AHMC (2006), WHO 2006)',
    'ReferenceLink': 'http://demoware.eu/en/results/deliverables/deliverable-d3-1-appropiate-and-user-friendly-methodologies-for-ra_lca_wfp.pdf/@@download/file/Deliverable%20D3.1%20-%20Appropiate%20and%20user%20friendly%20methodologies%20for%20RA_LCA_WFP.pdf'
  },
  {
    'TreatmentGroup': 'Filtration',
    'TreatmentName': 'Membrane filtration',
    'PathogenGroup': 'Bacteria',
    'Min': 3.5,
    'Max': 6,
    'ReferenceName': 'DEMEAUWARE Deliverable 3.1 (p.18-19): NRMMC-EPHC-AHMC (2006), WHO 2006)',
    'ReferenceLink': 'http://demoware.eu/en/results/deliverables/deliverable-d3-1-appropiate-and-user-friendly-methodologies-for-ra_lca_wfp.pdf/@@download/file/Deliverable%20D3.1%20-%20Appropiate%20and%20user%20friendly%20methodologies%20for%20RA_LCA_WFP.pdf'
  },
  {
    'TreatmentGroup': 'Filtration',
    'TreatmentName': 'Membrane filtration',
    'PathogenGroup': 'Viruses',
    'Min': 2.5,
    'Max': 6,
    'ReferenceName': 'DEMEAUWARE Deliverable 3.1 (p.18-19): NRMMC-EPHC-AHMC (2006), WHO 2006)',
    'ReferenceLink': 'http://demoware.eu/en/results/deliverables/deliverable-d3-1-appropiate-and-user-friendly-methodologies-for-ra_lca_wfp.pdf/@@download/file/Deliverable%20D3.1%20-%20Appropiate%20and%20user%20friendly%20methodologies%20for%20RA_LCA_WFP.pdf'
  },
  {
    'TreatmentGroup': 'Filtration',
    'TreatmentName': 'Membrane filtration',
    'PathogenGroup': 'Protozoa',
    'Min': 6,
    'Max': 6,
    'ReferenceName': 'DEMEAUWARE Deliverable 3.1 (p.18-19): NRMMC-EPHC-AHMC (2006), WHO 2006)',
    'ReferenceLink': 'http://demoware.eu/en/results/deliverables/deliverable-d3-1-appropiate-and-user-friendly-methodologies-for-ra_lca_wfp.pdf/@@download/file/Deliverable%20D3.1%20-%20Appropiate%20and%20user%20friendly%20methodologies%20for%20RA_LCA_WFP.pdf'
  },
  {
    'TreatmentGroup': 'Primary disinfection',
    'TreatmentName': 'Chlorination, drinking water',
    'PathogenGroup': 'Bacteria',
    'Min': 2,
    'Max': 6,
    'ReferenceName': 'DEMEAUWARE Deliverable 3.1 (p.18-19): NRMMC-EPHC-AHMC (2006), WHO 2006)',
    'ReferenceLink': 'http://demoware.eu/en/results/deliverables/deliverable-d3-1-appropiate-and-user-friendly-methodologies-for-ra_lca_wfp.pdf/@@download/file/Deliverable%20D3.1%20-%20Appropiate%20and%20user%20friendly%20methodologies%20for%20RA_LCA_WFP.pdf'
  },
  {
    'TreatmentGroup': 'Primary disinfection',
    'TreatmentName': 'Chlorination, drinking water',
    'PathogenGroup': 'Viruses',
    'Min': 1,
    'Max': 3,
    'ReferenceName': 'DEMEAUWARE Deliverable 3.1 (p.18-19): NRMMC-EPHC-AHMC (2006), WHO 2006)',
    'ReferenceLink': 'http://demoware.eu/en/results/deliverables/deliverable-d3-1-appropiate-and-user-friendly-methodologies-for-ra_lca_wfp.pdf/@@download/file/Deliverable%20D3.1%20-%20Appropiate%20and%20user%20friendly%20methodologies%20for%20RA_LCA_WFP.pdf'
  },
  {
    'TreatmentGroup': 'Primary disinfection',
    'TreatmentName': 'Chlorination, drinking water',
    'PathogenGroup': 'Protozoa',
    'Min': 0,
    'Max': 1.5,
    'ReferenceName': 'DEMEAUWARE Deliverable 3.1 (p.18-19): NRMMC-EPHC-AHMC (2006), WHO 2006)',
    'ReferenceLink': 'http://demoware.eu/en/results/deliverables/deliverable-d3-1-appropiate-and-user-friendly-methodologies-for-ra_lca_wfp.pdf/@@download/file/Deliverable%20D3.1%20-%20Appropiate%20and%20user%20friendly%20methodologies%20for%20RA_LCA_WFP.pdf'
  },
  {
    'TreatmentGroup': 'Primary disinfection',
    'TreatmentName': 'Ozonation, wastewater',
    'PathogenGroup': 'Bacteria',
    'Min': 2,
    'Max': 6,
    'ReferenceName': 'DEMEAUWARE Deliverable 3.1 (p.18-19): NRMMC-EPHC-AHMC (2006), WHO 2006)',
    'ReferenceLink': 'http://demoware.eu/en/results/deliverables/deliverable-d3-1-appropiate-and-user-friendly-methodologies-for-ra_lca_wfp.pdf/@@download/file/Deliverable%20D3.1%20-%20Appropiate%20and%20user%20friendly%20methodologies%20for%20RA_LCA_WFP.pdf'
  },
  {
    'TreatmentGroup': 'Primary disinfection',
    'TreatmentName': 'Ozonation, wastewater',
    'PathogenGroup': 'Viruses',
    'Min': 3,
    'Max': 6,
    'ReferenceName': 'DEMEAUWARE Deliverable 3.1 (p.18-19): NRMMC-EPHC-AHMC (2006), WHO 2006)',
    'ReferenceLink': 'http://demoware.eu/en/results/deliverables/deliverable-d3-1-appropiate-and-user-friendly-methodologies-for-ra_lca_wfp.pdf/@@download/file/Deliverable%20D3.1%20-%20Appropiate%20and%20user%20friendly%20methodologies%20for%20RA_LCA_WFP.pdf'
  },
  {
    'TreatmentGroup': 'Wetlands',
    'TreatmentName': 'Wetlands, surface flow',
    'PathogenGroup': 'Bacteria',
    'Min': 1.5,
    'Max': 2.5,
    'ReferenceName': 'DEMEAUWARE Deliverable 3.1 (p.18-19): NRMMC-EPHC-AHMC (2006), WHO 2006)',
    'ReferenceLink': 'http://demoware.eu/en/results/deliverables/deliverable-d3-1-appropiate-and-user-friendly-methodologies-for-ra_lca_wfp.pdf/@@download/file/Deliverable%20D3.1%20-%20Appropiate%20and%20user%20friendly%20methodologies%20for%20RA_LCA_WFP.pdf'
  },
  {
    'TreatmentGroup': 'Wetlands',
    'TreatmentName': 'Wetlands, surface flow',
    'PathogenGroup': 'Protozoa',
    'Min': 0.5,
    'Max': 1.5,
    'ReferenceName': 'DEMEAUWARE Deliverable 3.1 (p.18-19): NRMMC-EPHC-AHMC (2006), WHO 2006)',
    'ReferenceLink': 'http://demoware.eu/en/results/deliverables/deliverable-d3-1-appropiate-and-user-friendly-methodologies-for-ra_lca_wfp.pdf/@@download/file/Deliverable%20D3.1%20-%20Appropiate%20and%20user%20friendly%20methodologies%20for%20RA_LCA_WFP.pdf'
  },
  {
    'TreatmentGroup': 'Wetlands',
    'TreatmentName': 'Wetlands, subsurface flow',
    'PathogenGroup': 'Bacteria',
    'Min': 0.5,
    'Max': 3,
    'ReferenceName': 'DEMEAUWARE Deliverable 3.1 (p.18-19): NRMMC-EPHC-AHMC (2006), WHO 2006)',
    'ReferenceLink': 'http://demoware.eu/en/results/deliverables/deliverable-d3-1-appropiate-and-user-friendly-methodologies-for-ra_lca_wfp.pdf/@@download/file/Deliverable%20D3.1%20-%20Appropiate%20and%20user%20friendly%20methodologies%20for%20RA_LCA_WFP.pdf'
  },
  {
    'TreatmentGroup': 'Wetlands',
    'TreatmentName': 'Wetlands, subsurface flow',
    'PathogenGroup': 'Protozoa',
    'Min': 0.5,
    'Max': 2,
    'ReferenceName': 'DEMEAUWARE Deliverable 3.1 (p.18-19): NRMMC-EPHC-AHMC (2006), WHO 2006)',
    'ReferenceLink': 'http://demoware.eu/en/results/deliverables/deliverable-d3-1-appropiate-and-user-friendly-methodologies-for-ra_lca_wfp.pdf/@@download/file/Deliverable%20D3.1%20-%20Appropiate%20and%20user%20friendly%20methodologies%20for%20RA_LCA_WFP.pdf'
  },
  {
    'TreatmentGroup': 'Primary disinfection',
    'TreatmentName': 'UV disinfection, wastewater',
    'PathogenGroup': 'Bacteria',
    'Min': 2,
    'Max': 4,
    'ReferenceName': 'DEMEAUWARE Deliverable 3.1 (p.18-19): NRMMC-EPHC-AHMC (2006), WHO 2006)',
    'ReferenceLink': 'http://demoware.eu/en/results/deliverables/deliverable-d3-1-appropiate-and-user-friendly-methodologies-for-ra_lca_wfp.pdf/@@download/file/Deliverable%20D3.1%20-%20Appropiate%20and%20user%20friendly%20methodologies%20for%20RA_LCA_WFP.pdf'
  },
  {
    'TreatmentGroup': 'Primary disinfection',
    'TreatmentName': 'UV disinfection, wastewater',
    'PathogenGroup': 'Viruses',
    'Min': 1,
    'Max': 3,
    'ReferenceName': 'DEMEAUWARE Deliverable 3.1 (p.18-19): NRMMC-EPHC-AHMC (2006), WHO 2006)',
    'ReferenceLink': 'http://demoware.eu/en/results/deliverables/deliverable-d3-1-appropiate-and-user-friendly-methodologies-for-ra_lca_wfp.pdf/@@download/file/Deliverable%20D3.1%20-%20Appropiate%20and%20user%20friendly%20methodologies%20for%20RA_LCA_WFP.pdf'
  },
  {
    'TreatmentGroup': 'Primary disinfection',
    'TreatmentName': 'UV disinfection, wastewater',
    'PathogenGroup': 'Protozoa',
    'Min': 3,
    'Max': 3,
    'ReferenceName': 'DEMEAUWARE Deliverable 3.1 (p.18-19): NRMMC-EPHC-AHMC (2006), WHO 2006)',
    'ReferenceLink': 'http://demoware.eu/en/results/deliverables/deliverable-d3-1-appropiate-and-user-friendly-methodologies-for-ra_lca_wfp.pdf/@@download/file/Deliverable%20D3.1%20-%20Appropiate%20and%20user%20friendly%20methodologies%20for%20RA_LCA_WFP.pdf'
  },
  {
    'TreatmentGroup': 'Filtration',
    'TreatmentName': 'Microfiltration',
    'PathogenGroup': 'Bacteria',
    'Min': 0,
    'Max': 4.3,
    'ReferenceName': 'MICRORISK final report chapter 4 Table 4.11',
    'ReferenceLink': 'https://www.kwrwater.nl/wp-content/uploads/2016/09/MICRORISK-FINAL-REPORT-Quantitative-microbial-risk-assessment-in-the-Water-Safety-Plan.pdf'
  },
  {
    'TreatmentGroup': 'Filtration',
    'TreatmentName': 'Microfiltration',
    'PathogenGroup': 'Viruses',
    'Min': 0,
    'Max': 3.7,
    'ReferenceName': 'MICRORISK final report chapter 4 Table 4.11',
    'ReferenceLink': 'https://www.kwrwater.nl/wp-content/uploads/2016/09/MICRORISK-FINAL-REPORT-Quantitative-microbial-risk-assessment-in-the-Water-Safety-Plan.pdf'
  },
  {
    'TreatmentGroup': 'Filtration',
    'TreatmentName': 'Microfiltration',
    'PathogenGroup': 'Protozoa',
    'Min': 2.3,
    'Max': 6,
    'ReferenceName': 'MICRORISK final report chapter 4 Table 4.11',
    'ReferenceLink': 'https://www.kwrwater.nl/wp-content/uploads/2016/09/MICRORISK-FINAL-REPORT-Quantitative-microbial-risk-assessment-in-the-Water-Safety-Plan.pdf'
  },
  {
    'TreatmentGroup': 'Filtration',
    'TreatmentName': 'Ultrafiltration',
    'PathogenGroup': 'Bacteria',
    'Min': 5.5,
    'Max': 6,
    'ReferenceName': 'NSF/ANSI 419  validation',
    'ReferenceLink': 'http://info.nsf.org/Certified/pdwe/Listings.asp'
  },
  {
    'TreatmentGroup': 'Filtration',
    'TreatmentName': 'Ultrafiltration',
    'PathogenGroup': 'Viruses',
    'Min': 2.69,
    'Max': 5.14,
    'ReferenceName': 'NSF/ANSI 419  validation',
    'ReferenceLink': 'http://info.nsf.org/Certified/pdwe/Listings.asp'
  },
  {
    'TreatmentGroup': 'Filtration',
    'TreatmentName': 'Ultrafiltration',
    'PathogenGroup': 'Protozoa',
    'Min': 5.3,
    'Max': 6.5,
    'ReferenceName': 'NSF/ANSI 419  validation',
    'ReferenceLink': 'http://info.nsf.org/Certified/pdwe/Listings.asp'
  },
  {
    'TreatmentGroup': 'Filtration',
    'TreatmentName': 'Nanofiltration',
    'PathogenGroup': 'Bacteria',
    'Min': 5.44,
    'Max': 6,
    'ReferenceName': 'NSF/ANSI 419  validation',
    'ReferenceLink': 'http://info.nsf.org/Certified/pdwe/Listings.asp'
  },
  {
    'TreatmentGroup': 'Filtration',
    'TreatmentName': 'Nanofiltration',
    'PathogenGroup': 'Viruses',
    'Min': 5.44,
    'Max': 6,
    'ReferenceName': 'NSF/ANSI 419  validation',
    'ReferenceLink': 'http://info.nsf.org/Certified/pdwe/Listings.asp'
  },
  {
    'TreatmentGroup': 'Filtration',
    'TreatmentName': 'Nanofiltration',
    'PathogenGroup': 'Protozoa',
    'Min': 5.75,
    'Max': 6.32,
    'ReferenceName': 'NSF/ANSI 419  validation',
    'ReferenceLink': 'http://info.nsf.org/Certified/pdwe/Listings.asp'
  },
  {
    'TreatmentGroup': 'Filtration',
    'TreatmentName': 'Reverse osmosis',
    'PathogenGroup': 'Bacteria',
    'Min': 5.44,
    'Max': 6,
    'ReferenceName': 'NSF/ANSI 419  validation',
    'ReferenceLink': 'http://info.nsf.org/Certified/pdwe/Listings.asp'
  },
  {
    'TreatmentGroup': 'Filtration',
    'TreatmentName': 'Reverse osmosis',
    'PathogenGroup': 'Viruses',
    'Min': 5.44,
    'Max': 6,
    'ReferenceName': 'NSF/ANSI 419  validation',
    'ReferenceLink': 'http://info.nsf.org/Certified/pdwe/Listings.asp'
  },
  {
    'TreatmentGroup': 'Filtration',
    'TreatmentName': 'Reverse osmosis',
    'PathogenGroup': 'Protozoa',
    'Min': 5.75,
    'Max': 6.32,
    'ReferenceName': 'NSF/ANSI 419  validation',
    'ReferenceLink': 'http://info.nsf.org/Certified/pdwe/Listings.asp'
  },
  {
    'TreatmentGroup': 'Primary disinfection',
    'TreatmentName': 'UV disinfection 40 mJ/cm2, drinking',
    'PathogenGroup': 'Bacteria',
    'Min': 4.6,
    'Max': 6,
    'ReferenceName': 'Hijnen et al. (2006)',
    'ReferenceLink': 'https://doi.org/10.1016/j.watres.2005.10.030'
  },
  {
    'TreatmentGroup': 'Primary disinfection',
    'TreatmentName': 'UV disinfection 40 mJ/cm2, drinking',
    'PathogenGroup': 'Viruses',
    'Min': 4.1,
    'Max': 5.9,
    'ReferenceName': 'Hijnen et al. (2006)',
    'ReferenceLink': 'https://doi.org/10.1016/j.watres.2005.10.030'
  },
  {
    'TreatmentGroup': 'Primary disinfection',
    'TreatmentName': 'UV disinfection 40 mJ/cm2, drinking',
    'PathogenGroup': 'Protozoa',
    'Min': 2.5,
    'Max': 3,
    'ReferenceName': 'Hijnen et al. (2006)',
    'ReferenceLink': 'https://doi.org/10.1016/j.watres.2005.10.030'
  }
];
