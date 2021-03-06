import {IWellType} from '../../core/model/modflow/boundaries/WellBoundary.type';
import mapStyles from './mapStyles';

export const getStyle = (type: string, subtype?: string | IWellType) => {
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

// TODO: replace any's

export const disableMap = (map: any) => {
    if (map) {
        map.leafletElement._handlers.forEach((handler: any) => {
            handler.disable();
        });
    }
};

export const invalidateSize = (map: any) => {
    if (map) {
        map.leafletElement.invalidateSize();
    }
};
