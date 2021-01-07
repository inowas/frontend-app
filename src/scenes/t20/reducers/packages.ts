import {CLEAR} from './rtmodelling';
import {IFlopyPackages} from '../../../core/model/flopy/packages/FlopyPackages.type';
import {LOGOUT, UNAUTHORIZED} from '../../user/actions/actions';

export const PROCESSING_PACKAGES = 'T20_PROCESSING_PACKAGES';
export const RECALCULATE_PACKAGES = 'T20_RECALCULATE_PACKAGES';
export const UPDATE_PACKAGES = 'T20_UPDATE_PACKAGES';
export const UPDATE_PROCESSED_PACKAGES = 'T20_UPDATE_PROCESSED_PACKAGES';

export interface IPackagesReducer {
    data: null | IFlopyPackages;
    doRecalculate: boolean;
    isDirty: boolean;
    isProcessing: boolean;
}

const initialState: () => IPackagesReducer = () => ({
    data: null,
    doRecalculate: false,
    isDirty: false,
    isProcessing: false,
});

const packages = (
    state: IPackagesReducer = initialState(),
    action: { type: string, payload: IFlopyPackages, setIsDirty?: boolean }
) => {
    switch (action.type) {
        case CLEAR:
            return initialState();

        case RECALCULATE_PACKAGES:
            return {...state, doRecalculate: true, isProcessing: false};

        case PROCESSING_PACKAGES:
            return {...state, doRecalculate: false, isProcessing: true, isDirty: false};

        case UPDATE_PACKAGES:
            return {...state, data: action.payload};

        case UPDATE_PROCESSED_PACKAGES:
            return {...state, data: action.payload, isProcessing: false};

        case UNAUTHORIZED:
        case LOGOUT: {
            return initialState();
        }

        default:
            return state;
    }
};

export default packages;
