import * as ReactDOM from 'react-dom';
import { IPropertyValueObject } from '../../../../core/model/types';

export const getParameterValues = (arr: any[]) => {
  const parameters: IPropertyValueObject = {};
  arr.forEach((item) => {
    parameters[item.id] = item.value;
  });

  return parameters;
};

export const downloadFile = (name: string, uri: string) => {
  const downloadLink = document.createElement('a');
  downloadLink.href = uri;
  downloadLink.download = name;
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
};

export const exportChartData = (ref: any) => {
  if (!ref) {
    return null;
  }
  const rows = ref.props.data;
  if (!rows) {
    return null;
  }
  const keys = Object.keys(rows[0]);

  let csvContent = 'data:text/csv;charset=utf-8,';
  csvContent += keys.join(',');
  csvContent += '\r\n';

  rows.forEach((row: any) => {
    csvContent += Object.values(row).join(',');
    csvContent += '\r\n';
  });

  const encodedUri = encodeURI(csvContent);

  downloadFile('chart.csv', encodedUri);
};

export const exportChartImage = (ref: any) => {
  if (!ref) {
    return null;
  }

  // eslint-disable-next-line react/no-find-dom-node
  const domNode = ReactDOM.findDOMNode(ref);
  if (!(domNode instanceof Element)) {
    return null;
  }
  const svg = domNode.children[0] as SVGGraphicsElement;
  svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  const svgData = svg.outerHTML;
  const preface = '<?xml version="1.0" standalone="no"?>\r\n';
  const svgBlob = new Blob([preface, svgData], { type: 'image/svg+xml;charset=utf-8' });
  const svgUrl = URL.createObjectURL(svgBlob);

  const canvas = document.createElement('canvas');
  const bbox = svg.getBBox();
  canvas.width = bbox.width + 50;
  canvas.height = bbox.height + 50;

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    return null;
  }
  ctx.clearRect(0, 0, bbox.width, bbox.height);

  const img = new Image();
  img.onload = () => {
    ctx.drawImage(img, 15, 15);
    URL.revokeObjectURL(svgUrl);
    const imgURI = canvas.toDataURL('image/png').replace('image/png', 'image/octet-stream');

    downloadFile('chart.jpg', imgURI);
  };
  img.src = svgUrl;
};
