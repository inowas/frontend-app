import { CSSProperties } from 'react';
import noise from '../../assets/noise.svg';

export const styles: {
  [key: string]: CSSProperties;
} = {
  body: {
    background: 'linear-gradient(20deg, #0f3d13 0%, #0f5715 40%, #4d3719 60%)',
    height: '100vmax',
    overflow: 'hidden',
    margin: 'auto',
  },
  bgNoise: {
    marginTop: '-15%',
    width: '100%',
    height: '120%',
    background: `linear-gradient(20deg, rgb(22 29 22 / 88%) 10%, rgb(53 47 39 / 88%) 50%), url(${noise})`,
    filter: 'contrast(155%) brightness(350%)',
    mixBlendMode: 'screen',
  },
  boardBg: {
    width: '1100px',
    height: '900px',
    position: 'absolute',
    top: '40px',
    left: '120px',
  },
};
