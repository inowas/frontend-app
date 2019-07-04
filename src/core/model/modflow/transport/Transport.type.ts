import {ISubstance} from './Substance.type';

export interface ITransport {
    enabled: boolean;
    substances: ISubstance[];
}
