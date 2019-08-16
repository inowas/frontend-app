export interface IRasterFileMetadata {
    driver: string;
    rasterXSize: number;
    rasterYSize: number;
    rasterCount: number;
    projection: string;
    origin: [number, number];
    pixelSize: [number, number];
}

export interface IModflowFile {
    name: string;
    content: string;
}

export type IBudgetType = 'cumulative' | 'incremental';

export type IBudgetData = { [key in IBudgetType]: { [key: string]: number } };
