import FlopyModflowPackage from './FlopyModflowPackage';

export default class FlopyModflowFlowPackage extends FlopyModflowPackage {
    supportedModflowVersions = () => {
        throw Error('The method: supportedModflowVersions has to be implemented for flowPackages')
    }
}
