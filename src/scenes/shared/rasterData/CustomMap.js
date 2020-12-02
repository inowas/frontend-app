import {Map} from 'react-leaflet';

export default class CustomBaseMap extends Map {
    componentDidUpdate(prevProps) {
        this.updateLeafletElement(prevProps, this.props);
        const layers = this.leafletElement._layers;
        Object.values(layers)
            .filter((layer) => {
                return typeof layer.options.priority !== 'undefined';
            })
            .sort((layerA, layerB) => {
                return layerA.options.priority - layerB.options.priority;
            })
            .forEach((layer) => {
                layer.bringToFront();
            });
    }
}
