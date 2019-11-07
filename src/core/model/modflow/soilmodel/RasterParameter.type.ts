export interface IRasterParameter {
    defaultValue: number;
    isActive: boolean;
    id: string;
    unit: string;
    title: string;
}

export interface IRasterParameterLegacy {
    defaultValue: number;
    isActive: boolean;
    label: string;
    name: string;
    unit: string;
    value: number;
}
