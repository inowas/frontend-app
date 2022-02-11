import infiltrationPond from './infiltration-pond.png';
import river from './river.png';
import well from './well.png';

export const getImage = (slag?: string) => {
  if (slag === 'o_river') {
    return river;
  }
  if (slag === 'o_well') {
    return well;
  }
  return infiltrationPond;
};
