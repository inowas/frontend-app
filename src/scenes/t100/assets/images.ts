import { EGameObjectType } from '../../../core/marPro/GameObject.type';
import gb1 from './mar-gameboard-01-riverbed.png';
import happyPoints from './happy-points.png';
import infiltrationPond from './infiltration-pond.svg';
import marCoin from './mar-coin.png';
import river from './river.png';
import well from './structure-well.svg';
import wtp from './structure-wtp.svg';

interface IGameBoard {
  country: string;
  name: string;
  img: string;
  description: string;
}

export const gameBoards: IGameBoard[] = [
  {
    country: 'Cyprus',
    name: 'Ezousa',
    img: gb1,
    description:
      'The green valley in Cyprus is a protected natural reservoir and thus a pretty interesting place for Managed Aquifer Recharge.',
  },
];

export const getImage = (slag?: string) => {
  if (slag === 'res_coins') {
    return marCoin;
  }
  if (slag === 'res_happiness') {
    return happyPoints;
  }
  if (slag === EGameObjectType.RIVER) {
    return river;
  }
  if (slag === EGameObjectType.ABSTRACTION_WELL || slag === EGameObjectType.OBSERVATION_WELL) {
    return well;
  }
  if (slag === EGameObjectType.WASTEWATER_TREATMENT_PLANT) {
    return wtp;
  }
  return infiltrationPond;
};
