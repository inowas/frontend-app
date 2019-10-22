import { ILayerParameter } from './LayerParameter.type';

export interface ILayer {
    id: string;
    name: string;
    description: string;
    number: number;
    parameters: ILayerParameter[];
}
