import React, { ReactNode } from 'react';
import math from 'mathjs';

export type ICustomTooltipPayload = Array<{
  name: string;
  unit: string;
  value: number;
  payload: {
    x: number;
    y: number;
    name: string;
  }
}>;

export const convenientColors = [
  '#393b89',
  '#5254a3',
  '#6b6ecf',
  '#9c9ede',
  '#637939',
  '#8ca252',
  '#b5cf6b',
  '#cedb9c',
  '#8c6d31',
  '#bd9e39',
  '#e7ba52',
  '#e7cb94',
  '#843c39',
  '#ad494a',
  '#d6616b',
  '#e7969c',
  '#7b4173',
  '#a55194',
  '#ce6dbd',
  '#de9ed6',
  '#222222',
  '#444444',
  '#666666',
  '#888888',
  '#aaaaaa',
  '#018571',
  '#76cdc5',
  '#a5cdc2'
];

export const diagramLabel = (content: ReactNode) => (
  <div style={{ position: 'absolute', bottom: 100, right: 80 }}>
    <div style={{ color: 'red', padding: 20, border: '1px solid red', backgroundColor: 'white' }}>
      {content}
    </div>
  </div>
);

export const customTooltip = (e: any) => {
  if (e.active && e.payload && e.payload.length > 0) {
    const payload: ICustomTooltipPayload = e.payload;

    const wellName = getNameFromPayload(payload);

    return (
      <div
        className={'recharts-default-tooltip'}
        style={{
          margin: 0,
          padding: 10,
          backgroundColor: '#fff',
          border: '1px solid #ccc',
          whiteSpace: 'nowrap'
        }}
      >
        <h3>{`Well ${wellName}`}</h3>
        {payload.map((p, idx) => (
          <p key={idx}>{`${p.name}: ${math.round(p.value, 3)} ${p.unit}`}</p>
        ))}
      </div>
    );
  }

  return null;
};

export const getNameFromPayload = (p: ICustomTooltipPayload) => {
  return p[0].payload.name;
  //let name = p[0].payload.name;
  // name = name.replace(/\d+$/, '');
  // if (name.endsWith('.') || name.endsWith('_')) {
  //         return name.substr(0, name.length - 1);
  //}
  ///return name;
};
