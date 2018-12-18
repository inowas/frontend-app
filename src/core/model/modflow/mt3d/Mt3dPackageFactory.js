import MtPackage from './MtPackage';
import BtnPackage from './BtnPackage';
import DspPackage from './DspPackage';
import AdvPackage from './AdvPackage';
import GcgPackage from './GcgPackage';
import SsmPackage from './SsmPackage';

class Mt3dPackageFactory {
    static fromData(data) {
        const packageName = data._meta && data._meta.package_name;
        switch (packageName) {
            case 'adv':
                return AdvPackage.fromObject(data);
            case 'mt':
                return MtPackage.fromObject(data);
            case 'btn':
                return BtnPackage.fromObject(data);
            case 'dsp':
                return DspPackage.fromObject(data);
            case 'gcg':
                return GcgPackage.fromObject(data);
            case 'ssm':
                return SsmPackage.fromObject(data);
            default:
                return null;
        }
    }
}

export default Mt3dPackageFactory;
