import { EGameObjectType } from '../../../core/marPro/GameObject.type';
import gb1 from './mar-gameboard-01-riverbed.png';
import infiltrationPond from './infiltration-pond.png';
import river from './river.png';
import well from './well.png';

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
  if (slag === EGameObjectType.RIVER) {
    return river;
  }
  if (slag === EGameObjectType.ABSTRACTION_WELL) {
    return well;
  }
  return infiltrationPond;
};
