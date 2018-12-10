import React from 'react';
import {TileLayer} from 'react-leaflet';

export const BasicTileLayer = () => (
    <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
    />
);
