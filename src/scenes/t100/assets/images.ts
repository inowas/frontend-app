import { EGameObjectType } from '../../../core/marPro/GameObject.type';
import gb1 from './mar-gameboard-01-riverbed.png';
import gb2 from './mar-gameboard-02.jpg';
import happyPoints from './happy-points.png';
import infiltrationPond from './infiltration-pond.svg';
import marCoin from './mar-coin.png';
import river from './river.png';
import waterDrop from './water-drop.png';
import well from './structure-well.svg';
import wtp from './structure-wtp.svg';

export interface IGameBoard {
  country: string;
  name: string;
  img: string;
  description: string;
  size: {
    x: number;
    y: number;
  };
}

interface IIcon {
  name: string;
  img: string;
}

export const icons: IIcon[] = [
  { name: 'happyPoints', img: happyPoints },
  { name: 'marCoins', img: marCoin },
  { name: 'waterDrop', img: waterDrop },
];

export const gameBoards: IGameBoard[] = [
  {
    country: 'Cyprus',
    name: 'Ezousa 1',
    img: gb1,
    description:
      'The green valley in Cyprus is a protected natural reservoir and thus a pretty interesting place for Managed Aquifer Recharge.',
    size: {
      x: 1059,
      y: 791,
    },
  },
  {
    country: 'Cyprus',
    name: 'Ezousa 2',
    img: gb2,
    description:
      'This version of the Ezousa catchment is just showing more detailed information about the landuse around the valley.',
    size: {
      x: 1059,
      y: 791,
    },
  },
];

export const getImage = (slag?: string) => {
  if (slag === 'res_coins' || slag === 'marCoins') {
    return marCoin;
  }
  if (slag === 'res_coins' || slag === 'marCoins') {
    return marCoin;
  }
  if (slag === 'waterDrop') {
    return waterDrop;
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
