interface IHealthDefault {
  pathogenName: string;
  infectionToIllness: number;
  dalysPerCase: number;
  reference1: string;
  reference2: string;
}

const healthDefaults: IHealthDefault[] = [
  {
    pathogenName: 'Campylobacter jejuni and Campylobacter coli',
    infectionToIllness: 0.3,
    dalysPerCase: 0.0046,
    reference1: 'WHO (2011): Drinking water guideline, Table 7.4',
    reference2: 'WHO (2011): Drinking water guideline, Table 7.4'
  },
  {
    pathogenName: 'Cryptosporidium parvum and Cryptosporidium hominis',
    infectionToIllness: 0.7,
    dalysPerCase: 0.0015,
    reference1: 'WHO (2011): Drinking water guideline, Table 7.4',
    reference2: 'WHO (2011): Drinking water guideline, Table 7.4'
  },
  {
    pathogenName: 'Rotavirus',
    infectionToIllness: 0.5,
    dalysPerCase: 0.0140,
    reference1: 'WHO (2011): Drinking water guideline, Table 7.4',
    reference2: 'WHO (2011): Drinking water guideline, Table 7.4'
  }
];

export default healthDefaults;
