import md5 from 'md5';
import {mapStyles} from './index';

export const disableMap = (map) => {
    if (map) {
        map.leafletElement._handlers.forEach(function (handler) {
            handler.disable();
        });
    }
};

export const generateKey = geometry => {
    return md5(JSON.stringify(geometry));
};

export const getStyle = (type, subtype) => {
    if (!(type in mapStyles)) {
        return mapStyles.default;
    }

    if (subtype === undefined) {
        return mapStyles[type];
    }

    if (!(subtype in mapStyles[type])) {
        return mapStyles.default;
    }

    return mapStyles[type][subtype];
};
