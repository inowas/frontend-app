import { BoundingBox } from '../../../core/model/geometry';
import { IData } from './ReactLeafletHeatMapCanvasOverlay.type';
import { ILegendItemContinuous, ILegendItemDiscrete, RainbowOrLegend } from '../../../services/rainbowvis/types';
import { ImageOverlay } from 'react-leaflet';
import { LatLngBounds } from 'leaflet';
import { useEffect, useRef, useState } from 'react';
import Rainbow from '../../../services/rainbowvis/Rainbowvis';

interface IProps {
  boundingBox: BoundingBox;
  width: number;
  height: number;
  data: IData[];
  rainbow: RainbowOrLegend;
  sharpening: number;
}

const generateImage = (data: IData[], sharpening: number, rainbow: RainbowOrLegend) => {
  // create an offscreen canvas
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx || !data) {
    return null;
  }

  ctx.clearRect(0, 0, 1, 1);
  if (Array.isArray(data)) {
    data.forEach((d: IData) => {
      if (isNaN(d.value)) {
        ctx.clearRect(d.x, d.y, 1, 1);
      } else if (rainbow instanceof Rainbow) {
        ctx.fillStyle = '#' + rainbow.colorAt(d.value);
        ctx.fillRect(d.x, d.y, sharpening, sharpening);
      } else {
        const data = rainbow[0].isContinuous
          ? (rainbow as ILegendItemContinuous[]).filter(
              (row) =>
                (row.fromOperator === '>' ? d.value > row.from : d.value >= row.from) &&
                (row.toOperator === '<' ? d.value < row.to : d.value <= row.to)
            )
          : (rainbow as ILegendItemDiscrete[]).filter((row) => row.value === d.value);
        ctx.fillStyle = '#' + (data.length > 0 ? data[0].color : '#fff');
        ctx.fillRect(d.x, d.y, sharpening, sharpening);
      }
    });
  }

  //const imgData = ctx.getImageData(0, 0, props.width, props.height);
  //const data = imgData.data;

  // put the modified pixels back on the canvas
  //ctx.putImageData(imgData, 0, 0);

  // create a new img object
  const i = new Image();
  //i.style.transform = `${i.style.transform} rotateZ(180deg)`;

  // set the img.src to the canvas data url
  i.src = canvas.toDataURL();

  const link = document.createElement('a');
  link.href = i.src;
  link.download = 'Download.png';
  document.body.appendChild(link);
  //link.click();
  document.body.removeChild(link);

  // append the new img object to the page
  //document.body.appendChild(image);
  return i;
};

const RasterDataImageV2 = (props: IProps) => {
  const [image, setImage] = useState<HTMLImageElement | null>(
    generateImage(props.data, props.sharpening, props.rainbow)
  );

  console.log(props.data);

  if (!image) {
    return null;
  }

  const bounds = new LatLngBounds(props.boundingBox.southWest, props.boundingBox.northEast);

  return <ImageOverlay url={image.src} bounds={bounds} opacity={0.5} />;
};

export default RasterDataImageV2;
