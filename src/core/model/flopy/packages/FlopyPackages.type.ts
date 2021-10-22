import { IFlopyModflow } from './mf/FlopyModflow.type';
import { IFlopyMt3d } from './mt/FlopyMt3d';
import { IFlopySeawat } from './swt/FlopySeawat';

export interface IFlopyPackages {
  model_id: string;
  version: string;
  author: string;
  project: string;
  mf: IFlopyModflow;
  mp?: any;
  mt?: IFlopyMt3d;
  swt?: IFlopySeawat;
}

export interface IFlopyCalculation {
  author: string;
  project: string;
  version: string;
  calculation_id: string;
  model_id: string;
  data: {
    mf: IFlopyModflow;
    mp?: any;
    mt?: IFlopyMt3d;
    swt?: IFlopySeawat;
  };
}
