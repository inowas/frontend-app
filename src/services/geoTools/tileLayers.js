import { TileLayer } from 'react-leaflet';
import React from 'react';

export const BasicTileLayer = () => (
  <TileLayer
    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    maxNativeZoom={18}
    maxZoom={24}
  />
);
