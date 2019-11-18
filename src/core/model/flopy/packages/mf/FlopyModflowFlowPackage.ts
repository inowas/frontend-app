import FlopyModflowPackage from './FlopyModflowPackage';

export interface ISupportedModflowVersion {
    name: string;
    executable: string;
    version: string;
    default: boolean;
}

export default abstract class FlopyModflowFlowPackage<T> extends FlopyModflowPackage<T> {
    public abstract supportedModflowVersions(): ISupportedModflowVersion[];
}
