import {TileLayer} from 'react-leaflet';
import React from 'react';

export const BasicTileLayer = () => (
    <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
    />
);
