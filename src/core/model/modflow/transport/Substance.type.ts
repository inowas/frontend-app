export interface IBoundaryConcentration {
    id: string;
    concentrations: number[];
}

export interface ISubstance {
    id: string;
    name: string;
    boundaryConcentrations: IBoundaryConcentration[] | [];
}
